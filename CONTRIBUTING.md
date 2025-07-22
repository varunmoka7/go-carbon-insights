# Contributing to GoCarbonTracker

Welcome to GoCarbonTracker! We're excited to have you contribute to our corporate climate intelligence platform. This guide will help you get started with contributing to the project.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Submitting Changes](#submitting-changes)
- [Code Review Process](#code-review-process)
- [Release Process](#release-process)
- [Community Guidelines](#community-guidelines)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Git** for version control
- **Supabase Account** for database access
- **Modern IDE** (VS Code recommended)

### First Time Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/go-carbon-insights.git
   cd go-carbon-insights
   ```

2. **Install Dependencies**
   ```bash
   npm install
   cd forum-service && npm install && cd ..
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

## 🛠️ Development Setup

### Project Structure

```
go-carbon-insights/
├── src/                    # Main React application
│   ├── components/         # Reusable UI components
│   ├── pages/             # Route components
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   └── types/             # TypeScript type definitions
├── forum-service/         # Backend forum service
├── docs/                  # Documentation
├── supabase/             # Database migrations
└── tests/                # Test files
```

### Branch Strategy

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/***: New features (e.g., `feature/emissions-tracking`)
- **bugfix/***: Bug fixes (e.g., `bugfix/login-error`)
- **hotfix/***: Critical production fixes

### Naming Conventions

#### Branches
- `feature/short-description`
- `bugfix/issue-description`
- `hotfix/critical-fix`

#### Files
- **Components**: PascalCase (`EmissionChart.tsx`)
- **Hooks**: camelCase with `use` prefix (`useEmissionData.ts`)
- **Utils**: camelCase (`dataValidation.ts`)
- **Types**: PascalCase (`EmissionData.ts`)

#### Commits
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add emissions comparison chart
fix: resolve authentication token expiry
docs: update API documentation
test: add unit tests for emission calculations
```

## 📏 Code Standards

### TypeScript Guidelines

1. **Strict Mode**: Always use TypeScript strict mode
2. **Type Safety**: Avoid `any` types, use proper interfaces
3. **Null Safety**: Handle null/undefined explicitly

```typescript
// ✅ Good
interface EmissionData {
  scope1: number;
  scope2: number;
  scope3: number | null;
}

// ❌ Bad
interface EmissionData {
  scope1: any;
  scope2: any;
  scope3: any;
}
```

### React Component Guidelines

1. **Functional Components**: Use function components with hooks
2. **Props Interface**: Define interfaces for all props
3. **Default Props**: Use default parameters

```typescript
// ✅ Good
interface EmissionChartProps {
  data: EmissionData[];
  title?: string;
  height?: number;
}

export const EmissionChart = ({ 
  data, 
  title = "Emissions Overview",
  height = 400 
}: EmissionChartProps) => {
  // Component logic
};
```

### CSS/Styling Guidelines

1. **Tailwind First**: Use Tailwind CSS for styling
2. **Component Variants**: Use `class-variance-authority` for component variants
3. **Custom CSS**: Only when Tailwind is insufficient

```typescript
// ✅ Good - Using Tailwind
<div className="bg-white p-4 rounded-lg shadow-md">

// ✅ Good - Using CVA for variants
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
      },
    },
  }
);
```

### ESLint Configuration

Our ESLint rules enforce:
- TypeScript best practices
- React hooks rules
- Import organization
- Consistent formatting

Run linting:
```bash
npm run lint
npm run lint:fix  # Auto-fix issues
```

## 🧪 Testing Guidelines

### Testing Strategy

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows

### Testing Tools

- **Vitest**: Unit and integration testing
- **Testing Library**: React component testing
- **MSW**: API mocking
- **Playwright**: E2E testing (planned)

### Writing Tests

```typescript
// Component Test Example
import { render, screen } from '@testing-library/react';
import { EmissionChart } from '../EmissionChart';

describe('EmissionChart', () => {
  it('renders chart with provided data', () => {
    const mockData = [
      { scope1: 100, scope2: 200, scope3: 300 }
    ];
    
    render(<EmissionChart data={mockData} />);
    
    expect(screen.getByText('Emissions Overview')).toBeInTheDocument();
  });
});
```

### Test Requirements

- **Coverage**: Minimum 80% code coverage
- **Naming**: Descriptive test names
- **Isolation**: Tests should not depend on each other
- **Mocking**: Mock external dependencies

Run tests:
```bash
npm run test           # Run all tests
npm run test:coverage  # Run with coverage
npm run test:ui        # Run with UI
```

## 📤 Submitting Changes

### Pull Request Process

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow code standards
   - Add tests for new functionality
   - Update documentation

3. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add emission trend analysis"
   ```

4. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### PR Requirements

#### Before Submitting
- [ ] All tests pass locally
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] TypeScript compiles without errors

#### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

## 👀 Code Review Process

### Review Criteria

1. **Functionality**: Does the code work as intended?
2. **Code Quality**: Is the code clean and maintainable?
3. **Performance**: Are there any performance implications?
4. **Security**: Are there any security vulnerabilities?
5. **Tests**: Are there adequate tests?

### Review Guidelines

#### For Authors
- Provide clear PR descriptions
- Respond to feedback promptly
- Keep PRs small and focused
- Test your changes thoroughly

#### For Reviewers
- Be constructive and respectful
- Explain the "why" behind suggestions
- Approve when requirements are met
- Request changes when needed

### Review Process
1. **Automated Checks**: CI/CD runs tests and linting
2. **Peer Review**: At least one team member reviews
3. **Approval**: Reviewer approves changes
4. **Merge**: Author or maintainer merges

## 🔄 Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Steps

1. **Version Bump**: Update version in `package.json`
2. **Changelog**: Update `CHANGELOG.md`
3. **Tag Release**: Create git tag
4. **Deploy**: Automated deployment to production

## 🤝 Community Guidelines

### Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain professional communication

### Getting Help

- **Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Documentation**: Check existing docs first
- **Contact**: Reach out to maintainers

### Recognition

Contributors are recognized in:
- README.md contributors section
- Release notes
- Annual contributor highlights

## 📚 Additional Resources

### Development Tools

- **VS Code Extensions**:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

### Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

### API Documentation

- [Internal API Docs](./docs/API_DOCUMENTATION.md)
- [Database Schema](./docs/architecture/2-database-schema-design.md)

## 🐛 Reporting Issues

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
Clear description of the issue

**To Reproduce**
Steps to reproduce the behavior

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment**
- OS: [e.g. iOS]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem?**
Description of the problem

**Describe the solution you'd like**
Clear description of desired feature

**Additional context**
Any other context about the feature
```

## 📝 Documentation

### Documentation Standards

- Use clear, concise language
- Include code examples
- Keep docs up to date
- Follow markdown standards

### Documentation Types

1. **API Documentation**: Technical API references
2. **User Guides**: Step-by-step user instructions
3. **Architecture Docs**: System design and architecture
4. **Contribution Guides**: This document

---

**Thank you for contributing to GoCarbonTracker!** 🌍

For questions, reach out to the maintainers or create an issue.

**Last Updated**: January 22, 2025  
**Version**: 1.0  
**Maintainers**: Varun Moka and team