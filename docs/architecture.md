# GoCarbonTracker - Architecture Document

## 1. Introduction
This document serves as the detailed technical blueprint for implementing the features defined in the PRD. It outlines the database schema, API design, frontend architecture, and development workflow for the GoCarbonTracker platform, which is built on a React/TypeScript/Supabase stack.

## 2. Database Schema Design
*This schema will be implemented in Supabase (PostgreSQL).*

### **Epic 2: Carbon Tracking & Public Platform + Real Data Integration Schema**
```sql
-- Core company and emissions data schema for 100k+ companies
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    name TEXT NOT NULL,
    ticker_symbol TEXT,
    isin TEXT,
    sector_id UUID REFERENCES sectors(id),
    industry_id UUID REFERENCES industries(id),
    country TEXT,
    market_cap BIGINT,
    employee_count INTEGER,
    founded_year INTEGER,
    website TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE sectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    code TEXT UNIQUE,
    description TEXT
);

CREATE TABLE industries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sector_id UUID REFERENCES sectors(id),
    name TEXT NOT NULL,
    code TEXT UNIQUE,
    description TEXT
);

CREATE TABLE emissions_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    company_id UUID NOT NULL REFERENCES companies(id),
    reporting_period DATE NOT NULL,
    scope_1_emissions DECIMAL(15,2),
    scope_2_emissions DECIMAL(15,2),
    scope_3_emissions DECIMAL(15,2),
    total_emissions DECIMAL(15,2),
    emissions_intensity DECIMAL(15,2),
    data_source_id UUID REFERENCES data_sources(id),
    quality_score DECIMAL(3,2),
    verification_status TEXT CHECK (verification_status IN ('verified', 'reported', 'estimated')),
    currency TEXT DEFAULT 'USD',
    revenue DECIMAL(15,2),
    units TEXT DEFAULT 'tCO2e'
);

CREATE TABLE data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('api', 'csv', 'manual', 'partnership')),
    endpoint_url TEXT,
    api_key_hash TEXT,
    last_sync TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    credibility_score DECIMAL(3,2)
);

CREATE TABLE esg_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id),
    reporting_period DATE NOT NULL,
    metric_type TEXT NOT NULL,
    metric_value DECIMAL(15,2),
    metric_unit TEXT,
    data_source_id UUID REFERENCES data_sources(id),
    quality_score DECIMAL(3,2)
);

-- Performance optimization indexes
CREATE INDEX idx_companies_sector_industry ON companies(sector_id, industry_id);
CREATE INDEX idx_emissions_company_period ON emissions_data(company_id, reporting_period);
CREATE INDEX idx_emissions_total_desc ON emissions_data(total_emissions DESC);
CREATE INDEX idx_esg_metrics_company_type ON esg_metrics(company_id, metric_type);

-- Materialized views for performance
CREATE MATERIALIZED VIEW industry_benchmarks AS
SELECT 
    i.id as industry_id,
    i.name as industry_name,
    s.name as sector_name,
    COUNT(DISTINCT e.company_id) as company_count,
    AVG(e.total_emissions) as avg_emissions,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY e.total_emissions) as median_emissions,
    PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY e.total_emissions) as q1_emissions,
    PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY e.total_emissions) as q3_emissions
FROM industries i
JOIN sectors s ON i.sector_id = s.id
JOIN companies c ON c.industry_id = i.id
JOIN emissions_data e ON e.company_id = c.id
WHERE e.reporting_period >= DATE_TRUNC('year', NOW() - INTERVAL '2 years')
GROUP BY i.id, i.name, s.name;

-- Data import and quality monitoring tables
CREATE TABLE import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_source_id UUID REFERENCES data_sources(id),
    status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    total_records INTEGER,
    processed_records INTEGER DEFAULT 0,
    failed_records INTEGER DEFAULT 0,
    error_log JSONB,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

CREATE TABLE data_quality_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_source_id UUID REFERENCES data_sources(id),
    completeness_score DECIMAL(3,2),
    accuracy_score DECIMAL(3,2),
    freshness_score DECIMAL(3,2),
    consistency_score DECIMAL(3,2),
    overall_score DECIMAL(3,2),
    anomaly_count INTEGER DEFAULT 0,
    records_validated INTEGER
);
```

### **Epic 4: Community Forum – Professional Community Platform Schema**
```sql
CREATE TABLE forum_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    title TEXT NOT NULL,
    content TEXT,
    category TEXT,
    is_pinned BOOLEAN DEFAULT false
);

CREATE TABLE forum_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    topic_id UUID NOT NULL REFERENCES forum_topics(id) ON DELETE CASCADE,
    content TEXT NOT NULL
);

CREATE TABLE forum_upvotes (
    user_id UUID NOT NULL REFERENCES auth.users(id),
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, topic_id)
);
```

## 3. Epic 2: Carbon Tracking Platform Advanced Features Architecture

### **Enterprise Data Management (Stories 2.9-2.12)**
**Backend Strategy:**
- **Import Pipeline**: ETL system with validation, transformation, and batch processing
- **Quality Monitoring**: Real-time data quality metrics with automated anomaly detection
- **Source Management**: Unified API connector framework for enterprise data providers
- **Lineage Tracking**: Complete data provenance with audit trails and compliance features

**Frontend Strategy:**
- **Admin Dashboard**: Enterprise-scale data management interface with progress tracking
- **Quality Monitoring**: Real-time dashboards with alerts and performance metrics
- **Source Configuration**: Visual interface for API connections and data source management
- **Transparency UI**: User-facing data attribution with source credibility indicators

### **Performance & Scalability Architecture**
**Database Optimization:**
- **Partitioning**: Time-based partitioning for emissions_data and esg_metrics tables
- **Materialized Views**: Pre-aggregated industry benchmarks and sector statistics
- **Connection Pooling**: Supabase connection optimization for 100k+ company queries
- **Caching Strategy**: Redis integration for frequently accessed aggregations

**API Performance:**
- **GraphQL**: Complex queries with DataLoader for N+1 prevention
- **Rate Limiting**: Enterprise-grade throttling with tiered access levels
- **Pagination**: Cursor-based pagination for large datasets
- **Real-time Updates**: WebSocket/SSE for dashboard auto-refresh

### **Data Integration & API Ecosystem**
**Enterprise API Framework:**
- **RESTful Design**: Consistent endpoint patterns with comprehensive OpenAPI documentation
- **Authentication**: Enterprise SSO integration with role-based access control
- **Webhook System**: Event-driven updates for external system integration
- **SDK Generation**: Auto-generated SDKs for popular programming languages

**External Integrations:**
- **Bloomberg ESG**: API connector for financial and ESG data
- **Refinitiv**: Market data and sustainability metrics integration
- **MSCI**: ESG ratings and climate risk data
- **Government APIs**: EPA, EU Taxonomy, and regulatory data sources

## 4. Epic 4: Community Forum Advanced Features Architecture

### **Story 4.6: Advanced Search & Discovery**
**Backend Strategy:**
- **Full-Text Search Index**: Implement PostgreSQL `tsvector` and `tsquery` for forum_topics and forum_replies
- **Search API Endpoint**: `/api/search` with filters for content type, date range, user, category
- **SEO Metadata**: Add meta_title, meta_description, keywords columns to forum_topics
- **Content Recommendation**: Supabase functions to suggest related topics based on user activity

**Frontend Strategy:**
- **Global Search Component**: React search bar with debounced queries and autocomplete
- **Advanced Filter Panel**: Category, date range, user, content type filters
- **Search Results Page**: Paginated results with highlighting and relevance scoring
- **Recommendation Widgets**: "Related Topics" and "Trending Discussions" components

### **Story 4.7: Mobile-First Responsive Design & PWA**
**Backend Strategy:**
- **PWA Manifest**: Serve manifest.json with app icons and theme colors
- **Service Worker**: Cache forum content, API responses, and offline fallbacks
- **Push Notifications**: Web Push API integration for real-time notifications
- **Performance Optimization**: Implement pagination, lazy loading APIs

**Frontend Strategy:**
- **Responsive Breakpoints**: Mobile-first CSS with 320px, 768px, 1024px, 1440px breakpoints
- **Touch Gestures**: Swipe navigation, pull-to-refresh, touch-friendly buttons (44px minimum)
- **Offline Support**: Service worker caching with background sync for posts
- **PWA Shell**: App-like navigation with bottom tab bar for mobile

### **Story 4.8: Enhanced User Engagement Features**
**Backend Strategy:**
- **Mentions System**: @username parsing with notification triggers
- **Bookmarks Table**: user_bookmarks linking users to topics/replies
- **Reactions System**: emoji_reactions table with type (like, love, laugh, etc.)
- **Following System**: user_follows table for user-to-user relationships
- **Activity Feed**: Aggregated feed generation via Supabase functions

**Frontend Strategy:**
- **Mention Autocomplete**: @-triggered user search dropdown in rich text editor
- **Bookmark Management**: Save/unsave functionality with personal bookmarks page
- **Reaction Picker**: Emoji selector with real-time reaction counts
- **Follow/Unfollow UI**: User profile follow buttons with follower counts
- **Personalized Feed**: Algorithm-driven content recommendation based on follows and activity

### **Story 4.9: Rich Content Editor & Media Management**
**Backend Strategy:**
- **Draft Storage**: forum_drafts table for auto-saved content
- **Media Processing**: Image optimization and video thumbnail generation
- **Content Validation**: Server-side sanitization of HTML/Markdown content
- **Version History**: Content revision tracking for edit history

**Frontend Strategy:**
- **WYSIWYG Editor**: TinyMCE or Quill.js with custom toolbar
- **Markdown Support**: Dual-mode editor with live preview
- **Media Upload Widget**: Drag-drop interface with progress indicators
- **Auto-Save**: Periodic draft saving with conflict resolution
- **Content Formatting**: Code syntax highlighting, tables, embeds

### **Story 4.10: Community Analytics & Insights**
**Backend Strategy:**
- **Analytics Tables**: user_activity, topic_views, engagement_metrics
- **Supabase Views**: Pre-aggregated statistics for performance
- **Analytics Functions**: PostgreSQL functions for complex metrics calculation
- **Data Retention**: Automated cleanup of old analytics data

**Frontend Strategy:**
- **Admin Analytics Dashboard**: Charts for user growth, engagement, popular content
- **User Analytics**: Personal statistics page with contribution metrics
- **Community Insights**: Public statistics showing forum health and activity
- **Real-time Metrics**: Live updating dashboards using WebSocket connections

### **Story 4.11: Accessibility & Internationalization**
**Backend Strategy:**
- **Content Translation**: i18n_content table for multilingual support
- **Locale Detection**: User preference storage and automatic detection
- **GDPR Compliance**: Data export/deletion endpoints, consent tracking
- **Accessibility Audit Logs**: Track accessibility improvements and compliance

**Frontend Strategy:**
- **WCAG 2.1 AA Compliance**: Semantic HTML, ARIA labels, keyboard navigation
- **Screen Reader Support**: Proper heading hierarchy, alt text, focus management
- **i18n Framework**: React-i18next with namespace organization
- **RTL Support**: CSS logical properties, bidirectional text rendering
- **High Contrast Mode**: Alternative color schemes for visual accessibility
- **Reduced Motion**: Respect prefers-reduced-motion for animations

## 5. Technical Implementation Strategy

### **Epic 2: Carbon Platform Implementation**

#### **Data Architecture Strategy**
- **Schema Design**: Hierarchical company → industry → sector structure for optimal query performance
- **Data Validation**: Multi-stage validation pipeline with quality scoring and anomaly detection
- **Import Framework**: Pluggable ETL system supporting CSV, API, and real-time data sources
- **Performance Monitoring**: Continuous query optimization with automated index management

#### **Frontend Architecture Strategy**
- **Component Hierarchy**: Reusable ESG visualization components with consistent design system
- **State Management**: Zustand for admin state, React Query for data fetching and caching
- **Real-time Updates**: WebSocket integration with optimistic UI updates
- **Performance**: Virtualization for large datasets, lazy loading for dashboard components

#### **Security & Compliance Framework**
- **Data Protection**: Row-level security with enterprise data isolation
- **API Security**: OAuth 2.0 with scope-based permissions and rate limiting
- **Audit Logging**: Comprehensive activity tracking for compliance requirements
- **Data Lineage**: Complete provenance tracking for regulatory reporting

## 6. Epic 4: Forum Implementation Strategy

### **Carbon Platform Performance Optimization**
- **Database Strategy**: Partitioned tables, materialized views, composite indexes for 100k+ companies
- **Caching Architecture**: Multi-layer caching with Redis for aggregations and Supabase connection pooling
- **API Optimization**: GraphQL with DataLoader, cursor-based pagination, response compression

### **Forum Performance Optimization**
- **Indexing Strategy**: Composite indexes for search queries, user activity, and content discovery
- **Caching Layer**: Redis integration for frequently accessed forum data
- **Database Partitioning**: Time-based partitioning for analytics tables

### **Unified API Design Patterns**
- **RESTful Endpoints**: Consistent naming and HTTP method usage across carbon and forum APIs
- **GraphQL Integration**: Complex data fetching for carbon analytics and forum relationships
- **Rate Limiting**: Tiered limits for enterprise carbon data access and forum usage
- **API Versioning**: Header-based versioning for backward compatibility

### **Integrated Frontend Architecture**
- **Component Library**: Shared UI components for carbon visualizations and forum interface
- **State Management**: Zustand for global state, React Query for carbon data and forum content
- **Code Splitting**: Route-based lazy loading for carbon dashboards and forum features
- **Testing Strategy**: Unit tests (Jest), integration tests (Testing Library), E2E (Playwright)