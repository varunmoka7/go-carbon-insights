// ESG Data Types and Interfaces
// Epic 2, Story 2.13: Core ESG Database Schema Implementation

export interface Company {
  id: string;
  name: string;
  sector: string;
  industry: string;
  headquarters?: string;
  country?: string;
  employees?: number;
  revenue?: number; // in millions USD
  market_cap?: number; // in millions USD
  currency: string;
  sustainability_rating?: SustainabilityRating;
  sbti_committed: boolean;
  net_zero_target?: number; // target year
  carbon_neutral: boolean;
  data_quality_score: number; // 0.00 to 1.00
  verification_status: VerificationStatus;
  last_data_update?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface EmissionsData {
  id: string;
  company_id: string;
  year: number;
  scope1: number;
  scope2: number;
  scope3: number;
  total_emissions: number; // Generated column
  emissions_intensity?: number; // tCO2e per million USD revenue
  emissions_per_employee?: number; // tCO2e per employee
  data_source: string;
  verification_status: VerificationStatus;
  verification_date?: string;
  verified_by?: string;
  reporting_standard?: string;
  boundary_setting?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface SBTiTarget {
  id: string;
  company_id: string;
  near_term_target?: string;
  long_term_target?: string;
  baseline_year: number;
  target_year: number;
  scope1_reduction?: number; // percentage
  scope3_reduction?: number; // percentage
  overall_reduction?: number; // percentage
  validation_status: SBTiValidationStatus;
  validation_date?: string;
  sbti_id?: string;
  current_progress: number; // percentage
  on_track: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface CompanyFramework {
  id: string;
  company_id: string;
  framework_name: FrameworkName;
  status: FrameworkStatus;
  implementation_date?: string;
  verification_date?: string;
  score?: number; // 0-100
  level?: string;
  certification_number?: string;
  certifying_body?: string;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface SustainabilityMetric {
  id: string;
  company_id: string;
  metric_type: MetricType;
  value: number;
  unit: string;
  year: number;
  data_source: string;
  verification_status: VerificationStatus;
  confidence_level: number; // 0.00 to 1.00
  scope?: string;
  methodology?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  changed_fields?: string[];
  user_id?: string;
  user_email?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Enums and type definitions
export type SustainabilityRating = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D' | 'F';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type SBTiValidationStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export type FrameworkName = 
  | 'GRI' | 'SASB' | 'TCFD' | 'CDP' | 'UNGC' | 'ISO 14001' | 'ISO 50001'
  | 'B Corp' | 'LEED' | 'WELL' | 'BREEAM' | 'GRESB' | 'DJSI' | 'MSCI ESG';

export type FrameworkStatus = 'Implemented' | 'In Progress' | 'Planned' | 'Not Started';

export type MetricType = 
  | 'renewable_energy_percentage' | 'water_usage' | 'waste_generated'
  | 'carbon_credits' | 'materiality_score' | 'energy_efficiency'
  | 'water_intensity' | 'waste_intensity' | 'recycling_rate'
  | 'supplier_decarbonization' | 'green_buildings' | 'electric_vehicles';

// Materialized view types
export interface CompanyEmissionsSummary {
  id: string;
  name: string;
  sector: string;
  industry: string;
  sustainability_rating?: SustainabilityRating;
  sbti_committed: boolean;
  net_zero_target?: number;
  data_quality_score: number;
  year?: number;
  scope1?: number;
  scope2?: number;
  scope3?: number;
  total_emissions?: number;
  emissions_intensity?: number;
  verification_status?: VerificationStatus;
}

export interface SectorBenchmark {
  sector: string;
  company_count: number;
  avg_emissions?: number;
  avg_intensity?: number;
  avg_quality_score?: number;
  sbti_committed_count: number;
}

// API request/response types
export interface CreateCompanyRequest {
  name: string;
  sector: string;
  industry: string;
  headquarters?: string;
  country?: string;
  employees?: number;
  revenue?: number;
  market_cap?: number;
  currency?: string;
  sustainability_rating?: SustainabilityRating;
  sbti_committed?: boolean;
  net_zero_target?: number;
  carbon_neutral?: boolean;
}

export interface UpdateCompanyRequest extends Partial<CreateCompanyRequest> {
  id: string;
}

export interface CreateEmissionsRequest {
  company_id: string;
  year: number;
  scope1?: number;
  scope2?: number;
  scope3?: number;
  emissions_intensity?: number;
  emissions_per_employee?: number;
  data_source: string;
  reporting_standard?: string;
  boundary_setting?: string;
  notes?: string;
}

export interface UpdateEmissionsRequest extends Partial<CreateEmissionsRequest> {
  id: string;
}

export interface CreateSBTiTargetRequest {
  company_id: string;
  near_term_target?: string;
  long_term_target?: string;
  baseline_year: number;
  target_year: number;
  scope1_reduction?: number;
  scope3_reduction?: number;
  overall_reduction?: number;
}

export interface UpdateSBTiTargetRequest extends Partial<CreateSBTiTargetRequest> {
  id: string;
}

export interface CreateFrameworkRequest {
  company_id: string;
  framework_name: FrameworkName;
  status?: FrameworkStatus;
  implementation_date?: string;
  verification_date?: string;
  score?: number;
  level?: string;
  certification_number?: string;
  certifying_body?: string;
  expiry_date?: string;
}

export interface UpdateFrameworkRequest extends Partial<CreateFrameworkRequest> {
  id: string;
}

export interface CreateMetricRequest {
  company_id: string;
  metric_type: MetricType;
  value: number;
  unit: string;
  year: number;
  data_source: string;
  confidence_level?: number;
  scope?: string;
  methodology?: string;
  notes?: string;
}

export interface UpdateMetricRequest extends Partial<CreateMetricRequest> {
  id: string;
}

// Query and filter types
export interface CompanyFilters {
  sector?: string;
  industry?: string;
  sustainability_rating?: SustainabilityRating;
  sbti_committed?: boolean;
  country?: string;
  search?: string;
}

export interface EmissionsFilters {
  company_id?: string;
  year?: number;
  year_from?: number;
  year_to?: number;
  verification_status?: VerificationStatus;
  data_source?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Analytics and reporting types
export interface EmissionsAnalytics {
  total_companies: number;
  total_emissions: number;
  avg_emissions_per_company: number;
  emissions_by_scope: {
    scope1: number;
    scope2: number;
    scope3: number;
  };
  emissions_by_sector: Record<string, number>;
  emissions_trend: Array<{
    year: number;
    total_emissions: number;
    company_count: number;
  }>;
}

export interface CompanyAnalytics {
  company_id: string;
  company_name: string;
  emissions_history: EmissionsData[];
  sbti_targets: SBTiTarget[];
  frameworks: CompanyFramework[];
  metrics: SustainabilityMetric[];
  peer_comparison: {
    sector_rank: number;
    sector_avg_emissions: number;
    sector_avg_intensity: number;
  };
}