# Testing Strategy - GoCarbonTracker

**Version**: 1.0  
**Date**: January 22, 2025  
**Owner**: Technical Team  

## 📋 Overview

This document outlines the comprehensive testing strategy for GoCarbonTracker, ensuring high code quality, reliability, and user satisfaction through systematic testing approaches.

## 🎯 Testing Objectives

### Primary Goals
- **Quality Assurance**: Maintain 90%+ code reliability
- **User Experience**: Ensure seamless user interactions
- **Data Integrity**: Validate emissions data accuracy
- **Performance**: Maintain responsive application performance
- **Security**: Protect sensitive climate data

### Success Metrics
- **Code Coverage**: >80% overall, >90% for critical paths
- **Test Execution Time**: <5 minutes for full suite
- **Bug Detection**: Catch 95% of issues before production
- **Performance**: Page load times <2 seconds

## 🏗️ Testing Pyramid

### 1. Unit Tests (70% of tests)
**Purpose**: Test individual functions and components in isolation

**Scope**:
- Utility functions
- Data transformations
- Component logic
- Custom hooks
- API service functions

**Tools**:
- **Vitest**: Fast unit test runner
- **Testing Library**: React component testing
- **MSW**: API mocking

**Coverage Targets**:
- Utility functions: 95%
- Components: 85%
- Hooks: 90%

```typescript
// Example: Unit test for emission calculation
describe('calculateEmissionIntensity', () => {
  it('should calculate correct CO2 intensity per revenue', () => {
    const result = calculateEmissionIntensity(1000, 500000);
    expect(result).toBe(0.002);
  });

  it('should handle zero revenue gracefully', () => {
    const result = calculateEmissionIntensity(1000, 0);
    expect(result).toBe(0);
  });
});
```

### 2. Integration Tests (20% of tests)
**Purpose**: Test component interactions and data flow

**Scope**:
- API integrations
- Database operations
- Component communication
- User workflows
- State management

**Tools**:
- **Vitest**: Integration test framework
- **Supabase Test Client**: Database testing
- **React Testing Library**: Component integration

```typescript
// Example: Integration test for emissions dashboard
describe('EmissionsDashboard Integration', () => {
  it('should load and display company emissions data', async () => {
    const user = userEvent.setup();
    
    render(<EmissionsDashboard companyId="test-123" />);
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('Loading...')).not.toBeInTheDocument();
    });
    
    // Verify data display
    expect(screen.getByText('Scope 1: 1,000 tCO₂e')).toBeInTheDocument();
  });
});
```

### 3. End-to-End Tests (10% of tests)
**Purpose**: Test complete user journeys

**Scope**:
- User authentication flows
- Data input workflows
- Report generation
- Critical business processes

**Tools**:
- **Playwright**: E2E testing framework
- **Headless browsers**: Chrome, Firefox, Safari

```javascript
// Example: E2E test for user login
test('user can login and access dashboard', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('[data-testid=email]', 'test@example.com');
  await page.fill('[data-testid=password]', 'password');
  await page.click('[data-testid=login-button]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('[data-testid=welcome-message]')).toBeVisible();
});
```

## 🔧 Testing Tools & Setup

### Core Testing Stack

#### Frontend Testing
```json
{
  "vitest": "^3.2.4",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.6.3",
  "@testing-library/user-event": "^14.6.1",
  "msw": "^2.10.4"
}
```

#### Configuration Files

**vitest.config.ts**:
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  }
});
```

**Test Setup (src/test/setup.ts)**:
```typescript
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// MSW Setup
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock environment variables
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

### Backend Testing (Forum Service)

**Jest Configuration**:
```json
{
  "testEnvironment": "node",
  "setupFilesAfterEnv": ["<rootDir>/tests/setup.ts"],
  "collectCoverageFrom": [
    "src/**/*.{js,ts}",
    "!src/**/*.d.ts"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

## 📊 Test Organization

### Directory Structure
```
src/
├── test/
│   ├── setup.ts              # Test configuration
│   ├── utils.tsx             # Test utilities
│   ├── mocks/
│   │   ├── server.ts         # MSW server setup
│   │   ├── handlers.ts       # API mock handlers
│   │   └── data.ts           # Mock data
│   └── __tests__/
│       ├── components/       # Component tests
│       ├── hooks/           # Hook tests
│       ├── utils/           # Utility tests
│       └── integration/     # Integration tests
```

### Naming Conventions

**Test Files**:
- Unit tests: `ComponentName.test.tsx`
- Integration tests: `FeatureName.integration.test.tsx`
- E2E tests: `workflow-name.e2e.test.ts`

**Test Names**:
```typescript
describe('ComponentName', () => {
  describe('when condition', () => {
    it('should expected behavior', () => {
      // Test implementation
    });
  });
});
```

## 🎯 Testing Guidelines

### Unit Testing Best Practices

#### Component Testing
```typescript
// ✅ Good: Test behavior, not implementation
it('should show loading state while fetching data', () => {
  render(<EmissionChart loading={true} />);
  expect(screen.getByText('Loading...')).toBeInTheDocument();
});

// ❌ Bad: Testing implementation details
it('should call useEffect on mount', () => {
  const spy = vi.spyOn(React, 'useEffect');
  render(<EmissionChart />);
  expect(spy).toHaveBeenCalled();
});
```

#### Hook Testing
```typescript
// Custom hook testing
const { result } = renderHook(() => useEmissionData('company-123'));

await waitFor(() => {
  expect(result.current.data).toBeDefined();
});
```

#### Async Testing
```typescript
// Async operations
it('should handle API errors gracefully', async () => {
  server.use(
    rest.get('/api/emissions', (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );
  
  render(<EmissionsDashboard />);
  
  await waitFor(() => {
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });
});
```

### Integration Testing

#### API Integration
```typescript
describe('Emissions API Integration', () => {
  it('should fetch and transform emissions data correctly', async () => {
    const mockData = {
      scope1: 1000,
      scope2: 2000,
      scope3: 3000
    };
    
    server.use(
      rest.get('/api/emissions', (req, res, ctx) => {
        return res(ctx.json(mockData));
      })
    );
    
    const result = await fetchEmissionsData('company-123');
    
    expect(result).toEqual({
      total: 6000,
      breakdown: mockData
    });
  });
});
```

#### Database Testing
```typescript
describe('Database Operations', () => {
  beforeEach(async () => {
    await resetTestDatabase();
  });
  
  it('should create and retrieve emission records', async () => {
    const emissionData = {
      company_id: 'test-123',
      scope1: 1000,
      year: 2024
    };
    
    const created = await createEmissionRecord(emissionData);
    const retrieved = await getEmissionRecord(created.id);
    
    expect(retrieved).toMatchObject(emissionData);
  });
});
```

### E2E Testing

#### Page Object Model
```typescript
class DashboardPage {
  constructor(public page: Page) {}
  
  async navigateTo() {
    await this.page.goto('/dashboard');
  }
  
  async selectCompany(companyName: string) {
    await this.page.selectOption('[data-testid=company-select]', companyName);
  }
  
  async getEmissionValue(scope: string) {
    return await this.page.textContent(`[data-testid=${scope}-emissions]`);
  }
}
```

#### Critical Workflows
```typescript
test('complete emissions reporting workflow', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  
  // Login
  await page.goto('/login');
  await page.fill('[data-testid=email]', 'test@example.com');
  await page.fill('[data-testid=password]', 'password');
  await page.click('[data-testid=login-button]');
  
  // Navigate to dashboard
  await dashboard.navigateTo();
  
  // Select company
  await dashboard.selectCompany('Test Company');
  
  // Add emission data
  await page.click('[data-testid=add-emission-button]');
  await page.fill('[data-testid=scope1-input]', '1000');
  await page.fill('[data-testid=scope2-input]', '2000');
  await page.click('[data-testid=save-button]');
  
  // Verify data saved
  await expect(page.locator('[data-testid=success-message]')).toBeVisible();
  
  // Generate report
  await page.click('[data-testid=generate-report-button]');
  await expect(page.locator('[data-testid=report-download]')).toBeVisible();
});
```

## 📈 Test Coverage & Quality

### Coverage Requirements

#### Overall Coverage Targets
- **Lines**: 80% minimum, 90% target
- **Functions**: 85% minimum, 95% target
- **Branches**: 75% minimum, 85% target
- **Statements**: 80% minimum, 90% target

#### Critical Path Coverage
- Authentication: 95%
- Data validation: 95%
- Emission calculations: 98%
- API endpoints: 90%

### Quality Metrics

#### Test Quality Indicators
- **Test Reliability**: <1% flaky test rate
- **Test Speed**: <5 minutes full suite
- **Maintainability**: Clear, readable tests
- **Coverage Accuracy**: Meaningful assertions

### Coverage Reporting

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html

# Coverage for specific files
npm run test:coverage -- src/utils/calculations.ts
```

## 🔄 Continuous Integration

### GitHub Actions Workflow

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Pre-commit Hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged && npm run test:changed",
      "pre-push": "npm run test:coverage"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

## 🚀 Test Execution

### Development Workflow

#### Local Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test EmissionChart.test.tsx

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

#### Test Categories
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only
npm run test:e2e

# Smoke tests (quick validation)
npm run test:smoke
```

### Production Testing

#### Staging Environment
- Full test suite before deployment
- Performance testing
- Security testing
- User acceptance testing

#### Production Monitoring
- Health checks
- Error tracking
- Performance monitoring
- User behavior analytics

## 🛠️ Test Data Management

### Mock Data Strategy

#### Static Mocks
```typescript
// src/test/mocks/data.ts
export const mockEmissionData = {
  scope1: 1000,
  scope2: 2000,
  scope3: 3000,
  year: 2024,
  verified: true
};

export const mockCompanies = [
  {
    id: 'company-1',
    name: 'Test Company',
    industry: 'Manufacturing'
  }
];
```

#### Dynamic Mocks
```typescript
// MSW handlers
export const handlers = [
  rest.get('/api/emissions', (req, res, ctx) => {
    const companyId = req.url.searchParams.get('companyId');
    
    return res(
      ctx.json(generateEmissionData(companyId))
    );
  }),
];
```

### Test Database

#### Setup
```typescript
// Database seeding for tests
export async function seedTestDatabase() {
  await supabase.from('companies').insert(mockCompanies);
  await supabase.from('emissions').insert(mockEmissionData);
}

export async function resetTestDatabase() {
  await supabase.from('emissions').delete().neq('id', '');
  await supabase.from('companies').delete().neq('id', '');
}
```

## 📋 Testing Checklist

### Pre-Release Testing

#### Functional Testing
- [ ] All user stories tested
- [ ] Edge cases covered
- [ ] Error scenarios validated
- [ ] Data integrity verified

#### Non-Functional Testing
- [ ] Performance benchmarks met
- [ ] Security vulnerabilities scanned
- [ ] Accessibility standards met
- [ ] Browser compatibility verified

#### Regression Testing
- [ ] Existing functionality unaffected
- [ ] Previous bug fixes validated
- [ ] Integration points tested
- [ ] Data migration tested

### Code Review Testing
- [ ] Tests added for new features
- [ ] Test coverage maintained
- [ ] Test quality validated
- [ ] Performance impact assessed

## 🐛 Debugging & Troubleshooting

### Common Issues

#### Flaky Tests
```typescript
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Data loaded')).toBeInTheDocument();
}, { timeout: 5000 });

// Avoid testing implementation details
// ✅ Test behavior
expect(screen.getByRole('button')).toBeEnabled();
// ❌ Test implementation
expect(component.state.isLoading).toBe(false);
```

#### Mock Issues
```typescript
// Reset mocks between tests
afterEach(() => {
  vi.clearAllMocks();
});

// Mock external dependencies properly
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => mockSupabaseClient)
}));
```

### Test Debugging

#### Debug Tools
```bash
# Run tests in debug mode
npm run test:debug

# Run specific test with verbose output
npm run test -- --verbose ComponentName.test.tsx

# Run tests with browser devtools
npm run test:ui
```

## 📚 Resources & Training

### Documentation
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/)
- [MSW Documentation](https://mswjs.io/)
- [Playwright Documentation](https://playwright.dev/)

### Best Practices
- [Kent C. Dodds Testing Articles](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Testing Trophy Strategy](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)

### Internal Resources
- [Component Testing Examples](./examples/component-testing.md)
- [API Testing Guide](./examples/api-testing.md)
- [E2E Testing Patterns](./examples/e2e-patterns.md)

---

**Last Updated**: January 22, 2025  
**Version**: 1.0  
**Maintained by**: Technical Team

For questions about testing strategy, create an issue or contact the technical team.