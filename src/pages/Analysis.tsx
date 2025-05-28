
import React, { useState } from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Calendar, Globe, Building2, CheckCircle, XCircle, Clock, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Analysis = () => {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [region, setRegion] = useState('global');
  const [sector, setSector] = useState('all');

  const criticalAlerts = [
    {
      id: 1,
      company: 'MegaCorp',
      issue: 'Scope 1 emissions spike',
      change: '+35%',
      severity: 'high',
      description: 'Unexpected increase in direct emissions from manufacturing facilities',
      timeframe: '2 days ago'
    },
    {
      id: 2,
      company: 'IndustrialTech',
      issue: 'Scope 2 target breach',
      change: '+18%',
      severity: 'medium',
      description: 'Electricity consumption exceeded quarterly targets',
      timeframe: '1 week ago'
    },
    {
      id: 3,
      company: 'GlobalManufacturing',
      issue: 'Reporting compliance risk',
      change: 'Overdue',
      severity: 'high',
      description: 'Missing mandatory carbon disclosure deadline approaching',
      timeframe: '3 days ago'
    }
  ];

  const weeklyHighlights = [
    {
      date: '2024-01-15',
      type: 'sector-improvement',
      title: 'Tech sector achieves 12% reduction',
      description: 'Leading technology companies show significant progress in Scope 2 emissions',
      impact: 'positive'
    },
    {
      date: '2024-01-12',
      type: 'regulatory',
      title: 'New EU carbon tax regulations',
      description: 'Updated compliance requirements for companies operating in European markets',
      impact: 'neutral'
    },
    {
      date: '2024-01-10',
      type: 'company-achievement',
      title: 'CleanEnergy Corp reaches net-zero',
      description: 'First company in renewable sector to achieve verified net-zero emissions',
      impact: 'positive'
    },
    {
      date: '2024-01-08',
      type: 'market-trend',
      title: 'Carbon credit prices surge 23%',
      description: 'Increased demand drives voluntary carbon market pricing up significantly',
      impact: 'neutral'
    }
  ];

  const sectorAnalysis = [
    {
      sector: 'Technology',
      companies: 156,
      avgReduction: '15.2%',
      topPerformer: 'TechCorp',
      challenges: 'Data center energy consumption, supply chain emissions',
      opportunities: 'AI optimization, renewable energy adoption',
      trendDirection: 'improving'
    },
    {
      sector: 'Manufacturing',
      companies: 243,
      avgReduction: '8.7%',
      topPerformer: 'EcoManufacturing',
      challenges: 'Process emissions, legacy equipment',
      opportunities: 'Electrification, circular economy practices',
      trendDirection: 'stable'
    },
    {
      sector: 'Energy',
      companies: 89,
      avgReduction: '22.1%',
      topPerformer: 'SolarTech',
      challenges: 'Transition costs, grid stability',
      opportunities: 'Renewable expansion, storage solutions',
      trendDirection: 'improving'
    },
    {
      sector: 'Transportation',
      companies: 178,
      avgReduction: '11.4%',
      topPerformer: 'ElectricFleet',
      challenges: 'Fleet electrification, infrastructure',
      opportunities: 'EV adoption, route optimization',
      trendDirection: 'improving'
    }
  ];

  const bestPractices = [
    {
      id: 1,
      company: 'SolarTech',
      title: 'AI-powered energy optimization',
      savings: '$2.1M',
      emissionReduction: '28%',
      description: 'Implemented machine learning algorithms to optimize energy consumption across facilities',
      category: 'Technology Innovation'
    },
    {
      id: 2,
      company: 'GreenManufacturing',
      title: 'Circular waste management',
      savings: '$1.7M',
      emissionReduction: '35%',
      description: 'Zero-waste-to-landfill initiative with comprehensive recycling and upcycling programs',
      category: 'Waste Reduction'
    },
    {
      id: 3,
      company: 'EcoTransport',
      title: 'Electric fleet transition',
      savings: '$950K',
      emissionReduction: '42%',
      description: 'Complete transition to electric vehicles with smart charging infrastructure',
      category: 'Transportation'
    },
    {
      id: 4,
      company: 'CleanEnergy',
      title: 'Renewable energy procurement',
      savings: '$3.2M',
      emissionReduction: '55%',
      description: 'Long-term renewable energy contracts and on-site solar installations',
      category: 'Energy'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-orange-50 border-orange-200 text-orange-800';
      default: return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Carbon Analytics & Insights</h1>
              <p className="text-gray-600 mt-2">Expert analysis and actionable intelligence for carbon management</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
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
                  <SelectTrigger className="w-32">
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
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="energy">Energy</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            Critical Alerts
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {criticalAlerts.map((alert) => (
              <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  <span>{alert.company}</span>
                  <span className="text-sm font-normal">{alert.timeframe}</span>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  <div className="font-medium">{alert.issue} ({alert.change})</div>
                  <div className="text-sm mt-1">{alert.description}</div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>

        {/* Weekly Highlights Timeline */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 text-blue-600 mr-2" />
            Weekly Highlights
          </h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                {weeklyHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getImpactIcon(highlight.impact)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{highlight.title}</h3>
                        <span className="text-xs text-gray-500">{highlight.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{highlight.description}</p>
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full mt-2">
                        {highlight.type.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sector Analysis */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Building2 className="h-5 w-5 text-purple-600 mr-2" />
            Sector Analysis
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            {sectorAnalysis.map((sector, index) => (
              <AccordionItem key={index} value={`sector-${index}`} className="bg-white rounded-lg border">
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
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Challenges</h4>
                      <p className="text-sm text-gray-600">{sector.challenges}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Opportunities</h4>
                      <p className="text-sm text-gray-600">{sector.opportunities}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Best Practices */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
            Success Stories & Best Practices
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {bestPractices.map((practice) => (
              <Card key={practice.id} className="bg-green-50 border-green-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-green-800">{practice.company}</CardTitle>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
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
