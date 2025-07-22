# Docker & Containerization Guide - GoCarbonTracker

**Version**: 1.0  
**Date**: January 22, 2025  
**Owner**: Technical Team  

## 📋 Overview

This guide covers containerization strategies for GoCarbonTracker using Docker, including development environments, production deployments, and orchestration with Docker Compose and Kubernetes.

## 🐳 Docker Setup

### Prerequisites

#### Required Software
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

#### System Requirements
- **RAM**: Minimum 4GB, Recommended 8GB+
- **Storage**: 10GB+ available space
- **OS**: Linux, macOS, or Windows with WSL2

## 📁 Project Structure

### Docker Files Organization
```
go-carbon-insights/
├── Dockerfile                     # Main application
├── Dockerfile.dev                # Development version
├── docker-compose.yml            # Full stack
├── docker-compose.dev.yml        # Development stack
├── docker-compose.prod.yml       # Production stack
├── .dockerignore                 # Docker ignore file
├── forum-service/
│   ├── Dockerfile                # Forum service
│   └── Dockerfile.dev            # Forum dev version
└── docker/
    ├── nginx/
    │   ├── Dockerfile
    │   └── nginx.conf
    ├── postgres/
    │   ├── Dockerfile
    │   └── init.sql
    └── redis/
        ├── Dockerfile
        └── redis.conf
```

## 🔧 Frontend Containerization

### Main Application Dockerfile
```dockerfile
# Dockerfile - Production build
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### Development Dockerfile
```dockerfile
# Dockerfile.dev - Development with hot reload
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for development
RUN apk add --no-cache git

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Expose development port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Nginx Configuration
```nginx
# docker/nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    upstream api {
        server forum-service:8000;
    }

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Enable client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy
        location /api/ {
            proxy_pass http://api;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Static assets caching
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
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

## 🔧 Backend Containerization

### Forum Service Dockerfile
```dockerfile
# forum-service/Dockerfile - Production
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --chown=nodejs:nodejs --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start application
CMD ["node", "dist/server.js"]
```

### Development Backend Dockerfile
```dockerfile
# forum-service/Dockerfile.dev
FROM node:18-alpine

# Install development tools
RUN apk add --no-cache git curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start with nodemon for hot reload
CMD ["npm", "run", "dev"]
```

## 🐘 Database Containerization

### PostgreSQL Container
```dockerfile
# docker/postgres/Dockerfile
FROM postgres:15-alpine

# Copy initialization scripts
COPY init.sql /docker-entrypoint-initdb.d/

# Set environment variables
ENV POSTGRES_DB=gocarbon_db
ENV POSTGRES_USER=gocarbon_user
ENV POSTGRES_PASSWORD=secure_password

# Expose port
EXPOSE 5432

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1
```

### Database Initialization
```sql
-- docker/postgres/init.sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS public;
CREATE SCHEMA IF NOT EXISTS forum;

-- Set default permissions
GRANT ALL PRIVILEGES ON SCHEMA public TO gocarbon_user;
GRANT ALL PRIVILEGES ON SCHEMA forum TO gocarbon_user;

-- Create initial tables (basic structure)
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data for development
INSERT INTO companies (name, industry) VALUES 
    ('Sample Company 1', 'Technology'),
    ('Sample Company 2', 'Manufacturing')
ON CONFLICT DO NOTHING;
```

## ☁️ Redis Containerization

### Redis Configuration
```dockerfile
# docker/redis/Dockerfile
FROM redis:7-alpine

# Copy configuration
COPY redis.conf /etc/redis/redis.conf

# Create data directory
RUN mkdir -p /data && chown redis:redis /data

# Expose port
EXPOSE 6379

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD redis-cli ping || exit 1

# Start Redis with custom config
CMD ["redis-server", "/etc/redis/redis.conf"]
```

### Redis Configuration File
```conf
# docker/redis/redis.conf
# Network
bind 0.0.0.0
port 6379
protected-mode no

# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Logging
loglevel notice
logfile ""

# Security (use in production)
# requirepass your_secure_password

# Performance
tcp-keepalive 300
timeout 0
```

## 🔄 Docker Compose Configurations

### Development Stack
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  # Frontend development server
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - ./src:/app/src
      - ./public:/app/public
      - ./index.html:/app/index.html
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - VITE_API_URL=http://localhost:8000
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    depends_on:
      - backend
    networks:
      - gocarbon-network

  # Backend service
  backend:
    build:
      context: ./forum-service
      dockerfile: Dockerfile.dev
    ports:
      - "8000:8000"
    volumes:
      - ./forum-service/src:/app/src
      - ./forum-service/logs:/app/logs
      - /app/node_modules
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://gocarbon_user:secure_password@postgres:5432/gocarbon_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=dev_jwt_secret
    depends_on:
      - postgres
      - redis
    networks:
      - gocarbon-network

  # PostgreSQL database
  postgres:
    build:
      context: ./docker/postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./supabase/migrations:/docker-entrypoint-initdb.d/migrations
    environment:
      - POSTGRES_DB=gocarbon_db
      - POSTGRES_USER=gocarbon_user
      - POSTGRES_PASSWORD=secure_password
    networks:
      - gocarbon-network

  # Redis cache
  redis:
    build:
      context: ./docker/redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - gocarbon-network

  # Development tools
  adminer:
    image: adminer:latest
    ports:
      - "8080:8080"
    environment:
      - ADMINER_DEFAULT_SERVER=postgres
    depends_on:
      - postgres
    networks:
      - gocarbon-network

volumes:
  postgres_data:
  redis_data:

networks:
  gocarbon-network:
    driver: bridge
```

### Production Stack
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  # Nginx reverse proxy
  nginx:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/ssl:/etc/nginx/ssl
    environment:
      - NGINX_HOST=${DOMAIN_NAME}
    depends_on:
      - backend
    networks:
      - gocarbon-network
    restart: unless-stopped

  # Backend service
  backend:
    build:
      context: ./forum-service
      dockerfile: Dockerfile
    expose:
      - "8000"
    volumes:
      - ./logs:/app/logs
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
      - SENTRY_DSN=${SENTRY_DSN}
    depends_on:
      - postgres
      - redis
    networks:
      - gocarbon-network
    restart: unless-stopped
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  # PostgreSQL database
  postgres:
    image: postgres:15-alpine
    expose:
      - "5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    networks:
      - gocarbon-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G

  # Redis cache
  redis:
    image: redis:7-alpine
    expose:
      - "6379"
    volumes:
      - redis_data:/data
      - ./docker/redis/redis.conf:/etc/redis/redis.conf
    command: redis-server /etc/redis/redis.conf
    networks:
      - gocarbon-network
    restart: unless-stopped

  # Monitoring
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./docker/prometheus:/etc/prometheus
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/etc/prometheus/console_libraries'
      - '--web.console.templates=/etc/prometheus/consoles'
    networks:
      - gocarbon-network
    restart: unless-stopped

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    volumes:
      - grafana_data:/var/lib/grafana
      - ./docker/grafana:/etc/grafana/provisioning
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    networks:
      - gocarbon-network
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  prometheus_data:
  grafana_data:

networks:
  gocarbon-network:
    driver: bridge
```

### Simple Development Stack
```yaml
# docker-compose.yml - Simplified for quick start
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    networks:
      - gocarbon-network

  database:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=gocarbon_db
      - POSTGRES_USER=gocarbon_user
      - POSTGRES_PASSWORD=dev_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - gocarbon-network

volumes:
  postgres_data:

networks:
  gocarbon-network:
    driver: bridge
```

## 📝 Docker Ignore Configuration

### .dockerignore
```
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Development files
.env.local
.env.development
.env.test

# Build outputs
dist
build
coverage

# IDE files
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Git
.git
.gitignore

# Docker
Dockerfile*
docker-compose*
.dockerignore

# Documentation
README.md
docs/
*.md

# Test files
**/*.test.*
**/*.spec.*
__tests__/
test/
tests/

# Temporary files
tmp/
temp/
```

## 🛠️ Docker Scripts & Automation

### Development Scripts
```bash
#!/bin/bash
# scripts/docker-dev.sh

set -e

echo "🐳 Starting GoCarbonTracker development environment..."

# Build images
echo "📦 Building Docker images..."
docker-compose -f docker-compose.dev.yml build

# Start services
echo "🚀 Starting services..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "🗄️ Running database migrations..."
docker-compose -f docker-compose.dev.yml exec backend npm run migrate:up

# Show status
echo "📊 Service status:"
docker-compose -f docker-compose.dev.yml ps

echo "✅ Development environment is ready!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "🗄️ Database Admin: http://localhost:8080"
```

### Production Deployment Script
```bash
#!/bin/bash
# scripts/docker-prod.sh

set -e

echo "🚀 Deploying GoCarbonTracker to production..."

# Load environment variables
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Build production images
echo "📦 Building production images..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Pull latest images for services we don't build
echo "📥 Pulling latest images..."
docker-compose -f docker-compose.prod.yml pull postgres redis prometheus grafana

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Start production services
echo "🚀 Starting production services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 30

# Run health checks
echo "🔍 Running health checks..."
docker-compose -f docker-compose.prod.yml exec backend curl -f http://localhost:8000/health
docker-compose -f docker-compose.prod.yml exec nginx curl -f http://localhost/health

# Show status
echo "📊 Production status:"
docker-compose -f docker-compose.prod.yml ps

echo "✅ Production deployment complete!"
```

### Backup Script
```bash
#!/bin/bash
# scripts/backup.sh

set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "💾 Creating backup for $DATE..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
echo "🗄️ Backing up database..."
docker-compose exec postgres pg_dump -U gocarbon_user gocarbon_db > "$BACKUP_DIR/database_$DATE.sql"

# Redis backup
echo "📦 Backing up Redis..."
docker-compose exec redis redis-cli BGSAVE
docker cp $(docker-compose ps -q redis):/data/dump.rdb "$BACKUP_DIR/redis_$DATE.rdb"

# Application files backup
echo "📁 Backing up application files..."
tar -czf "$BACKUP_DIR/app_$DATE.tar.gz" --exclude=node_modules --exclude=.git .

# Log backup completion
echo "✅ Backup completed: $BACKUP_DIR"
ls -la $BACKUP_DIR/*$DATE*
```

## 📊 Monitoring & Health Checks

### Health Check Scripts
```bash
#!/bin/bash
# scripts/health-check.sh

echo "🔍 Checking container health..."

# Check container status
echo "📦 Container Status:"
docker-compose ps

# Check service health
echo "🏥 Service Health:"
services=("frontend" "backend" "postgres" "redis")

for service in "${services[@]}"; do
    if docker-compose exec $service curl -f http://localhost/health 2>/dev/null; then
        echo "✅ $service: healthy"
    else
        echo "❌ $service: unhealthy"
    fi
done

# Check resource usage
echo "📊 Resource Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"
```

### Container Logs Management
```bash
#!/bin/bash
# scripts/logs.sh

SERVICE=${1:-"all"}
LINES=${2:-"100"}

if [ "$SERVICE" = "all" ]; then
    echo "📋 Showing logs for all services..."
    docker-compose logs --tail=$LINES -f
else
    echo "📋 Showing logs for $SERVICE..."
    docker-compose logs --tail=$LINES -f $SERVICE
fi
```

## 🔄 CI/CD Integration

### GitHub Actions for Docker
```yaml
# .github/workflows/docker.yml
name: Docker Build & Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha

      - name: Build and push frontend
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and push backend
        uses: docker/build-push-action@v4
        with:
          context: ./forum-service
          file: ./forum-service/Dockerfile
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to production
        run: |
          echo "🚀 Deploying to production..."
          # Add your deployment commands here
```

## 🐛 Troubleshooting

### Common Docker Issues

#### Port Conflicts
```bash
# Find processes using port
lsof -i :3000
lsof -i :8000

# Kill processes
kill -9 $(lsof -ti:3000)

# Use different ports
docker-compose -f docker-compose.dev.yml up -p 3001:3000
```

#### Memory Issues
```bash
# Check Docker memory usage
docker system df
docker system prune -a

# Increase memory limit
docker-compose up --scale backend=1 --memory=2g
```

#### Volume Issues
```bash
# Reset volumes
docker-compose down -v
docker volume prune

# Check volume usage
docker volume ls
docker volume inspect gocarbon_postgres_data
```

#### Network Issues
```bash
# Check networks
docker network ls
docker network inspect gocarbon_gocarbon-network

# Recreate network
docker-compose down
docker network prune
docker-compose up
```

## 📚 Best Practices

### Security Best Practices
- Use non-root users in containers
- Scan images for vulnerabilities
- Use specific image tags, not `latest`
- Implement proper secrets management
- Enable security scanning in CI/CD

### Performance Optimization
- Use multi-stage builds
- Minimize layer count
- Optimize image size
- Use .dockerignore effectively
- Implement proper caching strategies

### Production Considerations
- Implement health checks
- Use restart policies
- Set resource limits
- Monitor container metrics
- Implement log rotation

---

**Last Updated**: January 22, 2025  
**Version**: 1.0  
**Maintained by**: Technical Team

This containerization guide ensures consistent development and production environments across all deployment scenarios.