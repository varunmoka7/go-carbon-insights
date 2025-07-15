# Data Import Templates

This directory contains standardized templates for importing data into the GoCarbonTracker platform.

## Templates Overview

| Template | Purpose | Format | Validation |
|----------|---------|---------|------------|
| `company-master-data.csv` | Core company information | CSV | Required fields validation |
| `emissions-data.csv` | Scope 1, 2, 3 emissions | CSV | Numeric validation, range checks |
| `industry-benchmarking.csv` | Performance benchmarks | CSV | Statistical validation |
| `sbti-targets.csv` | Science-based targets | CSV | Target consistency validation |
| `framework-compliance.csv` | CDP, TCFD, GRI compliance | CSV | Status validation |
| `financial-operational.csv` | Revenue, employees, locations | CSV | Financial data validation |

## Quick Start

1. Download the appropriate template from this directory
2. Fill in your data following the field specifications
3. Validate using our online validator (coming soon)
4. Import via the platform's data import interface

## Data Quality Requirements

- **Completeness**: Minimum 80% field completion required
- **Accuracy**: Cross-validation with public sources
- **Consistency**: Data alignment across related tables
- **Timeliness**: Data must be from the last 3 years for emissions

## Support

For questions about data import templates:
- Review the [Data Import Guide](../docs/data-import/DATA_IMPORT_GUIDE.md)
- Check [Data Source Guidelines](../docs/data-import/DATA_SOURCE_GUIDELINES.md)
- Contact support via GitHub issues