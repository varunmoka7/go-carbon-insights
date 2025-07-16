-- Enable Row Level Security (RLS) on all relevant tables
ALTER TABLE public.industry_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emissions_archetypes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.archetype_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taxonomy_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.industry_tag_assignments ENABLE ROW LEVEL SECURITY;

-- Public read access for open data tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Public read access' AND tablename = 'industry_taxonomy'
  ) THEN
    CREATE POLICY "Public read access" ON public.industry_taxonomy FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Public read access' AND tablename = 'emissions_archetypes'
  ) THEN
    CREATE POLICY "Public read access" ON public.emissions_archetypes FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Public read access' AND tablename = 'archetype_configurations'
  ) THEN
    CREATE POLICY "Public read access" ON public.archetype_configurations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Public read access' AND tablename = 'industry_tags'
  ) THEN
    CREATE POLICY "Public read access" ON public.industry_tags FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Public read access' AND tablename = 'company_industries'
  ) THEN
    CREATE POLICY "Public read access" ON public.company_industries FOR SELECT USING (true);
  END IF;
END $$;

-- Secure admin-only tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Admin only access' AND tablename = 'taxonomy_audit_log'
  ) THEN
    CREATE POLICY "Admin only access" ON public.taxonomy_audit_log FOR ALL USING (get_user_role(auth.uid()) = 'admin');
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE polname = 'Admin only manage tags' AND tablename = 'industry_tag_assignments'
  ) THEN
    CREATE POLICY "Admin only manage tags" ON public.industry_tag_assignments FOR ALL USING (get_user_role(auth.uid()) = 'admin');
  END IF;
END $$; 