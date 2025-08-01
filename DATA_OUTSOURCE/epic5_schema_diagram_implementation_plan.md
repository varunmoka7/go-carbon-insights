# Epic 5: Trancenable Integration - Schema Diagram & Implementation Plan

## Database Schema Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        TRANCENABLE ESG INTEGRATION SCHEMA                      │
│                                Epic 5 Architecture                             │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│   CORE ENTITIES     │    │  TRANCENABLE EXTS   │    │   SUPPORT TABLES    │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘

┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│     COMPANIES       │    │ COMPANY_IDENTIFIERS │    │INDUSTRY_MAPPING_LOG │
│ =================== │    │ =================== │    │ =================== │
│ id (UUID) PK        │◄──┤ company_id FK       │    │ id (UUID) PK        │
│ name (TEXT) UNIQUE  │    │ identifier_type     │    │ trancenable_industry│
│ sector (TEXT)       │    │ identifier_value    │    │ trancenable_sector  │
│ industry (TEXT)     │    │ identifier_source   │    │ mapped_industry_id  │
│ country (TEXT)      │    │ is_primary (BOOL)   │    │ mapping_type        │
│ employees (INT)     │    │ confidence_score    │    │ confidence_score    │
│ ─────────────────── │    │ ─────────────────── │    │ companies_using     │
│ *** NEW FIELDS ***  │    │ created_at          │    │ approved_by         │
│ lei (TEXT)          │    │ updated_at          │    │ ─────────────────── │
│ figi (TEXT)         │    └─────────────────────┘    │ created_at          │
│ ticker (TEXT)       │                               └─────────────────────┘
│ permid (TEXT)       │    
│ exchange (TEXT)     │    ┌─────────────────────┐    ┌─────────────────────┐
│ mic_code (TEXT)     │    │TRANCENABLE_IMPORT   │    │EMISSION_SOURCES_DTL │
│ trancenable_co_id   │    │        _LOG         │    │ =================== │
│ data_source_attr    │    │ =================== │    │ emissions_data_id   │
│ identifier_conf     │    │ import_batch_id     │    │ source_category     │
│ ─────────────────── │    │ total_records       │    │ source_subcategory  │
│ data_quality_score  │    │ companies_created   │    │ emission_value      │
│ verification_status │    │ companies_updated   │    │ emission_unit       │
│ last_data_update    │    │ emissions_created   │    │ emission_scope      │
│ created_at          │    │ validation_errors   │    │ calculation_approach│
│ updated_at          │    │ lei_match_rate      │    │ uncertainty_range   │
│ created_by          │    │ industry_mapping    │    │ data_quality_rating │
│ updated_by          │    │ import_status       │    │ ─────────────────── │
└─────────────────────┘    │ error_details       │    │ created_at          │
           │               │ ─────────────────── │    └─────────────────────┘
           │               │ created_at          │               ▲
           ▼               │ created_by          │               │
┌─────────────────────┐    └─────────────────────┘               │
│   EMISSIONS_DATA    │                                          │
│ =================== │    ┌─────────────────────┐              │
│ id (UUID) PK        │    │  INDUSTRY_TAXONOMY  │              │
│ company_id FK       │◄──┤ =================== │              │
│ year (INT)          │    │ id (UUID) PK        │              │
│ scope1 (DECIMAL)    │    │ sector (TEXT)       │              │
│ scope2 (DECIMAL)    │    │ industry (TEXT)     │              │
│ scope3 (DECIMAL)    │    │ emissions_archetype │              │
│ total_emissions     │    │ description         │              │
│ emissions_intensity │    │ ghg_protocol_align  │              │
│ emissions_per_emp   │    │ cdp_category        │              │
│ data_source         │    │ sbti_pathway        │              │
│ verification_status │    │ ─────────────────── │              │
│ ─────────────────── │    │ created_at          │              │
│ *** NEW FIELDS ***  │    │ updated_at          │              │
│ trancenable_doc_id  │    └─────────────────────┘              │
│ emission_sources    │                                          │
│ source_urls         │                                          │
│ incomplete_bounds   │                                          │
│ calculation_method  │                                          │
│ disclosure_year     │                                          │
│ data_lineage        │──────────────────────────────────────────┘
│ ─────────────────── │
│ reporting_standard  │
│ boundary_setting    │
│ notes               │
│ created_at          │
│ updated_at          │
│ created_by          │
│ updated_by          │
└─────────────────────┘

┌─────────────────────┐    ┌─────────────────────┐
│      SBTI_TARGETS   │    │COMPANY_FRAMEWORKS   │
│ =================== │    │ =================== │
│ company_id FK       │    │ company_id FK       │
│ near_term_target    │    │ framework_name      │
│ long_term_target    │    │ status              │
│ baseline_year       │    │ implementation_date │
│ target_year         │    │ verification_date   │
│ scope1_reduction    │    │ score               │
│ scope3_reduction    │    │ level               │
│ overall_reduction   │    │ certification_num   │
│ validation_status   │    │ certifying_body     │
│ current_progress    │    │ expiry_date         │
│ on_track            │    │ ─────────────────── │
│ ─────────────────── │    │ created_at          │
│ created_at          │    │ updated_at          │
│ updated_at          │    └─────────────────────┘
└─────────────────────┘

┌─────────────────────┐
│ SUSTAINABILITY_     │
│      METRICS        │
│ =================== │
│ company_id FK       │
│ metric_type         │
│ value               │
│ unit                │
│ year                │
│ data_source         │
│ verification_status │
│ confidence_level    │
│ scope               │
│ methodology         │
│ ─────────────────── │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

## Implementation Plan

### Phase 1: Pre-Migration Preparation (Week 1)
```bash
# 1.1 Environment Preparation
- [ ] Create migration branch: epic5/trancenable-integration
- [ ] Backup production database
- [ ] Set up staging environment with production data copy
- [ ] Validate current schema integrity

# 1.2 Migration Script Validation
- [ ] Review migration script: 20250801200000_epic5_trancenable_schema_extensions.sql
- [ ] Test migration on development environment
- [ ] Validate rollback script: 20250801200001_epic5_trancenable_rollback.sql
- [ ] Performance test index creation with sample data

# 1.3 Team Coordination
- [ ] Schedule maintenance window (estimated 30-45 minutes)
- [ ] Notify stakeholders of planned schema changes
- [ ] Prepare monitoring dashboards for post-migration validation
```

### Phase 2: Migration Execution (Week 1-2)

#### Step 2.1: Schema Extension Migration
```sql
-- Execute primary migration script
\i 20250801200000_epic5_trancenable_schema_extensions.sql

-- Expected execution time: ~15-20 minutes
-- Key checkpoints:
-- ✓ Company identifier columns added
-- ✓ 25+ new industries inserted
-- ✓ Trancenable support tables created
-- ✓ Indexes created concurrently
-- ✓ Validation functions deployed
-- ✓ RLS policies applied
```

#### Step 2.2: Post-Migration Validation
```sql
-- Verify schema changes
SELECT 'Schema validation completed' as status,
       COUNT(*) as new_industries
FROM industry_taxonomy 
WHERE created_at >= CURRENT_DATE;

-- Test validation functions
SELECT validate_import_quality_gates(uuid_generate_v4());

-- Verify index creation
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes 
WHERE indexname LIKE '%trancenable%';
```

### Phase 3: Data Integration Testing (Week 2)

#### Step 3.1: ETL Pipeline Testing
```bash
# Test transformation pipeline
cd DATA_OUTSOURCE
npm install
npm run transform

# Expected output:
# - transformed-companies.csv (~600 companies)
# - transformed-emissions.csv (~19,902 records)
# - transformation-report.json (quality metrics)
```

#### Step 3.2: Data Quality Validation
```sql
-- Run quality gates after test import
SELECT * FROM validate_import_quality_gates('test-batch-uuid');

-- Monitor data quality alerts
SELECT alert_type, severity, COUNT(*) 
FROM data_quality_alerts 
WHERE created_at >= CURRENT_DATE
GROUP BY alert_type, severity;

-- Validate company identifier distribution
SELECT 
    COUNT(CASE WHEN lei IS NOT NULL THEN 1 END) as lei_count,
    COUNT(CASE WHEN ticker IS NOT NULL THEN 1 END) as ticker_count,
    COUNT(CASE WHEN figi IS NOT NULL THEN 1 END) as figi_count,
    COUNT(*) as total_companies
FROM companies 
WHERE trancenable_company_id IS NOT NULL;
```

### Phase 4: Performance Optimization (Week 2-3)

#### Step 4.1: Index Performance Analysis
```sql
-- Monitor index usage
SELECT 
    indexname,
    idx_scan as times_used,
    idx_tup_read as tuples_read,
    pg_size_pretty(pg_total_relation_size(indexname::regclass)) as size
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
AND (indexname LIKE '%companies%' OR indexname LIKE '%emissions%')
ORDER BY idx_scan DESC;

-- Identify slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements 
WHERE query LIKE '%companies%' OR query LIKE '%emissions%'
ORDER BY mean_time DESC
LIMIT 10;
```

#### Step 4.2: Query Optimization
```sql
-- Test critical query patterns
EXPLAIN ANALYZE
SELECT c.name, c.lei, c.sector, e.total_emissions
FROM companies c
LEFT JOIN emissions_data e ON c.id = e.company_id 
WHERE c.sector = 'Manufacturing' 
AND e.year = 2023
ORDER BY e.total_emissions DESC;

-- Target: <50ms execution time
-- Optimized by: idx_companies_sector_industry, idx_emissions_company_year
```

### Phase 5: Frontend Integration (Week 3-4)

#### Step 5.1: API Endpoint Updates
```typescript
// Update company search endpoints to support new identifiers
GET /api/companies/search?lei=XXXXXXXXXXXXXXXXXXXX
GET /api/companies/search?ticker=AAPL&exchange=NASDAQ
GET /api/companies/search?figi=XXXXXXXXXXXX

// New industry mapping endpoints
GET /api/admin/industry-mappings
GET /api/admin/industry-mappings/confidence-report
POST /api/admin/industry-mappings/approve/:id
```

#### Step 5.2: Dashboard Enhancements
```typescript
// Company detail page updates
interface CompanyDetail {
  // Existing fields...
  lei?: string;
  figi?: string;
  ticker?: string;
  exchange?: string;
  permid?: string;
  identifierConfidenceScore: number;
  dataQualityScore: number;
  trancenableCompanyId?: string;
}

// Data quality dashboard
interface QualityMetrics {
  leiCoverage: number;
  averageQualityScore: number;
  highQualityRecords: number;
  mappingConfidenceDistribution: Record<string, number>;
}
```

### Phase 6: Production Deployment (Week 4)

#### Step 6.1: Production Migration Checklist
```bash
# Pre-deployment checklist
- [ ] All tests passing in staging environment
- [ ] Performance benchmarks met (<50ms average query time)
- [ ] Data quality gates validated (>80% LEI coverage)
- [ ] Rollback procedures tested and ready
- [ ] Monitoring dashboards configured
- [ ] Team trained on new features and troubleshooting

# Deployment sequence
1. Enable maintenance mode
2. Create production database backup
3. Execute migration script
4. Validate schema changes
5. Deploy updated API code
6. Deploy updated frontend code
7. Run smoke tests
8. Disable maintenance mode
9. Monitor system health for 24 hours
```

#### Step 6.2: Post-Deployment Monitoring
```sql
-- 24-hour monitoring queries
-- Database performance
SELECT 
    schemaname,
    tablename,
    n_tup_ins + n_tup_upd + n_tup_del as total_activity,
    n_tup_hot_upd,
    n_dead_tup
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY total_activity DESC;

-- Index effectiveness
SELECT 
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan > 0
ORDER BY idx_scan DESC;

-- Data quality monitoring
SELECT 
    AVG(data_quality_score) as avg_quality,
    COUNT(CASE WHEN lei IS NOT NULL THEN 1 END)::DECIMAL / COUNT(*) as lei_coverage,
    COUNT(*) as total_trancenable_companies
FROM companies 
WHERE trancenable_company_id IS NOT NULL;
```

## Risk Mitigation Strategies

### Technical Risks
```
HIGH RISK: Migration execution time exceeds maintenance window
├── Mitigation: Use CONCURRENTLY for index creation
├── Contingency: Rollback script ready within 5 minutes
└── Testing: Complete migration rehearsal in staging

MEDIUM RISK: Performance degradation after migration
├── Mitigation: Comprehensive index strategy
├── Monitoring: Real-time query performance tracking
└── Response: Quick index tuning and query optimization

LOW RISK: Data quality issues in production
├── Prevention: Multi-layer validation framework
├── Detection: Automated quality monitoring
└── Resolution: Data correction procedures documented
```

### Business Risks
```
DATA INTEGRITY: Ensure no data loss during migration
├── Solution: Complete backup and rollback procedures
├── Validation: Checksum verification pre/post migration
└── Recovery: Point-in-time recovery capability

USER EXPERIENCE: Minimize service disruption
├── Approach: Off-peak maintenance window
├── Communication: Advanced notification to users
└── Fallback: Graceful degradation if issues arise

COMPLIANCE: Maintain audit trail and data governance
├── Framework: Complete audit logging of all changes
├── Documentation: Detailed change log and approvals
└── Verification: Compliance team review and sign-off
```

## Success Criteria

### Technical Success Metrics
- [ ] **Migration Completion**: All schema changes applied without errors
- [ ] **Performance Targets**: Query response times <50ms (95th percentile)
- [ ] **Data Quality**: >80% LEI coverage, >70% average quality score
- [ ] **Index Efficiency**: All new indexes showing active usage
- [ ] **Zero Data Loss**: Checksum validation confirms data integrity

### Business Success Metrics
- [ ] **Integration Completeness**: 600+ companies successfully imported
- [ ] **Emissions Coverage**: 19,902+ emissions records available
- [ ] **Industry Mapping**: 25+ new industries with >90% confidence
- [ ] **User Experience**: No degradation in application response times
- [ ] **Operational Stability**: 99.9% uptime maintained during and after migration

## Timeline Summary

```
WEEK 1: Preparation & Migration
├── Days 1-2: Environment setup and validation
├── Days 3-4: Migration execution and testing
└── Days 5-7: Post-migration validation and optimization

WEEK 2: Integration Testing
├── Days 1-3: ETL pipeline testing and data quality validation
├── Days 4-5: Performance optimization and index tuning
└── Days 6-7: Integration testing with applications

WEEK 3: Frontend Integration
├── Days 1-3: API endpoint updates and testing
├── Days 4-5: Dashboard enhancements and UI updates
└── Days 6-7: End-to-end testing and validation

WEEK 4: Production Deployment
├── Days 1-2: Final preparations and team training
├── Day 3: Production deployment
├── Days 4-5: Post-deployment monitoring and optimization
└── Days 6-7: Documentation and retrospective
```

This comprehensive implementation plan ensures a smooth, risk-mitigated deployment of the Trancenable ESG integration while maintaining system performance and data integrity throughout the process.