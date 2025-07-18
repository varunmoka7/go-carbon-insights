# Brownfield Architecture Document

## 1. Project's Core Purpose

**GoCarbonTracker** is a corporate climate intelligence platform that provides real-time insights into company carbon emissions, science-based targets, and decarbonization strategies. It enables organizations, investors, and policymakers to make informed decisions using standardized, verified climate data.

---

## 2. Technology Stack

| Layer         | Technology/Tool         | Details/Notes                                 |
|---------------|------------------------|-----------------------------------------------|
| Frontend      | React 18 + TypeScript  | Vite, Tailwind CSS, shadcn/ui, Recharts       |
| Backend       | Supabase (PostgreSQL)  | Auth, RLS, real-time, edge functions          |
| Data Pipeline | Node.js (npm)          | Data import, validation, templates            |
| Hosting       | Lovable, Vercel        | Automatic deployment, custom domain support   |
| Auth          | Supabase Auth          | JWT, RLS, OAuth                               |
| Config        | JSON, TOML             | Supabase config, Vercel config, templates     |
| Visualization | Recharts               | Interactive charts, dashboards                |

---

## 3. Architecture Map

**Source Tree (high-level):**
```
/src
  /components
  /features
    /forum
      /components
      /hooks
      /data
      /scripts
  /hooks
  /pages
  /contexts
  /data
  /integrations
    /supabase
  /utils
  /types
  ...
/supabase
  /migrations
  config.toml
...
/data-templates
/docs
/public
```

**Key Directory Purposes:**
- `/src/features/forum`: Community forum (UI, hooks, data, scripts)
- `/src/integrations/supabase`: Supabase client and types
- `/supabase`: Database schema, migrations, config
- `/data-templates`: CSV templates for company, emissions, SBTi, etc.
- `/docs`: Project documentation, API, migration plans

**High-Level Pattern:**  
- **Frontend-heavy, data-driven SaaS** with a real-time dashboard, forum, and data import pipeline.  
- **Backend is managed via Supabase** (PostgreSQL, RLS, edge functions).

---

## 4. Data Models and APIs

**Core Data Structures:**
- **Company**: Name, industry, emissions, targets, compliance, financials
- **Emissions**: Scope 1, 2, 3 breakdowns, year, source, quality score
- **SBTi Targets**: Type, status, progress, validation date
- **Forum**: Users, topics, replies, upvotes, badges, categories

**APIs / Ingestion Protocols:**
- **Data Import**: CSV templates for bulk upload (company, emissions, SBTi, etc.)
- **Supabase Edge Functions**: For custom serverless logic (e.g., upvotes, notifications)
- **Real-time Subscriptions**: For live updates (topics, emissions, etc.)
- **RESTful Endpoints**: Provided by Supabase for CRUD operations

---

## 5. Technical Debt

- **No Go code or go.mod found**: Despite the repo name, the current codebase is TypeScript/Node.js/React/Supabase, not Go.
- **No Dockerfile found**: Deployment is managed via Lovable/Vercel, not containerized.
- **Tests**: No explicit test directory or test scripts found.
- **Versioning**: Version is tracked in README, but no changelog or release notes.
- **Dependency Management**: Uses npm for frontend/backend JS, Supabase for DB migrations.

---

## 6. Synthesis

GoCarbonTracker is a modern, frontend-driven SaaS platform for climate data intelligence, built with React, TypeScript, and Supabase.  
- **All backend logic, data models, and APIs are managed via Supabase** (PostgreSQL, RLS, edge functions).
- **Data import is handled via CSV templates** and validated through automated scripts.
- **The forum/community feature is fully integrated** with Supabase for real-time updates and secure access.
- **Deployment is cloud-native** (Lovable, Vercel), with no Docker or Go backend present.
- **Technical debt** is minimal, but the absence of Go code, tests, and containerization may be a concern for some teams.

---

**For a new AI developer:**  
- Focus on the `/src/features`, `/supabase`, and `/data-templates` directories for core logic and data.
- Use the documentation in `/docs` and `PROJECT_KNOWLEDGE.md` for deeper technical and business context.
- All backend/database logic is managed via Supabase migrations and edge functions.
- The project is designed for rapid iteration and real-time collaboration, with a strong emphasis on data quality, security, and professional UI/UX. 