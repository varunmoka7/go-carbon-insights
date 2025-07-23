-- Seed data for the demo account

-- Insert a sample company
INSERT INTO public.companies (company_id, company_name, industry, sector, headquarters_country, headquarters_city, website, description, founded_year, employee_count_range, revenue_range_usd, public_private, stock_exchange, ticker_symbol, primary_business_activities, geographical_presence, sustainability_officer_contact, data_quality_score, last_updated, data_source)
VALUES ('DEMO_001', 'Demo Corp', 'Technology Hardware & Equipment', 'Technology', 'United States', 'Palo Alto', 'www.demo.com', 'A demonstration company for the GoCarbonTracker platform.', 2024, '1000-5000', '1B-5B', 'Private', 'N/A', 'N/A', 'Software development', 'Global', 'sustainability@demo.com', 0.99, '2025-07-21', 'Internal');

-- Insert sample emissions data for the demo company
INSERT INTO public.emissions (company_id, reporting_year, scope1_total, scope2_total, scope3_total, verification_status, reporting_boundary, methodology, data_quality_score, last_updated, data_source)
VALUES ('DEMO_001', 2023, 1000, 2000, 30000, 'Third-party verified', 'Operational Control', 'GHG Protocol Corporate Standard', 0.98, '2025-07-21', 'Internal');

-- Associate the demo user with the demo company
INSERT INTO public.user_companies (user_id, company_id)
VALUES ((SELECT id FROM auth.users WHERE email = 'demo@gocarbontracker.net'), 'DEMO_001');
