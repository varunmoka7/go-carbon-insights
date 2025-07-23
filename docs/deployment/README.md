# 🚀 Deployment Documentation

**Complete guides for deploying GoCarbonTracker to various environments**

## Deployment Options

### **Production Deployment**
- [**Deployment Guide**](./DEPLOYMENT_GUIDE.md) - Comprehensive production deployment options
  - Lovable Platform (One-click deployment)
  - Vercel (Static/Serverless)
  - Netlify (Static hosting)
  - AWS (S3 + CloudFront)
  - Docker (Containerized deployment)

### **Infrastructure & Containerization**
- [**Docker Containerization**](./DOCKER_CONTAINERIZATION.md) - Docker setup and container orchestration
- [**Release Process**](./RELEASE_PROCESS.md) - Automated release and deployment pipeline

## Quick Deploy Commands

### **Instant Deployment (Recommended)**
```bash
# Deploy to Lovable Platform
# 1. Open: https://lovable.dev/projects/6fcef7a7-25cd-4c8d-b7e1-5fdfbaf9a17b
# 2. Click: Share → Publish
# 3. Configure custom domain (optional)
```

### **Vercel Deployment**
```bash
npm install -g vercel
vercel --prod
```

### **Docker Deployment**
```bash
# Build and run container
docker build -t gocarbontracker .
docker run -p 3000:80 gocarbontracker
```

### **AWS S3 + CloudFront**
```bash
# Build and deploy to S3
npm run build
aws s3 sync dist/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

## Environment Configuration

### **Required Environment Variables**
```bash
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# Optional Configuration
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://your-sentry-dsn
VITE_ENABLE_DEMO_MODE=true
```

### **Security Configuration**
```bash
# Production Security Settings
VITE_FORCE_HTTPS=true
VITE_CSP_ENABLED=true
VITE_API_RATE_LIMIT=1000
```

## Deployment Checklist

### **Pre-Deployment**
- [ ] Environment variables configured
- [ ] API keys secured and rotated
- [ ] Tests passing (`npm run test`)
- [ ] Build successful (`npm run build`)
- [ ] Performance benchmarks met

### **Post-Deployment**
- [ ] SSL certificate valid
- [ ] Application health checks passing
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Backup procedures tested

## Deployment Environments

### **Development**
- **URL**: localhost:3000
- **Purpose**: Local development and testing
- **Auto-deploy**: Manual (`npm run dev`)

### **Staging**
- **URL**: staging.yourdomain.com
- **Purpose**: Integration testing and QA
- **Auto-deploy**: On push to `develop` branch

### **Production**
- **URL**: yourdomain.com
- **Purpose**: Live user-facing application
- **Auto-deploy**: On push to `main` branch

## CI/CD Pipeline

### **GitHub Actions Workflow**
```yaml
# Automated deployment on main branch
on:
  push:
    branches: [ main ]

jobs:
  - Build and test application
  - Deploy to staging environment
  - Run smoke tests
  - Deploy to production
  - Notify team of deployment
```

### **Deployment Triggers**
- **Automatic**: Push to main branch
- **Manual**: GitHub Actions workflow dispatch
- **Scheduled**: Nightly deployments for updates

## Monitoring & Rollback

### **Health Monitoring**
- Application uptime and response times
- Error rates and exception tracking
- Performance metrics and user analytics
- Database connection and query performance

### **Rollback Procedures**
```bash
# Quick rollback to previous version
git revert HEAD~1
git push origin main

# Or revert to specific commit
git revert <commit-hash>
git push origin main
```

## Scaling Considerations

### **Traffic Growth**
- **CDN**: Global content distribution
- **Caching**: Aggressive caching strategies
- **Load Balancing**: Multiple application instances
- **Database**: Read replicas and connection pooling

### **Performance Optimization**
- **Code Splitting**: Lazy load components
- **Asset Optimization**: Compressed images and bundles
- **Caching Headers**: Browser and CDN caching
- **Database Indexes**: Optimized queries

---
*For deployment issues or questions, check the [Troubleshooting Guide](../operations/TROUBLESHOOTING_GUIDE.md) or create an issue.*