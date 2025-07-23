# ❓ Frequently Asked Questions

## Getting Started

### **Q: How do I quickly explore the platform?**
A: 
1. Follow our [Quick Start Guide](./QUICK_START.md) for 5-minute setup
2. Use the demo account for instant access:
   - Email: `demo@gocarbontracker.net`
   - Password: `demodemo`
   - Or click "Login as Demo" on the login page
3. Check the [Dashboard Tutorial](./user-guides/dashboard-tutorial.md) for guidance

### **Q: What are the system requirements?**
A: Minimum: Node.js 18+, 8GB RAM, modern browser. Recommended: 16GB+ RAM, Chrome/Firefox latest.

### **Q: How do I set up the development environment?**
A: Follow our [Quick Start Guide](./QUICK_START.md) for 5-minute setup or [Environment Setup](./ENVIRONMENT_SETUP.md) for detailed configuration.

## Platform Usage

### **Q: What data sources does GoCarbonTracker use?**
A: Primary sources include:
- **CDP Climate Disclosures** (emissions data)
- **Company Sustainability Reports** 
- **SBTi Database** (science-based targets)
- **SEC Filings** (financial context)
- **Commercial providers** (Refinitiv, MSCI, Sustainalytics)

### **Q: How current is the data?**
A: 
- **Dashboard metrics**: Real-time updates
- **Emissions data**: Annual updates (typically Q2 following reporting year)
- **SBTi targets**: Quarterly updates
- **Quality improvements**: Monthly

### **Q: What does the quality score mean?**
A: Quality scores (0.0-1.0) indicate data reliability:
- **0.8-1.0** (Green): High-quality, verified data
- **0.6-0.8** (Yellow): Medium quality, some validation needed  
- **0.0-0.6** (Red): Lower quality, requires expert review

### **Q: How many companies and industries are covered?**
A: Currently tracking **112 companies** across **185+ industries** with detailed taxonomy and emissions data.

## Technical Questions

### **Q: Can I export data from the platform?**
A: Yes, most data views include export functionality. Look for download/export buttons in the interface.

### **Q: Is there an API available?**
A: API documentation is available in [docs/API_DOCUMENTATION.md](./API_DOCUMENTATION.md). Contact us for API access credentials.

### **Q: What happens if I encounter an error?**
A: 
1. Check the [Troubleshooting Guide](./TROUBLESHOOTING_GUIDE.md)
2. Clear browser cache and cookies
3. Try the demo account to isolate issues
4. Create an issue on GitHub with error details

### **Q: How do I report data quality issues?**
A: Create an issue on GitHub with:
- Company name and data point
- Expected vs. actual values
- Source references if available
- Screenshots if helpful

## Data & Methodology

### **Q: What are Scope 1, 2, and 3 emissions?**
A:
- **Scope 1**: Direct emissions from owned/controlled sources (facilities, vehicles)
- **Scope 2**: Indirect emissions from purchased electricity/energy
- **Scope 3**: All other indirect emissions in value chain (15 categories)

### **Q: What are Science-Based Targets (SBTi)?**
A: Climate targets aligned with climate science to limit global warming to 1.5°C. Companies set near-term (5-10 years) and long-term (2050) targets validated by SBTi.

### **Q: How is industry benchmarking calculated?**
A: Companies are compared within industry peer groups using:
- Emissions intensity metrics (per revenue, per employee)
- Absolute emissions trends
- Target ambition and progress
- Framework compliance scores

### **Q: Why do some companies show incomplete data?**
A: Common reasons:
- Recent addition to platform (data still being collected)
- Limited public disclosure by the company
- Data quality below minimum thresholds
- Ongoing validation and verification processes

## Contributing & Development

### **Q: How can I contribute to the project?**
A: Check our [Contributing Quick Guide](./CONTRIBUTING_QUICK.md) for first-time contributors or [full Contributing Guide](../CONTRIBUTING.md) for detailed process.

### **Q: What technologies does the platform use?**
A: 
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Charts**: Recharts for data visualization
- **UI**: shadcn/ui components

### **Q: How do I run tests?**
A: 
```bash
npm run test        # Run all tests
npm run test:ui     # Visual test interface
npm run lint        # Code style checking
```

### **Q: Can I use this for my own climate tracking?**
A: The platform is designed for corporate climate intelligence. Personal carbon tracking features are planned for future releases.

## Business & Licensing

### **Q: Is GoCarbonTracker free to use?**
A: The demo account provides free access to explore the platform. Contact us for enterprise access and pricing.

### **Q: Can I use the data commercially?**
A: Data usage depends on source licensing. Check individual data source terms and contact us for commercial use cases.

### **Q: How do I get support?**
A: 
- **Technical issues**: GitHub issues
- **Data questions**: GitHub issues with 'data-quality' label
- **Business inquiries**: Contact form on platform
- **Community**: Discussion forum on platform

### **Q: Is my company's data included?**
A: We focus on large publicly-traded companies with climate disclosures. To request company addition, create a GitHub issue with company details and data sources.

## Troubleshooting

### **Q: The platform won't load. What should I do?**
A: 
1. Check internet connection
2. Try incognito/private browsing mode
3. Clear browser cache and cookies
4. Disable browser extensions
5. Check [system status page] if available

### **Q: I can't login with the demo account**
A: Verify credentials:
- Email: `demo@gocarbontracker.net` (exact spelling)
- Password: `demodemo` (lowercase)
- Try the "Login as Demo" button instead

### **Q: Charts or data aren't displaying correctly**
A: 
1. Refresh the page
2. Check browser console for errors (F12)
3. Try a different browser
4. Report the issue with browser/OS details

### **Q: How do I clear my local development environment?**
A:
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Reset git state (if needed)
git checkout main
git reset --hard origin/main
```

---

**Still have questions?** 
- Create an issue on GitHub
- Check our [User Guides](./user-guides/README.md)
- See [complete documentation](../README.md)