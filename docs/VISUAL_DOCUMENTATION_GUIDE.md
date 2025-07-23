# 📸 Visual Documentation Implementation Guide

**Complete guide for capturing and implementing visual documentation assets**

## Screenshot Capture Process

### **Setup Environment**
1. **Browser Configuration**
   ```bash
   # Use Chrome in incognito mode
   google-chrome --incognito --window-size=1920,1080
   ```

2. **Demo Account Login**
   - URL: Platform demo URL
   - Email: `demo@gocarbontracker.net`
   - Password: `demodemo`

3. **Screen Resolution**
   - Set to 1920x1080 for consistency
   - Use 100% browser zoom level
   - Hide browser extensions

### **Screenshot Standards**

#### **File Naming Convention**
```
{page}_{section}_{state}.png

Examples:
✅ dashboard_main_overview.png
✅ analysis_scope1_chart.png
✅ ui_search_active.png
❌ Screen Shot 2025-01-23.png
❌ image1.png
```

#### **Image Specifications**
- **Format**: PNG for UI screenshots
- **Resolution**: 1920x1080 minimum
- **File Size**: <500KB (compress with TinyPNG)
- **Quality**: Lossless compression
- **Annotations**: Red arrows/boxes for highlighting

### **Required Screenshots Checklist**

#### **🚀 Priority 1: Core User Experience**
- [ ] `dashboard_main_overview.png` - Full dashboard with data
- [ ] `analysis_scope1_chart.png` - Scope 1 emissions visualization
- [ ] `analysis_scope2_breakdown.png` - Scope 2 energy analysis
- [ ] `analysis_scope3_categories.png` - Scope 3 value chain view
- [ ] `ui_navigation_sidebar.png` - Main navigation interface

#### **📊 Priority 2: Key Features**
- [ ] `dashboard_stats_cards.png` - Global statistics section
- [ ] `dashboard_companies_table.png` - Featured companies data
- [ ] `analysis_industry_benchmarking.png` - Industry comparison
- [ ] `ui_search_global.png` - Search functionality
- [ ] `ui_filters_advanced.png` - Advanced filtering

#### **🎨 Priority 3: UI Components**
- [ ] `ui_export_data.png` - Data export options
- [ ] `ui_theme_dark.png` - Dark theme example
- [ ] `dashboard_mobile_responsive.png` - Mobile view
- [ ] `analysis_trends_timeline.png` - Multi-year trends
- [ ] `onboarding_welcome.png` - New user welcome

### **Screenshot Capture Commands**

#### **Using Browser DevTools**
```javascript
// Run in browser console to standardize viewport
document.body.style.zoom = '100%';
window.resizeTo(1920, 1080);

// Hide scroll bars for cleaner screenshots
document.documentElement.style.overflow = 'hidden';

// Restore after screenshot
document.documentElement.style.overflow = 'auto';
```

#### **Automated Screenshot Script**
```javascript
// screenshot-capture.js
const puppeteer = require('puppeteer');

async function captureScreenshots() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1920, height: 1080 }
  });
  
  const page = await browser.newPage();
  
  // Login to demo account
  await page.goto('your-platform-url');
  await page.type('input[type="email"]', 'demo@gocarbontracker.net');
  await page.type('input[type="password"]', 'demodemo');
  await page.click('button[type="submit"]');
  
  // Wait for dashboard to load
  await page.waitForSelector('[data-testid="dashboard"]');
  await page.waitForTimeout(2000);
  
  // Capture dashboard overview
  await page.screenshot({
    path: 'docs/assets/screenshots/dashboard/dashboard_main_overview.png',
    fullPage: false
  });
  
  // Navigate to analysis page
  await page.click('a[href="/analysis/scope1"]');
  await page.waitForSelector('[data-testid="scope1-chart"]');
  await page.waitForTimeout(2000);
  
  // Capture scope 1 analysis
  await page.screenshot({
    path: 'docs/assets/screenshots/analysis/analysis_scope1_chart.png',
    fullPage: false
  });
  
  await browser.close();
}

captureScreenshots();
```

## Diagram Creation

### **Mermaid Diagrams** (Recommended)
```mermaid
# Example: System Architecture
graph TB
    User[👤 User] --> Frontend[🌐 React Frontend]
    Frontend --> Backend[🗄️ Supabase Backend]
    Backend --> Database[(🗃️ PostgreSQL)]
```

#### **Mermaid Best Practices**
- Use consistent icon prefixes (👤 🌐 🗄️ 📊)
- Apply semantic colors with style directives
- Keep diagrams simple and focused
- Use descriptive node labels

### **Advanced Diagram Tools**

#### **Figma for Complex Diagrams**
```
1. Create new Figma file
2. Use GoCarbonTracker brand colors:
   - Primary: #1e40af
   - Secondary: #059669
   - Accent: #dc2626
3. Export as SVG with transparent background
4. Optimize with SVGO
```

#### **Draw.io Integration**
```xml
<!-- Example: Data Flow Diagram -->
<mxfile host="app.diagrams.net">
  <diagram name="Data Flow">
    <!-- Diagram content -->
  </diagram>
</mxfile>
```

## Implementation in Documentation

### **Markdown Image Syntax**
```markdown
![Alt Text](../assets/screenshots/dashboard/dashboard_main_overview.png)
*Caption describing the screenshot with context*
```

### **Image Optimization**
```bash
# Compress screenshots
for file in docs/assets/screenshots/**/*.png; do
  pngquant --quality=80-95 --ext .png --force "$file"
done

# Optimize SVG diagrams
for file in docs/assets/diagrams/**/*.svg; do
  svgo --input "$file" --output "$file"
done
```

### **Responsive Images**
```markdown
<!-- For different screen sizes -->
![Dashboard Overview](../assets/screenshots/dashboard/dashboard_main_overview.png)
<details>
<summary>Mobile View</summary>

![Dashboard Mobile](../assets/screenshots/dashboard/dashboard_mobile_responsive.png)
</details>
```

## Asset Management

### **File Organization**
```
docs/assets/
├── screenshots/           # Application screenshots
│   ├── dashboard/        # Dashboard views
│   ├── analysis/         # Analysis pages
│   ├── community/        # Community features
│   ├── ui/              # UI components
│   └── onboarding/      # User onboarding
├── diagrams/            # System diagrams
│   ├── system-overview/ # Architecture diagrams
│   ├── data-flow/       # Data flow charts
│   └── user-journey/    # User experience flows
├── icons/               # Status indicators & icons
└── mockups/             # Design mockups
```

### **Version Control**
```bash
# Git LFS for large assets (optional)
git lfs track "*.png"
git lfs track "*.svg"

# Compress before committing
npm run optimize-assets

# Add with descriptive commits
git add docs/assets/screenshots/dashboard/
git commit -m "docs: add dashboard screenshot suite"
```

## Maintenance & Updates

### **Screenshot Update Schedule**
- **Major Features**: Capture screenshots immediately
- **UI Changes**: Update within 1 week
- **Quarterly Review**: Refresh all screenshots
- **Version Releases**: Complete screenshot audit

### **Quality Assurance**
```bash
# Check for broken image links
find docs/ -name "*.md" -exec grep -l "!\[.*\](.*\.png)" {} \; | \
  xargs -I {} sh -c 'echo "Checking {}"; grep -o "!\[.*\](.*\.png)" "{}"'

# Validate image dimensions
identify docs/assets/screenshots/**/*.png | grep -v "1920x1080"
```

### **Automated Validation**
```javascript
// validate-screenshots.js
const fs = require('fs');
const path = require('path');

function validateScreenshots() {
  const screenshotDir = 'docs/assets/screenshots';
  const required = [
    'dashboard/dashboard_main_overview.png',
    'analysis/analysis_scope1_chart.png',
    'analysis/analysis_scope2_breakdown.png',
    'analysis/analysis_scope3_categories.png',
    'ui/ui_search_global.png'
  ];
  
  const missing = required.filter(file => 
    !fs.existsSync(path.join(screenshotDir, file))
  );
  
  if (missing.length > 0) {
    console.error('Missing required screenshots:', missing);
    process.exit(1);
  }
  
  console.log('✅ All required screenshots present');
}

validateScreenshots();
```

## Integration with CI/CD

### **GitHub Actions Workflow**
```yaml
name: Visual Documentation Check

on: [push, pull_request]

jobs:
  check-visuals:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Check for broken image links
        run: |
          find docs/ -name "*.md" -exec grep -l "!\[.*\](.*\.png)" {} \; | \
            xargs -I {} sh -c 'echo "Checking {}"; grep -o "!\[.*\](.*\.png)" "{}"'
      
      - name: Validate required screenshots
        run: node scripts/validate-screenshots.js
      
      - name: Optimize new images
        run: |
          npm install -g imagemin-cli imagemin-pngquant
          imagemin 'docs/assets/screenshots/**/*.png' --out-dir='docs/assets/screenshots/' --plugin=pngquant
```

## Best Practices Summary

### **✅ Do**
- Use consistent naming conventions
- Compress images before committing
- Include descriptive alt text and captions
- Update screenshots with feature changes
- Use semantic file organization
- Test on multiple screen sizes

### **❌ Don't**
- Commit uncompressed large images
- Use generic filenames (image1.png)
- Include personal data in screenshots
- Forget to update outdated screenshots
- Mix different screenshot styles
- Skip accessibility considerations

---

**Next Steps**: Start with Priority 1 screenshots and implement the automated capture script for consistent visual documentation across the platform.