
import React from 'react';
import { FileText, Clock, Calendar, BarChart3, TrendingUp, Database, AlertCircle } from 'lucide-react';

const ReportsAnalytics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="flex space-x-1">
              <FileText className="h-6 w-6 text-purple-600" />
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Reports & Analytics</h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive reporting and advanced analytics capabilities
          </p>
        </div>

        {/* Two-Column Layout */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Reports Section */}
          <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reports</h2>
            <p className="text-lg text-gray-600 mb-8">
              Comprehensive reporting features are coming soon
            </p>
            
            <div className="bg-purple-50/70 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">What's Coming</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">Automated Reports</h4>
                    <p className="text-sm text-purple-700">Generate compliance and sustainability reports automatically</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">Scheduled Delivery</h4>
                    <p className="text-sm text-purple-700">Set up recurring report delivery to stakeholders</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">Multiple Formats</h4>
                    <p className="text-sm text-purple-700">Export in PDF, Excel, and interactive formats</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-purple-800">Compliance Ready</h4>
                    <p className="text-sm text-purple-700">Meet CSRD, CDP, and other regulatory requirements</p>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm">
              This feature will be available in the next update. Stay tuned for powerful reporting capabilities!
            </p>
          </div>

          {/* Right Column - Analytics Section */}
          <div className="backdrop-blur-lg bg-white/70 rounded-xl shadow-lg border border-white/20 p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Advanced Analytics</h2>
            <p className="text-lg text-gray-600 mb-8">
              Powerful data analysis and insights are being developed
            </p>
            
            <div className="bg-blue-50/70 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Coming Features</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Predictive Analytics</h4>
                    <p className="text-sm text-blue-700">Forecast future emissions and trends</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Benchmarking</h4>
                    <p className="text-sm text-blue-700">Compare performance against industry peers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Smart Alerts</h4>
                    <p className="text-sm text-blue-700">Automated notifications for anomalies</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <BarChart3 className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Custom Dashboards</h4>
                    <p className="text-sm text-blue-700">Build personalized analytics views</p>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-500 text-sm">
              Advanced analytics capabilities will enhance your carbon management strategy with deeper insights and predictive intelligence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
