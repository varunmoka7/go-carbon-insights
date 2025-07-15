# Data Import Guide for GoCarbonTracker

## Overview

This guide provides step-by-step instructions for importing data into the GoCarbonTracker platform. Our system supports bulk data import through standardized CSV templates and provides real-time validation and quality scoring.

## Pre-Import Checklist

### 1. Data Preparation Requirements
- [ ] Data is from the last 3 years (2022-2024)
- [ ] Company information matches official sources
- [ ] Emissions data includes verification status
- [ ] All required fields are completed
- [ ] Data format matches template specifications

### 2. Data Quality Standards
- **Minimum Completeness**: 80% of fields must be populated
- **Data Accuracy**: Cross-validated with public sources
- **Consistency**: Related data points must align
- **Verification**: Emissions data should be third-party verified when possible

## Import Process

### Step 1: Download Templates
```bash
# Available templates in /data-templates/
- company-master-data.csv
- emissions-data.csv  
- sbti-targets.csv
- framework-compliance.csv
- financial-operational.csv
- industry-benchmarking.csv
```

### Step 2: Data Population
1. **Open template** in Excel, Google Sheets, or text editor
2. **Follow field specifications** provided in template comments
3. **Use controlled vocabularies** for categorical fields
4. **Validate data types** (dates, numbers, text)
5. **Check data ranges** (years, percentages, etc.)

### Step 3: Pre-Import Validation
Before importing, validate your data:

#### Required Field Validation
- Company ID must be unique
- Industry/Sector must exist in taxonomy
- Dates must be in YYYY-MM-DD format
- Numeric fields within acceptable ranges

#### Data Consistency Checks
- Emissions totals = sum of components
- Target years > baseline years
- Progress percentages between 0-100
- Financial data in consistent currency

### Step 4: Import Execution
1. **Login** to GoCarbonTracker platform
2. **Navigate** to Data Import section
3. **Select template type** and upload file
4. **Review validation results** and fix errors
5. **Confirm import** after validation passes

### Step 5: Post-Import Verification
- [ ] Data appears correctly in platform
- [ ] Calculations are accurate
- [ ] Charts and visualizations update
- [ ] No data inconsistencies

## Data Validation Rules

### Company Master Data
```yaml
company_id: 
  - Required: true
  - Unique: true
  - Format: Alphanumeric, max 20 chars

industry:
  - Required: true
  - Validation: Must exist in industry_taxonomy table
  
founded_year:
  - Range: 1800-2024
  - Type: Integer
```

### Emissions Data
```yaml
scope1_total:
  - Required: true
  - Type: Integer
  - Range: ≥ 0
  - Unit: tCO2e

verification_status:
  - Options: ["Third-party verified", "Internal verification", "Limited assurance", "Reasonable assurance", "Not verified"]
```

### SBTi Targets
```yaml
reduction_percentage:
  - Range: 0-100
  - Type: Integer
  
target_year:
  - Range: 2025-2050
  - Must be > baseline_year
```

## Error Handling

### Common Validation Errors

#### Missing Required Fields
```
Error: company_name is required
Solution: Provide official company name
```

#### Invalid Data Types
```
Error: founded_year must be integer between 1800-2024
Solution: Use 4-digit year format
```

#### Reference Validation Failures
```
Error: Industry 'Software' not found in taxonomy
Solution: Use exact industry name from taxonomy
```

### Data Quality Warnings

#### Low Completeness Score
- **Warning**: Data completeness below 80%
- **Impact**: Reduced data quality score
- **Solution**: Complete additional optional fields

#### Inconsistent Data
- **Warning**: Scope totals don't match components
- **Impact**: Calculation errors in platform
- **Solution**: Verify and correct component values

## Batch Import Strategies

### Large Dataset Handling
1. **Split files** into chunks of 1000 companies
2. **Import sequentially** to avoid timeouts
3. **Monitor progress** through import status page
4. **Verify completion** after each batch

### Update Existing Data
1. **Use same company_id** for updates
2. **Include all fields** to avoid partial updates
3. **Increment data versions** for tracking
4. **Backup existing data** before import

## Data Source Integration

### Automated Data Feeds
For large-scale implementations, consider:
- **CDP API Integration**: Direct data feed from CDP
- **Company API Connections**: Real-time data updates
- **Third-party Data Providers**: Sustainalytics, MSCI
- **Custom ETL Pipelines**: Automated data processing

### Manual Data Collection
- **Company Annual Reports**: Financial and operational data
- **Sustainability Reports**: ESG metrics and targets
- **SEC Filings**: Public company disclosures
- **Industry Databases**: Benchmarking data

## Quality Assurance Process

### Data Verification Steps
1. **Source Verification**: Confirm data originates from reliable sources
2. **Cross-Reference Validation**: Compare with multiple sources
3. **Statistical Analysis**: Identify outliers and anomalies
4. **Expert Review**: Subject matter expert validation
5. **User Feedback**: Continuous improvement based on platform usage

### Quality Scoring Algorithm
```
Quality Score = (Completeness × 0.3) + (Accuracy × 0.4) + (Timeliness × 0.2) + (Verification × 0.1)

Where:
- Completeness: % of fields populated
- Accuracy: % of fields matching reference sources  
- Timeliness: Recency of data (within 3 years)
- Verification: Third-party verification status
```

## Support and Troubleshooting

### Getting Help
- **Documentation**: Review template specifications
- **Validation Reports**: Check detailed error messages
- **Support Contact**: GitHub issues or support email
- **Community Forum**: User discussions and best practices

### Common Issues
1. **File Format Problems**: Use UTF-8 encoding for CSV files
2. **Large File Uploads**: Split files if >10MB
3. **Network Timeouts**: Import during off-peak hours
4. **Browser Issues**: Use Chrome or Firefox for best compatibility

## Best Practices

### Data Management
- **Version Control**: Track data versions and changes
- **Documentation**: Record data sources and collection methods
- **Regular Updates**: Refresh data annually or bi-annually
- **Quality Monitoring**: Continuous data quality assessment

### Performance Optimization
- **Batch Processing**: Import related data together
- **Off-Peak Timing**: Schedule imports during low usage
- **File Preparation**: Clean and validate before import
- **Progress Monitoring**: Track import status and completion

## Compliance and Security

### Data Privacy
- **Sensitive Information**: Avoid personal or confidential data
- **Public Data Focus**: Use publicly available information
- **Consent Requirements**: Ensure data usage permissions
- **Anonymization**: Remove identifying information when possible

### Data Retention
- **Storage Period**: Data retained for 7 years
- **Backup Strategy**: Regular automated backups
- **Version History**: Maintain import audit trail
- **Deletion Policies**: Secure data removal procedures