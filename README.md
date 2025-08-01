# GoCarbonTracker - Corporate Climate Intelligence Platform

**Transform corporate climate data into actionable insights for a sustainable future**

🌍 **Live Platform**: https://lovable.dev/projects/6fcef7a7-25cd-4c8d-b7e1-5fdfbaf9a17b

## 🚀 Platform Overview

GoCarbonTracker is a comprehensive corporate climate intelligence platform that provides real-time insights into company carbon emissions, science-based targets, and decarbonization strategies. Our platform helps organizations, investors, and policymakers make informed decisions based on standardized, verified climate data.

## 🔄 Auto-Sync Development

This project includes an **enhanced auto-sync feature** that provides true two-way synchronization between your local development environment and GitHub. It automatically commits and pushes your local changes to GitHub, and also pulls changes from GitHub to your local environment.

**Quick Setup:**
```bash
npm run auto-sync  # Start enhanced auto-sync watcher
```

**Features:**
- ✅ **Auto-push**: Local changes → GitHub → Lovable
- ✅ **Auto-pull**: Lovable changes → GitHub → Local  
- ✅ **Conflict Resolution**: Smart handling of merge conflicts
- ✅ **Error Recovery**: Automatic recovery from common git issues

**See [Enhanced Auto-Sync Guide](./docs/AUTO_SYNC_GUIDE.md) for complete setup and usage instructions.**

### 🎯 Core Features

#### **Multi-Scope Emissions Tracking**
- **Scope 1**: Direct emissions from owned/controlled sources
- **Scope 2**: Indirect emissions from purchased energy  
- **Scope 3**: Value chain emissions across 15 categories
- **Real-time visualization** with interactive charts and treemaps

#### **Industry Intelligence**
- **185+ Industries** with detailed taxonomy and classification
- **Emissions archetypes** for sector-specific analysis
- **Benchmarking tools** against industry peers
- **Hotspot identification** for targeted improvements

#### **Science-Based Targets (SBTi)**
- **Target validation** and progress tracking
- **Near-term and long-term** commitment monitoring
- **Net-zero pathway** alignment assessment
- **Progress visualization** with interactive dashboards

#### **Framework Compliance**
- **CDP Climate Change** scoring and analysis
- **TCFD alignment** assessment
- **GRI Standards** compliance tracking
- **Regulatory disclosure** monitoring

#### **Financial Integration**
- **Emissions intensity** per revenue/employee
- **Climate risk** financial quantification
- **Investment flow** tracking for sustainability
- **ROI analysis** for decarbonization initiatives

#### **Collaboration Hub**
- **Expert community** for knowledge sharing
- **Best practices** exchange platform
- **Solution marketplace** for climate technologies
- **Peer learning** networks

### 📊 Platform Statistics

- **112 Companies** with verified emissions data
- **185 Industries** with detailed classification
- **3-Year History** of emissions tracking
- **Real-time Updates** via Supabase integration
- **Professional UI/UX** with mobile-first design

## 📚 Documentation

**For comprehensive project documentation, see [PROJECT_KNOWLEDGE.md](./project-docs/PROJECT_KNOWLEDGE.md)**

### Quick Links
- 🚀 [**Quick Start Guide**](./docs/guides/QUICK_START.md) - Get running in 5 minutes
- 📊 [**Dashboard Tutorial**](./docs/guides/user-guides/dashboard-tutorial.md) - Learn the platform
- 🤝 [**Contributing Quick Guide**](./docs/development/CONTRIBUTING_QUICK.md) - Start contributing
- ❓ [**FAQ**](./docs/guides/FAQ.md) - Common questions answered

### Documentation
- 📚 [**User Guides**](./docs/guides/) - Complete user documentation
- 🛠️ [**Development Docs**](./docs/development/) - Developer setup and guidelines
- 🚀 [**Deployment Guide**](./docs/deployment/) - Production deployment options
- 🔧 [**Operations**](./docs/operations/) - Monitoring and maintenance
- 📖 [**Reference**](./docs/reference/) - Technical specifications

### Integration & APIs
- 🔌 [**API Examples**](./docs/api-examples/README.md) - JavaScript & Python integration
- 📋 [**API Documentation**](./docs/reference/API_DOCUMENTATION.md) - Complete API reference
- ⚙️ [**Advanced Configuration**](./docs/reference/ADVANCED_CONFIGURATION.md) - Deep customization

### Architecture & Design
- 🏗️ [**System Architecture**](./docs/reference/SYSTEM_ARCHITECTURE.md) - Technical architecture diagrams
- 🗺️ [**User Journeys**](./docs/reference/USER_JOURNEYS.md) - User experience flowcharts
- 📸 [**Visual Assets**](./docs/assets/README.md) - Screenshots and diagrams guide

### Project Resources
- 📋 [**Project Documentation**](./project-docs/) - Project knowledge base and summaries
- 🔧 [**Backend Services**](./backend-services/) - Backend architecture and services
- 🗺️ [Complete Epic Roadmap](./docs/EPIC_ROADMAP.md)
- 📥 [Data Import Templates](./data-templates/)

### Epic Status (Updated January 2025)
- ✅ **Epic 1**: Foundational Backend & User Authentication (Complete)
- ✅ **Epic 2**: Carbon Tracking & Public Platform + Real Data Integration (Foundation Complete + 4 Enterprise Stories)
  - ✅ **Stories 2.1-2.8**: Complete foundation with 100k company scale, real-time dashboards, enterprise APIs
  - 🔄 **Stories 2.9-2.12**: Enterprise data import, quality monitoring, source management, attribution systems
- 🔄 **Epic 3**: Personal Carbon Management (Future Plan)
- 🚀 **Epic 4**: Community Forum – Professional Community Platform (see [Epic Story Structure](./docs/prd/3-epic-story-structure.md) for full breakdown)
- 📋 **Epics 5-12**: See [Complete Epic Roadmap](./docs/EPIC_ROADMAP.md) for future development phases

**Complete Epic Overview**:
- **Phase 1 (Q1 2025)**: Epics 1-4 - Foundation & Core Features (Epic 5 integrated into Epic 2)
- **Phase 2 (Q2-Q3 2025)**: Epics 6-8 - Data & Intelligence
- **Phase 3 (Q4 2025-Q1 2026)**: Epics 9-12 - Enterprise & Scale

## 🚀 Quick Start

**Get started in 5 minutes** → [**Quick Start Guide**](./docs/guides/QUICK_START.md)

```bash
git clone <YOUR_GIT_URL> && cd go-carbon-insights
npm install && npm run dev
```

## 🛠️ Development & Data Import

### Local Development Setup

**Prerequisites**: Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))

For detailed setup instructions, see our [**Environment Setup Guide**](./docs/development/ENVIRONMENT_SETUP.md).

### 📥 Data Import System

We provide comprehensive data import templates for scaling the platform with real corporate climate data:

#### **Available Templates**
- **Company Master Data**: Core company information and classification
- **Emissions Data**: Scope 1, 2, 3 emissions with detailed breakdowns  
- **SBTi Targets**: Science-based targets and progress tracking
- **Framework Compliance**: CDP, TCFD, GRI status and scores
- **Financial & Operational**: Revenue, employees, facilities data
- **Industry Benchmarking**: Sector-specific performance metrics

#### **Data Sources Supported**
- **CDP Climate Disclosures**: Primary emissions data source
- **Company Sustainability Reports**: Detailed strategic information
- **SBTi Database**: Validated climate targets
- **SEC Filings**: Financial context and risk disclosures
- **Commercial Providers**: Refinitiv, MSCI, Sustainalytics

#### **Quality Assurance**
- **Automated validation** with 90%+ accuracy requirements
- **Cross-reference verification** against multiple sources
- **Statistical outlier detection** and expert review
- **Continuous quality monitoring** and improvement

**📖 Get Started**: See [Data Import Guide](./docs/data-import/DATA_IMPORT_GUIDE.md)

### Development Options

**Option 1: Lovable Platform**
- Visit [Lovable Project](https://lovable.dev/projects/6fcef7a7-25cd-4c8d-b7e1-5fdfbaf9a17b)
- Changes automatically committed to repository
- Real-time preview and collaboration

**Option 2: GitHub Integration**
- Direct file editing in GitHub interface  
- GitHub Codespaces for cloud development
- Automatic sync with Lovable platform

## 🏗️ Technical Architecture

### **Frontend Stack**
- **React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with custom design system
- **shadcn/ui** components with extensive customization
- **Recharts** for advanced data visualizations
- **React Router** for seamless navigation

### **Backend Infrastructure**  
- **Supabase** for database, authentication, and real-time features
- **PostgreSQL** with comprehensive emissions data schema
- **Row-Level Security (RLS)** for data access control
- **Real-time subscriptions** for live data updates
- **Edge Functions** for serverless data processing

### **Data Architecture**
- **Enterprise Scale**: Designed for 100k+ companies with Company → Industry → Sector hierarchy
- **Admin-Controlled Platform**: Monthly data uploads via CSV/API with enterprise validation
- **Real-time Experience**: Auto-refreshing dashboards with WebSocket/SSE updates
- **Quality Framework**: Comprehensive monitoring with anomaly detection and compliance tracking
- **API Foundation**: RESTful/GraphQL APIs ready for Bloomberg, Refinitiv, MSCI integrations
- **Performance Optimized**: Materialized views, connection pooling, sub-500ms response times

### **Key Features**
- **Responsive design** optimized for mobile-first experience
- **Professional theming** with semantic design tokens
- **Advanced filtering** and search capabilities
- **Real-time charts** with interactive visualizations
- **Export functionality** for data analysis

For detailed technical specifications, see [Technical Architecture](./PROJECT_KNOWLEDGE.md#technical-architecture).

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6fcef7a7-25cd-4c8d-b7e1-5fdfbaf9a17b) and click on Share → Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

## 🎯 Use Cases & Applications

### **For Organizations**
- **Emissions Management**: Track and manage Scope 1, 2, 3 emissions
- **Target Setting**: Align with science-based targets (SBTi)
- **Benchmark Analysis**: Compare performance against industry peers
- **Compliance Tracking**: Monitor CDP, TCFD, GRI framework alignment
- **Strategy Development**: Data-driven decarbonization planning

### **For Investors & Analysts**
- **ESG Assessment**: Comprehensive climate performance evaluation
- **Risk Analysis**: Climate risk identification and quantification
- **Portfolio Management**: Climate-aligned investment decisions
- **Due Diligence**: Verified emissions and target data
- **Impact Measurement**: Track investment climate outcomes

### **For Researchers & Policymakers**
- **Industry Analysis**: Sector-wide emissions trends and patterns
- **Policy Impact**: Measure effectiveness of climate regulations
- **Academic Research**: Access to verified corporate climate data
- **Benchmark Development**: Industry standard creation and refinement

## 🔐 Security & Data Quality

### **Data Security**
- **Supabase authentication** with Row-Level Security (RLS)
- **HTTPS encryption** for all data transmission
- **API rate limiting** and abuse prevention
- **Audit logging** for all data modifications
- **Backup and recovery** procedures

### **Data Quality Framework**
- **Quality scoring** system (0.0-1.0 scale)
- **Multi-source validation** and cross-referencing
- **Statistical outlier detection** and expert review
- **Continuous monitoring** and improvement processes
- **User feedback integration** for data corrections

## 📊 Current Platform Status

- **Version**: 2.0.0 (Epic 2 Complete)
- **Status**: Enterprise Foundation Ready
- **Scale**: Designed for 100k+ companies with hierarchical data structure
- **Architecture**: Admin-controlled data platform with enterprise APIs
- **Performance**: Sub-500ms response times with real-time auto-refresh
- **Integration**: Forum connectivity, benchmarking, and analytics pipeline
- **Data Quality**: >95% accuracy with automated quality monitoring
- **Update Frequency**: Monthly admin uploads with real-time user experience
- **Last Updated**: January 25, 2025

For detailed project roadmap and known issues, see the [Project Knowledge Base](./PROJECT_KNOWLEDGE.md).
# Test deployment - Fri Jul 11 23:40:03 CEST 2025