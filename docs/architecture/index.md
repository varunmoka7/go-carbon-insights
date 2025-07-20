# GoCarbonTracker - Architecture Document

## Table of Contents

- [GoCarbonTracker - Architecture Document](#table-of-contents)
  - [1. Introduction](./1-introduction.md)
  - [2. Database Schema Design](./2-database-schema-design.md)
      - [Community Forum Schema (Epic 4)](./2-database-schema-design.md#community-forum-schema-epic-4)
  - [3. Epic 4 Component Architecture](#3-epic-4-component-architecture)
      - [Frontend Components](#frontend-components)
      - [Custom Hooks](#custom-hooks)
      - [Badge System Architecture](#badge-system-architecture)
      - [Data Flow](#data-flow)

## 3. Epic 4 Component Architecture

Epic 4 successfully implemented a Reddit-style discussion forum by refactoring existing components and creating new ones focused on MVP functionality.

### Frontend Components

#### New Components Created

**TopicThreadView.tsx**
- Purpose: Dedicated thread view component with MVP-focused interface
- Features: Clean Like/Reply interface, non-MVP actions removed
- Integration: Uses `useTopicThread` and `useUpvote` hooks
- Navigation: Integrated with CommunityPage routing system

**Enhanced Components**

**UserProfile.tsx**
- Refactored: Tab-based structure with Summary and Activity tabs only
- Summary Tab: User stats, reputation breakdown, badge display, bio
- Activity Tab: Recent user posts and replies with timestamps
- Badge Integration: Uses `useBadgeSystem` for real-time badge display

**TopicsList.tsx**
- Enhanced: Infinite scroll mechanism replacing pagination
- Performance: Optimized loading with `useInfiniteScroll` hook
- UX: Simplified filtering interface for better user experience

**OnboardingFlow.tsx**
- Integration: Badge system integration for Basic badge awarding
- Flow: Maintains existing 4-step onboarding with badge reward

### Custom Hooks

#### New Hooks Created

**useBadgeSystem.ts**
- Purpose: Centralized badge management and API integration
- Features: Badge fetching, awarding, statistics, and local state management
- Badges Supported: Basic (onboarding), First Like (first upvote)
- Integration: Works with reputation system and profile display

**useTopicThread.ts**
- Purpose: Thread data fetching and state management
- Features: Topic loading, replies fetching, reply creation, view tracking
- Performance: Efficient data loading with fallback mechanisms
- Error Handling: Comprehensive error states and retry logic

#### Enhanced Hooks

**useUpvote.ts**
- Enhanced: Integrated with badge system for First Like detection
- Badge Logic: Automatically awards First Like badge on user's first upvote
- Performance: Optimistic updates with error handling and rollback

**useInfiniteScroll.ts**
- Purpose: Efficient infinite scroll implementation for TopicsList
- Features: Intersection observer, back-to-top functionality, loading states
- Performance: Configurable threshold and smooth loading experience

### Badge System Architecture

#### Core Components
- **useBadgeSystem Hook**: Central badge management
- **Badge API Integration**: RESTful endpoints for badge operations
- **Profile Integration**: Real-time badge display in user profiles
- **Reputation Integration**: Badge awarding tied to user actions

#### Badge Types Implemented
1. **Basic Badge**: Awarded upon onboarding completion
2. **First Like Badge**: Awarded on user's first upvote action

#### Badge Flow
1. User Action (onboarding completion or first upvote)
2. Hook detects action and calls badge API
3. Badge awarded and stored in database
4. Local state updated and profile refreshed
5. Badge displays in user's Summary profile tab

### Data Flow

#### Thread View Flow
1. User clicks topic in TopicsList
2. CommunityPage routes to TopicThreadView
3. useTopicThread fetches topic and replies
4. User interactions (Like/Reply) update via respective hooks
5. Badge system checks for first-time actions

#### Badge Award Flow
1. User completes qualifying action
2. Relevant hook (useUpvote, OnboardingFlow) detects action
3. useBadgeSystem.awardBadge() called
4. API validates and awards badge
5. Local badge state updated
6. Profile UI reflects new badge immediately

#### Profile Display Flow
1. UserProfile loads user data
2. useBadgeSystem fetches user's badges
3. getBadgeStats() calculates display metrics
4. Summary tab shows badges with tooltips
5. Activity tab shows recent user activity

### Performance Optimizations

- **Infinite Scroll**: Efficient topic loading with intersection observer
- **Optimistic Updates**: Immediate UI feedback for Like actions with rollback
- **Badge Caching**: Local badge state management to reduce API calls
- **Error Boundaries**: Graceful degradation when badge operations fail
- **Mobile Responsive**: All components optimized for mobile experience

### Technical Patterns Used

- **Hook Composition**: Multiple hooks working together (useUpvote + useBadgeSystem)
- **State Management**: Local state with React hooks, no external state library needed
- **Error Handling**: Comprehensive error states with user-friendly messaging
- **Component Composition**: Reusable components with clear separation of concerns
- **Progressive Enhancement**: Core functionality works without badge system
