-- Create plastic packaging companies table
CREATE TABLE public.plastic_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('producer', 'converter', 'brand', 'waste-management')),
  specialization TEXT,
  description TEXT,
  logo_url TEXT,
  annual_polymer_usage BIGINT, -- in tonnes
  revenue_billions DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create plastic emissions table
CREATE TABLE public.plastic_emissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.plastic_companies(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  scope1_emissions BIGINT NOT NULL DEFAULT 0, -- in tCO2e
  scope2_emissions BIGINT NOT NULL DEFAULT 0, -- in tCO2e
  scope3_emissions BIGINT DEFAULT 0, -- in tCO2e
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, year)
);

-- Create plastic targets table
CREATE TABLE public.plastic_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.plastic_companies(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL, -- 'circular_commitment', 'recycled_content', 'reuse_rate', 'net_zero'
  target_value DECIMAL(5,2), -- percentage or year
  target_year INTEGER,
  description TEXT,
  status TEXT DEFAULT 'committed' CHECK (status IN ('committed', 'in_progress', 'achieved', 'missed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create KPI definitions table
CREATE TABLE public.plastic_kpi_definitions (
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
CREATE TABLE public.plastic_kpi_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.plastic_companies(id) ON DELETE CASCADE,
  kpi_definition_id UUID NOT NULL REFERENCES public.plastic_kpi_definitions(id) ON DELETE CASCADE,
  value DECIMAL(10,2) NOT NULL,
  year INTEGER NOT NULL DEFAULT 2023,
  benchmark_tier TEXT NOT NULL CHECK (benchmark_tier IN ('Leader', 'Above Average', 'Average', 'Below Average')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(company_id, kpi_definition_id, year)
);

-- Enable RLS on all tables
ALTER TABLE public.plastic_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plastic_emissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plastic_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plastic_kpi_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plastic_kpi_scores ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public read access
CREATE POLICY "Public read access to plastic companies" ON public.plastic_companies FOR SELECT USING (true);
CREATE POLICY "Public read access to plastic emissions" ON public.plastic_emissions FOR SELECT USING (true);
CREATE POLICY "Public read access to plastic targets" ON public.plastic_targets FOR SELECT USING (true);
CREATE POLICY "Public read access to plastic KPI definitions" ON public.plastic_kpi_definitions FOR SELECT USING (true);
CREATE POLICY "Public read access to plastic KPI scores" ON public.plastic_kpi_scores FOR SELECT USING (true);

-- Create policies for authenticated users to manage data
CREATE POLICY "Authenticated users can manage plastic companies" ON public.plastic_companies FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage plastic emissions" ON public.plastic_emissions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage plastic targets" ON public.plastic_targets FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage plastic KPI definitions" ON public.plastic_kpi_definitions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage plastic KPI scores" ON public.plastic_kpi_scores FOR ALL USING (auth.role() = 'authenticated');

-- Create update trigger for timestamps
CREATE TRIGGER update_plastic_companies_updated_at
  BEFORE UPDATE ON public.plastic_companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert KPI definitions
INSERT INTO public.plastic_kpi_definitions (kpi_name, category, unit, description, leader_threshold, above_average_threshold, average_threshold, higher_is_better) VALUES
-- Producer KPIs
('Bio-based Feedstock Ratio', 'producer', '%', 'Percentage of bio-based raw materials in production', 25, 15, 5, true),
('Carbon Intensity', 'producer', 'tCO₂e/ton', 'Carbon emissions per ton of polymer produced', 1.8, 2.5, 3.5, false),
('Renewable Energy Usage', 'producer', '%', 'Percentage of renewable energy in operations', 70, 50, 30, true),
('Recyclable Product Portfolio', 'producer', '%', 'Percentage of products designed for recyclability', 80, 65, 45, true),

-- Converter KPIs
('Material Efficiency', 'converter', '%', 'Waste reduction in manufacturing process', 85, 75, 60, true),
('Lightweighting Index', 'converter', '%', 'Weight reduction achieved in packaging design', 20, 15, 8, true),
('Recyclability Index', 'converter', 'score', 'Design score for end-of-life recyclability (0-100)', 85, 70, 50, true),
('Eco-design Portfolio Share', 'converter', '%', 'Share of products with eco-design principles', 60, 45, 25, true),

-- Brand KPIs
('Circular Content Ratio', 'brand', '%', 'Percentage of recycled content in packaging', 50, 30, 15, true),
('Packaging Intensity', 'brand', 'g/€', 'Grams of packaging per euro of revenue', 15, 25, 40, false),
('Reuse Rate', 'brand', '%', 'Percentage of reusable packaging systems', 30, 20, 5, true),
('EPR Responsibility Score', 'brand', 'score', 'Extended Producer Responsibility compliance (0-100)', 90, 75, 50, true),

-- Waste Management KPIs
('Recovery Efficiency', 'waste-management', '%', 'Percentage of plastic waste successfully recovered', 85, 70, 50, true),
('Output Quality', 'waste-management', '%', 'Percentage of food-grade quality recycled output', 70, 55, 35, true),
('Tech Innovation Index', 'waste-management', 'score', 'Technology adoption and innovation score (0-100)', 80, 65, 45, true),
('Collection Reach', 'waste-management', '%', 'Population coverage for plastic waste collection', 90, 75, 55, true);