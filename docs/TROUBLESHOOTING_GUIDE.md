# Troubleshooting Guide - GoCarbonTracker

**Version**: 1.0  
**Date**: January 22, 2025  
**Owner**: Technical Team  

## 📋 Overview

This comprehensive troubleshooting guide helps developers, administrators, and users resolve common issues in GoCarbonTracker. It covers frontend, backend, database, and deployment-related problems with step-by-step solutions.

## 🚨 Emergency Procedures

### Critical Issues Triage

#### Severity Levels
- **P0 (Critical)**: System down, data loss, security breach
- **P1 (High)**: Major functionality broken, performance severely degraded
- **P2 (Medium)**: Minor features broken, workarounds available
- **P3 (Low)**: Cosmetic issues, enhancement requests

#### Emergency Response
```bash
# Quick health check
curl -f https://your-domain.com/api/health

# Check system status
docker ps  # If using containers
pm2 status  # If using PM2
systemctl status your-service  # If using systemd

# View recent logs
tail -f /var/log/application.log
journalctl -u your-service -f
```

### Contact Information
- **On-call Engineer**: See internal documentation
- **System Admin**: See internal documentation
- **Emergency Escalation**: See internal documentation

## 🔧 Development Environment Issues

### Installation & Setup Problems

#### Node.js Version Issues
**Problem**: Application fails to start due to Node.js version mismatch
```bash
Error: The engine "node" is incompatible with this module
```

**Solution**:
```bash
# Check current version
node --version

# Install correct version using nvm
nvm install 18
nvm use 18
nvm alias default 18

# Verify installation
node --version  # Should show v18.x.x
npm --version   # Should be compatible
```

#### NPM Installation Failures
**Problem**: Dependencies fail to install
```bash
npm ERR! peer dep missing
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps

# Alternative: Use specific npm version
npm install -g npm@8.19.2
npm install
```

#### Environment Variables Missing
**Problem**: Application crashes with missing environment variables
```bash
Error: SUPABASE_URL is required
```

**Solution**:
```bash
# Check if .env.local exists
ls -la .env*

# Copy from example
cp .env.example .env.local

# Required variables for development:
echo "VITE_SUPABASE_URL=your_supabase_url" >> .env.local
echo "VITE_SUPABASE_ANON_KEY=your_anon_key" >> .env.local
echo "DATABASE_URL=your_database_url" >> .env.local
```

### Development Server Issues

#### Port Already in Use
**Problem**: Development server won't start
```bash
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution**:
```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)

# Or use different port
npm run dev -- --port 3001
```

#### Hot Reload Not Working
**Problem**: Changes not reflecting in browser

**Solutions**:
```bash
# Clear browser cache
# Chrome: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

# Restart development server
npm run dev

# Check if file watcher limit exceeded (Linux)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

#### TypeScript Compilation Errors
**Problem**: TypeScript errors preventing development
```bash
Type 'string' is not assignable to type 'number'
Property 'data' does not exist on type 'unknown'
```

**Solutions**:
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Fix common issues:
# 1. Add proper type annotations
interface EmissionData {
  scope1: number;
  scope2: number;
  scope3: number;
}

# 2. Use type guards
const isEmissionData = (data: unknown): data is EmissionData => {
  return typeof data === 'object' && data !== null && 'scope1' in data;
};

# 3. Update TypeScript if needed
npm update typescript
```

## 🌐 Frontend Issues

### React Component Problems

#### Components Not Rendering
**Problem**: Components appear blank or don't render

**Debugging Steps**:
```typescript
// Add error boundary
class ErrorBoundary extends Component<{children: React.ReactNode}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

// Check console for errors
console.log('Component props:', props);
console.log('Component state:', state);

// Verify data structure
console.log('Data type:', typeof data);
console.log('Data content:', JSON.stringify(data, null, 2));
```

#### State Updates Not Working
**Problem**: Component state doesn't update as expected

**Common Causes & Solutions**:
```typescript
// ❌ Mutating state directly
const [items, setItems] = useState([]);
items.push(newItem);  // Wrong!

// ✅ Using functional updates
setItems(prev => [...prev, newItem]);

// ❌ Stale closures in useEffect
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1);  // Uses stale count
  }, 1000);
}, []);

// ✅ Using functional updates
useEffect(() => {
  const timer = setInterval(() => {
    setCount(prev => prev + 1);
  }, 1000);
}, []);
```

#### Infinite Re-renders
**Problem**: Component enters infinite render loop

**Solution**:
```typescript
// ❌ Missing dependencies in useEffect
useEffect(() => {
  fetchData(companyId);
}, []); // Missing companyId dependency

// ✅ Include all dependencies
useEffect(() => {
  fetchData(companyId);
}, [companyId]);

// ❌ Creating objects in render
const EmissionChart = ({ data }) => {
  const options = { responsive: true };  // New object every render
  return <Chart data={data} options={options} />;
};

// ✅ Memoize objects
const EmissionChart = ({ data }) => {
  const options = useMemo(() => ({ responsive: true }), []);
  return <Chart data={data} options={options} />;
};
```

### Styling Issues

#### Tailwind Classes Not Applied
**Problem**: Tailwind CSS classes not working

**Solutions**:
```bash
# Check if Tailwind is properly installed
npm list tailwindcss

# Verify tailwind.config.ts
npx tailwindcss --init

# Check content paths in config
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}

# Rebuild CSS
npm run build:css

# Clear browser cache
```

#### Responsive Design Issues
**Problem**: Layout breaks on mobile devices

**Debugging**:
```css
/* Debug responsive breakpoints */
@media (max-width: 640px) {
  body::before {
    content: "sm";
    position: fixed;
    top: 0;
    right: 0;
    background: red;
    color: white;
    padding: 4px;
    z-index: 9999;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  body::before {
    content: "md";
    /* ... */
  }
}
```

### Performance Issues

#### Slow Rendering
**Problem**: Components take too long to render

**Solutions**:
```typescript
// Use React DevTools Profiler
// Wrap component in Profiler
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration) => {
  console.log('Render time:', id, phase, actualDuration);
};

<Profiler id="EmissionChart" onRender={onRenderCallback}>
  <EmissionChart data={data} />
</Profiler>

// Optimize with memoization
const ExpensiveComponent = memo(({ data, filters }) => {
  const processedData = useMemo(() => {
    return heavyDataProcessing(data, filters);
  }, [data, filters]);
  
  return <Chart data={processedData} />;
});

// Use virtualization for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedList = ({ items }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={50}
  >
    {({ index, style }) => (
      <div style={style}>
        {items[index].name}
      </div>
    )}
  </List>
);
```

## 🔧 Backend Issues

### API Problems

#### 500 Internal Server Error
**Problem**: API endpoints returning 500 errors

**Debugging Steps**:
```bash
# Check server logs
tail -f logs/error.log
tail -f logs/combined.log

# Test endpoint directly
curl -X GET \
  "http://localhost:8000/api/companies" \
  -H "Authorization: Bearer your_token"

# Check database connection
npm run db:check
```

**Common Causes**:
```typescript
// ❌ Unhandled promise rejection
app.get('/api/companies', (req, res) => {
  fetchCompanies();  // Missing await and error handling
  res.json(data);
});

// ✅ Proper error handling
app.get('/api/companies', async (req, res) => {
  try {
    const data = await fetchCompanies();
    res.json(data);
  } catch (error) {
    logger.error('Failed to fetch companies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

#### Authentication Issues
**Problem**: Authentication failures

**Solutions**:
```typescript
// Debug JWT tokens
import jwt from 'jsonwebtoken';

const debugToken = (token: string) => {
  try {
    const decoded = jwt.decode(token, { complete: true });
    console.log('Token header:', decoded?.header);
    console.log('Token payload:', decoded?.payload);
    console.log('Token expires:', new Date((decoded?.payload as any)?.exp * 1000));
  } catch (error) {
    console.error('Invalid token:', error);
  }
};

// Check Supabase auth
const { data: { user }, error } = await supabase.auth.getUser(token);
if (error) {
  console.error('Auth error:', error);
  return res.status(401).json({ error: 'Unauthorized' });
}
```

#### Rate Limiting Issues
**Problem**: Users getting rate limited

**Solutions**:
```typescript
// Check rate limit configuration
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Debug rate limits
app.use('/api', (req, res, next) => {
  console.log('Rate limit info:', {
    ip: req.ip,
    remaining: res.getHeader('X-RateLimit-Remaining'),
    reset: res.getHeader('X-RateLimit-Reset')
  });
  next();
});
```

### Database Issues

#### Connection Problems
**Problem**: Database connection failures

**Solutions**:
```bash
# Test database connection
psql -h localhost -U username -d database_name

# Check connection pool
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  query
FROM pg_stat_activity 
WHERE datname = 'your_database';

# Check for deadlocks
SELECT 
  blocked_locks.pid AS blocked_pid,
  blocked_activity.usename AS blocked_user,
  blocking_locks.pid AS blocking_pid,
  blocking_activity.usename AS blocking_user,
  blocked_activity.query AS blocked_statement,
  blocking_activity.query AS current_statement_in_blocking_process
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks ON blocking_locks.locktype = blocked_locks.locktype
JOIN pg_catalog.pg_stat_activity blocking_activity ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;
```

#### Slow Queries
**Problem**: Database queries taking too long

**Solutions**:
```sql
-- Enable query logging
ALTER SYSTEM SET log_min_duration_statement = 1000;  -- Log queries > 1s
SELECT pg_reload_conf();

-- Analyze slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  stddev_time
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Check for missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE schemaname = 'public' 
  AND n_distinct > 100;

-- Create index for common queries
CREATE INDEX CONCURRENTLY idx_emissions_company_year 
ON emissions (company_id, year);
```

#### Migration Issues
**Problem**: Database migrations failing

**Solutions**:
```bash
# Check migration status
npm run migration:status

# Run specific migration
npm run migration:up 001-initial-schema.sql

# Rollback migration
npm run migration:down

# Reset database (development only)
npm run db:reset
npm run migration:up

# Manual migration check
psql -d database_name -c "SELECT * FROM schema_migrations;"
```

## 🚀 Deployment Issues

### Build Problems

#### Build Failures
**Problem**: Application fails to build

**Solutions**:
```bash
# Clear build cache
rm -rf dist/
rm -rf .vite/

# Check build logs
npm run build 2>&1 | tee build.log

# Build with verbose output
npm run build -- --verbose

# Check memory usage
node --max-old-space-size=4096 $(which npm) run build

# Common fixes:
# 1. Update dependencies
npm audit fix

# 2. Clear TypeScript cache
npx tsc --build --clean

# 3. Check for circular dependencies
npx madge --circular src/
```

#### Environment-Specific Issues
**Problem**: Application works locally but fails in production

**Solutions**:
```bash
# Check environment variables
printenv | grep -E "(NODE_ENV|VITE_|DATABASE_URL)"

# Verify production build locally
npm run build
npm run preview

# Check for missing dependencies
npm ls --production
npm prune --production

# Compare package-lock.json versions
diff package-lock.json.local package-lock.json.production
```

### SSL/TLS Issues

#### Certificate Problems
**Problem**: SSL certificate errors

**Solutions**:
```bash
# Check certificate status
openssl s_client -connect your-domain.com:443 -servername your-domain.com

# Verify certificate chain
curl -vI https://your-domain.com

# Check certificate expiry
echo | openssl s_client -servername your-domain.com -connect your-domain.com:443 2>/dev/null | openssl x509 -noout -dates

# Renew Let's Encrypt certificate
certbot renew --dry-run
certbot renew
```

### Load Balancer Issues

#### Health Check Failures
**Problem**: Load balancer marking instances as unhealthy

**Solutions**:
```bash
# Test health endpoint
curl -f http://localhost:3000/health

# Check health endpoint implementation
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      memory: process.memoryUsage(),
    }
  };
  
  res.status(200).json(health);
});

# Verify load balancer configuration
# Check timeout settings
# Verify health check path
# Confirm expected response codes
```

## 🔍 Monitoring & Debugging

### Logging Best Practices

#### Structured Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Usage
logger.info('User login', { 
  userId: user.id, 
  email: user.email,
  ip: req.ip 
});

logger.error('Database query failed', { 
  query: 'SELECT * FROM companies',
  error: error.message,
  stack: error.stack 
});
```

#### Log Analysis
```bash
# Search for errors in logs
grep -i "error" logs/combined.log | tail -20

# Find specific patterns
grep -E "(500|error|exception)" logs/combined.log

# Analyze performance
grep "response_time" logs/combined.log | awk '{print $4}' | sort -n

# Monitor real-time logs
tail -f logs/combined.log | grep -E "(error|warn)"
```

### Performance Debugging

#### Memory Leaks
```typescript
// Monitor memory usage
setInterval(() => {
  const usage = process.memoryUsage();
  console.log('Memory usage:', {
    rss: Math.round(usage.rss / 1024 / 1024) + 'MB',
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024) + 'MB',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024) + 'MB',
    external: Math.round(usage.external / 1024 / 1024) + 'MB'
  });
}, 30000);

// Heap dump for analysis
import v8 from 'v8';
import fs from 'fs';

const takeHeapSnapshot = () => {
  const stream = v8.getHeapSnapshot();
  const fileName = `heap-${Date.now()}.heapsnapshot`;
  const fileStream = fs.createWriteStream(fileName);
  stream.pipe(fileStream);
  console.log(`Heap snapshot saved: ${fileName}`);
};
```

#### CPU Profiling
```bash
# Node.js profiling
node --prof app.js

# Process the profile
node --prof-process isolate-0x[hash]-v8.log > profile.txt

# Use clinic.js for detailed analysis
npm install -g clinic
clinic doctor -- node app.js
clinic flame -- node app.js
```

## 📋 Troubleshooting Checklists

### Frontend Issue Checklist
- [ ] Check browser console for errors
- [ ] Verify network requests in DevTools
- [ ] Check React DevTools for component state
- [ ] Validate props and data types
- [ ] Test in different browsers
- [ ] Check responsive design
- [ ] Verify API endpoints are reachable
- [ ] Check authentication status

### Backend Issue Checklist
- [ ] Check server logs for errors
- [ ] Verify database connectivity
- [ ] Test API endpoints manually
- [ ] Check authentication middleware
- [ ] Verify environment variables
- [ ] Monitor resource usage (CPU, memory)
- [ ] Check for rate limiting
- [ ] Validate input data

### Database Issue Checklist
- [ ] Check connection pool status
- [ ] Analyze slow query logs
- [ ] Verify index usage
- [ ] Check for deadlocks
- [ ] Monitor database size
- [ ] Validate migration status
- [ ] Check backup status
- [ ] Verify permissions

### Deployment Issue Checklist
- [ ] Verify build process completes
- [ ] Check environment-specific configuration
- [ ] Validate SSL certificates
- [ ] Test health endpoints
- [ ] Check load balancer configuration
- [ ] Verify DNS resolution
- [ ] Monitor application metrics
- [ ] Check log aggregation

## 🆘 When to Escalate

### Escalation Criteria
- Security vulnerabilities discovered
- Data loss or corruption
- System completely unavailable
- Performance degraded beyond acceptable limits
- Unable to resolve within SLA timeframe

### Escalation Process
1. **Document the issue**: Symptoms, steps taken, impact
2. **Gather logs**: Relevant log files and error messages
3. **Contact next level**: Follow internal escalation procedures
4. **Provide context**: Share all debugging information
5. **Stay available**: Be ready to provide additional information

## 📚 Additional Resources

### Internal Documentation
- [Architecture Overview](./architecture/)
- [API Documentation](./API_DOCUMENTATION.md)
- [Testing Strategy](./TESTING_STRATEGY.md)
- [Performance Benchmarks](./PERFORMANCE_BENCHMARKS.md)

### External Resources
- [React Debugging Guide](https://react.dev/learn/react-developer-tools)
- [Node.js Debugging](https://nodejs.org/en/docs/guides/debugging-getting-started/)
- [PostgreSQL Performance](https://www.postgresql.org/docs/current/performance-tips.html)
- [Supabase Troubleshooting](https://supabase.com/docs/guides/troubleshooting)

### Tools & Utilities
- [React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [pgAdmin](https://www.pgadmin.org/)

---

**Last Updated**: January 22, 2025  
**Version**: 1.0  
**Maintained by**: Technical Team

This guide is continuously updated based on common issues and solutions. If you encounter new problems or have better solutions, please contribute to this documentation.