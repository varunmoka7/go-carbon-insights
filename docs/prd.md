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

### Epic 2: Carbon Tracker
*Goal: To implement a unified Tracker Page with two distinct modes: a "Private Tracking" view for personal data management and a "Public Data" view for open-access exploration.*

* **Story 2.1: Implement Dual-View Tracker Page**
    * As a user, I want a unified Tracker Page with a clear way to switch between a "Public Data" view and my "Private Tracking" view, so that I can explore all data and also manage my own.
    * **AC:**
        1.  The Tracker Page has a UI control (tabs/toggle) to select "Public Data" or "Private Tracking".
        2.  The "Public Data" view is the default.
        3.  Components displayed change dynamically based on the selected view.

* **Story 2.2: Manage Private Emission Records**
    * As a logged-in user, I want a table in my "Private Tracking" view to see, add, edit, and delete my own emission records, so that I can manage my data accurately.
    * **AC:**
        1.  The "Private Tracking" view contains a data table displaying only the records associated with the user.
        2.  An "Add New Record" feature is available.
        3.  Each record has "Edit" and "Delete" actions.
        4.  The backend logic is updated to support a secure delete function.

* **Story 2.3: Explore Public Emission Records**
    * As a user, I want to see a filterable table of all public emission records in the "Public Data" view, so that I can analyze the entire dataset.
    * **AC:**
        1.  The "Public Data" view displays a table of all publicly available emission records.
        2.  The table is filterable by company, date, and emission scope.

* **Story 2.4: Visualize Emission Trends (for Both Views)**
    * As a user, I want to see charts that visualize the emission data, so that I can identify trends in both the public dataset and my own private data.
    * **AC:**
        1.  Charts update dynamically based on the selected view (Public/Private).
        2.  Charts show aggregated data for the selected view.
        3.  Charts respect any active filters applied to the data tables.

* **Story 2.5: Bulk Import Private Emission Records via CSV**
    * As a logged-in user, I want to upload a CSV file in my "Private Tracking" view, so that I can efficiently import my own emission records.
    * **AC:**
        1.  The "Private Tracking" view includes a "Bulk Import" feature.
        2.  A downloadable CSV template is provided.
        3.  The UI parses and validates the CSV, providing clear error feedback.
        4.  Valid records are sent to the backend for secure insertion.

* **Story 2.6: Display Targets and Progress**
    * As a user, I want to see climate targets and progress against them, so that I can assess performance in both the Public and Private views.
    * **AC:**
        1.  The UI includes a component for displaying targets and progress.
        2.  The component shows data relevant to the active view (public company or private user).
        3.  Progress bars or charts are used to visualize progress.

* **Story 2.7: Display Data Quality and Validation Status**
    * As a user, I want to see the quality score and validation status for emission records, so that I can assess the reliability of the data.
    * **AC:**
        1.  Data tables in both views include a "Data Quality Score" column.
        2.  Filtering by quality score is supported.
        3.  Record details show validation status and data source.

### Epic 3: Public Platform & Company Benchmarking
*Goal: To build the public-facing "Platform Page," focusing on company profiles, comparative data, and industry benchmarks.*

* **Story 3.1: Display Company Profiles List**
    * As a user, I want to see a searchable and filterable list of all company profiles, so that I can discover and select companies for detailed analysis.
    * **AC:**
        1.  A "Platform" page displays all companies in a grid/list.
        2.  Each item shows Company Name, Industry, and Location.
        3.  The page includes search and filter controls.
        4.  Clicking a company navigates to its detailed dashboard.

* **Story 3.2: View Detailed Company Dashboard**
    * As a user, I want to view a detailed dashboard for a specific company, so that I can analyze its emissions data, targets, and compliance status in one place.
    * **AC:**
        1.  A dedicated page displays a single company's profile.
        2.  The page shows detailed emissions data, climate targets, and compliance badges.
        3.  Relevant financial/operational data is included for context.
        4.  All data is fetched from Supabase.

* **Story 3.3: Benchmark Company Performance Against Industry Averages**
    * As a user, I want to compare a company's emissions data against industry benchmarks, so that I can understand its performance relative to its peers.
    * **AC:**
        1.  The company dashboard includes a "Benchmarking" section.
        2.  Charts compare the company's key metrics against its industry average.
        3.  "Best-in-class" metrics are displayed as a performance target.
        4.  Benchmark data is fetched from the `industry_benchmarks` table.

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