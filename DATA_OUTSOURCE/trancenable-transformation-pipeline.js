/**
 * Trancenable Data Transformation Pipeline
 * Transforms Trancenable CSV data to match GoCarbonTracker schema
 */

const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

class TrancenableTransformationPipeline {
  constructor() {
    this.industryMapping = new Map();
    this.sectorMapping = new Map();
    this.archetypeMapping = new Map();
    this.companies = new Map();
    this.emissionsData = [];
    this.transformedCompanies = [];
    this.transformedEmissions = [];
    
    // Data quality tracking
    this.stats = {
      totalRecords: 0,
      processedRecords: 0,
      skippedRecords: 0,
      duplicateCompanies: 0,
      mappingErrors: 0,
      dataQualityIssues: 0
    };
  }

  /**
   * Load mapping tables from CSV files
   */
  async loadMappings() {
    console.log('Loading mapping tables...');
    
    // Load industry mapping
    await this.loadCsvMapping('./trancenable-industry-mapping.csv', this.industryMapping, 
      'trancenable_industry', ['your_framework_industry', 'emissions_archetype', 'mapping_type', 'confidence_score']);
    
    // Load sector mapping  
    await this.loadCsvMapping('./trancenable-sector-mapping.csv', this.sectorMapping,
      'trancenable_sector', ['your_framework_sector', 'mapping_type', 'confidence_score']);
    
    console.log(`Loaded ${this.industryMapping.size} industry mappings and ${this.sectorMapping.size} sector mappings`);
  }

  /**
   * Load CSV mapping file into Map
   */
  async loadCsvMapping(filePath, targetMap, keyField, valueFields) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          const key = row[keyField];
          const value = {};
          valueFields.forEach(field => {
            value[field] = row[field];
          });
          targetMap.set(key, value);
        })
        .on('end', resolve)
        .on('error', reject);
    });
  }

  /**
   * Process main Trancenable dataset
   */
  async processTrancenableData(inputFilePath) {
    console.log('Processing Trancenable dataset...');
    
    return new Promise((resolve, reject) => {
      fs.createReadStream(inputFilePath)
        .pipe(csv())
        .on('data', (row) => {
          this.stats.totalRecords++;
          
          try {
            this.processRecord(row);
            this.stats.processedRecords++;
          } catch (error) {
            console.warn(`Error processing record ${this.stats.totalRecords}: ${error.message}`);
            this.stats.skippedRecords++;
          }
        })
        .on('end', () => {
          console.log('Dataset processing complete');
          this.printStats();
          resolve();
        })
        .on('error', reject);
    });
  }

  /**
   * Process individual record from Trancenable dataset
   */
  processRecord(row) {
    // Extract and clean company data
    const companyData = this.extractCompanyData(row);
    const emissionsData = this.extractEmissionsData(row, companyData.id);
    
    // Skip if essential data is missing
    if (!companyData.name || !emissionsData.value || emissionsData.value <= 0) {
      this.stats.dataQualityIssues++;
      return;
    }
    
    // Apply mappings
    const mappedData = this.applyMappings(companyData, emissionsData);
    
    // Store processed data
    this.storeProcessedData(mappedData.company, mappedData.emissions);
  }

  /**
   * Extract company information from raw record
   */
  extractCompanyData(row) {
    return {
      id: row.company_id || this.generateCompanyId(row),
      name: this.cleanCompanyName(row.company_name),
      lei: row.lei,
      figi: row.figi,
      ticker: row.ticker,
      exchange: row.exchange,
      mic_code: row.mic_code,
      permid: row.permid,
      country: row.country,
      sector: row.sector,
      industry: row.industry,
      employees: this.parseInteger(row.employees),
      originalSector: row.sector,
      originalIndustry: row.industry
    };
  }

  /**
   * Extract emissions data from raw record
   */
  extractEmissionsData(row, companyId) {
    const scope = this.parseScope(row.scope);
    const scopeSimplified = this.parseScope(row['Scope Simplified']);
    const finalScope = scopeSimplified || scope;
    
    return {
      companyId: companyId,
      year: this.parseInteger(row.reporting_period),
      yearOfDisclosure: this.parseInteger(row.year_of_disclosure),
      metric: row.metric,
      level: row.level,
      scope: finalScope,
      emissionsSources: row.emissions_sources,
      value: this.parseFloat(row.value),
      unit: row.unit,
      method: row.method,
      incompleteBoundaries: row.incomplete_boundaries,
      sourceNames: row.source_names,
      sourceUrls: row.source_urls,
      documentId: row.document_id
    };
  }

  /**
   * Apply industry and sector mappings
   */
  applyMappings(companyData, emissionsData) {
    // Map industry
    const industryMapping = this.industryMapping.get(companyData.industry);
    if (!industryMapping) {
      console.warn(`No mapping found for industry: ${companyData.industry}`);
      this.stats.mappingErrors++;
    }
    
    // Map sector
    const sectorMapping = this.sectorMapping.get(companyData.sector);
    if (!sectorMapping) {
      console.warn(`No mapping found for sector: ${companyData.sector}`);
      this.stats.mappingErrors++;
    }
    
    // Apply mappings
    const mappedCompany = {
      ...companyData,
      sector: sectorMapping?.your_framework_sector || companyData.sector,
      industry: industryMapping?.your_framework_industry || companyData.industry,
      emissionsArchetype: industryMapping?.emissions_archetype || 'Unknown',
      mappingConfidence: industryMapping?.confidence_score || 0.0,
      mappingType: industryMapping?.mapping_type || 'unmapped'
    };
    
    const mappedEmissions = {
      ...emissionsData,
      scope1: this.extractScopeValue(emissionsData, 'Scope 1'),
      scope2: this.extractScopeValue(emissionsData, 'Scope 2'),
      scope3: this.extractScopeValue(emissionsData, 'Scope 3'),
      dataSource: this.formatDataSource(emissionsData.sourceNames, emissionsData.sourceUrls),
      verificationStatus: this.determineVerificationStatus(emissionsData.method),
      reportingStandard: this.determineReportingStandard(emissionsData.method),
      boundarySettings: emissionsData.incompleteBoundaries === 'Not Specified' ? null : emissionsData.incompleteBoundaries
    };
    
    return {
      company: mappedCompany,
      emissions: mappedEmissions
    };
  }

  /**
   * Extract scope-specific emissions value
   */
  extractScopeValue(emissionsData, targetScope) {
    if (emissionsData.scope === targetScope || 
        (Array.isArray(emissionsData.scope) && emissionsData.scope.includes(targetScope))) {
      return emissionsData.value;
    }
    return 0.0;
  }

  /**
   * Store processed data, handling duplicates
   */
  storeProcessedData(company, emissions) {
    // Check for duplicate companies (by LEI or name)
    const existingCompanyKey = company.lei || company.name;
    if (this.companies.has(existingCompanyKey)) {
      this.stats.duplicateCompanies++;
      // Update existing company with better data if available
      const existing = this.companies.get(existingCompanyKey);
      if (company.mappingConfidence > existing.mappingConfidence) {
        this.companies.set(existingCompanyKey, company);
      }
    } else {
      this.companies.set(existingCompanyKey, company);
    }
    
    // Always store emissions data (companies can have multiple years)
    this.emissionsData.push(emissions);
  }

  /**
   * Generate output files
   */
  async generateOutputFiles() {
    console.log('Generating output files...');
    
    // Convert companies Map to array
    this.transformedCompanies = Array.from(this.companies.values());
    
    // Write companies CSV
    await this.writeCsv('./output/transformed-companies.csv', this.transformedCompanies, [
      { id: 'id', title: 'company_id' },
      { id: 'name', title: 'company_name' },
      { id: 'sector', title: 'sector' },
      { id: 'industry', title: 'industry' },
      { id: 'emissionsArchetype', title: 'emissions_archetype' },
      { id: 'country', title: 'country' },
      { id: 'employees', title: 'employees' },
      { id: 'lei', title: 'lei' },
      { id: 'ticker', title: 'ticker' },
      { id: 'exchange', title: 'exchange' },
      { id: 'mappingConfidence', title: 'mapping_confidence' },
      { id: 'mappingType', title: 'mapping_type' }
    ]);
    
    // Write emissions CSV
    await this.writeCsv('./output/transformed-emissions.csv', this.emissionsData, [
      { id: 'companyId', title: 'company_id' },
      { id: 'year', title: 'year' },
      { id: 'scope1', title: 'scope1' },
      { id: 'scope2', title: 'scope2' },
      { id: 'scope3', title: 'scope3' },
      { id: 'dataSource', title: 'data_source' },
      { id: 'verificationStatus', title: 'verification_status' },
      { id: 'reportingStandard', title: 'reporting_standard' },
      { id: 'boundarySettings', title: 'boundary_setting' },
      { id: 'method', title: 'method' }
    ]);
    
    // Generate mapping statistics
    await this.generateMappingReport();
    
    console.log('Output files generated successfully');
  }

  /**
   * Write data to CSV file
   */
  async writeCsv(filePath, data, headers) {
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: headers
    });
    
    await csvWriter.writeRecords(data);
  }

  /**
   * Generate detailed mapping and transformation report
   */
  async generateMappingReport() {
    const report = {
      transformationStats: this.stats,
      dataQuality: {
        totalCompanies: this.transformedCompanies.length,
        totalEmissionsRecords: this.emissionsData.length,
        averageMappingConfidence: this.calculateAverageMappingConfidence(),
        scopeCoverage: this.calculateScopeCoverage(),
        temporalCoverage: this.calculateTemporalCoverage(),
        geographicCoverage: this.calculateGeographicCoverage()
      },
      mappingBreakdown: {
        industryMappingTypes: this.analyzeMappingTypes(),
        archetypeDistribution: this.analyzeArchetypeDistribution(),
        sectorDistribution: this.analyzeSectorDistribution()
      },
      recommendations: this.generateRecommendations()
    };
    
    fs.writeFileSync('./output/transformation-report.json', 
      JSON.stringify(report, null, 2));
  }

  // Utility methods
  cleanCompanyName(name) {
    return name ? name.trim().replace(/\s+/g, ' ') : '';
  }

  generateCompanyId(row) {
    return row.lei || row.ticker || `COMP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  parseInteger(value) {
    const parsed = parseInt(value);
    return isNaN(parsed) ? null : parsed;
  }

  parseFloat(value) {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0.0 : parsed;
  }

  parseScope(scopeString) {
    if (!scopeString) return null;
    
    // Handle JSON array format
    if (scopeString.startsWith('[') && scopeString.endsWith(']')) {
      try {
        const parsed = JSON.parse(scopeString.replace(/"/g, '"'));
        return Array.isArray(parsed) ? parsed[0] : parsed;
      } catch (e) {
        console.warn(`Failed to parse scope JSON: ${scopeString}`);
      }
    }
    
    return scopeString;
  }

  formatDataSource(sourceNames, sourceUrls) {
    if (!sourceNames) return 'Unknown';
    
    // Parse JSON array if needed
    let names = sourceNames;
    if (sourceNames.startsWith('[')) {
      try {
        names = JSON.parse(sourceNames.replace(/"/g, '"'));
        names = Array.isArray(names) ? names[0] : names;
      } catch (e) {
        names = sourceNames;
      }
    }
    
    return names;
  }

  determineVerificationStatus(method) {
    if (!method || method === 'Not Applicable' || method === 'Not Specified') {
      return 'unverified';
    }
    return method.toLowerCase().includes('verified') ? 'verified' : 'unverified';
  }

  determineReportingStandard(method) {
    if (!method) return null;
    if (method.toLowerCase().includes('ghg protocol')) return 'GHG Protocol';
    if (method.toLowerCase().includes('iso')) return 'ISO 14064';
    return null;
  }

  calculateAverageMappingConfidence() {
    if (this.transformedCompanies.length === 0) return 0;
    const total = this.transformedCompanies.reduce((sum, company) => 
      sum + (company.mappingConfidence || 0), 0);
    return total / this.transformedCompanies.length;
  }

  calculateScopeCoverage() {
    const scopeCounts = { scope1: 0, scope2: 0, scope3: 0 };
    this.emissionsData.forEach(emission => {
      if (emission.scope1 > 0) scopeCounts.scope1++;
      if (emission.scope2 > 0) scopeCounts.scope2++;
      if (emission.scope3 > 0) scopeCounts.scope3++;
    });
    return scopeCounts;
  }

  calculateTemporalCoverage() {
    const years = this.emissionsData.map(e => e.year).filter(Boolean);
    return {
      minYear: Math.min(...years),
      maxYear: Math.max(...years),
      uniqueYears: [...new Set(years)].length
    };
  }

  calculateGeographicCoverage() {
    const countries = this.transformedCompanies.map(c => c.country).filter(Boolean);
    const countryCount = {};
    countries.forEach(country => {
      countryCount[country] = (countryCount[country] || 0) + 1;
    });
    return countryCount;
  }

  analyzeMappingTypes() {
    const mappingTypes = {};
    this.transformedCompanies.forEach(company => {
      const type = company.mappingType || 'unmapped';
      mappingTypes[type] = (mappingTypes[type] || 0) + 1;
    });
    return mappingTypes;
  }

  analyzeArchetypeDistribution() {
    const archetypes = {};
    this.transformedCompanies.forEach(company => {
      const archetype = company.emissionsArchetype || 'Unknown';
      archetypes[archetype] = (archetypes[archetype] || 0) + 1;
    });
    return archetypes;
  }

  analyzeSectorDistribution() {
    const sectors = {};
    this.transformedCompanies.forEach(company => {
      const sector = company.sector || 'Unknown';
      sectors[sector] = (sectors[sector] || 0) + 1;
    });
    return sectors;
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.stats.mappingErrors > this.stats.totalRecords * 0.1) {
      recommendations.push('High mapping error rate - review industry mapping completeness');
    }
    
    if (this.stats.dataQualityIssues > this.stats.totalRecords * 0.05) {
      recommendations.push('Significant data quality issues - implement additional validation');
    }
    
    if (this.calculateAverageMappingConfidence() < 0.8) {
      recommendations.push('Low average mapping confidence - refine mapping rules');
    }
    
    return recommendations;
  }

  printStats() {
    console.log('\n=== Transformation Statistics ===');
    console.log(`Total records processed: ${this.stats.totalRecords}`);
    console.log(`Successfully transformed: ${this.stats.processedRecords}`);
    console.log(`Skipped records: ${this.stats.skippedRecords}`);
    console.log(`Duplicate companies: ${this.stats.duplicateCompanies}`);
    console.log(`Mapping errors: ${this.stats.mappingErrors}`);
    console.log(`Data quality issues: ${this.stats.dataQualityIssues}`);
    console.log(`Unique companies: ${this.transformedCompanies.length}`);
    console.log(`Total emissions records: ${this.emissionsData.length}`);
  }

  /**
   * Main execution method
   */
  async execute(inputFilePath) {
    try {
      // Create output directory
      if (!fs.existsSync('./output')) {
        fs.mkdirSync('./output');
      }
      
      // Load mappings
      await this.loadMappings();
      
      // Process data
      await this.processTrancenableData(inputFilePath);
      
      // Generate outputs
      await this.generateOutputFiles();
      
      console.log('\n✅ Transformation pipeline completed successfully');
      
    } catch (error) {
      console.error('❌ Pipeline execution failed:', error);
      throw error;
    }
  }
}

// Usage
if (require.main === module) {
  const pipeline = new TrancenableTransformationPipeline();
  const inputFile = './COMPANY UNIVERSE - Trancenable.csv';
  
  pipeline.execute(inputFile)
    .then(() => console.log('Pipeline execution complete'))
    .catch(error => {
      console.error('Pipeline failed:', error);
      process.exit(1);
    });
}

module.exports = TrancenableTransformationPipeline;