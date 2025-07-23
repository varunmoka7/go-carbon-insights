# 🔧 Backend Services

**Backend services and infrastructure components for GoCarbonTracker**

## Service Architecture

### **Active Services**
- [**forum-service/**](./forum-service/) - Community forum backend service
  - Node.js/TypeScript service
  - PostgreSQL database
  - REST API endpoints
  - WebSocket support for real-time features

### **Shared Resources**
- [**shared/database-schema/**](./shared/database-schema/) - Consolidated database schemas and migrations
- [**shared/logs/**](./shared/logs/) - Centralized logging from all services

## Service Structure

```
backend-services/
├── forum-service/          # Community forum service
│   ├── src/                # Service source code
│   ├── tests/              # Service tests
│   ├── database/           # Service-specific database files
│   └── README.md           # Service documentation
├── shared/                 # Shared resources
│   ├── database-schema/    # Database schemas and migrations
│   │   ├── migrations/     # Database migration files
│   │   ├── documentation/  # Database planning docs
│   │   └── legacy-database/ # Legacy database files
│   └── logs/               # Consolidated log files
└── README.md               # This file
```

## Getting Started with Services

### **Forum Service**
```bash
cd backend-services/forum-service
npm install
npm run dev
```

### **Database Setup**
```bash
# Run migrations
cd backend-services/forum-service
npm run migrate

# Check migration status
npm run migrate:status
```

## Service Communication

- **Frontend (React)** ↔ **Forum Service** via REST API
- **Database** ↔ **Services** via PostgreSQL connections
- **Real-time** features via WebSocket connections

## Development

### **Adding New Services**
1. Create service directory under `backend-services/`
2. Follow the forum-service structure
3. Update this README.md
4. Add service to deployment configuration

### **Shared Resources**
- Database schemas: Use `shared/database-schema/`
- Common utilities: Add to `shared/utils/` (create as needed)
- Shared types: Add to `shared/types/` (create as needed)

## Deployment

Services are deployed as:
- **Development**: Local Node.js processes
- **Production**: Containerized services (see deployment documentation)

## Documentation

- **API Documentation**: [/docs/reference/API_DOCUMENTATION.md](../docs/reference/API_DOCUMENTATION.md)
- **Database Documentation**: [shared/database-schema/documentation/](./shared/database-schema/documentation/)
- **Deployment Guide**: [/docs/deployment/](../docs/deployment/)

---
*This backend services architecture supports the GoCarbonTracker platform's scalable, microservices-based approach.*