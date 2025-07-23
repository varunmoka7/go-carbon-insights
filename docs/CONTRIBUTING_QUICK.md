# 🤝 Contributing Quick Guide

**Start contributing to GoCarbonTracker in minutes**

## First-Time Contributors

### 1. Quick Setup
```bash
# Fork the repository on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/go-carbon-insights.git
cd go-carbon-insights
npm install
npm run dev
```

### 2. Make Your First Change
1. **Find a good first issue** - Look for `good-first-issue` label
2. **Create a branch** - `git checkout -b fix/issue-description`
3. **Make your changes** - Follow existing code patterns
4. **Test locally** - Run `npm run test` and `npm run lint`
5. **Submit PR** - Push and create Pull Request

## Code Standards

### **Quick Rules**
- Use TypeScript for all new code
- Follow existing naming conventions
- Add tests for new features
- Update documentation when needed
- Keep commits small and focused

### **File Structure**
```
src/
├── components/     # React components
├── pages/         # Main page components  
├── hooks/         # Custom React hooks
├── utils/         # Helper functions
└── types/         # TypeScript definitions
```

## Testing

```bash
# Run all tests
npm run test

# Run linting
npm run lint

# Type checking
npm run typecheck
```

## Submitting Changes

### **PR Checklist**
- [ ] Tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated if needed
- [ ] Descriptive commit messages
- [ ] PR describes what and why

### **PR Template**
```markdown
## What Changed
Brief description of your changes

## Why
Reason for the change (fixes issue #123)

## Testing
How you tested the changes
```

## Common Tasks

### **Adding a New Component**
1. Create in appropriate folder under `/src/components/`
2. Use TypeScript and existing UI patterns
3. Add to exports in `index.ts` if reusable
4. Include basic tests

### **Fixing a Bug**
1. Write a test that reproduces the bug
2. Fix the issue
3. Verify test passes
4. Update documentation if behavior changed

### **Adding Documentation**
1. Use clear, concise language
2. Include code examples
3. Update relevant index files
4. Follow existing documentation style

## Getting Help

- **Questions about code?** Check existing issues or create a new one
- **Unsure about approach?** Comment on the issue before starting
- **Need review?** Tag maintainers in your PR
- **Documentation unclear?** Help improve it!

## Code Review Process

1. **Automated checks** run on every PR
2. **Maintainer review** for code quality and fit
3. **Testing** in development environment
4. **Merge** once approved and tests pass

## Quick Reference

```bash
# Development commands
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests
npm run lint         # Check code style

# Git workflow
git checkout -b feature/my-feature
git add .
git commit -m "feat: add new feature"
git push origin feature/my-feature
```

---

**Ready to contribute?** 
- Check out [good first issues](https://github.com/your-org/go-carbon-insights/labels/good-first-issue)
- See the [full Contributing Guide](../CONTRIBUTING.md) for detailed information
- Join the [community discussions](../user-guides/README.md#community--support)
- Need help getting started? Check our [FAQ](./FAQ.md)