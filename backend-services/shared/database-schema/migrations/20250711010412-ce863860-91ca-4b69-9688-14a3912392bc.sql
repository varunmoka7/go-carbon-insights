-- Seed community platform with initial data

-- Insert categories
INSERT INTO public.community_categories (name, description, slug, color, icon, sort_order) VALUES
('Scope 3 Emissions', 'Discussions about supply chain and value chain emissions tracking', 'scope-3-emissions', '#059669', 'TrendingUp', 1),
('Carbon Accounting', 'Best practices for carbon accounting methodologies and standards', 'carbon-accounting', '#0891b2', 'Calculator', 2),
('Supply Chain Decarbonization', 'Strategies and technologies for reducing supply chain emissions', 'supply-chain-decarbonization', '#7c3aed', 'Truck', 3),
('ESG Reporting', 'Environmental, Social, and Governance reporting frameworks and compliance', 'esg-reporting', '#dc2626', 'FileText', 4),
('Science-Based Targets', 'SBTi guidelines, target setting, and progress tracking', 'science-based-targets', '#ea580c', 'Target', 5),
('Climate Technologies', 'Emerging technologies for climate action and decarbonization', 'climate-technologies', '#16a34a', 'Zap', 6),
('Industry Benchmarking', 'Sector-specific emission benchmarks and performance comparisons', 'industry-benchmarking', '#9333ea', 'BarChart3', 7),
('Regulatory Updates', 'Latest climate regulations, policies, and compliance requirements', 'regulatory-updates', '#be123c', 'Scale', 8),
('Data & Analytics', 'Tools, platforms, and methodologies for emissions data analysis', 'data-analytics', '#0369a1', 'Database', 9),
('Community Support', 'General questions, introductions, and platform support', 'community-support', '#64748b', 'Users', 10);

-- Insert expert users (GCT team)
INSERT INTO public.community_users (id, email, username, display_name, role, is_gct_team, bio) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'varun@gocarbontracker.com', 'varun_moka_gct', 'Varun Moka', 'admin', true, 'Lead Carbon Analyst at GoCarbonTracker. Expert in Scope 3 emissions and supply chain decarbonization strategies.'),
('550e8400-e29b-41d4-a716-446655440002', 'linda@gocarbontracker.com', 'linda_gct_expert', 'Linda Chen', 'moderator', true, 'ESG Reporting Specialist at GoCarbonTracker. Focuses on regulatory compliance and industry benchmarking.');

-- Insert regular community members
INSERT INTO public.community_users (id, email, username, display_name, role, is_gct_team) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'sarah.johnson@example.com', 'sarah_sustainability', 'Sarah Johnson', 'member', false),
('550e8400-e29b-41d4-a716-446655440004', 'mike.green@example.com', 'mike_carbonfree', 'Mike Green', 'member', false),
('550e8400-e29b-41d4-a716-446655440005', 'anna.climate@example.com', 'anna_esg_pro', 'Anna Martinez', 'member', false);

-- Insert topics
INSERT INTO public.community_topics (id, title, content, category_id, author_id, is_pinned, tags, view_count, reply_count) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Welcome to GoCarbonTracker Community!', 'Welcome to our collaborative platform for carbon tracking professionals. This community is designed to facilitate knowledge sharing, best practice discussions, and expert guidance on supply chain decarbonization. Feel free to introduce yourself and share your carbon accounting journey!', 
  (SELECT id FROM public.community_categories WHERE slug = 'community-support'), 
  '550e8400-e29b-41d4-a716-446655440001', true, 
  ARRAY['welcome', 'introduction', 'community'], 145, 8),

('660e8400-e29b-41d4-a716-446655440002', 'Best Practices for Scope 3 Category 1: Purchased Goods & Services', 'Looking for insights on accurately measuring emissions from purchased goods and services. What methodologies have you found most effective for data collection from suppliers? Any recommendations for engaging suppliers who are reluctant to share emissions data?', 
  (SELECT id FROM public.community_categories WHERE slug = 'scope-3-emissions'), 
  '550e8400-e29b-41d4-a716-446655440003', false, 
  ARRAY['scope-3', 'suppliers', 'data-collection'], 89, 12),

('660e8400-e29b-41d4-a716-446655440003', 'SBTi Net-Zero Target Validation Process', 'Has anyone recently gone through the SBTi net-zero target validation process? Looking for tips on preparing the submission and common pitfalls to avoid. Particularly interested in experiences with the FLAG sector methodology.', 
  (SELECT id FROM public.community_categories WHERE slug = 'science-based-targets'), 
  '550e8400-e29b-41d4-a716-446655440004', false, 
  ARRAY['sbti', 'net-zero', 'validation', 'flag'], 67, 6),

('660e8400-e29b-41d4-a716-446655440004', 'CSRD Implementation Timeline and Requirements', 'With CSRD coming into effect, what are the key deadlines companies should be aware of? Looking for a comprehensive timeline and understanding of the scope requirements for different company sizes.', 
  (SELECT id FROM public.community_categories WHERE slug = 'regulatory-updates'), 
  '550e8400-e29b-41d4-a716-446655440005', false, 
  ARRAY['csrd', 'regulations', 'compliance', 'timeline'], 134, 15),

('660e8400-e29b-41d4-a716-446655440005', 'Technology Solutions for Automated Emissions Tracking', 'Exploring technology platforms for automated emissions data collection and calculation. What tools have you implemented successfully? Particularly interested in solutions that integrate with existing ERP systems.', 
  (SELECT id FROM public.community_categories WHERE slug = 'climate-technologies'), 
  '550e8400-e29b-41d4-a716-446655440003', false, 
  ARRAY['automation', 'technology', 'erp-integration'], 78, 9);

-- Insert replies with mix of expert and community responses
INSERT INTO public.community_replies (content, topic_id, author_id, is_expert_answer) VALUES
('Thank you for joining our community! We''re excited to have professionals like you contributing to the global decarbonization effort. Don''t hesitate to share your challenges and insights - we''re all here to learn from each other.', 
  '660e8400-e29b-41d4-a716-446655440001', 
  '550e8400-e29b-41d4-a716-446655440002', true),

('Great question! For Category 1 emissions, I recommend starting with spend-based calculations using emission factors, then gradually transitioning to supplier-specific data. The key is to establish clear data requirements in your procurement contracts.', 
  '660e8400-e29b-41d4-a716-446655440002', 
  '550e8400-e29b-41d4-a716-446655440001', true),

('I''ve found that offering to share aggregated industry benchmarks with suppliers increases their willingness to participate. It creates a value exchange rather than just asking for data.', 
  '660e8400-e29b-41d4-a716-446655440002', 
  '550e8400-e29b-41d4-a716-446655440004', false),

('For SBTi validation, ensure your baseline year data is thoroughly documented. The reviewers pay close attention to data quality and methodology consistency. Also, allow extra time for the FLAG guidance implementation.', 
  '660e8400-e29b-41d4-a716-446655440003', 
  '550e8400-e29b-41d4-a716-446655440002', true),

('The CSRD phased approach starts with large EU companies (>500 employees) reporting in 2025 on 2024 data. Smaller companies follow in subsequent years. The double materiality assessment is crucial for scoping.', 
  '660e8400-e29b-41d4-a716-446655440004', 
  '550e8400-e29b-41d4-a716-446655440001', true),

('We''ve had success with platforms that use APIs to connect directly with supplier systems. The initial setup takes time, but the ongoing data quality and automation benefits are significant.', 
  '660e8400-e29b-41d4-a716-446655440005', 
  '550e8400-e29b-41d4-a716-446655440003', false);

-- Update last_reply_at and last_reply_by for topics
UPDATE public.community_topics 
SET last_reply_at = NOW() - INTERVAL '2 hours', 
    last_reply_by = '550e8400-e29b-41d4-a716-446655440002'
WHERE id = '660e8400-e29b-41d4-a716-446655440001';

UPDATE public.community_topics 
SET last_reply_at = NOW() - INTERVAL '4 hours', 
    last_reply_by = '550e8400-e29b-41d4-a716-446655440004'
WHERE id = '660e8400-e29b-41d4-a716-446655440002';

UPDATE public.community_topics 
SET last_reply_at = NOW() - INTERVAL '1 day', 
    last_reply_by = '550e8400-e29b-41d4-a716-446655440002'
WHERE id = '660e8400-e29b-41d4-a716-446655440003';

UPDATE public.community_topics 
SET last_reply_at = NOW() - INTERVAL '6 hours', 
    last_reply_by = '550e8400-e29b-41d4-a716-446655440001'
WHERE id = '660e8400-e29b-41d4-a716-446655440004';

UPDATE public.community_topics 
SET last_reply_at = NOW() - INTERVAL '8 hours', 
    last_reply_by = '550e8400-e29b-41d4-a716-446655440003'
WHERE id = '660e8400-e29b-41d4-a716-446655440005';