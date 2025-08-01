# Trancenable Data Transformation Pipeline

This directory contains the complete data transformation pipeline for integrating Trancenable ESG emissions data into the GoCarbonTracker system.

## Files Overview

### Core Files
- `COMPANY UNIVERSE - Trancenable.csv` - Original Trancenable dataset (10.4MB, 19,902 records)
- `trancenable-transformation-pipeline.js` - Main transformation pipeline
- `package.json` - Node.js dependencies

### Mapping Tables
- `trancenable-industry-mapping.csv` - Industry mapping from Trancenable to your framework (86 industries)
- `trancenable-sector-mapping.csv` - Sector mapping between frameworks (6 → 10 sectors)
- `emissions-archetype-assignments.csv` - Emissions archetype assignments for industries

## Pipeline Features

### 🔄 Data Transformation
- **Company Deduplication**: Uses LEI, ticker, or company name to identify duplicates
- **Industry Mapping**: Maps 86 Trancenable industries to your framework
- **Sector Consolidation**: Transforms 6 sectors to your 10-sector framework
- **Emissions Archetype Assignment**: Assigns appropriate archetype based on industry characteristics

### 📊 Data Quality Management
- **Validation**: Checks for missing essential data (company name, emissions values)
- **Confidence Scoring**: Each mapping has confidence score (0.0-1.0)
- **Error Tracking**: Comprehensive statistics on transformation quality
- **Source Attribution**: Preserves data source URLs and verification status

### 🎯 Output Generation
- **Transformed Companies**: Company master data in your schema format
- **Transformed Emissions**: Scope 1/2/3 emissions data ready for import
- **Transformation Report**: Detailed statistics and recommendations

## Usage Instructions

### 1. Install Dependencies
```bash
cd DATA_OUTSOURCE
npm install
```

### 2. Run Transformation Pipeline
```bash
npm run transform
```

### 3. Review Output
Check the `output/` directory for:
- `transformed-companies.csv` - Clean company data
- `transformed-emissions.csv` - Structured emissions data  
- `transformation-report.json` - Quality metrics and statistics

## Data Flow Architecture

```
Trancenable CSV (19,902 records)
         ↓
   Industry Mapping (86 → 50+ industries)
         ↓
   Sector Mapping (6 → 10 sectors)
         ↓
   Archetype Assignment (7 archetypes)
         ↓
   Company Deduplication (~3,500 unique companies)
         ↓
   Output Generation (CSV + JSON reports)
```

## Mapping Strategy

### Industry Mapping Types
- **Direct**: 1:1 mapping to existing industry (e.g., Steel → Steel Production)
- **Merge**: Multiple Trancenable industries → 1 framework industry
- **Extend**: New industry added to framework (e.g., Specialty Industrial Machinery)
- **Map**: Fuzzy mapping with confidence score

### Emissions Archetypes Assigned
1. **Operational Emitter** (23 industries) - High direct emissions
2. **Upstream-heavy** (18 industries) - Supply chain dominant  
3. **Scope 2-heavy** (20 industries) - Electricity intensive
4. **Use-phase Dominant** (12 industries) - Consumer usage phase
5. **Lifecycle-dependent** (10 industries) - Balanced across scopes
6. **Financed Emissions** (5 industries) - Financial services
7. **Scope 3-heavy** (8 industries) - Distribution/transport dominant

## Expected Results

### Data Volumes
- **Companies**: ~3,500 unique companies (after deduplication)
- **Emissions Records**: ~19,900 emissions data points
- **Geographic Coverage**: Primarily European (Germany 18%, UK 14%, Switzerland 11%)
- **Temporal Coverage**: 2015-2024 with peak in 2022-2023

### Data Quality Metrics
- **Mapping Confidence**: Target >85% average confidence
- **Error Rate**: Target <5% mapping errors
- **Completeness**: >95% of records should transform successfully

## Integration with Backend

### Database Import
Use the existing DataImportController endpoints:
```javascript
POST /api/data-imports/initiate
// Upload transformed-companies.csv and transformed-emissions.csv
```

### Schema Compatibility
Output files match your existing database schema:
- `companies` table structure
- `emissions_data` table structure  
- `industry_taxonomy` extensions

## Troubleshooting

### Common Issues
1. **High mapping errors**: Review industry mapping completeness
2. **Low confidence scores**: Refine mapping rules in CSV files
3. **Data quality issues**: Check for missing values in source data

### Validation
Run validation checks:
```bash
node validate-mappings.js
```

## Next Steps

1. **Review Mappings**: Validate industry and sector mappings are accurate
2. **Test Pipeline**: Run on subset of data first
3. **Database Integration**: Import transformed data via existing API
4. **Quality Monitoring**: Set up ongoing data quality tracking

## Contact

For questions about the transformation pipeline or mapping decisions, refer to the project documentation or contact the development team.