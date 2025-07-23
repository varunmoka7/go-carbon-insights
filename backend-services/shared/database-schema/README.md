# 🗄️ Database Schema & Migrations

**Consolidated database schemas, migrations, and documentation**

## Structure

```
database-schema/
├── migrations/             # Database migration files (from supabase/)
├── documentation/          # Database planning and integration docs
├── legacy-database/        # Legacy database files (from root database/)
└── README.md              # This file
```

## Migration Files

### **Active Migrations** (`migrations/`)
- **Source**: Moved from `supabase/migrations/`
- **Purpose**: Production database schema changes
- **Format**: SQL migration files with timestamps
- **Usage**: Applied via Supabase CLI or service migration scripts

### **Latest Migration** (`20250723000000_setup_admin_and_demo_accounts.sql`)
- **Admin Setup**: Upgrades varunmoka7@gmail.com and varunmoka28@gmail.com to super_admin role
- **Demo Account**: Creates professional demo account at demo@gocarbontracker.com
- **Access Control**: Sets up proper RLS policies for demo account access
- **Usage**: Run to establish admin accounts and professional demo access

### **Key Migration Categories**
- **Authentication**: User management and security
- **Community Forum**: Forum schema (topics, replies, users)
- **Core Application**: Main application data structures
- **Gamification**: Badge system and reputation
- **Real-time Features**: Presence, notifications, WebSocket support

## Documentation

### **Planning Documents** (`documentation/`)
- [**sql-migration-plan.md**](./documentation/sql-migration-plan.md) - Database migration strategy
- [**supabase-backend-integration-plan.md**](./documentation/supabase-backend-integration-plan.md) - Backend integration approach

## Legacy Database (`legacy-database/`)
- **Source**: Original `database/` folder from root
- **Purpose**: Historical database files and development artifacts
- **Status**: Preserved for reference, may contain useful development data

## Usage

### **Running Migrations**
```bash
# From forum-service directory
cd ../forum-service
npm run migrate

# Check migration status
npm run migrate:status
```

### **Adding New Migrations**
1. Create new migration file in `migrations/` following timestamp format
2. Test migration in development environment
3. Document any breaking changes
4. Deploy via standard migration process

### **Database Schema Reference**
- **Primary Database**: PostgreSQL via Supabase
- **Migration Tool**: Supabase CLI / service migration scripts
- **Schema Documentation**: See individual migration files for schema changes

## Development

### **Local Development**
- Use forum-service database configuration
- Migrations applied automatically in development setup
- Local SQLite for development (forum-service specific)

### **Production**
- Supabase PostgreSQL database
- Migrations applied via deployment pipeline
- Row-Level Security (RLS) policies applied

## Related Documentation

- [**Backend Services Overview**](../README.md)
- [**Forum Service Documentation**](../../forum-service/README.md)
- [**Database Migrations Guide**](../../../docs/reference/DATABASE_MIGRATIONS.md)

---
*This consolidated database schema structure supports all GoCarbonTracker services with centralized migration management.*