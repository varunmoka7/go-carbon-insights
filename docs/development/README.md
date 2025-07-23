# 🛠️ Development Documentation

**Guidelines, processes, and tools for developers contributing to GoCarbonTracker**

## Development Setup & Environment

### **Getting Started**
- [**Environment Setup**](./ENVIRONMENT_SETUP.md) - Complete development environment configuration
- [**Contributing Quick Guide**](../guides/QUICK_START.md) - Fast track for new contributors

### **Code Quality & Standards**
- [**Code Review Guidelines**](./CODE_REVIEW_GUIDELINES.md) - Code review process and standards
- [**TypeScript Guidelines**](./TYPESCRIPT_GUIDELINES.md) - TypeScript coding standards and best practices
- [**Testing Strategy**](./TESTING_STRATEGY.md) - Comprehensive testing approach and frameworks

### **Version Control & Workflows**
- [**Git Workflow**](./GIT_WORKFLOW.md) - Branch management and commit conventions
- [**Release Process**](../deployment/RELEASE_PROCESS.md) - How releases are created and deployed

## Quick Reference

### **Essential Commands**
```bash
# Development setup
npm install && npm run dev

# Code quality checks
npm run lint && npm run typecheck && npm run test

# Build for production
npm run build
```

### **Development Standards**
- **Code Style**: ESLint + Prettier configuration
- **TypeScript**: Strict mode enabled with comprehensive types
- **Testing**: Unit, integration, and E2E test coverage
- **Git**: Conventional commits with semantic versioning

### **Key Development Tools**
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase, PostgreSQL, Real-time subscriptions
- **Testing**: Vitest, Testing Library, Playwright
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

## Contributing Workflow

1. **Setup Development Environment**
   - Follow [Environment Setup Guide](./ENVIRONMENT_SETUP.md)
   - Verify setup with `npm run dev`

2. **Code Development**
   - Create feature branch following [Git Workflow](./GIT_WORKFLOW.md)
   - Follow [TypeScript Guidelines](./TYPESCRIPT_GUIDELINES.md)
   - Write tests per [Testing Strategy](./TESTING_STRATEGY.md)

3. **Code Review**
   - Submit PR following [Code Review Guidelines](./CODE_REVIEW_GUIDELINES.md)
   - Address feedback and iterate
   - Ensure all CI checks pass

4. **Deployment**
   - Code merged to main triggers deployment
   - Follow [Release Process](../deployment/RELEASE_PROCESS.md) for releases

## Development Resources

### **Architecture Understanding**
- [System Architecture](../reference/SYSTEM_ARCHITECTURE.md) - Technical architecture overview
- [User Journeys](../reference/USER_JOURNEYS.md) - User experience flows
- [API Documentation](../reference/API_DOCUMENTATION.md) - Complete API reference

### **Operational Knowledge**
- [Troubleshooting Guide](../operations/TROUBLESHOOTING_GUIDE.md) - Common development issues
- [Performance Benchmarks](../operations/PERFORMANCE_BENCHMARKS.md) - Performance standards
- [Monitoring & Alerting](../operations/MONITORING_ALERTING.md) - Operational monitoring

---
*For questions or issues with development setup, create an issue or check the [FAQ](../guides/FAQ.md)*