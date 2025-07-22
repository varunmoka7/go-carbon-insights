# TypeScript Guidelines - GoCarbonTracker

**Version**: 1.0  
**Date**: January 22, 2025  
**Owner**: Technical Team  

## 📋 Overview

This document establishes comprehensive TypeScript guidelines, patterns, and best practices for GoCarbonTracker development. It covers advanced typing strategies, architectural patterns, and code organization to ensure type safety, maintainability, and developer productivity.

## 🎯 TypeScript Configuration

### Project Configuration

#### tsconfig.json (Root)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    // Strict Type Checking
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    
    // Advanced Options
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "preserveConstEnums": true,
    
    // Path Mapping
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/hooks/*": ["hooks/*"],
      "@/utils/*": ["utils/*"],
      "@/types/*": ["types/*"],
      "@/api/*": ["api/*"]
    }
  },
  "include": [
    "src/**/*",
    "vite-env.d.ts"
  ],
  "exclude": [
    "node_modules",
    "dist",
    "build"
  ],
  "references": [
    {
      "path": "./forum-service/tsconfig.json"
    }
  ]
}
```

#### tsconfig.app.json (Frontend)
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "composite": true,
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "skipLibCheck": true,
    
    // Bundler mode
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    // React-specific
    "allowJs": false,
    "checkJs": false
  },
  "include": [
    "src"
  ]
}
```

### ESLint TypeScript Integration
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "@typescript-eslint/recommended-requiring-type-checking"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-non-null-assertion": "warn",
    "@typescript-eslint/strict-boolean-expressions": "error",
    "@typescript-eslint/prefer-nullish-coalescing": "error",
    "@typescript-eslint/prefer-optional-chain": "error"
  }
}
```

## 🔧 Type Definitions & Patterns

### Core Data Types

#### Domain Models
```typescript
// types/company.ts
export interface Company {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly industry: Industry;
  readonly country: CountryCode;
  readonly employeeCount: number | null;
  readonly revenue: Money | null;
  readonly foundedYear: number | null;
  readonly websiteUrl: URL | null;
  readonly description: string | null;
  readonly auditFields: AuditFields;
  readonly isDeleted: boolean;
}

// Branded types for better type safety
export type CompanyId = string & { readonly __brand: 'CompanyId' };
export type Industry = string & { readonly __brand: 'Industry' };
export type CountryCode = string & { readonly __brand: 'CountryCode' };

// Value objects
export interface Money {
  readonly amount: number;
  readonly currency: CurrencyCode;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY';

export interface AuditFields {
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly createdBy: UserId;
  readonly updatedBy: UserId;
}

// Factory functions with validation
export const createCompany = (data: CompanyInput): Result<Company, ValidationError> => {
  // Validation logic
  if (!data.name?.trim()) {
    return Result.error(new ValidationError('Company name is required'));
  }
  
  return Result.ok({
    id: generateId() as CompanyId,
    name: data.name.trim(),
    slug: createSlug(data.name),
    // ... other fields
  });
};
```

#### Emissions Data Types
```typescript
// types/emissions.ts
export interface EmissionRecord {
  readonly id: EmissionRecordId;
  readonly companyId: CompanyId;
  readonly year: ReportingYear;
  readonly scope1: EmissionValue;
  readonly scope2: EmissionValue;
  readonly scope3: Scope3Emissions;
  readonly dataQuality: DataQualityScore;
  readonly verificationStatus: VerificationStatus;
  readonly methodology: EmissionMethodology;
  readonly auditFields: AuditFields;
}

// Granular scope 3 breakdown
export interface Scope3Emissions {
  readonly category1: EmissionValue;  // Purchased goods and services
  readonly category2: EmissionValue;  // Capital goods
  readonly category3: EmissionValue;  // Fuel and energy activities
  readonly category4: EmissionValue;  // Upstream transportation
  readonly category5: EmissionValue;  // Waste generated in operations
  readonly category6: EmissionValue;  // Business travel
  readonly category7: EmissionValue;  // Employee commuting
  readonly category8: EmissionValue;  // Upstream leased assets
  readonly category9: EmissionValue;  // Downstream transportation
  readonly category10: EmissionValue; // Processing of sold products
  readonly category11: EmissionValue; // Use of sold products
  readonly category12: EmissionValue; // End-of-life treatment
  readonly category13: EmissionValue; // Downstream leased assets
  readonly category14: EmissionValue; // Franchises
  readonly category15: EmissionValue; // Investments
}

// Value objects with validation
export interface EmissionValue {
  readonly value: number;
  readonly unit: EmissionUnit;
  readonly uncertainty: number | null; // Percentage
}

export type EmissionUnit = 'tCO2e' | 'ktCO2e' | 'MtCO2e';
export type ReportingYear = number & { readonly __brand: 'ReportingYear' };
export type DataQualityScore = number & { readonly __brand: 'DataQualityScore' };

export const enum VerificationStatus {
  Pending = 'pending',
  Verified = 'verified',
  Rejected = 'rejected',
  ThirdPartyVerified = 'third_party_verified'
}

// Type guards
export const isValidReportingYear = (year: number): year is ReportingYear => {
  return year >= 1990 && year <= new Date().getFullYear();
};

export const isValidDataQualityScore = (score: number): score is DataQualityScore => {
  return score >= 0 && score <= 1;
};
```

### Advanced Typing Patterns

#### Utility Types
```typescript
// types/utils.ts

// Recursive partial for nested objects
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Make specific fields required
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Exclude null and undefined
export type NonNullable<T> = T extends null | undefined ? never : T;

// Create union from object values
export type ValueOf<T> = T[keyof T];

// Conditional types for API responses
export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

// Extract promise type
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

// Function type utilities
export type AsyncFunction<T extends readonly unknown[], R> = 
  (...args: T) => Promise<R>;

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type ChangeHandler<T = unknown> = (value: T) => void;

// Form field types
export type FormField<T> = {
  value: T;
  error: string | null;
  touched: boolean;
  validate: (value: T) => string | null;
};

// Component prop helpers
export type PropsWithClassName<T = {}> = T & { className?: string };
export type PropsWithChildren<T = {}> = T & { children?: React.ReactNode };

// State management types
export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// Result type for error handling
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };
```

#### Generic Constraints and Conditional Types
```typescript
// Advanced type patterns
export type EntityWithId = { id: string };

export type EntityList<T extends EntityWithId> = {
  items: T[];
  totalCount: number;
  hasNextPage: boolean;
};

// Conditional type for API endpoints
export type ApiEndpoint<T extends string> = 
  T extends `${infer Base}/list` 
    ? EntityList<EntityFromEndpoint<Base>>
    : T extends `${infer Base}/${string}`
    ? EntityFromEndpoint<Base>
    : never;

// Extract entity type from endpoint
type EntityFromEndpoint<T extends string> = 
  T extends 'companies' ? Company :
  T extends 'emissions' ? EmissionRecord :
  T extends 'users' ? User :
  never;

// Recursive key paths
export type KeyPath<T> = {
  [K in keyof T]: T[K] extends object 
    ? K | `${K & string}.${KeyPath<T[K]> & string}`
    : K;
}[keyof T];

// Type-safe object access
export const getValueByPath = <T, P extends KeyPath<T>>(
  obj: T,
  path: P
): PathValue<T, P> => {
  // Implementation with type safety
  return path.split('.').reduce((acc, key) => acc?.[key], obj) as PathValue<T, P>;
};

type PathValue<T, P extends string> = 
  P extends keyof T 
    ? T[P]
    : P extends `${infer K}.${infer Rest}`
    ? K extends keyof T
      ? PathValue<T[K], Rest>
      : never
    : never;
```

### Component Type Patterns

#### React Component Types
```typescript
// Component definition patterns
export interface BaseComponentProps {
  className?: string;
  'data-testid'?: string;
}

// Generic component with children
export interface LayoutProps extends BaseComponentProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
}

// Form component patterns
export interface FormFieldProps<T> extends BaseComponentProps {
  name: string;
  value: T;
  onChange: (value: T) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

// Render prop pattern
export interface DataProviderProps<T> {
  children: (data: AsyncState<T>) => React.ReactNode;
  url: string;
  dependencies?: unknown[];
}

// Higher-order component types
export type WithLoading<P> = P & {
  loading?: boolean;
};

export type WithError<P> = P & {
  error?: string | null;
};

// Component as prop
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  header?: React.ComponentType<{ onClose: () => void }>;
  footer?: React.ComponentType<{ onClose: () => void }>;
}

// Polymorphic component pattern
export interface PolymorphicProps<T extends React.ElementType = 'div'> {
  as?: T;
  children?: React.ReactNode;
}

export type PolymorphicComponentProps<
  T extends React.ElementType,
  P = {}
> = P & PolymorphicProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof P>;

// Usage example
export const Button = <T extends React.ElementType = 'button'>({
  as,
  children,
  ...props
}: PolymorphicComponentProps<T, { variant?: 'primary' | 'secondary' }>) => {
  const Component = as || 'button';
  return <Component {...props}>{children}</Component>;
};
```

#### Hook Type Patterns
```typescript
// Custom hook types
export interface UseApiOptions<T> {
  url: string;
  params?: Record<string, unknown>;
  dependencies?: React.DependencyList;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Generic data fetching hook
export const useApi = <T>(options: UseApiOptions<T>): UseApiReturn<T> => {
  // Implementation
};

// Form management hook
export interface UseFormOptions<T extends Record<string, unknown>> {
  initialValues: T;
  validationSchema?: ValidationSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  handleChange: <K extends keyof T>(field: K, value: T[K]) => void;
  handleBlur: (field: keyof T) => void;
  handleSubmit: () => Promise<void>;
  isValid: boolean;
  isSubmitting: boolean;
  reset: () => void;
}

// Local storage hook
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] => {
  // Implementation with type safety
};

// Debounced value hook
export const useDebounce = <T>(value: T, delay: number): T => {
  // Implementation
};
```

## 🏗️ Architecture Patterns

### Domain-Driven Design with TypeScript

#### Aggregates and Entities
```typescript
// domain/company/Company.ts
export class Company {
  private constructor(
    private readonly _id: CompanyId,
    private _name: string,
    private _industry: Industry,
    private _emissions: EmissionRecord[]
  ) {}

  public static create(data: CreateCompanyData): Result<Company, DomainError> {
    // Validation and business logic
    const validationResult = this.validate(data);
    if (!validationResult.isValid) {
      return Result.error(new ValidationError(validationResult.errors));
    }

    return Result.ok(new Company(
      CompanyId.generate(),
      data.name,
      data.industry,
      []
    ));
  }

  public addEmissionRecord(record: EmissionRecord): Result<void, DomainError> {
    // Business rules
    if (this.hasEmissionRecordForYear(record.year)) {
      return Result.error(new DomainError('Emission record already exists for this year'));
    }

    this._emissions.push(record);
    return Result.ok(undefined);
  }

  public calculateTotalEmissions(year: ReportingYear): EmissionValue {
    const record = this._emissions.find(e => e.year === year);
    if (!record) {
      throw new Error(`No emission record found for year ${year}`);
    }

    return {
      value: record.scope1.value + record.scope2.value + this.calculateScope3Total(record.scope3),
      unit: 'tCO2e' as EmissionUnit,
      uncertainty: null
    };
  }

  // Getters
  public get id(): CompanyId { return this._id; }
  public get name(): string { return this._name; }
  public get industry(): Industry { return this._industry; }
  public get emissions(): readonly EmissionRecord[] { return this._emissions; }

  private hasEmissionRecordForYear(year: ReportingYear): boolean {
    return this._emissions.some(record => record.year === year);
  }

  private calculateScope3Total(scope3: Scope3Emissions): number {
    return Object.values(scope3).reduce((total, emission) => total + emission.value, 0);
  }

  private static validate(data: CreateCompanyData): ValidationResult {
    // Validation logic
  }
}

// Value objects
export class CompanyId {
  private constructor(private readonly value: string) {}

  public static generate(): CompanyId {
    return new CompanyId(crypto.randomUUID());
  }

  public static fromString(value: string): Result<CompanyId, ValidationError> {
    if (!this.isValid(value)) {
      return Result.error(new ValidationError('Invalid company ID format'));
    }
    return Result.ok(new CompanyId(value));
  }

  public toString(): string {
    return this.value;
  }

  public equals(other: CompanyId): boolean {
    return this.value === other.value;
  }

  private static isValid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }
}
```

#### Repository Pattern
```typescript
// domain/company/CompanyRepository.ts
export interface CompanyRepository {
  findById(id: CompanyId): Promise<Company | null>;
  findBySlug(slug: string): Promise<Company | null>;
  findByIndustry(industry: Industry): Promise<Company[]>;
  save(company: Company): Promise<void>;
  delete(id: CompanyId): Promise<void>;
}

// infrastructure/CompanyRepositoryImpl.ts
export class SupabaseCompanyRepository implements CompanyRepository {
  constructor(private readonly client: SupabaseClient) {}

  public async findById(id: CompanyId): Promise<Company | null> {
    const { data, error } = await this.client
      .from('companies')
      .select(`
        *,
        emissions:emission_records(*)
      `)
      .eq('id', id.toString())
      .single();

    if (error || !data) {
      return null;
    }

    return this.toDomain(data);
  }

  public async save(company: Company): Promise<void> {
    const dto = this.toDto(company);
    
    const { error } = await this.client
      .from('companies')
      .upsert(dto);

    if (error) {
      throw new Error(`Failed to save company: ${error.message}`);
    }
  }

  private toDomain(dto: CompanyDto): Company {
    // Map from database DTO to domain object
  }

  private toDto(company: Company): CompanyDto {
    // Map from domain object to database DTO
  }
}
```

### Service Layer Pattern
```typescript
// application/CompanyService.ts
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly eventBus: EventBus
  ) {}

  public async createCompany(command: CreateCompanyCommand): Promise<Result<CompanyId, ServiceError>> {
    // Check if company already exists
    const existingCompany = await this.companyRepository.findBySlug(command.slug);
    if (existingCompany) {
      return Result.error(new ServiceError('Company with this slug already exists'));
    }

    // Create company aggregate
    const companyResult = Company.create({
      name: command.name,
      industry: command.industry,
      // ... other fields
    });

    if (!companyResult.success) {
      return Result.error(new ServiceError(companyResult.error.message));
    }

    const company = companyResult.data;

    // Save to repository
    await this.companyRepository.save(company);

    // Publish domain event
    await this.eventBus.publish(new CompanyCreatedEvent({
      companyId: company.id,
      name: company.name,
      industry: company.industry,
      createdAt: new Date()
    }));

    return Result.ok(company.id);
  }

  public async addEmissionRecord(
    companyId: CompanyId,
    command: AddEmissionRecordCommand
  ): Promise<Result<void, ServiceError>> {
    // Load company aggregate
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      return Result.error(new ServiceError('Company not found'));
    }

    // Create emission record
    const emissionRecord = EmissionRecord.create({
      companyId,
      year: command.year,
      scope1: command.scope1,
      scope2: command.scope2,
      scope3: command.scope3,
      methodology: command.methodology
    });

    if (!emissionRecord.success) {
      return Result.error(new ServiceError(emissionRecord.error.message));
    }

    // Add to aggregate
    const addResult = company.addEmissionRecord(emissionRecord.data);
    if (!addResult.success) {
      return Result.error(new ServiceError(addResult.error.message));
    }

    // Save aggregate
    await this.companyRepository.save(company);

    return Result.ok(undefined);
  }
}
```

## 🔍 Type Safety Best Practices

### Strict Type Checking

#### Null Safety
```typescript
// Use strict null checks
function processCompany(company: Company | null): string {
  // Type guard
  if (company === null) {
    return 'No company provided';
  }

  // TypeScript knows company is not null here
  return company.name;
}

// Nullish coalescing
const companyName = company?.name ?? 'Unknown Company';

// Optional chaining with type safety
const emissionValue = company?.emissions?.[0]?.scope1?.value;

// Type assertion with validation
function assertIsCompany(value: unknown): asserts value is Company {
  if (typeof value !== 'object' || value === null || !('id' in value)) {
    throw new Error('Value is not a Company');
  }
}
```

#### Discriminated Unions
```typescript
// API response types
export type ApiResponse<T> = 
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
  | { status: 'loading' };

// Type-safe response handling
function handleApiResponse<T>(response: ApiResponse<T>): void {
  switch (response.status) {
    case 'success':
      // TypeScript knows response.data exists
      console.log(response.data);
      break;
    case 'error':
      // TypeScript knows response.error exists
      console.error(response.error);
      break;
    case 'loading':
      // TypeScript knows this is loading state
      console.log('Loading...');
      break;
    default:
      // Exhaustive check - TypeScript will error if we miss a case
      const _exhaustive: never = response;
      break;
  }
}

// Form field state
export type FieldState<T> = 
  | { type: 'pristine'; value: T }
  | { type: 'dirty'; value: T; initialValue: T }
  | { type: 'error'; value: T; error: string }
  | { type: 'validating'; value: T };
```

### Error Handling Patterns

#### Result Type Pattern
```typescript
// Result type for error handling
export abstract class Result<T, E> {
  public abstract isSuccess(): this is Success<T, E>;
  public abstract isFailure(): this is Failure<T, E>;
  
  public static ok<T, E>(value: T): Result<T, E> {
    return new Success(value);
  }
  
  public static error<T, E>(error: E): Result<T, E> {
    return new Failure(error);
  }
  
  public map<U>(fn: (value: T) => U): Result<U, E> {
    return this.isSuccess() 
      ? Result.ok(fn(this.value))
      : Result.error(this.error);
  }
  
  public flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    return this.isSuccess() 
      ? fn(this.value)
      : Result.error(this.error);
  }
}

class Success<T, E> extends Result<T, E> {
  constructor(public readonly value: T) {
    super();
  }
  
  public isSuccess(): this is Success<T, E> {
    return true;
  }
  
  public isFailure(): this is Failure<T, E> {
    return false;
  }
}

class Failure<T, E> extends Result<T, E> {
  constructor(public readonly error: E) {
    super();
  }
  
  public isSuccess(): this is Success<T, E> {
    return false;
  }
  
  public isFailure(): this is Failure<T, E> {
    return true;
  }
}

// Usage
const result = await fetchCompany(companyId);
if (result.isSuccess()) {
  console.log(result.value.name);
} else {
  console.error(result.error);
}
```

#### Async Error Handling
```typescript
// Async Result type
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

export const tryCatch = async <T>(
  fn: () => Promise<T>
): AsyncResult<T, Error> => {
  try {
    const result = await fn();
    return Result.ok(result);
  } catch (error) {
    return Result.error(error instanceof Error ? error : new Error(String(error)));
  }
};

// Usage in service
export class CompanyService {
  public async getCompany(id: CompanyId): AsyncResult<Company, ServiceError> {
    const result = await tryCatch(() => this.companyRepository.findById(id));
    
    if (result.isFailure()) {
      return Result.error(new ServiceError(`Failed to fetch company: ${result.error.message}`));
    }
    
    if (result.value === null) {
      return Result.error(new ServiceError('Company not found'));
    }
    
    return Result.ok(result.value);
  }
}
```

## 📊 Performance & Optimization

### Type-Level Performance

#### Efficient Type Definitions
```typescript
// Use const assertions for better performance
export const EMISSION_CATEGORIES = [
  'purchased_goods_services',
  'capital_goods',
  'fuel_energy_activities',
  // ... more categories
] as const;

export type EmissionCategory = typeof EMISSION_CATEGORIES[number];

// Use mapped types efficiently
export type EmissionCategoryData = {
  [K in EmissionCategory]: EmissionValue;
};

// Avoid deep recursion in types
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Use template literal types efficiently
export type APIEndpoint = `/api/${'companies' | 'emissions' | 'users'}/${string}`;
```

#### Conditional Type Optimization
```typescript
// Optimize conditional types
export type NonNullable<T> = T extends null | undefined ? never : T;

// Use distributive conditional types carefully
export type ToArray<T> = T extends unknown ? T[] : never;

// Tail recursion optimization for recursive types
export type Join<T extends readonly string[], D extends string = ','> = 
  T extends readonly [infer F, ...infer R]
    ? F extends string
      ? R extends readonly string[]
        ? R['length'] extends 0
          ? F
          : `${F}${D}${Join<R, D>}`
        : F
      : never
    : '';
```

## 🧪 Testing TypeScript Code

### Type Testing
```typescript
// Type assertions for testing
import { expectType, expectError, expectAssignable } from 'tsd';

// Test type compatibility
expectType<Company>(mockCompany);
expectAssignable<CompanyId>(validCompanyId);
expectError<CompanyId>(invalidId);

// Test generic types
expectType<ApiResponse<Company[]>>(companyListResponse);

// Test conditional types
type TestConditional = EmissionUnit extends 'tCO2e' ? true : false;
expectType<true>(true as TestConditional);
```

### Runtime Type Validation
```typescript
// Runtime validation with Zod
import { z } from 'zod';

export const CompanySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  industry: z.string(),
  employeeCount: z.number().int().positive().nullable(),
  revenue: z.object({
    amount: z.number().positive(),
    currency: z.enum(['USD', 'EUR', 'GBP', 'JPY'])
  }).nullable(),
});

export type Company = z.infer<typeof CompanySchema>;

// Validation function
export const validateCompany = (data: unknown): Result<Company, ValidationError> => {
  try {
    const company = CompanySchema.parse(data);
    return Result.ok(company);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Result.error(new ValidationError(error.message));
    }
    return Result.error(new ValidationError('Unknown validation error'));
  }
};
```

## 📚 Resources & References

### TypeScript Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### Best Practices
- [TypeScript Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Tools & Libraries
- [Zod](https://zod.dev/) - Runtime type validation
- [tsd](https://github.com/SamVerschueren/tsd) - Type testing
- [ts-pattern](https://github.com/gvergnaud/ts-pattern) - Pattern matching

---

**Last Updated**: January 22, 2025  
**Version**: 1.0  
**Maintained by**: Technical Team

TypeScript guidelines ensure type safety, maintainability, and developer productivity across the entire GoCarbonTracker codebase.