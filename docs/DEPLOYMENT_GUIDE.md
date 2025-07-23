# 🚀 Production Deployment Guide

**Complete guide for deploying GoCarbonTracker to production environments**

## Overview

GoCarbonTracker is designed for easy deployment with multiple hosting options. This guide covers production-ready deployment strategies with security, performance, and scalability considerations.

## Quick Deploy Options

### **Option 1: Lovable Platform (Recommended)**
**Easiest deployment - One-click production ready**

1. **Open Lovable Project**: https://lovable.dev/projects/6fcef7a7-25cd-4c8d-b7e1-5fdfbaf9a17b
2. **Click Share → Publish**
3. **Configure custom domain** (optional): Project > Settings > Domains

**Features:**
- ✅ Automatic HTTPS/SSL
- ✅ Global CDN
- ✅ Automatic builds on git push
- ✅ Environment variable management
- ✅ Built-in monitoring

### **Option 2: Vercel (Static/Serverless)**
**Great for React apps with global edge deployment**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from repository
vercel --prod

# Or connect GitHub repository via Vercel dashboard
```

**Configuration (`vercel.json`):**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "env": {
    "VITE_SUPABASE_URL": "@supabase_url",
    "VITE_SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

### **Option 3: Netlify**
**Static site hosting with excellent developer experience**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy manually
npm run build
netlify deploy --prod --dir=dist

# Or connect repository via Netlify dashboard
```

**Configuration (`netlify.toml`):**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Advanced Deployment Options

### **Option 4: AWS (S3 + CloudFront)**
**Enterprise-grade deployment with full AWS integration**

#### **Infrastructure Setup**
```bash
# Create S3 bucket
aws s3 mb s3://your-app-bucket

# Enable static website hosting
aws s3 website s3://your-app-bucket --index-document index.html --error-document index.html

# Build and upload
npm run build
aws s3 sync dist/ s3://your-app-bucket --delete

# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

#### **CloudFront Configuration**
```json
{
  "CallerReference": "go-carbon-tracker-deployment",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "s3-origin",
        "DomainName": "your-app-bucket.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200"
      }
    ]
  }
}
```

### **Option 5: Docker Deployment**
**Containerized deployment for any cloud provider**

#### **Dockerfile**
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### **nginx.conf**
```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/css text/javascript application/javascript application/json;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;
        
        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        
        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

#### **Docker Compose for Development**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    restart: unless-stopped
    
  # Optional: Add monitoring
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml:ro
```

## Environment Configuration

### **Production Environment Variables**
```bash
# Required - Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional - Analytics & Monitoring
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn

# Optional - Feature Flags
VITE_ENABLE_DEMO_MODE=true
VITE_ENABLE_ANALYTICS=true

# Build Optimization
VITE_DROP_CONSOLE=true
VITE_MINIFY=true
```

### **Security Configuration**
```bash
# Content Security Policy
VITE_CSP_ENABLED=true

# HTTPS Enforcement
VITE_FORCE_HTTPS=true

# API Rate Limiting
VITE_API_RATE_LIMIT=1000

# CORS Configuration
VITE_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## Performance Optimization

### **Build Optimization**
```javascript
// vite.config.ts - Production optimizations
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  build: {
    // Enable gzip compression
    reportCompressedSize: true,
    
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-dialog'],
          charts: ['recharts']
        }
      }
    },
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.VITE_DROP_CONSOLE === 'true',
        drop_debugger: true
      }
    }
  },
  
  // Development server
  server: {
    port: 3000,
    host: true
  }
})
```

### **CDN Configuration**
```javascript
// For assets served from CDN
const CDN_URL = process.env.VITE_CDN_URL || '';

// In your components
const getAssetUrl = (path) => `${CDN_URL}${path}`;

// Usage
<img src={getAssetUrl('/images/logo.png')} alt="Logo" />
```

## Monitoring & Analytics

### **Application Monitoring**
```javascript
// Sentry integration for error tracking
import * as Sentry from "@sentry/react";

if (process.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
  });
}
```

### **Performance Monitoring**
```javascript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  gtag('event', metric.name, {
    event_category: 'Web Vitals',
    value: Math.round(metric.value),
    event_label: metric.id,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### **Health Check Endpoints**
```javascript
// Health check service
export const healthCheck = async () => {
  try {
    // Check Supabase connection
    const { data, error } = await supabase
      .from('companies')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'operational',
        api: 'operational'
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
};
```

## Domain & SSL Configuration

### **Custom Domain Setup**
```bash
# DNS Configuration (A/CNAME records)
# For Apex domain (yourdomain.com)
A    @    your.deployment.ip.address

# For subdomain (app.yourdomain.com)  
CNAME app  your-deployment-url.com

# For www redirect
CNAME www  yourdomain.com
```

### **SSL Certificate (Let's Encrypt)**
```bash
# Using Certbot for SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## CI/CD Pipeline

### **GitHub Actions Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test:run
    
    - name: Build application
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
    
    - name: Deploy to production
      run: npm run deploy:prod
      env:
        DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

## Security Checklist

### **Pre-deployment Security**
- [ ] Environment variables properly configured
- [ ] API keys secured and rotated
- [ ] HTTPS enforced in production
- [ ] Content Security Policy configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] XSS protection headers set
- [ ] CORS properly configured
- [ ] Security headers configured
- [ ] Dependencies updated and scanned

### **Post-deployment Monitoring**
- [ ] SSL certificate valid and monitored
- [ ] Application health checks running
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Log aggregation setup
- [ ] Backup procedures tested
- [ ] Incident response plan ready

## Troubleshooting

### **Common Deployment Issues**

#### **Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Check Node.js version
node --version  # Should be 18+
```

#### **Environment Variable Issues**
```bash
# Verify variables are loaded
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

# Check build-time vs runtime variables
# Vite variables must start with VITE_
```

#### **Route Issues (404 on refresh)**
Ensure your hosting platform redirects all routes to `/index.html`:
- **Netlify**: Add `_redirects` file with `/* /index.html 200`
- **Vercel**: Add `rewrites` in `vercel.json`
- **Nginx**: Configure `try_files $uri $uri/ /index.html;`

#### **Performance Issues**
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for large dependencies
npm install -g bundlephobia-cli
bundlephobia package.json
```

## Scaling Considerations

### **Traffic Growth**
- **CDN**: Use global CDN for static assets
- **Caching**: Implement aggressive caching strategies
- **Code Splitting**: Lazy load components and routes
- **Database**: Optimize Supabase queries and indexes

### **Team Growth**
- **Environment Management**: Use infrastructure as code
- **Feature Flags**: Implement feature toggle system
- **Staging Environments**: Mirror production setup
- **Monitoring**: Add application and infrastructure monitoring

---

**Ready to deploy?** Start with the [Quick Deploy options](#quick-deploy-options) and refer to specific sections as needed for your deployment environment.