# Epic 3: Personal Carbon Management

- **Status:** 📋 **IMPLEMENTATION READY** (Detailed Plan Complete)

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

### Story 3.1: Private Data Management Interface (2-3 weeks)
**Goal:** Secure private data storage with user isolation and organization-level access

**Technical Implementation:**
- **Database Schema:** Parallel private tables (mirrors public structure)
  - `private_emissions_data`, `private_scope1_emissions`, `private_scope2_emissions`, `private_scope3_emissions`
  - `data_sharing_preferences` (granular privacy controls)
  - `private_emission_targets` (private goal tracking)
  - `private_data_imports` (audit trail for uploads)

- **New Components:**
  - `PrivateDataDashboard.tsx` - Main private data interface
  - `OrganizationSelector.tsx` - Company context switching
  - `PrivateEmissionsUpload.tsx` - CSV/manual data entry
  - `DataPrivacyControls.tsx` - Sharing preference management

- **Custom Hooks:**
  - `usePrivateData.ts` - Private data fetching with caching
  - `useOrganizationContext.ts` - Company scope management
  - `useDataUpload.ts` - File processing and validation
  - `usePrivatePermissions.ts` - Access control logic

**Security:** Enhanced RLS policies using existing `user_company_access` system with role-based permissions

### Story 3.2: Dual-View Tracker Interface (2 weeks)  
**Goal:** Seamless switching between public platform and private organizational data

**Technical Implementation:**
- **Architecture Pattern:**
  ```typescript
  <ViewModeProvider>
    <DataScopeProvider scope={currentScope}>
      <TrackerDashboard /> // Adapts to public/private/combined views
    </DataScopeProvider>
  </ViewModeProvider>
  ```

- **Route Structure:**
  - `/tracker/public` - Public platform data view
  - `/tracker/private` - Private organizational data
  - `/tracker/combined` - Privacy-aware merged view

- **Integration Points:**
  - Enhanced existing TrackerPage.tsx with seamless view toggle
  - Unified search interface across public and private data scopes
  - Context-aware component rendering based on current data scope
  - Privacy-respectful data merging for combined analytics

### Story 3.3: Private Analytics and Reporting (3 weeks)
**Goal:** Organization-specific metrics with public context and compliance export

**Advanced Analytics Components:**
- `PrivateAnalyticsDashboard.tsx` - Organization-specific metrics
- `BenchmarkingWithPrivacy.tsx` - Anonymous peer group comparison
- `ComplianceReporting.tsx` - Regulatory export functionality
- `CustomReportBuilder.tsx` - White-label report generation
- `ProgressTracking.tsx` - Private target monitoring and alerts
- `ScenarioModeling.tsx` - What-if analysis tools

**Privacy Controls:**
```typescript
interface DataSharingPreferences {
  shareBenchmarking: boolean;     // Participate in anonymous benchmarking
  shareAggregated: boolean;       // Contribute to industry averages
  anonymizeData: boolean;         // Remove identifying information
  retentionPeriod: string;        // Data retention policy compliance
}
```

## 4. Dependencies & Integration

- **✅ Satisfied:** Epic 1 (Authentication) - Complete auth system with role-based access control
- **✅ Satisfied:** Epic 2 (Public Platform) - Full data architecture and API foundation ready
- **✅ Enables:** Epic 6 (SaaS Platform Features) - Private data foundation for multi-tenancy

### Integration Architecture:
- **Shared Infrastructure:** Leverages Epic 2's real-time updates, API patterns, component library
- **Data Synergy:** Private data can utilize public benchmarking for contextual insights  
- **Security Model:** Consistent role-based access control across public and private data
- **User Experience:** Seamless transition between public platform exploration and private data management

## 5. Success Metrics & Acceptance Criteria

### Story 3.1 Acceptance Criteria:
- ✅ Secure private data storage with user isolation and organization-level access
- ✅ Unified interface combining private data management with public insights
- ✅ Data privacy controls with granular permission management
- ✅ Integration with public benchmarking for contextual analysis

### Story 3.2 Acceptance Criteria:
- ✅ Toggle interface between public platform and private tracking modes
- ✅ Consistent user experience across both data views
- ✅ Context-aware features that respect data privacy boundaries
- ✅ Unified search and filtering across appropriate data scopes

### Story 3.3 Acceptance Criteria:
- ✅ Private analytics dashboard with organization-specific metrics
- ✅ Custom reporting capabilities with white-label options
- ✅ Data export functionality for compliance and external reporting
- ✅ Integration with public benchmarking for competitive analysis

### Performance Targets:
- **Response Time:** Private data CRUD operations <500ms
- **View Switching:** Public/private mode transition <2s
- **Data Isolation:** 100% user isolation with zero data leakage
- **Export Formats:** Support for multiple formats (PDF, CSV, Excel, JSON)
- **Real-time Updates:** Private analytics with live data refresh
- **Scalability:** Unlimited private emissions records per organization
- **User Adoption:** >60% of authenticated users utilizing private features

## 6. Technical Implementation Plan

### Phase 1: Foundation (Story 3.1) - 2-3 weeks
**Priority:** High - Establishes core private data capabilities
- Set up private database tables and RLS policies
- Implement basic private data CRUD operations  
- Create data upload/import interface (CSV + manual)
- Build organization context switching

### Phase 2: Integration (Story 3.2) - 2 weeks  
**Priority:** High - Enables seamless public/private experience
- Implement dual-view tracker interface
- Add view mode context and routing
- Create unified search across data scopes
- Integrate with existing dashboard components

### Phase 3: Advanced Analytics (Story 3.3) - 3 weeks
**Priority:** Medium - Adds enterprise reporting capabilities
- Develop private analytics dashboard
- Implement compliance export functionality
- Add benchmarking with privacy controls
- Create custom report builder

### Technical Architecture Decisions:

1. **Data Architecture:** Parallel private tables (vs. single table with flags)
   - ✅ **Recommended:** Maintains schema consistency, simplifies RLS, supports different privacy requirements

2. **Authentication Integration:** Leverage existing `user_company_access` system
   - ✅ **Recommended:** Reuses proven access control, supports role-based permissions

3. **View Mode Implementation:** Context-based rendering (vs. separate routes)
   - ✅ **Recommended:** Unified experience, shared components, easier maintenance

4. **Data Privacy:** Granular sharing preferences with anonymous benchmarking
   - ✅ **Recommended:** Builds user trust, enables valuable insights, supports compliance

### Database Schema Extensions:
```sql
-- Private emissions tables (parallel structure)
private_emissions_data, private_scope1_emissions, private_scope2_emissions, private_scope3_emissions

-- Privacy and sharing controls
data_sharing_preferences (granular privacy settings)
private_emission_targets (private goal tracking)
private_data_imports (audit trail for uploads)

-- Enhanced security functions
user_has_private_access() for role-based private data access
```

## 7. Change Log

| Date       | Version | Description of Change                     | Author |
| :--------- | :------ | :---------------------------------------- | :----- |
| 2025-07-20 | 1.0     | Initial creation of this epic document. | Claude |
| 2025-07-31 | 2.0     | **MAJOR UPDATE: Complete implementation plan with detailed technical architecture** | Claude |