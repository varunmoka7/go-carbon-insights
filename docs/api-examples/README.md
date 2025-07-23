# 🔌 API Integration Examples

**Code examples for integrating with the GoCarbonTracker API**

## Getting Started

### **Authentication Setup**
All API requests require Supabase authentication headers:
```bash
Authorization: Bearer <anon_key>
apikey: <anon_key>
Content-Type: application/json
```

### **Base URL**
```
https://hiplsgbyxbalukmejxaq.supabase.co/rest/v1/
```

## Language Examples

### 📋 [JavaScript/Node.js Examples](./javascript-examples.md)
- Fetch companies with async/await
- Real-time data subscriptions
- Error handling patterns
- Authentication flows

### 🐍 [Python Examples](./python-examples.md)
- Data analysis with pandas
- Batch data processing
- API client class
- Integration with data science workflows

### 🌐 cURL Examples *(coming soon)*
- Command-line API testing
- Shell script automation
- Quick data retrieval
- Authentication verification

## Common Use Cases

### **ESG Data Analysis**
```javascript
// Get companies with SBTi targets
const response = await fetch('/companies?sbti_status=eq.Committed');
const companies = await response.json();
```

### **Industry Benchmarking**
```python
# Compare emissions across industry peers
companies = supabase.table('companies').select('*').eq('industry', 'Technology').execute()
```

### **Real-time Monitoring**
```javascript
// Subscribe to data updates
const subscription = supabase
  .channel('companies')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'companies' }, handleUpdate)
  .subscribe();
```

## Integration Patterns

### **Data Fetching Strategies**
- **Pagination**: Handle large datasets efficiently
- **Filtering**: Use query parameters for targeted data
- **Caching**: Implement local caching for performance
- **Rate Limiting**: Respect API limits and implement backoff

### **Error Handling**
- **Network Errors**: Retry with exponential backoff
- **Authentication Errors**: Token refresh patterns
- **Data Validation**: Client-side validation strategies
- **Graceful Degradation**: Fallback mechanisms

### **Performance Optimization**
- **Selective Fields**: Use `select` parameter to reduce payload
- **Batch Requests**: Combine multiple queries efficiently
- **Connection Pooling**: Reuse connections for multiple requests
- **Compression**: Enable gzip compression for responses

## Security Best Practices

### **API Key Management**
- Store keys in environment variables
- Use different keys for dev/staging/production
- Rotate keys regularly
- Never commit keys to version control

### **Data Access Patterns**
- Implement Row-Level Security (RLS) policies
- Use proper authentication flows
- Validate all input data
- Log API access for monitoring

## Quick Start Templates

### **Basic Data Fetcher**
```javascript
// Template for basic API integration
class GoCarbonAPI {
  constructor(apiKey) {
    this.baseURL = 'https://hiplsgbyxbalukmejxaq.supabase.co/rest/v1/';
    this.headers = {
      'Authorization': `Bearer ${apiKey}`,
      'apikey': apiKey,
      'Content-Type': 'application/json'
    };
  }
  
  async getCompanies(filters = {}) {
    // Implementation in javascript-examples.md
  }
}
```

### **Data Analysis Starter**
```python
# Template for data science workflows
import pandas as pd
from supabase import create_client

class ClimateDataAnalyzer:
    def __init__(self, supabase_url, supabase_key):
        self.client = create_client(supabase_url, supabase_key)
    
    def load_emissions_data(self):
        # Implementation in python-examples.md
        pass
```

## Resources

### **API Reference**
- [Complete API Documentation](../API_DOCUMENTATION.md)
- [Authentication Guide](../API_DOCUMENTATION.md#authentication)
- [Rate Limiting](../API_DOCUMENTATION.md#rate-limiting)

### **Development Tools**
- [Postman Collection](./postman-collection.json) *(coming soon)*
- [OpenAPI Specification](./openapi.yaml) *(coming soon)*
- [API Testing Scripts](./test-scripts/) *(coming soon)*

### **Support**
- [Troubleshooting Guide](../TROUBLESHOOTING_GUIDE.md)
- [FAQ](../FAQ.md)
- [Community Forum](../user-guides/README.md#community--support)

---
*These examples are maintained alongside the platform. Found an issue or have a suggestion? [Contribute to our documentation](../CONTRIBUTING_QUICK.md)*