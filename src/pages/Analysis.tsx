
import React, { useState } from 'react';
import { TrendingDown, TrendingUp, Calendar, Globe, Building2, CheckCircle, Clock, DollarSign, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { enhancedCompanies } from '@/data/enhancedMockData';

const Analysis = () => {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [region, setRegion] = useState('global');
  const [sector, setSector] = useState('all');

  // Get unique sectors from the data
  const sectors = [...new Set(enhancedCompanies.map(company => company.industry))];

  const sectorAnalysis = sectors.map(sector => {
    const sectorCompanies = enhancedCompanies.filter(company => company.industry === sector);
    const avgReduction = sectorCompanies.reduce((acc, company) => {
      const oldestData = company.emissionsData[0];
      const newestData = company.emissionsData[company.emissionsData.length - 1];
      const totalOld = oldestData.scope1 + oldestData.scope2 + oldestData.scope3;
      const totalNew = newestData.scope1 + newestData.scope2 + newestData.scope3;
      const reduction = ((totalOld - totalNew) / totalOld) * 100;
      return acc + reduction;
    }, 0) / sectorCompanies.length;

    const topPerformer = sectorCompanies.reduce((best, company) => {
      const oldestData = company.emissionsData[0];
      const newestData = company.emissionsData[company.emissionsData.length - 1];
      const totalOld = oldestData.scope1 + oldestData.scope2 + oldestData.scope3;
      const totalNew = newestData.scope1 + newestData.scope2 + newestData.scope3;
      const reduction = ((totalOld - totalNew) / totalOld) * 100;
      
      if (!best) return { company, reduction };
      return reduction > best.reduction ? { company, reduction } : best;
    }, null);

    return {
      sector,
      companies: sectorCompanies.length,
      avgReduction: `${avgReduction.toFixed(1)}%`,
      topPerformer: topPerformer?.company.name || 'N/A',
      challenges: getIndustryChallenges(sector),
      opportunities: getIndustryOpportunities(sector),
      trendDirection: avgReduction > 10 ? 'improving' : avgReduction > 5 ? 'stable' : 'declining'
    };
  });

  const bestPractices = [
    {
      id: 1,
      company: 'TechCorp Industries',
      title: 'AI-powered energy optimization',
      savings: '$2.1M',
      emissionReduction: '28%',
      description: 'Implemented machine learning algorithms to optimize energy consumption across facilities',
      category: 'Technology Innovation'
    },
    {
      id: 2,
      company: 'Green Manufacturing Co.',
      title: 'Circular waste management',
      savings: '$1.7M',
      emissionReduction: '35%',
      description: 'Zero-waste-to-landfill initiative with comprehensive recycling and upcycling programs',
      category: 'Waste Reduction'
    },
    {
      id: 3,
      company: 'Retail Giant',
      title: 'Supply chain optimization',
      savings: '$950K',
      emissionReduction: '22%',
      description: 'Implemented local sourcing and sustainable procurement practices',
      category: 'Supply Chain'
    }
  ];

  function getIndustryChallenges(industry: string) {
    const challenges = {
      'Technology': 'Data center energy consumption, supply chain emissions, rapid hardware turnover',
      'Manufacturing': 'Process emissions, legacy equipment, energy-intensive operations',
      'Retail': 'Supply chain complexity, store operations, logistics emissions'
    };
    return challenges[industry] || 'Industry-specific operational challenges';
  }

  function getIndustryOpportunities(industry: string) {
    const opportunities = {
      'Technology': 'AI optimization, renewable energy adoption, circular design principles',
      'Manufacturing': 'Electrification, circular economy practices, energy efficiency',
      'Retail': 'Sustainable sourcing, renewable energy, supply chain transparency'
    };
    return opportunities[industry] || 'Renewable adoption, efficiency improvements';
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Filters */}
        <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-6">
          <Alert className="mb-4 bg-yellow-50/70 border-yellow-200">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This analysis uses mock data to demonstrate platform capabilities. Real data integration will provide actual insights.
            </AlertDescription>
          </Alert>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Carbon Analytics & Insights</h1>
              <p className="text-gray-600 mt-2">Expert analysis and actionable intelligence for carbon management</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40 backdrop-blur-sm bg-white/80">
                    <SelectValue placeholder="Date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-7-days">Last 7 days</SelectItem>
                    <SelectItem value="last-30-days">Last 30 days</SelectItem>
                    <SelectItem value="last-quarter">Last quarter</SelectItem>
                    <SelectItem value="last-year">Last year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="w-32 backdrop-blur-sm bg-white/80">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-gray-500" />
                <Select value={sector} onValueChange={setSector}>
                  <SelectTrigger className="w-40 backdrop-blur-sm bg-white/80">
                    <SelectValue placeholder="Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    {sectors.map(s => (
                      <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Sector Analysis */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Building2 className="h-5 w-5 text-purple-600 mr-2" />
            Sector Analysis
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {sectorAnalysis.map((sector, index) => (
              <AccordionItem key={index} value={`sector-${index}`} className="backdrop-blur-lg bg-white/70 rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{sector.sector}</span>
                      <span className="text-sm text-gray-500">({sector.companies} companies)</span>
                    </div>
                    <div className="flex items-center space-x-4 mr-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">{sector.avgReduction} avg reduction</div>
                        <div className="text-xs text-gray-500">Top: {sector.topPerformer}</div>
                      </div>
                      {getTrendIcon(sector.trendDirection)}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="backdrop-blur-sm bg-white/50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Key Challenges</h4>
                      <p className="text-sm text-gray-600">{sector.challenges}</p>
                    </div>
                    <div className="backdrop-blur-sm bg-white/50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Opportunities</h4>
                      <p className="text-sm text-gray-600">{sector.opportunities}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Success Stories & Best Practices */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            Success Stories & Best Practices
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bestPractices.map((practice) => (
              <Card key={practice.id} className="backdrop-blur-lg bg-gradient-to-br from-green-50/70 to-emerald-50/70 border-green-200/30 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-green-800">{practice.company}</CardTitle>
                    <span className="px-2 py-1 bg-green-100/70 text-green-700 text-xs rounded-full backdrop-blur-sm">
                      {practice.category}
                    </span>
                  </div>
                  <CardDescription className="text-green-700 font-medium">
                    {practice.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-700 mb-4">{practice.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">{practice.savings}</span>
                        <span className="text-xs text-green-600">saved</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">{practice.emissionReduction}</span>
                        <span className="text-xs text-green-600">reduction</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analysis;
