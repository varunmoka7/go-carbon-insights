# 🟨 JavaScript/Node.js API Examples

**Complete examples for integrating GoCarbonTracker API with JavaScript**

## Setup & Authentication

### **Install Supabase Client**
```bash
npm install @supabase/supabase-js
```

### **Basic Client Setup**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hiplsgbyxbalukmejxaq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your anon key
const supabase = createClient(supabaseUrl, supabaseKey);
```

### **Environment Variables (.env)**
```bash
VITE_SUPABASE_URL=https://hiplsgbyxbalukmejxaq.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Basic Data Fetching

### **Get All Companies**
```javascript
async function getAllCompanies() {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(100);
    
    if (error) throw error;
    
    console.log('Companies:', data);
    return data;
  } catch (error) {
    console.error('Error fetching companies:', error.message);
    return [];
  }
}
```

### **Get Company by ID**
```javascript
async function getCompanyById(companyId) {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      scope1_emissions(*),
      scope2_emissions(*),
      scope3_emissions(*)
    `)
    .eq('id', companyId)
    .single();
    
  if (error) {
    console.error('Error:', error.message);
    return null;
  }
  
  return data;
}
```

### **Search Companies by Name**
```javascript
async function searchCompanies(searchTerm) {
  const { data, error } = await supabase
    .from('companies')
    .select('id, name, industry, country')
    .ilike('name', `%${searchTerm}%`)
    .order('name');
    
  return error ? [] : data;
}
```

## Advanced Queries

### **Filter by Industry and SBTi Status**
```javascript
async function getCompaniesWithTargets(industry = null) {
  let query = supabase
    .from('companies')
    .select(`
      name,
      industry,
      sbti_status,
      sbti_target_date,
      scope1_emissions(year, total_emissions),
      scope2_emissions(year, total_emissions)
    `)
    .not('sbti_status', 'is', null);
    
  if (industry) {
    query = query.eq('industry', industry);
  }
  
  const { data, error } = await query.order('name');
  return error ? [] : data;
}
```

### **Get Emissions Trends**
```javascript
async function getEmissionsTrends(companyId, years = 3) {
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - years;
  
  const { data, error } = await supabase
    .from('scope1_emissions')
    .select('year, total_emissions, quality_score')
    .eq('company_id', companyId)
    .gte('year', startYear)
    .order('year');
    
  return error ? [] : data;
}
```

### **Industry Benchmarking**
```javascript
async function getIndustryBenchmarks(industry) {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      name,
      scope1_emissions!inner(total_emissions, year),
      scope2_emissions!inner(total_emissions, year)
    `)
    .eq('industry', industry)
    .eq('scope1_emissions.year', 2023)
    .eq('scope2_emissions.year', 2023);
    
  if (error) return [];
  
  // Calculate industry averages
  const scope1Avg = data.reduce((sum, company) => 
    sum + (company.scope1_emissions[0]?.total_emissions || 0), 0) / data.length;
    
  const scope2Avg = data.reduce((sum, company) => 
    sum + (company.scope2_emissions[0]?.total_emissions || 0), 0) / data.length;
    
  return {
    industry,
    companies: data.length,
    scope1_average: scope1Avg,
    scope2_average: scope2Avg,
    companies_data: data
  };
}
```

## Real-time Data Subscriptions

### **Subscribe to Company Updates**
```javascript
function subscribeToCompanyUpdates(companyId, callback) {
  const subscription = supabase
    .channel(`company-${companyId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'companies',
        filter: `id=eq.${companyId}`
      },
      callback
    )
    .subscribe();
    
  return subscription;
}

// Usage
const unsubscribe = subscribeToCompanyUpdates(123, (payload) => {
  console.log('Company updated:', payload.new);
});

// Clean up when done
// unsubscribe();
```

### **Real-time Dashboard Data**
```javascript
class RealTimeDashboard {
  constructor() {
    this.subscriptions = [];
  }
  
  subscribeToEmissionsUpdates(callback) {
    const channels = ['scope1_emissions', 'scope2_emissions', 'scope3_emissions'];
    
    channels.forEach(table => {
      const subscription = supabase
        .channel(table)
        .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
        .subscribe();
        
      this.subscriptions.push(subscription);
    });
  }
  
  cleanup() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}
```

## Error Handling & Retry Logic

### **Robust API Client**
```javascript
class GoCarbonAPI {
  constructor(supabaseUrl, supabaseKey) {
    this.client = createClient(supabaseUrl, supabaseKey);
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second
  }
  
  async withRetry(operation, retries = this.maxRetries) {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await this.delay(this.retryDelay);
        return this.withRetry(operation, retries - 1);
      }
      throw error;
    }
  }
  
  isRetryableError(error) {
    return error.message.includes('network') || 
           error.message.includes('timeout') ||
           error.status >= 500;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async getCompanies(filters = {}) {
    return this.withRetry(async () => {
      let query = this.client.from('companies').select('*');
      
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    });
  }
}
```

## Data Processing & Analysis

### **Calculate Emissions Intensity**
```javascript
async function calculateEmissionsIntensity(companyId) {
  const { data: company, error } = await supabase
    .from('companies')
    .select(`
      name,
      revenue_2023,
      employees_2023,
      scope1_emissions!inner(total_emissions),
      scope2_emissions!inner(total_emissions)
    `)
    .eq('id', companyId)
    .eq('scope1_emissions.year', 2023)
    .eq('scope2_emissions.year', 2023)
    .single();
    
  if (error || !company) return null;
  
  const totalEmissions = 
    (company.scope1_emissions[0]?.total_emissions || 0) +
    (company.scope2_emissions[0]?.total_emissions || 0);
    
  return {
    company_name: company.name,
    total_emissions: totalEmissions,
    emissions_per_revenue: company.revenue_2023 ? 
      (totalEmissions / company.revenue_2023).toFixed(2) : null,
    emissions_per_employee: company.employees_2023 ? 
      (totalEmissions / company.employees_2023).toFixed(2) : null
  };
}
```

### **Export Data to CSV**
```javascript
async function exportCompaniesToCSV(filters = {}) {
  const companies = await getAllCompanies(filters);
  
  const csvHeaders = ['Name', 'Industry', 'Country', 'SBTi Status', 'Total Emissions 2023'];
  const csvRows = companies.map(company => [
    company.name,
    company.industry,
    company.country,
    company.sbti_status || 'None',
    company.total_emissions_2023 || 'N/A'
  ]);
  
  const csvContent = [csvHeaders, ...csvRows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
    
  // Download file
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'companies-export.csv';
  a.click();
  window.URL.revokeObjectURL(url);
}
```

## React Integration Examples

### **Custom Hook for Companies**
```javascript
import { useState, useEffect } from 'react';

function useCompanies(filters = {}) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchCompanies() {
      try {
        setLoading(true);
        let query = supabase.from('companies').select('*');
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value) query = query.eq(key, value);
        });
        
        const { data, error } = await query;
        if (error) throw error;
        
        setCompanies(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCompanies();
  }, [JSON.stringify(filters)]);
  
  return { companies, loading, error };
}

// Usage in component
function CompanyList({ industry }) {
  const { companies, loading, error } = useCompanies({ industry });
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <ul>
      {companies.map(company => (
        <li key={company.id}>{company.name}</li>
      ))}
    </ul>
  );
}
```

## Testing Examples

### **Jest Test Suite**
```javascript
import { createClient } from '@supabase/supabase-js';
import { GoCarbonAPI } from './api-client';

// Mock Supabase for testing
jest.mock('@supabase/supabase-js');

describe('GoCarbonAPI', () => {
  let api;
  let mockSupabase;
  
  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({ data: [], error: null })
    };
    
    createClient.mockReturnValue(mockSupabase);
    api = new GoCarbonAPI('url', 'key');
  });
  
  test('should fetch companies successfully', async () => {
    const mockData = [{ id: 1, name: 'Test Company' }];
    mockSupabase.limit.mockResolvedValue({ data: mockData, error: null });
    
    const result = await api.getCompanies();
    expect(result).toEqual(mockData);
    expect(mockSupabase.from).toHaveBeenCalledWith('companies');
  });
  
  test('should handle errors gracefully', async () => {
    mockSupabase.limit.mockResolvedValue({ 
      data: null, 
      error: new Error('Network error') 
    });
    
    await expect(api.getCompanies()).rejects.toThrow('Network error');
  });
});
```

---
*These examples demonstrate production-ready patterns for integrating with the GoCarbonTracker API. Adapt them to your specific use case and requirements.*