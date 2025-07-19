# GoCarbonTracker - Brownfield Product Requirements Document (PRD)

## 1. Overview
This document outlines the requirements for enhancing the GoCarbonTracker platform. The work is structured into four main epics to add user authentication, build out the Tracker and Platform pages with dual-view (public/private) functionality, and complete the Community Forum.

## 2. High-Level Functional Requirements

* **FR-Auth-1:** The system must support user sign-up, login, and session management via email/password and social providers (Google, GitHub).
* **FR-Tracker-1:** The Tracker page must provide both a private view for users to manage their own data and a public view to explore all company data.
* **FR-Tracker-2:** The Tracker page must include features for data input (manual and CSV), visualization, and quality assessment.
* **FR-Platform-1:** The Platform page must provide tools for discovering, viewing, and benchmarking public company climate data.
* **FR-Forum-1:** The Community Forum must have features for topic creation, replies, upvoting, moderation, and administration.

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
*Goal: To implement a unified platform for exploring public emissions data, company benchmarking, and global monitoring with comprehensive analytics, visualization capabilities, and real corporate climate data integration.*

* **Story 2.1: Display Company Profiles List**
    * As a user, I want to browse a comprehensive list of company profiles, so that I can explore different organizations and their climate performance.
    * **AC:**
        1.  Company list displays with search and filtering capabilities
        2.  Each company shows key metrics (emissions, targets, industry)
        3.  Pagination handles large datasets efficiently
        4.  Company cards link to detailed profiles
        5.  Industry and region filters available

* **Story 2.2: View Detailed Company Dashboard**
    * As a user, I want to view a comprehensive dashboard for any company, so that I can understand their climate performance and strategy.
    * **AC:**
        1.  Company-specific climate performance dashboard
        2.  Emissions data across all scopes with historical trends
        3.  SBTi targets and net zero commitments
        4.  Industry benchmarking and peer comparisons
        5.  Carbon projects and initiatives overview

* **Story 2.3: Benchmark Company Performance**
    * As a user, I want to compare company performance against industry peers and benchmarks, so that I can understand relative positioning and identify best practices.
    * **AC:**
        1.  Industry benchmarking with peer comparisons
        2.  Performance metrics and rankings
        3.  Gap analysis against targets and benchmarks
        4.  Visual charts and graphs for easy comparison
        5.  Export capabilities for reports

* **Story 2.4: Explore Public Emission Records**
    * As a user, I want to explore public emission records and data, so that I can understand global emissions patterns and trends.
    * **AC:**
        1.  Global emissions monitoring center
        2.  Sector breakdown and regional analysis
        3.  Historical trends and projections
        4.  Data quality indicators and source attribution
        5.  Interactive visualizations and charts

* **Story 2.5: Visualize Emission Trends**
    * As a user, I want to visualize emission trends and patterns, so that I can identify insights and opportunities for improvement.
    * **AC:**
        1.  Interactive charts and graphs for trend analysis
        2.  Multiple visualization types (line, bar, scatter, treemap)
        3.  Time series analysis with period comparisons
        4.  Drill-down capabilities for detailed exploration
        5.  Export and sharing functionality

* **Story 2.6: Display Targets and Progress**
    * As a user, I want to view company targets and progress tracking, so that I can understand commitment levels and achievement rates.
    * **AC:**
        1.  SBTi targets and validation status
        2.  Net zero commitments and timelines
        3.  Progress tracking against targets
        4.  Target setting and management tools
        5.  Achievement recognition and milestones

* **Story 2.7: Display Data Quality Metrics**
    * As a user, I want to understand data quality and reliability, so that I can make informed decisions based on trustworthy information.
    * **AC:**
        1.  Data quality indicators and scoring
        2.  Source attribution and verification status
        3.  Completeness and accuracy metrics
        4.  Data freshness and update frequency
        5.  Quality improvement recommendations

* **Story 2.8: Display Platform Impact Metrics**
    * As a user, I want to see platform impact and usage statistics, so that I can understand the community's engagement and influence.
    * **AC:**
        1.  Platform usage statistics and trends
        2.  Community engagement metrics
        3.  Data contribution and sharing statistics
        4.  Impact measurement and reporting
        5.  Success stories and case studies

* **Story 2.9: CSV Data Import System**
    * As a Data Administrator, I want to import real corporate climate data from CSV files, so that the platform can display verified emissions data instead of mock data.
    * **AC:**
        1.  CSV file upload with drag-and-drop interface
        2.  Template validation against predefined schemas
        3.  Data parsing and transformation
        4.  Error reporting and validation feedback
        5.  Import progress tracking and status updates

* **Story 2.10: Data Quality Monitoring Dashboard**
    * As a Data Administrator, I want to monitor data quality scores and issues, so that I can ensure the platform displays reliable and accurate information.
    * **AC:**
        1.  Quality score visualization (0.0-1.0 scale)
        2.  Data completeness and accuracy metrics
        3.  Quality issue tracking and resolution
        4.  Source attribution and verification status
        5.  Quality trend analysis over time

* **Story 2.11: Import Management Interface**
    * As a Data Administrator, I want to manage data imports and track import history, so that I can maintain data integrity and audit trails.
    * **AC:**
        1.  Import history with success/failure tracking
        2.  Data source management and configuration
        3.  Import scheduling and automation
        4.  Rollback capabilities for failed imports
        5.  Import performance metrics and optimization

* **Story 2.12: Data Source Attribution**
    * As a user, I want to see the source of data displayed on the platform, so that I can understand data reliability and make informed decisions.
    * **AC:**
        1.  Data source indicators on all data displays
        2.  Source credibility scoring and badges
        3.  Last update timestamps for all data
        4.  Data lineage tracking and documentation
        5.  Source comparison and verification tools

### Epic 3: Personal Carbon Management (Future Plan)
*Goal: To implement private carbon tracking capabilities for individual users and organizations to manage their own emissions data.*

* **Story 3.1: Private Data Management Interface**
    * As a user, I want to manage my private emission records, so that I can track my organization's carbon footprint securely.
    * **AC:**
        1.  Private data table with CRUD operations
        2.  Add/Edit/Delete forms for emission records
        3.  User-specific data management
        4.  Secure data storage and access controls
        5.  Data validation and quality checks

* **Story 3.2: Dual-View Tracker Interface**
    * As a user, I want a unified tracker page with public and private views, so that I can seamlessly switch between exploring public data and managing my private records.
    * **AC:**
        1.  Tab/toggle interface for Public vs Private views
        2.  Dynamic component switching
        3.  Unified tracker page design
        4.  Consistent user experience across views
        5.  Context-aware navigation and actions

* **Story 3.3: Private Analytics and Reporting**
    * As a user, I want private analytics and reporting tools, so that I can generate insights and reports for my organization's emissions data.
    * **AC:**
        1.  Private dashboard with organization-specific metrics
        2.  Custom report generation
        3.  Data export capabilities
        4.  Trend analysis and forecasting
        5.  Goal setting and progress tracking

### Epic 4: Community Forum – Professional Community Platform
*Goal: To build a professional-grade community platform for climate discussions, collaboration, and engagement.*

#### **Foundational Stories (Completed/In Progress)**

* **Story 4.1: Forum Foundations**
    * Topic/reply structure, categories, basic forum logic.

* **Story 4.2: User Profiles & Reputation System**
    * Dynamic user profiles, reputation tracking, badge achievements, upvote/downvote system.

* **Story 4.3: Advanced Moderation & Admin Dashboard**
    * Flagged content queue, ban tools, moderation logs, admin role protection.

* **Story 4.4: File Uploads & Attachments**
    * S3 integration, file preview UI, attachments in posts.

* **Story 4.5: Real-Time Notifications (in progress)**
    * SSE/WebSocket-based delivery, user-targeted alerts, frontend bell integration.

#### **Planned Enhancements (To Achieve Professional Grade)**

* **Story 4.6: Advanced Search & Discovery**
    * Full-text search, trending topics, tag filters, SEO-friendly URLs and metadata.

* **Story 4.7: Mobile-First Experience & PWA**
    * Responsive layout, touch-first components, offline mode, app-like experience.

* **Story 4.8: Enhanced User Engagement**
    * Mentions (@username), bookmarks, follows, content reactions, personalized feed.

* **Story 4.9: Rich Content & Editor Experience**
    * WYSIWYG with Markdown, media embeds, post types (Q&A, polls, announcements).

* **Story 4.10: Community Analytics & Insights**
    * User engagement dashboards, trending discussions, growth metrics.

* **Story 4.11: Accessibility & Internationalization**
    * WCAG compliance, screen reader support, i18n, RTL support, GDPR alignment.