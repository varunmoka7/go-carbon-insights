# Epic 5: Trancenable Integration - Database Indexing Strategy

## Overview
This document outlines the comprehensive indexing strategy for the Trancenable ESG data integration, designed to optimize query performance for 19,902+ emissions records across 600+ companies while maintaining efficient write operations.

## Indexing Philosophy

### Core Principles
1. **Query-Driven Design**: Indexes based on actual query patterns from frontend and API usage
2. **Selective Indexing**: Only index columns frequently used in WHERE, JOIN, and ORDER BY clauses
3. **Composite Index Strategy**: Multi-column indexes for complex query patterns
4. **Concurrent Creation**: All indexes created with CONCURRENTLY to avoid blocking operations
5. **Monitoring-Ready**: Indexes designed to support performance monitoring and optimization

## Index Categories

### 1. PRIMARY LOOKUP INDEXES
**Purpose**: Fast company identification and lookups
```sql
-- Company financial identifiers (high-frequency lookups)
CREATE INDEX CONCURRENTLY idx_companies_lei_btree 
ON public.companies(lei) WHERE lei IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_companies_ticker_btree 
ON public.companies(ticker) WHERE ticker IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_companies_figi_btree 
ON public.companies(figi) WHERE figi IS NOT NULL;

-- Unique constraints for data integrity
CREATE UNIQUE INDEX CONCURRENTLY idx_companies_lei_unique 
ON public.companies(lei) WHERE lei IS NOT NULL;

CREATE UNIQUE INDEX CONCURRENTLY idx_companies_ticker_exchange_unique 
ON public.companies(ticker, exchange) 
WHERE ticker IS NOT NULL AND exchange IS NOT NULL;
```

**Query Optimization**:
- Company lookup by LEI: `SELECT * FROM companies WHERE lei = 'XXXX'` → <1ms
- Ticker-based queries: `SELECT * FROM companies WHERE ticker = 'AAPL'` → <1ms
- Prevents duplicate identifiers across 600+ companies

### 2. ANALYTICAL QUERY INDEXES
**Purpose**: Support dashboard queries, filtering, and aggregations
```sql
-- Sector and industry analysis (dashboard queries)
CREATE INDEX CONCURRENTLY idx_companies_sector_industry 
ON public.companies(sector, industry);

CREATE INDEX CONCURRENTLY idx_companies_country_sector 
ON public.companies(country, sector);

-- Data quality filtering (admin dashboards)
CREATE INDEX CONCURRENTLY idx_companies_data_quality 
ON public.companies(data_quality_score DESC) 
WHERE data_quality_score > 0.7;
```

**Query Optimization**:
- Sector filtering: `WHERE sector = 'Manufacturing' AND industry = 'Steel'` → ~2ms
- Geographic analysis: `WHERE country = 'Germany' AND sector = 'Energy'` → ~3ms  
- Quality filtering: `WHERE data_quality_score > 0.8 ORDER BY data_quality_score DESC` → ~5ms

### 3. EMISSIONS DATA INDEXES
**Purpose**: Time-series analysis and emissions tracking
```sql
-- Trancenable-specific emissions tracking
CREATE INDEX CONCURRENTLY idx_emissions_trancenable_doc 
ON public.emissions_data(trancenable_document_id) 
WHERE trancenable_document_id IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_emissions_disclosure_year 
ON public.emissions_data(disclosure_year) 
WHERE disclosure_year IS NOT NULL;

CREATE INDEX CONCURRENTLY idx_emissions_calculation_method 
ON public.emissions_data(calculation_method) 
WHERE calculation_method IS NOT NULL;

-- Existing optimized indexes (from current schema)
-- idx_emissions_company_year ON emissions_data(company_id, year)
-- idx_emissions_total ON emissions_data(total_emissions)
-- idx_emissions_intensity ON emissions_data(emissions_intensity)
```

**Query Optimization**:
- Document traceability: `WHERE trancenable_document_id = 'uuid'` → <1ms
- Temporal analysis: `WHERE disclosure_year = 2023` → ~10ms across 5,157 records
- Methodology filtering: `WHERE calculation_method = 'Market-based'` → ~8ms

### 4. RELATIONSHIP AND SUPPORT TABLE INDEXES
**Purpose**: Efficient joins and relationship queries
```sql
-- Company identifiers table
CREATE INDEX CONCURRENTLY idx_company_identifiers_type_value 
ON public.company_identifiers(identifier_type, identifier_value);

CREATE INDEX CONCURRENTLY idx_company_identifiers_company 
ON public.company_identifiers(company_id);

CREATE INDEX CONCURRENTLY idx_company_identifiers_primary 
ON public.company_identifiers(company_id) 
WHERE is_primary = TRUE;

-- Industry mapping confidence tracking
CREATE INDEX CONCURRENTLY idx_industry_mapping_confidence 
ON public.industry_mapping_log(confidence_score DESC);

-- Emission sources detail
CREATE INDEX CONCURRENTLY idx_emission_sources_detail_emissions 
ON public.emission_sources_detail(emissions_data_id);

CREATE INDEX CONCURRENTLY idx_emission_sources_detail_category 
ON public.emission_sources_detail(source_category, emission_scope);
```

**Query Optimization**:
- Identifier lookups: Multi-source company identification → ~2ms
- Primary identifier queries: `WHERE is_primary = TRUE` → <1ms
- Mapping confidence: Quality assessment queries → ~3ms
- Source detail analysis: Detailed emissions breakdown → ~5ms

## Performance Impact Analysis

### Index Size Estimates
```
PRIMARY INDEXES:
├── Company identifiers: ~500KB (4 indexes × 600 companies)
├── Unique constraints: ~200KB (integrity enforcement)
└── Analytical indexes: ~800KB (composite indexes)

EMISSIONS INDEXES:
├── Trancenable-specific: ~2MB (19,902 records)
├── Temporal indexes: ~1.5MB (year-based queries)
└── Source tracking: ~1MB (document relationships)

SUPPORT TABLE INDEXES:
├── Company identifiers: ~100KB (relationship table)
├── Industry mapping: ~50KB (mapping confidence)
└── Emission sources: ~500KB (detailed breakdowns)

TOTAL ESTIMATED SIZE: ~6.5MB additional storage
```

### Query Performance Targets
```
LOOKUP QUERIES (Sub-second response):
├── Company by LEI/ticker: <1ms
├── Primary identifier lookup: <1ms
└── Document traceability: <1ms

ANALYTICAL QUERIES (Real-time dashboard):
├── Sector/industry filtering: 2-5ms
├── Geographic analysis: 3-8ms
├── Quality score filtering: 5-10ms
└── Temporal emissions analysis: 10-20ms

COMPLEX QUERIES (Batch operations):
├── Multi-company aggregations: 50-100ms
├── Cross-year trend analysis: 100-200ms
└── Full dataset exports: 1-2 seconds
```

## Index Maintenance Strategy

### Monitoring Queries
```sql
-- Index usage statistics
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as times_used,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes 
WHERE indexname LIKE '%trancenable%' OR indexname LIKE '%companies%'
ORDER BY idx_scan DESC;

-- Index size monitoring
SELECT 
    indexname,
    pg_size_pretty(pg_total_relation_size(indexname::regclass)) as size
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(indexname::regclass) DESC;

-- Unused index detection
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND schemaname = 'public';
```

### Maintenance Schedule
```
DAILY:
├── Monitor index usage statistics
├── Check for unused indexes (idx_scan = 0)
└── Validate query performance metrics

WEEKLY:
├── Analyze index bloat and fragmentation
├── Review slow query logs for missing indexes
└── Update table statistics (ANALYZE)

MONTHLY:
├── REINDEX operations for heavily updated tables
├── Review and optimize composite index strategies
└── Assess need for new indexes based on usage patterns
```

## Index Creation Timing Strategy

### Phase 1: Pre-Data Load (Structural Indexes)
```sql
-- Create unique constraint indexes first
-- These prevent duplicate data during import
-- Execution time: ~50ms per index
```

### Phase 2: Post-Data Load (Performance Indexes)
```sql
-- Create analytical indexes after bulk data import
-- Avoids index maintenance overhead during ETL
-- Execution time: ~2-5 minutes total for all indexes
```

### Phase 3: Monitoring and Optimization
```sql
-- Monitor actual query patterns for 1-2 weeks
-- Add additional indexes based on real usage
-- Remove unused indexes to reduce maintenance overhead
```

## Query Pattern Optimization

### Common Query Patterns and Index Support

#### 1. Company Dashboard Queries
```sql
-- Query: Company overview with latest emissions
SELECT c.name, c.lei, c.sector, e.total_emissions
FROM companies c
LEFT JOIN emissions_data e ON c.id = e.company_id AND e.year = 2023
WHERE c.sector = 'Manufacturing'
ORDER BY e.total_emissions DESC;

-- Optimized by: idx_companies_sector_industry, idx_emissions_company_year
-- Expected performance: ~15ms for 200 manufacturing companies
```

#### 2. Industry Benchmarking Queries
```sql
-- Query: Industry emission benchmarks
SELECT 
    industry,
    AVG(total_emissions) as avg_emissions,
    COUNT(*) as company_count
FROM companies c
JOIN emissions_data e ON c.id = e.company_id
WHERE e.year = 2023 AND c.sector = 'Energy'
GROUP BY industry;

-- Optimized by: idx_companies_sector_industry, idx_emissions_company_year
-- Expected performance: ~25ms for energy sector analysis
```

#### 3. Data Quality Assessment
```sql
-- Query: Data quality review
SELECT 
    COUNT(*) as companies,
    AVG(data_quality_score) as avg_quality,
    COUNT(CASE WHEN lei IS NOT NULL THEN 1 END) as lei_coverage
FROM companies 
WHERE trancenable_company_id IS NOT NULL;

-- Optimized by: idx_companies_data_quality, idx_companies_trancenable_id
-- Expected performance: ~5ms for quality assessment
```

## Backup and Recovery Considerations

### Index Backup Strategy
```bash
# Include indexes in backup strategy
pg_dump --schema-only --table=companies --table=emissions_data > schema_backup.sql

# Index recreation script for recovery
grep "CREATE.*INDEX" schema_backup.sql > index_recreation.sql
```

### Rollback Index Management
```sql
-- Indexes are automatically dropped with tables during rollback
-- Ensure rollback script includes index cleanup verification
-- Recovery process should recreate only necessary indexes
```

## Performance Monitoring Dashboard

### Key Metrics to Track
```
INDEX PERFORMANCE:
├── Index hit ratio (target: >95%)
├── Average query response time (target: <50ms)
├── Index scan vs sequential scan ratio
└── Index bloat percentage (target: <20%)

QUERY PATTERNS:
├── Most frequent query types
├── Slowest queries (>100ms)
├── Missing index opportunities
└── Unused index identification

STORAGE METRICS:
├── Total index size growth
├── Table vs index size ratio
├── Index maintenance overhead
└── Disk I/O patterns
```

This indexing strategy ensures optimal performance for the Trancenable integration while maintaining scalability for future growth. The selective approach minimizes storage overhead while maximizing query performance for the most common use cases.