-- Create plastic packaging companies table
CREATE TABLE plastic_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('producer', 'converter', 'brand', 'waste-management')),
  specialization TEXT,
  description TEXT,
  logo_url TEXT,
  annual_polymer_usage BIGINT,
  revenue_billions DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plastic emissions table
CREATE TABLE plastic_emissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES plastic_companies(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  scope1_emissions BIGINT NOT NULL DEFAULT 0,
  scope2_emissions BIGINT NOT NULL DEFAULT 0,
  scope3_emissions BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, year)
);

-- Create plastic targets table
CREATE TABLE plastic_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES plastic_companies(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_value DECIMAL(5,2),
  target_year INTEGER,
  description TEXT,
  status TEXT DEFAULT 'committed' CHECK (status IN ('committed', 'in_progress', 'achieved', 'missed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create KPI definitions table
CREATE TABLE plastic_kpi_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('producer', 'converter', 'brand', 'waste-management')),
  unit TEXT NOT NULL,
  description TEXT,
  leader_threshold DECIMAL(10,2),
  above_average_threshold DECIMAL(10,2),
  average_threshold DECIMAL(10,2),
  higher_is_better BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(kpi_name, category)
);

-- Create KPI scores table
CREATE TABLE plastic_kpi_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES plastic_companies(id) ON DELETE CASCADE,
  kpi_definition_id UUID NOT NULL REFERENCES plastic_kpi_definitions(id) ON DELETE CASCADE,
  value DECIMAL(10,2) NOT NULL,
  year INTEGER NOT NULL DEFAULT 2023,
  benchmark_tier TEXT NOT NULL CHECK (benchmark_tier IN ('Leader', 'Above Average', 'Average', 'Below Average')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, kpi_definition_id, year)
);

-- Enable RLS
ALTER TABLE plastic_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plastic_kpi_scores ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read access" ON plastic_companies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON plastic_emissions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON plastic_targets FOR SELECT USING (true);
CREATE POLICY "Public read access" ON plastic_kpi_definitions FOR SELECT USING (true);
CREATE POLICY "Public read access" ON plastic_kpi_scores FOR SELECT USING (true);

-- Authenticated write policies
CREATE POLICY "Authenticated users can manage" ON plastic_companies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage" ON plastic_emissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage" ON plastic_targets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage" ON plastic_kpi_definitions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage" ON plastic_kpi_scores FOR ALL USING (auth.role() = 'authenticated');