# GoCarbonTracker - Brownfield Product Requirements Document (PRD)

## 1. Overview
This document outlines the requirements for enhancing the GoCarbonTracker platform. The work is structured into four main epics to add user authentication, build out the Tracker and Platform pages with dual-view (public/private) functionality, and complete the Community Forum.

## 2. High-Level Functional Requirements

* **FR-Auth-1:** The system must support user sign-up, login, and session management via email/password and social providers (Google, GitHub).
* **FR-Tracker-1:** The Tracker page must provide both a private view for users to manage their own data and a public view to explore all company data.
* **FR-Tracker-2:** The Tracker page must include features for data input (manual and CSV), visualization, and quality assessment.
* **FR-Platform-1:** The Platform page must provide tools for discovering, viewing, and benchmarking public company climate data.
* **FR-Forum-1:** ✅ The Community Forum must have features for topic creation, replies, upvoting, moderation, and administration. (Epic 4 Complete - MVP Reddit-style forum implemented with simplified UX, badge system, and mobile-responsive design)

## 3. Epic & Story Structure

### Epic 1: Foundational Backend & User Authentication
*Goal: To set up the core database structure in Supabase and implement a complete, secure authentication system.*

* **Story 1.1: Set Up Core User and Company Database Tables**
    * As a Platform Administrator, I want the core database tables for user profiles and company profiles to be created in Supabase, so that we have a structured place to store user accounts and link them to their respective organizations.
    * **AC:**
        1.  A `profiles` table is created to store user-specific data, linked to Supabase's built-in `auth.users` table.
        2.  A `companies` table is created with fields for company name, industry, size, and location.
        3.  A clear relationship is established to link multiple user profiles to a single company.

* **Story 1.2: User Registration with Email and Password**
    * As a new user, I want to be able to sign up for an account using my email and a password, so that I can access the GoCarbonTracker platform.
    * **AC:**
        1.  A registration page exists with input fields for email and password.
        2.  Upon submission, a new account is created in the Supabase `auth.users` table.
        3.  A corresponding `profiles` entry is created and linked to the new user account.
        4.  Clear error messages are provided for invalid inputs.
        5.  After successful registration, the user is automatically logged in and redirected to their personal Tracker page.

* **Story 1.3: User Login with Email and Password**
    * As an existing user, I want to be able to log in with my email and password, so that I can access my account and data.
    * **AC:**
        1.  A login page exists with input fields for email and password.
        2.  Upon submitting correct credentials, the user is successfully authenticated.
        3.  After a successful login, the user is redirected to their personal Tracker page.
        4.  A clear error message is displayed for incorrect credentials.
        5.  A "Forgot Password?" link is available.

* **Story 1.4: User Sign-Up and Login with Social Providers**
    * As a new or existing user, I want to be able to sign up or log in using my Google or GitHub account, so that I can access the platform without creating a separate password.
    * **AC:**
        1.  Registration and login pages display "Continue with Google" and "Continue with GitHub" options.
        2.  Clicking an option initiates the Supabase OAuth flow.
        3.  New users have accounts and profiles created; existing users are logged in.
        4.  After successful login, the user is redirected to their personal Tracker page.

* **Story 1.5: Create Database Schemas for Core Application Data**
    * As a Platform Administrator, I want all the necessary Supabase database tables for emissions, targets, and public company data to be created, so that the application has a structured backend to store and retrieve data.
    * **AC:**
        1.  An `emission_records` table is created.
        2.  Tables for `emission_targets` and `progress` are created.
        3.  Tables for `public_company_profiles`, `public_emissions_data`, and `industry_benchmarks` are created.
        4.  All necessary relationships, foreign keys, and initial RLS policies are configured.

### Epic 2: Carbon Tracking & Public Platform + Real Data Integration
*Goal: To build a comprehensive enterprise-scale carbon data platform with 100k company support, admin-controlled data management, and real-time user dashboard experience.*

#### **Foundation Stories (2.1-2.8) - Public Platform Infrastructure**

* **Story 2.1: Core Carbon Data Schema & Database Setup**
    * As a Platform Developer, I want a comprehensive database schema for carbon emissions and ESG data with proper indexing and relationships, so that the platform can efficiently store, query, and analyze emissions data for 100k+ companies while maintaining data integrity and performance.
    * **AC:**
        1.  Complete database schema supporting 100k+ companies with Company → Industry → Sector hierarchy.
        2.  Scope 1, 2, 3 emissions tables with time-series data and data source attribution.
        3.  Performance optimization with partitioned tables, materialized views, and optimized indexes.
        4.  Security implementation with RLS policies and data encryption.

* **Story 2.2: Public Carbon Dashboard Interface**
    * As a user, I want an intuitive dashboard to explore global carbon emissions data with real-time updates, so that I can monitor climate progress and company performance.
    * **AC:**
        1.  Global emissions overview with real-time counters and trend visualizations.
        2.  Interactive filtering by industry, geography, company size, and time period.
        3.  Mobile-responsive design with accessibility compliance (WCAG 2.1 AA).
        4.  Integration with existing React + TypeScript architecture.

* **Story 2.3: Company Search & Discovery System**
    * As a user, I want to easily find and discover companies through advanced search and intelligent recommendations, so that I can quickly access relevant climate data.
    * **AC:**
        1.  Advanced search with autocomplete, fuzzy matching, and real-time suggestions.
        2.  Multi-faceted filtering by industry, location, ESG performance, and company attributes.
        3.  AI-powered discovery features with "companies like this" recommendations.
        4.  Search analytics and performance optimization for enterprise scale.

* **Story 2.4: Industry & Sector Aggregation Views**
    * As a user, I want to explore emissions data through industry and sector groupings with benchmarking capabilities, so that I can understand relative performance and industry trends.
    * **AC:**
        1.  Hierarchical navigation supporting GICS, NAICS, and custom sector classifications.
        2.  Real-time aggregation engine with statistical analysis and confidence intervals.
        3.  Benchmarking tools with peer group analysis and trend identification.
        4.  Export functionality for reports and presentations.

* **Story 2.5: Basic ESG Metrics Visualization**
    * As a user, I want comprehensive ESG data visualization tools to analyze environmental, social, and governance metrics, so that I can make informed decisions based on multiple sustainability indicators.
    * **AC:**
        1.  Interactive charts using Recharts with drill-down capabilities.
        2.  ESG correlation analysis with financial performance metrics.
        3.  Progress tracking for science-based targets and climate commitments.
        4.  Data quality integration with visual indicators and confidence scores.

* **Story 2.6: Benchmarking & Comparison Tools**
    * As a user, I want to compare multiple companies and analyze peer groups, so that I can benchmark performance and identify best practices.
    * **AC:**
        1.  Multi-company comparison interface supporting up to 10 companies simultaneously.
        2.  Intelligent peer group generation with statistical significance testing.
        3.  Advanced analytics including risk-adjusted metrics and correlation analysis.
        4.  Collaboration features with sharing, export, and presentation tools.

* **Story 2.7: Real-time Dashboard Auto-refresh System**
    * As a user, I want the dashboard to automatically update with the latest data, so that I always have access to current information without manual refresh.
    * **AC:**
        1.  WebSocket and Server-Sent Events implementation for real-time updates.
        2.  Intelligent change detection with incremental loading and performance optimization.
        3.  Offline mode support with connection status indicators.
        4.  Administrative controls for update frequency and system monitoring.

* **Story 2.8: Public API Foundation for Data Access**
    * As a developer/enterprise user, I want comprehensive API access to carbon and ESG data, so that I can integrate climate data into external systems and applications.
    * **AC:**
        1.  RESTful API with comprehensive endpoint coverage and consistent design patterns.
        2.  GraphQL integration with real-time subscriptions and complex query support.
        3.  Authentication, rate limiting, and tiered access with enterprise features.
        4.  Interactive documentation, SDK generation, and performance optimization.

#### **Enterprise Management Stories (2.9-2.12) - Admin Data Platform**

* **Story 2.9: Enterprise Data Import Management System**
    * As an admin, I want to efficiently import large-scale carbon emissions and ESG datasets into the platform, so that users can access comprehensive, up-to-date insights.
    * **AC:**
        1.  Admin-only interface for enterprise-scale data management (millions of records).
        2.  Multiple data source support (CSV uploads, API integrations, data partnerships).
        3.  Batch processing with progress tracking, validation pipelines, and error handling.
        4.  Security framework with audit trails and data governance controls.

* **Story 2.10: Real-time Data Quality & Monitoring Dashboard**
    * As an admin, I want to monitor data quality, import status, and system health, so that users always have access to reliable carbon/ESG insights.
    * **AC:**
        1.  Real-time monitoring of data pipelines with enterprise quality metrics.
        2.  Alert system for data anomalies, failed imports, and quality threshold breaches.
        3.  Performance metrics dashboard with query optimization and system health indicators.
        4.  Compliance reporting with data accuracy and completeness tracking.

* **Story 2.11: Unified Data Source Management Interface**
    * As an admin, I want to manage all data sources from a single interface, so that the platform remains scalable and maintainable.
    * **AC:**
        1.  API connection management for enterprise data providers (Bloomberg, Refinitiv, MSCI).
        2.  Scheduling and automation for regular data updates with conflict resolution.
        3.  Data source prioritization with integration to forum and benchmarking features.
        4.  Health monitoring and performance optimization for all data connections.

* **Story 2.12: Comprehensive Data Attribution & Lineage System**
    * As a user, I want to understand the source and reliability of carbon/ESG data, so that I can make informed decisions based on transparent information.
    * **AC:**
        1.  Enterprise-grade data lineage tracking with complete audit trails.
        2.  Source attribution visible in all dashboard insights with credibility scoring.
        3.  Data freshness indicators and integration with forum discussions.
        4.  Regulatory compliance features for ESG reporting requirements.

### Epic 3: Personal Carbon Management 🔄 **FUTURE PLAN**
*Goal: Private carbon tracking capabilities for individual users and organizations (moved from Epic 2 focus)*

* **Story 3.1: Private Data Management Interface**
    * As a logged-in user, I want to manage my organization's private carbon data, so that I can track internal progress while benefiting from public benchmarking.
    * **AC:**
        1.  Secure private data storage with user isolation and organization-level access.
        2.  Unified interface combining private data management with public insights.
        3.  Data privacy controls with granular permission management.
        4.  Integration with public benchmarking for contextual analysis.

* **Story 3.2: Dual-View Tracker Interface (Public/Private)**
    * As a user, I want seamless switching between public platform data and private organizational data, so that I can leverage both datasets effectively.
    * **AC:**
        1.  Toggle interface between public platform and private tracking modes.
        2.  Consistent user experience across both data views.
        3.  Context-aware features that respect data privacy boundaries.
        4.  Unified search and filtering across appropriate data scopes.

* **Story 3.3: Private Analytics and Reporting**
    * As an organization user, I want comprehensive analytics on private data with public context, so that I can generate insights for internal and external reporting.
    * **AC:**
        1.  Private analytics dashboard with organization-specific metrics.
        2.  Custom reporting capabilities with white-label options.
        3.  Data export functionality for compliance and external reporting.
        4.  Integration with public benchmarking for competitive analysis.

### Epic 4: Community Forum – Reddit-style Discussion Forum ✅ COMPLETE
*Goal: Successfully refactored the existing community platform into a simpler, Reddit-style discussion forum focused on core MVP functionality and user engagement.*

#### **Completed Stories**

* **Story 4.5 (Revised): Refactor Main Layout to Two-Column View**
    * **Goal:** Create a consistent two-column layout with a persistent sidebar for the entire community section.
    * **Key Work:** Implemented two-column layout with persistent sidebar, mobile-responsive design maintained.
    * **Status:** ✅ Complete & Implemented
    * **Implementation:** Two-column layout integrated into CommunityPage component

* **Story 4.6 (Revised): Rework TopicsList.tsx for Infinite Scroll Feed**
    * **Goal:** Replace the topic list with a modern, performant infinite scroll feed for a better browsing experience.
    * **Key Work:** New `useInfiniteScroll.ts` hook, updated `useCommunityTopics.ts` for pagination, refactored `TopicsList.tsx`.
    * **Status:** ✅ Complete & Implemented
    * **Implementation:** Infinite scroll mechanism with simplified filtering interface

* **Story 4.7 (Revised): Simplify CommunityThread.tsx Interactions for MVP**
    * **Goal:** Streamline the single-post view to focus only on MVP actions: 'Like' and 'Reply'.
    * **Key Work:** New `TopicThreadView.tsx` component, integrates `useUpvote` and `ReplyBox`, hides non-MVP actions.
    * **Status:** ✅ Complete & Implemented
    * **Implementation:** Clean thread view with prominent Like/Reply buttons, non-MVP actions removed

* **Story 4.8 (Revised): Adapt UserProfile.tsx for MVP Focus**
    * **Goal:** Simplify the user profile page to show only 'Summary' and 'Activity' tabs for MVP.
    * **Key Work:** Refactored `UserProfile.tsx` with tab-based structure showing only essential information.
    * **Status:** ✅ Complete & Implemented
    * **Implementation:** Tab-based profile with Summary (stats, badges, bio) and Activity (recent posts/replies)

* **Story 4.9 (Revised): Integrate New Onboarding Badge Logic**
    * **Goal:** Encourage user engagement by implementing new 'Basic' and 'First Like' badges.
    * **Key Work:** Created `useBadgeSystem.ts` hook, integrated badge awarding logic with reputation system.
    * **Status:** ✅ Complete & Implemented
    * **Implementation:** Badge system with Basic badge (onboarding) and First Like badge (first upvote)

#### **Epic 4 Technical Achievements**

**New Components Created:**
- `TopicThreadView.tsx` - Dedicated thread view component with MVP-focused interface
- `useBadgeSystem.ts` - Centralized badge management and API integration hook
- `useTopicThread.ts` - Hook for thread data fetching and state management

**Enhanced Components:**
- `UserProfile.tsx` - Refactored to tab-based structure (Summary/Activity only)
- `TopicsList.tsx` - Enhanced with infinite scroll and simplified filtering
- `OnboardingFlow.tsx` - Integrated with badge system for Basic badge awarding
- `useUpvote.ts` - Enhanced with First Like badge integration

**Key Features Implemented:**
- Reddit-style thread navigation and interaction
- Badge system integrated with reputation hooks
- Mobile-responsive design throughout
- Performance optimizations (infinite scroll, efficient badge system)
- Clean MVP-focused user experience