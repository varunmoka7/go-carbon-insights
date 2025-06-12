
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertTriangle, Database, Shield, FileText } from 'lucide-react';

const MeasurementVerificationSystem = () => {
  const dataCollectionSources = [
    {
      type: 'Primary Data Collection',
      icon: <Database className="h-5 w-5" />,
      sources: [
        { name: 'Direct Supplier Reporting', status: 'active', coverage: '85%' },
        { name: 'IoT Sensor Networks', status: 'active', coverage: '72%' },
        { name: 'Supply Chain APIs', status: 'pending', coverage: '45%' }
      ]
    },
    {
      type: 'Secondary Data Sources',
      icon: <FileText className="h-5 w-5" />,
      sources: [
        { name: 'Industry Benchmarks', status: 'active', coverage: '95%' },
        { name: 'Lifecycle Assessments', status: 'active', coverage: '78%' },
        { name: 'Government Databases', status: 'active', coverage: '90%' }
      ]
    },
    {
      type: 'Verification Methods',
      icon: <Shield className="h-5 w-5" />,
      sources: [
        { name: 'Third-party Audits', status: 'scheduled', coverage: '60%' },
        { name: 'Blockchain Verification', status: 'pilot', coverage: '25%' },
        { name: 'Peer Review Process', status: 'active', coverage: '80%' }
      ]
    }
  ];

  const kpiMetrics = [
    {
      category: 'Absolute Emissions Reduction',
      current: '18.5%',
      target: '25%',
      trend: 'up',
      status: 'on-track'
    },
    {
      category: 'Emissions per Revenue',
      current: '12.3 tCO2e/$M',
      target: '10.0 tCO2e/$M',
      trend: 'down',
      status: 'behind'
    },
    {
      category: 'Supplier Engagement Rate',
      current: '65%',
      target: '80%',
      trend: 'up',
      status: 'on-track'
    },
    {
      category: 'Circular Material Rate',
      current: '30%',
      target: '50%',
      trend: 'up',
      status: 'ahead'
    },
    {
      category: 'Customer Impact Score',
      current: '7.8/10',
      target: '8.5/10',
      trend: 'up',
      status: 'on-track'
    }
  ];

  const reportingSchedule = [
    { period: 'Q1 2024', type: 'Quarterly', status: 'completed', dueDate: 'Apr 15' },
    { period: 'Q2 2024', type: 'Quarterly', status: 'completed', dueDate: 'Jul 15' },
    { period: 'Q3 2024', type: 'Quarterly', status: 'in-progress', dueDate: 'Oct 15' },
    { period: 'Q4 2024', type: 'Quarterly', status: 'upcoming', dueDate: 'Jan 15' },
    { period: '2024 Annual', type: 'Comprehensive', status: 'upcoming', dueDate: 'Mar 31' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
      case 'in-progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'scheduled':
      case 'upcoming':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'bg-green-100 text-green-800 border-green-200';
      case 'on-track': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'behind': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Measurement & Verification System</h2>
      
      {/* Data Collection Infrastructure */}
      <div className="grid lg:grid-cols-3 gap-6">
        {dataCollectionSources.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg">
                {category.icon}
                <span>{category.type}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.sources.map((source, sourceIndex) => (
                  <div key={sourceIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(source.status)}
                      <div>
                        <div className="font-medium text-sm">{source.name}</div>
                        <div className="text-xs text-gray-600">Coverage: {source.coverage}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize text-xs">
                      {source.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Key Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators (KPIs)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpiMetrics.map((kpi, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm text-gray-900">{kpi.category}</h4>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(kpi.status)}
                  >
                    {kpi.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current:</span>
                    <span className="font-semibold">{kpi.current}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-semibold">{kpi.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reporting Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Reporting Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reportingSchedule.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(report.status)}
                  <div>
                    <div className="font-medium">{report.period} - {report.type} Report</div>
                    <div className="text-sm text-gray-600">Due: {report.dueDate}</div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`capitalize ${
                    report.status === 'completed' ? 'bg-green-100 text-green-800' :
                    report.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}
                >
                  {report.status.replace('-', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeasurementVerificationSystem;
