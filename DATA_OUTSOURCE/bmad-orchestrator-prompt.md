# BMad Orchestrator Prompt: Trancenable Data Integration Implementation

## Project Context
We have successfully created a comprehensive data transformation pipeline for integrating Trancenable ESG emissions data (19,902 records, 3,500+ companies) into our GoCarbonTracker platform. Now we need to implement this integration using proper agile methodology with BMad agents.

## Current State
✅ **COMPLETED:**
- Trancenable dataset analysis (10.4MB, 86 industries, 6 sectors)
- Industry mapping tables (86 Trancenable → existing framework)
- Sector mapping (6 → 10 sectors) with emissions archetype assignments
- Complete Node.js transformation pipeline with quality control
- Output schema compatibility with existing database structure

## Implementation Objective
**Goal:** Implement Trancenable data integration into backend database using agile workflow, proper story breakdown, and BMad methodology.

**Scope:** Full-stack integration including:
- Backend API enhancements for bulk data import
- Database schema extensions for new industries/archetypes
- Data validation and quality monitoring
- Frontend integration for new data visibility
- Testing and deployment pipeline

## Technical Architecture Context
**Current Backend:** Node.js/Express with TypeScript, Supabase PostgreSQL
**Existing Features:** 
- DataImportController with CSV upload capability
- Industry taxonomy system with emissions archetypes
- Companies and emissions_data tables with RLS policies
- Real-time data quality monitoring
- Materialized views for dashboard performance

**Data Integration Points:**
- Transform pipeline outputs: transformed-companies.csv, transformed-emissions.csv
- Mapping tables: industry/sector mappings with confidence scores
- Quality metrics: transformation reports and validation results

## Agile Implementation Request

### Epic Structure Needed
1. **Data Integration Infrastructure** - Backend API and pipeline enhancements
2. **Database Schema Evolution** - Extend taxonomy and add new industry mappings  
3. **Data Quality & Monitoring** - Validation, error handling, quality dashboards
4. **Frontend Integration** - UI updates for new data visibility
5. **Testing & Deployment** - Comprehensive testing and production deployment

### Story Requirements
- **Brownfield approach** - Extending existing system, not greenfield
- **API-first design** - RESTful endpoints with proper error handling
- **Database migrations** - Safe schema changes with rollback capability
- **Data validation** - Comprehensive validation rules and quality gates
- **Monitoring** - Real-time quality metrics and alerting
- **Security** - Maintain RLS policies and audit logging
- **Performance** - Handle 19K+ record imports efficiently

### Technical Constraints
- Must work with existing Supabase PostgreSQL database
- Preserve existing RLS policies and audit trails
- Maintain backward compatibility with current API
- Support incremental data updates (not just initial load)
- Handle data conflicts and duplicate detection
- Provide rollback mechanisms for failed imports

### Success Criteria
- Successfully import 19,902 Trancenable emissions records
- Integrate 3,500+ companies with proper deduplication
- Extend industry taxonomy with 25+ new industries
- Maintain >95% data quality scores
- Complete end-to-end testing with production-like data
- Zero downtime deployment

## BMad Agent Orchestration Request

**Primary Request:** Use BMad orchestration to break down this implementation into proper agile stories with the following agent assignments:

### Recommended Agent Workflow:
1. **BMad Master** - Overall coordination and epic planning
2. **Product Owner Agent** - Story prioritization and acceptance criteria
3. **Architect Agent** - Technical design and database schema planning
4. **Backend Developer Agent** - API implementation and data pipeline
5. **Frontend Developer Agent** - UI integration for new data
6. **QA Agent** - Testing strategy and validation framework

### Story Breakdown Needed:
- Epic creation with story mapping
- User stories with acceptance criteria
- Technical stories for infrastructure
- Definition of Done for each story
- Sprint planning with story point estimation
- Risk assessment and mitigation strategies

### Deliverables Expected:
- Complete epic and story breakdown in Jira/GitHub format
- Technical architecture documentation
- Database migration scripts
- API endpoint specifications
- Testing framework and test cases
- Deployment checklist and rollback procedures

## Additional Context Files Available:
- `trancenable-transformation-pipeline.js` - Complete transformation logic
- `trancenable-industry-mapping.csv` - Industry mapping with confidence scores
- `emissions-archetype-assignments.csv` - Archetype assignments for new industries
- `transformation-report.json` - Data quality and validation metrics
- Existing codebase in `/backend-services/forum-service/` with DataImportController

## Specific BMad Commands to Execute:
1. Start with epic creation using brownfield approach
2. Create detailed story breakdown with technical specifications
3. Generate architecture documentation for schema extensions
4. Create database migration strategy with rollback procedures
5. Design API endpoint specifications for bulk import
6. Develop comprehensive testing strategy
7. Create deployment and monitoring checklist

**Expected Output:** Complete agile implementation plan with story cards, technical specifications, and execution roadmap ready for development team sprint planning.

---

**PROMPT FOR BMAD ORCHESTRATOR:**
"I need to implement Trancenable ESG data integration (19,902 records) into my existing GoCarbonTracker backend using proper agile methodology. Please coordinate the appropriate BMad agents to create a complete epic/story breakdown, technical architecture, and implementation plan for this brownfield integration project. Focus on backend database integration, API enhancements, data quality monitoring, and frontend visibility while maintaining existing system integrity."