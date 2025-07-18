# GoCarbonTracker - Architecture Document

## 1. Introduction
This document serves as the detailed technical blueprint for implementing the features defined in the PRD. It outlines the database schema, API design, frontend architecture, and development workflow for the GoCarbonTracker platform, which is built on a React/TypeScript/Supabase stack.

## 2. Database Schema Design
*This schema will be implemented in Supabase (PostgreSQL).*

#### **Community Forum Schema (Epic 4)**
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