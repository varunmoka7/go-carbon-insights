# 🐍 Python API Examples

**Complete examples for integrating GoCarbonTracker API with Python**

## Setup & Installation

### **Install Dependencies**
```bash
pip install supabase pandas requests python-dotenv numpy matplotlib seaborn
```

### **Environment Setup (.env)**
```bash
SUPABASE_URL=https://hiplsgbyxbalukmejxaq.supabase.co
SUPABASE_KEY=your_anon_key_here
```

### **Basic Client Setup**
```python
import os
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd
import numpy as np

load_dotenv()

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)
```

## Data Fetching & Analysis

### **Climate Data Analyzer Class**
```python
class ClimateDataAnalyzer:
    def __init__(self, supabase_url: str, supabase_key: str):
        self.client = create_client(supabase_url, supabase_key)
        
    def get_companies_df(self, industry: str = None) -> pd.DataFrame:
        """Fetch companies as pandas DataFrame"""
        query = self.client.table('companies').select('*')
        
        if industry:
            query = query.eq('industry', industry)
            
        response = query.execute()
        
        if response.data:
            return pd.DataFrame(response.data)
        return pd.DataFrame()
    
    def get_emissions_data(self, company_id: int, scope: str = 'all') -> pd.DataFrame:
        """Get emissions data for a company across all scopes"""
        tables = []
        
        if scope in ['all', 'scope1']:
            scope1 = self.client.table('scope1_emissions')\
                .select('*')\
                .eq('company_id', company_id)\
                .execute()
            if scope1.data:
                df1 = pd.DataFrame(scope1.data)
                df1['scope'] = 'Scope 1'
                tables.append(df1)
                
        if scope in ['all', 'scope2']:
            scope2 = self.client.table('scope2_emissions')\
                .select('*')\
                .eq('company_id', company_id)\
                .execute()
            if scope2.data:
                df2 = pd.DataFrame(scope2.data)
                df2['scope'] = 'Scope 2'
                tables.append(df2)
                
        if scope in ['all', 'scope3']:
            scope3 = self.client.table('scope3_emissions')\
                .select('*')\
                .eq('company_id', company_id)\
                .execute()
            if scope3.data:
                df3 = pd.DataFrame(scope3.data)
                df3['scope'] = 'Scope 3'
                tables.append(df3)
        
        return pd.concat(tables, ignore_index=True) if tables else pd.DataFrame()
```

### **Industry Benchmarking Analysis**
```python
def analyze_industry_performance(analyzer: ClimateDataAnalyzer, industry: str):
    """Comprehensive industry analysis with statistics"""
    
    # Get companies in industry
    companies_df = analyzer.get_companies_df(industry)
    
    if companies_df.empty:
        print(f"No companies found for industry: {industry}")
        return None
    
    # Collect emissions data for all companies
    industry_emissions = []
    
    for _, company in companies_df.iterrows():
        emissions_df = analyzer.get_emissions_data(company['id'])
        
        if not emissions_df.empty:
            # Calculate total emissions by year and scope
            emissions_summary = emissions_df.groupby(['year', 'scope'])['total_emissions'].sum().reset_index()
            emissions_summary['company_id'] = company['id']
            emissions_summary['company_name'] = company['name']
            industry_emissions.append(emissions_summary)
    
    if not industry_emissions:
        print(f"No emissions data found for {industry}")
        return None
        
    # Combine all data
    all_emissions = pd.concat(industry_emissions, ignore_index=True)
    
    # Calculate industry statistics
    industry_stats = all_emissions.groupby(['year', 'scope'])['total_emissions'].agg([
        'mean', 'median', 'std', 'min', 'max', 'count'
    ]).round(2)
    
    print(f"\n=== {industry} Industry Analysis ===")
    print(f"Companies analyzed: {len(companies_df)}")
    print(f"Companies with emissions data: {all_emissions['company_id'].nunique()}")
    print("\nEmissions Statistics by Year and Scope:")
    print(industry_stats)
    
    return {
        'companies': companies_df,
        'emissions': all_emissions,
        'statistics': industry_stats
    }
```

### **SBTi Targets Analysis**
```python
def analyze_sbti_targets(analyzer: ClimateDataAnalyzer):
    """Analyze Science-Based Targets adoption and progress"""
    
    # Get all companies with SBTi data
    companies_df = analyzer.get_companies_df()
    
    # Filter companies with SBTi commitments
    sbti_companies = companies_df[companies_df['sbti_status'].notna()]
    
    if sbti_companies.empty:
        print("No companies with SBTi targets found")
        return None
    
    # SBTi status distribution
    status_counts = sbti_companies['sbti_status'].value_counts()
    
    # Industry distribution of SBTi companies
    industry_sbti = sbti_companies.groupby('industry').size().sort_values(ascending=False)
    
    # Target year analysis
    target_years = sbti_companies['sbti_target_date'].dropna()
    
    analysis = {
        'total_companies': len(companies_df),
        'sbti_companies': len(sbti_companies),
        'sbti_adoption_rate': len(sbti_companies) / len(companies_df) * 100,
        'status_distribution': status_counts,
        'industry_leaders': industry_sbti.head(10),
        'target_years': target_years.describe() if not target_years.empty else None
    }
    
    print(f"\n=== SBTi Analysis ===")
    print(f"Total companies: {analysis['total_companies']}")
    print(f"Companies with SBTi targets: {analysis['sbti_companies']}")
    print(f"SBTi adoption rate: {analysis['sbti_adoption_rate']:.1f}%")
    print(f"\nStatus distribution:")
    for status, count in status_counts.items():
        print(f"  {status}: {count}")
    
    return analysis
```

## Data Visualization

### **Emissions Trend Plotting**
```python
import matplotlib.pyplot as plt
import seaborn as sns

def plot_emissions_trends(analyzer: ClimateDataAnalyzer, company_ids: list, save_path: str = None):
    """Plot emissions trends for multiple companies"""
    
    plt.figure(figsize=(12, 8))
    
    for company_id in company_ids:
        emissions_df = analyzer.get_emissions_data(company_id)
        
        if not emissions_df.empty:
            # Get company name
            company_response = analyzer.client.table('companies')\
                .select('name')\
                .eq('id', company_id)\
                .single()\
                .execute()
            
            company_name = company_response.data['name'] if company_response.data else f"Company {company_id}"
            
            # Aggregate by year (sum all scopes)
            yearly_emissions = emissions_df.groupby('year')['total_emissions'].sum()
            
            plt.plot(yearly_emissions.index, yearly_emissions.values, 
                    marker='o', label=company_name, linewidth=2)
    
    plt.title('Emissions Trends Comparison', fontsize=16, fontweight='bold')
    plt.xlabel('Year', fontsize=12)
    plt.ylabel('Total Emissions (tCO2e)', fontsize=12)
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    
    plt.show()

def plot_industry_benchmarks(industry_data: dict, save_path: str = None):
    """Create industry benchmark visualization"""
    
    emissions_df = industry_data['emissions']
    
    # Create subplots for each scope
    fig, axes = plt.subplots(1, 3, figsize=(18, 6))
    scopes = ['Scope 1', 'Scope 2', 'Scope 3']
    
    for i, scope in enumerate(scopes):
        scope_data = emissions_df[emissions_df['scope'] == scope]
        
        if not scope_data.empty:
            # Box plot by year
            sns.boxplot(data=scope_data, x='year', y='total_emissions', ax=axes[i])
            axes[i].set_title(f'{scope} Emissions Distribution', fontweight='bold')
            axes[i].set_ylabel('Emissions (tCO2e)')
            axes[i].tick_params(axis='x', rotation=45)
        else:
            axes[i].text(0.5, 0.5, f'No {scope} data', 
                        ha='center', va='center', transform=axes[i].transAxes)
    
    plt.tight_layout()
    
    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
    
    plt.show()
```

## Data Processing & ETL

### **Batch Data Processor**
```python
import time
from typing import List, Dict
import json

class BatchDataProcessor:
    def __init__(self, analyzer: ClimateDataAnalyzer):
        self.analyzer = analyzer
        self.batch_size = 50
        self.delay_between_batches = 1  # seconds
        
    def process_all_companies(self, output_file: str = 'companies_data.json'):
        """Process all companies and save to JSON"""
        
        # Get all companies
        companies_df = self.analyzer.get_companies_df()
        total_companies = len(companies_df)
        
        print(f"Processing {total_companies} companies...")
        
        processed_data = []
        
        for i in range(0, total_companies, self.batch_size):
            batch = companies_df.iloc[i:i + self.batch_size]
            
            print(f"Processing batch {i//self.batch_size + 1}: companies {i+1}-{min(i+self.batch_size, total_companies)}")
            
            for _, company in batch.iterrows():
                company_data = self._process_single_company(company)
                if company_data:
                    processed_data.append(company_data)
            
            # Rate limiting
            time.sleep(self.delay_between_batches)
        
        # Save to file
        with open(output_file, 'w') as f:
            json.dump(processed_data, f, indent=2, default=str)
        
        print(f"Processing complete! Data saved to {output_file}")
        return processed_data
    
    def _process_single_company(self, company: pd.Series) -> Dict:
        """Process a single company's data"""
        try:
            # Get emissions data
            emissions_df = self.analyzer.get_emissions_data(company['id'])
            
            # Calculate metrics
            latest_year = emissions_df['year'].max() if not emissions_df.empty else None
            
            company_data = {
                'id': company['id'],
                'name': company['name'],
                'industry': company['industry'],
                'country': company['country'],
                'sbti_status': company['sbti_status'],
                'data_quality_score': company.get('quality_score'),
                'latest_data_year': latest_year,
                'emissions_summary': {}
            }
            
            if not emissions_df.empty:
                # Calculate emissions summary by scope
                scope_summary = emissions_df.groupby('scope')['total_emissions'].agg(['sum', 'mean', 'count']).to_dict()
                company_data['emissions_summary'] = scope_summary
                
                # Calculate total emissions for latest year
                latest_emissions = emissions_df[emissions_df['year'] == latest_year]['total_emissions'].sum()
                company_data['latest_total_emissions'] = latest_emissions
            
            return company_data
            
        except Exception as e:
            print(f"Error processing company {company['name']}: {str(e)}")
            return None
```

### **Data Quality Assessment**
```python
def assess_data_quality(analyzer: ClimateDataAnalyzer):
    """Comprehensive data quality assessment"""
    
    companies_df = analyzer.get_companies_df()
    
    quality_report = {
        'total_companies': len(companies_df),
        'data_completeness': {},
        'quality_scores': {},
        'coverage_by_year': {},
        'industry_coverage': {}
    }
    
    # Data completeness analysis
    completeness_fields = ['industry', 'country', 'sbti_status', 'revenue_2023', 'employees_2023']
    
    for field in completeness_fields:
        if field in companies_df.columns:
            non_null_count = companies_df[field].notna().sum()
            quality_report['data_completeness'][field] = {
                'complete': non_null_count,
                'missing': len(companies_df) - non_null_count,
                'completion_rate': non_null_count / len(companies_df) * 100
            }
    
    # Quality scores distribution
    if 'quality_score' in companies_df.columns:
        quality_scores = companies_df['quality_score'].dropna()
        quality_report['quality_scores'] = {
            'mean': quality_scores.mean(),
            'median': quality_scores.median(),
            'std': quality_scores.std(),
            'high_quality_count': (quality_scores >= 0.8).sum(),
            'medium_quality_count': ((quality_scores >= 0.6) & (quality_scores < 0.8)).sum(),
            'low_quality_count': (quality_scores < 0.6).sum()
        }
    
    # Emissions data coverage by year
    all_emissions = []
    for _, company in companies_df.iterrows():
        emissions_df = analyzer.get_emissions_data(company['id'])
        if not emissions_df.empty:
            all_emissions.append(emissions_df)
    
    if all_emissions:
        combined_emissions = pd.concat(all_emissions, ignore_index=True)
        year_coverage = combined_emissions.groupby('year').agg({
            'company_id': 'nunique',
            'total_emissions': 'count'
        })
        quality_report['coverage_by_year'] = year_coverage.to_dict()
    
    # Industry coverage
    industry_counts = companies_df['industry'].value_counts()
    quality_report['industry_coverage'] = industry_counts.head(20).to_dict()
    
    return quality_report

def print_quality_report(quality_report: Dict):
    """Print formatted quality report"""
    
    print("=== DATA QUALITY REPORT ===")
    print(f"Total companies: {quality_report['total_companies']}")
    
    print("\n--- Data Completeness ---")
    for field, stats in quality_report['data_completeness'].items():
        print(f"{field}: {stats['completion_rate']:.1f}% complete ({stats['complete']}/{stats['complete'] + stats['missing']})")
    
    if quality_report['quality_scores']:
        print("\n--- Quality Scores ---")
        scores = quality_report['quality_scores']
        print(f"Average quality score: {scores['mean']:.2f}")
        print(f"High quality (≥0.8): {scores['high_quality_count']} companies")
        print(f"Medium quality (0.6-0.8): {scores['medium_quality_count']} companies") 
        print(f"Low quality (<0.6): {scores['low_quality_count']} companies")
    
    print("\n--- Top Industries by Company Count ---")
    for industry, count in list(quality_report['industry_coverage'].items())[:10]:
        print(f"{industry}: {count} companies")
```

## Advanced Analytics

### **Emissions Forecasting**
```python
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import warnings
warnings.filterwarnings('ignore')

def forecast_emissions(analyzer: ClimateDataAnalyzer, company_id: int, forecast_years: int = 5):
    """Simple linear regression forecast for company emissions"""
    
    emissions_df = analyzer.get_emissions_data(company_id)
    
    if emissions_df.empty:
        return None
    
    # Aggregate total emissions by year
    yearly_totals = emissions_df.groupby('year')['total_emissions'].sum().reset_index()
    
    if len(yearly_totals) < 3:
        print("Not enough historical data for forecasting")
        return None
    
    # Prepare data for regression
    X = yearly_totals['year'].values.reshape(-1, 1)
    y = yearly_totals['total_emissions'].values
    
    # Fit model
    model = LinearRegression()
    model.fit(X, y)
    
    # Calculate model performance
    y_pred = model.predict(X)
    r2 = r2_score(y, y_pred)
    rmse = np.sqrt(mean_squared_error(y, y_pred))
    
    # Generate forecasts
    current_year = yearly_totals['year'].max()
    forecast_years_array = np.arange(current_year + 1, current_year + forecast_years + 1).reshape(-1, 1)
    forecasts = model.predict(forecast_years_array)
    
    # Calculate trend
    trend = "decreasing" if model.coef_[0] < 0 else "increasing"
    annual_change = abs(model.coef_[0])
    
    return {
        'historical_data': yearly_totals,
        'model_performance': {'r2': r2, 'rmse': rmse},
        'forecasts': dict(zip(forecast_years_array.flatten(), forecasts)),
        'trend': trend,
        'annual_change_rate': annual_change,
        'model_equation': f"Emissions = {model.coef_[0]:.2f} * Year + {model.intercept_:.2f}"
    }
```

## Usage Examples

### **Complete Analysis Script**
```python
if __name__ == "__main__":
    # Initialize analyzer
    analyzer = ClimateDataAnalyzer(
        supabase_url=os.environ.get("SUPABASE_URL"),
        supabase_key=os.environ.get("SUPABASE_KEY")
    )
    
    # 1. Industry analysis
    tech_analysis = analyze_industry_performance(analyzer, "Technology")
    
    # 2. SBTi targets analysis
    sbti_analysis = analyze_sbti_targets(analyzer)
    
    # 3. Data quality assessment
    quality_report = assess_data_quality(analyzer)
    print_quality_report(quality_report)
    
    # 4. Emissions forecasting for specific company
    company_forecast = forecast_emissions(analyzer, company_id=1, forecast_years=5)
    if company_forecast:
        print(f"\nForecast trend: {company_forecast['trend']}")
        print(f"Annual change rate: {company_forecast['annual_change_rate']:.2f} tCO2e/year")
    
    # 5. Visualization
    if tech_analysis:
        plot_industry_benchmarks(tech_analysis, save_path='tech_industry_analysis.png')
    
    print("\nAnalysis complete!")
```

---
*These Python examples provide a foundation for scientific analysis of climate data. Customize them for your specific research or business intelligence needs.*