-- Seed initial categories for the community platform
INSERT INTO community_categories (id, name, description, slug, color, is_active, sort_order) VALUES
  (gen_random_uuid(), 'Scope 3 Emissions', 'Discussions about indirect emissions and value chain impacts', 'scope-3-emissions', '#DC2626', true, 1),
  (gen_random_uuid(), 'Carbon Accounting', 'General carbon accounting methodologies and best practices', 'carbon-accounting', '#059669', true, 2),
  (gen_random_uuid(), 'Supply Chain Decarbonization', 'Strategies for reducing emissions across supply chains', 'supply-chain-decarbonization', '#2563EB', true, 3),
  (gen_random_uuid(), 'GHG Protocol', 'Guidelines and standards from the Greenhouse Gas Protocol', 'ghg-protocol', '#7C3AED', true, 4),
  (gen_random_uuid(), 'SBTi & Net Zero', 'Science-based targets and net-zero commitments', 'sbti-net-zero', '#EA580C', true, 5),
  (gen_random_uuid(), 'PCAF & Finance', 'Partnership for Carbon Accounting Financials and green finance', 'pcaf-finance', '#16A34A', true, 6),
  (gen_random_uuid(), 'Reporting & Compliance', 'CDP, TCFD, CSRD and other reporting frameworks', 'reporting-compliance', '#0891B2', true, 7),
  (gen_random_uuid(), 'Technology & Tools', 'Carbon management software and measurement tools', 'technology-tools', '#9333EA', true, 8),
  (gen_random_uuid(), 'Industry Specific', 'Sector-specific carbon accounting challenges and solutions', 'industry-specific', '#C2410C', true, 9),
  (gen_random_uuid(), 'General Discussion', 'Open discussions about sustainability and climate action', 'general-discussion', '#4B5563', true, 10);

-- Create a GCT expert user for seeding content
INSERT INTO community_users (id, email, username, display_name, is_gct_team, role, bio) VALUES
  ('550e8400-e29b-41d4-a716-446655440000', 'varun@gocarbontracker.com', 'varun_moka_gct', 'Varun Moka', true, 'expert', 'Carbon accounting expert and founder of GoCarbonTracker. Specializing in Scope 3 emissions and supply chain decarbonization.'),
  ('550e8400-e29b-41d4-a716-446655440001', 'linda@gocarbontracker.com', 'linda_gct_expert', 'Linda GCT Expert', true, 'expert', 'Senior carbon consultant with expertise in financial sector carbon accounting and PCAF methodology.');

-- Seed some welcome topics (get category IDs first)
WITH category_data AS (
  SELECT id, slug FROM community_categories 
  WHERE slug IN ('scope-3-emissions', 'carbon-accounting', 'general-discussion')
)
INSERT INTO community_topics (id, title, content, category_id, author_id, tags, is_pinned, view_count, reply_count) 
SELECT 
  gen_random_uuid(),
  CASE 
    WHEN cd.slug = 'general-discussion' THEN 'Welcome to GoCarbonTracker Community!'
    WHEN cd.slug = 'scope-3-emissions' THEN 'Understanding Scope 3 Categories: A Comprehensive Guide'
    WHEN cd.slug = 'carbon-accounting' THEN 'Best Practices for Carbon Data Collection and Management'
  END,
  CASE 
    WHEN cd.slug = 'general-discussion' THEN 'Welcome to the GoCarbonTracker Community! This is your space to connect with carbon accounting professionals worldwide, share insights, ask questions, and collaborate on solving the climate crisis. Please introduce yourself and let us know what brings you to our community.'
    WHEN cd.slug = 'scope-3-emissions' THEN 'Scope 3 emissions often represent the largest portion of a company''s carbon footprint. This comprehensive guide covers all 15 categories, calculation methodologies, and practical tips for data collection. What challenges have you faced with Scope 3 reporting?'
    WHEN cd.slug = 'carbon-accounting' THEN 'Effective carbon data collection is the foundation of accurate emissions reporting. This topic covers data quality principles, source identification, calculation methodologies, and tools for streamlining the process. Share your experiences and best practices here!'
  END,
  cd.id,
  '550e8400-e29b-41d4-a716-446655440000',
  CASE 
    WHEN cd.slug = 'general-discussion' THEN ARRAY['welcome', 'introductions', 'community']
    WHEN cd.slug = 'scope-3-emissions' THEN ARRAY['scope-3', 'value-chain', 'methodology', 'ghg-protocol']
    WHEN cd.slug = 'carbon-accounting' THEN ARRAY['data-collection', 'methodology', 'best-practices', 'tools']
  END,
  CASE WHEN cd.slug = 'general-discussion' THEN true ELSE false END,
  CASE 
    WHEN cd.slug = 'general-discussion' THEN 245
    WHEN cd.slug = 'scope-3-emissions' THEN 189
    WHEN cd.slug = 'carbon-accounting' THEN 156
  END,
  CASE 
    WHEN cd.slug = 'general-discussion' THEN 12
    WHEN cd.slug = 'scope-3-emissions' THEN 8
    WHEN cd.slug = 'carbon-accounting' THEN 6
  END
FROM category_data cd;