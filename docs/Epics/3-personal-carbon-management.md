# Epic 3: Personal Carbon Management

- **Status:** Future Plan

## 1. Epic Goal
Enable private carbon tracking capabilities for individual users and organizations to manage their own emissions data alongside public platform exploration.

## 2. Scope and Boundaries

### In Scope:
- Secure private data storage with user isolation
- Dual-view tracker interface switching between Public and Private data
- Private emissions record management (Create, Read, Update, Delete)
- Organization-specific analytics and insights
- Custom reporting and data export capabilities
- Private data visualization and trend analysis
- Personal target setting and progress tracking
- Private data import capabilities (CSV/Excel)
- User-specific dashboard and metrics

### Out of Scope:
- Public data features - already handled in Epic 2
- Multi-organization data sharing - reserved for Epic 6
- Advanced AI insights on private data - reserved for Epic 7
- Mobile-specific private data features - reserved for Epic 8
- Enterprise-grade data governance - reserved for Epic 6
- Compliance reporting automation - reserved for Epic 10

## 3. Stories in this Epic

- `Private Data Management Interface` (Story 3.1 - Planned)
- `Dual-View Tracker Interface (Public/Private)` (Story 3.2 - Planned)  
- `Private Analytics and Reporting` (Story 3.3 - Planned)

## 4. Dependencies

- **Blocks:** Epic 6 (SaaS Platform Features) - Private data foundation required for multi-tenancy
- **Blocked By:** Epic 1 (Authentication), Epic 2 (Public Platform) - Requires auth system and public data architecture

## 5. Success Metrics

- Secure private data storage with 100% user isolation
- Dual-view interface with <2s switching time between public/private modes
- Private data CRUD operations with <500ms response times
- Custom reporting with export to multiple formats (PDF, CSV, Excel)
- User adoption of private features >60% of authenticated users
- Zero data leakage incidents between user accounts
- Private analytics dashboard with real-time updates
- Support for unlimited private emissions records per user

## 6. Change Log

| Date       | Version | Description of Change                     | Author |
| :--------- | :------ | :---------------------------------------- | :----- |
| 2025-07-20 | 1.0     | Initial creation of this epic document. | Claude |