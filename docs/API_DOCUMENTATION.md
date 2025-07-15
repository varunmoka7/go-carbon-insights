# GoCarbonTracker API Documentation

## Overview

The GoCarbonTracker API provides programmatic access to corporate climate data, emissions tracking, and sustainability metrics. Built on Supabase, the API offers real-time data access with robust authentication and data quality validation.

## Base URL
```
https://hiplsgbyxbalukmejxaq.supabase.co/rest/v1/
```

## Authentication

### API Key Authentication
All API requests require authentication using Supabase API keys:

```bash
# Headers required for all requests
Authorization: Bearer <anon_key>
apikey: <anon_key>
Content-Type: application/json
```

### Anonymous Key
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcGxzZ2J5eGJhbHVrbWVqeGFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NDMxNDMsImV4cCI6MjA2NDAxOTE0M30.q6OONa0tbs0_CS2eZG0RG-bjghtAlHa2MeOR-Qoa2m4
```

## Core Endpoints

### Companies

#### Get All Companies
```http
GET /companies
```

**Query Parameters:**
- `select`: Specify fields to return
- `limit`: Limit number of results (default: 1000)
- `offset`: Pagination offset
- `order`: Sort order (e.g., `name.asc`)

**Example:**
```bash
curl -X GET "https://hiplsgbyxbalukmejxaq.supabase.co/rest/v1/companies?select=*&limit=10" \
  -H "Authorization: Bearer <anon_key>" \
  -H "apikey: <anon_key>"
```

**Response:**
```json
[
  {
    "id": "AAPL",
    "name": "Apple Inc.",
    "industry": "Technology Hardware & Equipment",
    "sector": "Technology",
    "carbon_footprint": 22600000,
    "energy_consumption": 18900000,
    "renewable_energy_percentage": 100,
    "created_at": "2024-01-15T00:00:00Z"
  }
]
```

#### Get Company by ID
```http
GET /companies?id=eq.{company_id}
```

#### Create Company
```http
POST /companies
```

**Request Body:**
```json
{
  "id": "COMPANY_ID",
  "name": "Company Name",
  "industry": "Industry Name",
  "sector": "Sector Name",
  "description": "Company description",
  "carbon_footprint": 1000000,
  "energy_consumption": 500000,
  "waste_generated": 50000
}
```

### Emissions Data

#### Get Emissions by Company
```http
GET /emissions_data?company_id=eq.{company_id}
```

**Example:**
```bash
curl -X GET "https://hiplsgbyxbalukmejxaq.supabase.co/rest/v1/emissions_data?company_id=eq.AAPL&order=year.desc" \
  -H "Authorization: Bearer <anon_key>" \
  -H "apikey: <anon_key>"
```

**Response:**
```json
[
  {
    "id": "uuid",
    "company_id": "AAPL",
    "year": 2023,
    "scope1": 1500000,
    "scope2": 3200000,
    "scope3": 17900000,
    "created_at": "2024-01-15T00:00:00Z"
  }
]
```

#### Create Emissions Record
```http
POST /emissions_data
```

**Request Body:**
```json
{
  "company_id": "COMPANY_ID",
  "year": 2023,
  "scope1": 1000000,
  "scope2": 2000000,
  "scope3": 5000000
}
```

### Scope-Specific Emissions

#### Scope 1 Emissions
```http
GET /scope1_emissions?company_id=eq.{company_id}
POST /scope1_emissions
```

**Scope 1 Record:**
```json
{
  "company_id": "COMPANY_ID",
  "year": 2023,
  "source": "Stationary Combustion",
  "total_emissions": 1000000,
  "emissions_by_source": 800000
}
```

#### Scope 2 Emissions
```http
GET /scope2_emissions?company_id=eq.{company_id}
POST /scope2_emissions
```

**Scope 2 Record:**
```json
{
  "company_id": "COMPANY_ID",
  "year": 2023,
  "source": "Purchased Electricity",
  "location": "United States",
  "total_emissions": 2000000,
  "emissions_by_source": 1800000,
  "percentage": "90"
}
```

#### Scope 3 Emissions
```http
GET /scope3_emissions?company_id=eq.{company_id}
POST /scope3_emissions
```

**Scope 3 Record:**
```json
{
  "company_id": "COMPANY_ID",
  "year": 2023,
  "category": "Purchased Goods and Services",
  "total_emissions": 5000000,
  "emissions_by_category": 4500000,
  "influence_factors": "Supply chain engagement",
  "insights": "Primary driver of Scope 3 emissions"
}
```

### Science-Based Targets (SBTi)

#### Get SBTi Targets
```http
GET /sbti_targets?company_id=eq.{company_id}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "company_id": "COMPANY_ID",
    "near_term_2030_scope1_2": 50,
    "near_term_2030_scope3": 25,
    "current_progress_scope1_2": 30,
    "current_progress_scope3": 15,
    "baseline_year": 2019,
    "target_year": 2030,
    "status": "Committed",
    "progress_percentage": 60
  }
]
```

#### Create SBTi Target
```http
POST /sbti_targets
```

### Framework Compliance

#### Get Framework Compliance
```http
GET /frameworks_compliance?company_id=eq.{company_id}
```

**Response:**
```json
[
  {
    "id": "uuid",
    "company_id": "COMPANY_ID",
    "framework_name": "CDP Climate Change",
    "status": "A-",
    "description": "Leadership level disclosure",
    "last_updated": "2023-12-31"
  }
]
```

### Industry Data

#### Get Industry Taxonomy
```http
GET /industry_taxonomy
```

**Response:**
```json
[
  {
    "id": "uuid",
    "sector": "Technology",
    "industry": "Technology Hardware & Equipment",
    "emissions_archetype": "Scope 2-heavy",
    "description": "Companies manufacturing technology hardware",
    "ghg_protocol_alignment": "Compliant",
    "cdp_category": "Technology",
    "sbti_pathway": "1.5°C Pathway"
  }
]
```

#### Get Industries by Sector
```http
GET /industry_taxonomy?sector=eq.Technology
```

### Company Benchmarks

#### Get Benchmarks by Industry
```http
GET /company_benchmarks?industry=eq.Technology Hardware & Equipment
```

**Response:**
```json
[
  {
    "id": "uuid",
    "company_id": "COMPANY_ID",
    "industry": "Technology Hardware & Equipment",
    "benchmark_year": 2023,
    "total_emissions": 22600000,
    "emissions_per_revenue": 0.0075,
    "emissions_per_employee": 502.2,
    "sbti_status": "Committed",
    "is_public_data": true
  }
]
```

## Advanced Queries

### Filtering and Sorting

#### Multiple Filters
```http
GET /companies?industry=eq.Technology&renewable_energy_percentage=gte.50&order=carbon_footprint.desc
```

#### Range Queries
```http
GET /emissions_data?year=gte.2020&year=lte.2023&scope1=gte.1000000
```

#### Text Search
```http
GET /companies?name=ilike.*Apple*
```

### Aggregations

#### Industry Totals
```http
GET /rpc/get_industry_totals
```

**Response:**
```json
[
  {
    "industry": "Technology Hardware & Equipment",
    "total_companies": 25,
    "total_emissions": 850000000,
    "avg_emissions": 34000000
  }
]
```

#### Sector Breakdown
```http
GET /rpc/get_sector_breakdown?year=2023
```

### Time Series Data

#### Emissions Trends
```http
GET /emissions_data?company_id=eq.AAPL&order=year.asc
```

#### Progress Tracking
```http
GET /sbti_targets?company_id=eq.AAPL&order=created_at.desc
```

## Real-time Subscriptions

### WebSocket Connection
```javascript
import { supabase } from '@supabase/supabase-js'

// Subscribe to emissions data changes
const subscription = supabase
  .channel('emissions-changes')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'emissions_data'
  }, (payload) => {
    console.log('New emissions data:', payload)
  })
  .subscribe()
```

### Real-time Filters
```javascript
// Subscribe to specific company updates
const companySubscription = supabase
  .channel('company-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'companies',
    filter: 'id=eq.AAPL'
  }, (payload) => {
    console.log('Apple data updated:', payload)
  })
  .subscribe()
```

## Data Quality & Validation

### Quality Score Endpoint
```http
GET /rpc/get_data_quality_score?company_id=COMPANY_ID
```

**Response:**
```json
{
  "company_id": "COMPANY_ID",
  "overall_score": 0.92,
  "completeness": 0.95,
  "accuracy": 0.90,
  "timeliness": 0.88,
  "verification_status": "Third-party verified"
}
```

### Validation Rules
```http
GET /rpc/validate_emissions_data
```

**Request Body:**
```json
{
  "emissions_data": {
    "scope1": 1000000,
    "scope2": 2000000,
    "scope3": 5000000,
    "year": 2023
  }
}
```

## Error Handling

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Unprocessable Entity
- `500`: Internal Server Error

### Error Response Format
```json
{
  "error": {
    "message": "Invalid company ID format",
    "code": "INVALID_FORMAT",
    "details": "Company ID must be alphanumeric and max 20 characters"
  }
}
```

## Rate Limiting

### Limits
- **Anonymous users**: 100 requests per minute
- **Authenticated users**: 1000 requests per minute
- **Bulk operations**: 10 requests per minute

### Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @supabase/supabase-js
```

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hiplsgbyxbalukmejxaq.supabase.co',
  'your-anon-key'
)

// Get companies
const { data, error } = await supabase
  .from('companies')
  .select('*')
  .limit(10)
```

### Python
```bash
pip install supabase
```

```python
from supabase import create_client

supabase = create_client(
    "https://hiplsgbyxbalukmejxaq.supabase.co",
    "your-anon-key"
)

# Get companies
response = supabase.table('companies').select('*').limit(10).execute()
```

## Data Import API

### Bulk Import Endpoint
```http
POST /rpc/bulk_import_companies
```

**Request Body:**
```json
{
  "companies": [
    {
      "id": "COMPANY1",
      "name": "Company One",
      "industry": "Technology",
      "carbon_footprint": 1000000
    }
  ]
}
```

### Import Status
```http
GET /rpc/get_import_status?import_id={import_id}
```

**Response:**
```json
{
  "import_id": "uuid",
  "status": "completed",
  "processed_records": 150,
  "successful_records": 148,
  "failed_records": 2,
  "errors": [
    {
      "record_id": "COMPANY_X",
      "error": "Invalid industry code"
    }
  ]
}
```

## Best Practices

### Performance Optimization
1. **Use specific selects**: Only request needed fields
2. **Implement pagination**: Use limit and offset for large datasets
3. **Filter early**: Apply filters to reduce data transfer
4. **Cache results**: Cache frequently accessed data
5. **Batch operations**: Group related operations together

### Security
1. **Validate inputs**: Always validate user inputs
2. **Use RLS policies**: Leverage Row-Level Security
3. **Monitor usage**: Track API usage patterns
4. **Rotate keys**: Regularly rotate API keys
5. **Audit access**: Log all data access

### Data Quality
1. **Validate before insert**: Use validation endpoints
2. **Check quality scores**: Monitor data quality metrics
3. **Handle errors gracefully**: Implement proper error handling
4. **Provide feedback**: Report data quality issues
5. **Regular audits**: Perform periodic data audits

## Support

### Documentation
- [Supabase Documentation](https://supabase.com/docs)
- [PostgREST API Reference](https://postgrest.org/en/stable/api.html)
- [Real-time Subscriptions](https://supabase.com/docs/guides/realtime)

### Community
- [GitHub Issues](https://github.com/your-repo/issues)
- [Discord Community](https://discord.gg/your-discord)
- [Developer Forum](https://forum.your-domain.com)

### Enterprise Support
For enterprise customers requiring SLA guarantees, dedicated support, or custom implementations:
- Email: enterprise@gocarbontracker.com
- Phone: +1-555-CARBON-1
- Support Portal: https://support.gocarbontracker.com