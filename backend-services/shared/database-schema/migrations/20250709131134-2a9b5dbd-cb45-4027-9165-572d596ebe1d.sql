-- Complete migration: Convert ENUM columns to TEXT
-- Handle both emissions_archetype column and archetype_name column

-- First, convert emissions_archetype column from enum to text
ALTER TABLE industry_taxonomy 
ALTER COLUMN emissions_archetype TYPE TEXT USING emissions_archetype::TEXT;

-- Convert archetype_name column in archetype_configurations from enum to text
ALTER TABLE archetype_configurations 
ALTER COLUMN archetype_name TYPE TEXT USING archetype_name::TEXT;

-- Update the get_user_role function to handle any enum casting issues (using CREATE OR REPLACE)
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS TEXT AS $$
  SELECT COALESCE(role::TEXT, 'user') FROM public.user_profiles WHERE id = user_uuid LIMIT 1;
$$ LANGUAGE SQL STABLE SECURITY DEFINER SET search_path TO 'public', 'pg_temp';

-- Ensure all text columns have proper constraints
ALTER TABLE industry_taxonomy 
ADD CONSTRAINT check_emissions_archetype_not_empty 
CHECK (emissions_archetype IS NOT NULL AND length(trim(emissions_archetype)) > 0);

ALTER TABLE archetype_configurations 
ADD CONSTRAINT check_archetype_name_not_empty 
CHECK (archetype_name IS NOT NULL AND length(trim(archetype_name)) > 0);