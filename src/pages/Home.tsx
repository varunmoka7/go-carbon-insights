
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Target, FileText, TrendingDown, CheckCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const features = [
    {
      icon: BarChart,
      title: 'Emissions Tracking',
      description: 'Monitor carbon footprint across operations with detailed breakdowns across all emission scopes.'
    },
    {
      icon: Target,
      title: 'Target Setting',
      description: 'Establish and track science-based sustainability goals aligned with global climate commitments.'
    },
    {
      icon: FileText,
      title: 'Compliance Reporting',
      description: 'Generate comprehensive reports for regulatory requirements and stakeholder communications.'
    }
  ];

  const benefits = [
    'Real-time emissions monitoring and analytics',
    'Science-based target setting and tracking',
    'Automated compliance reporting',
    'Industry benchmarking capabilities',
    'Actionable reduction recommendations',
    'Stakeholder engagement tools'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Track and Reduce Your Company's{' '}
            <span className="text-teal-600">Environmental Impact</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive carbon emission tracking and ESG performance management platform 
            designed to help companies monitor, analyze, and reduce their environmental footprint.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3">
                Explore the Dashboard
              </Button>
            </Link>
            <Link to="/tracking">
              <Button variant="outline" size="lg" className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600">
            Everything you need to manage your environmental impact effectively
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose GoCarbonTracker?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our platform provides comprehensive tools and insights to help your organization 
                achieve its sustainability goals and meet regulatory requirements.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">500+</div>
                  <div className="text-sm text-gray-600">Companies Tracking</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">30%</div>
                  <div className="text-sm text-gray-600">Average Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">95%</div>
                  <div className="text-sm text-gray-600">Compliance Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
                  <div className="text-sm text-gray-600">Monitoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-teal-600 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Sustainability Journey?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join hundreds of companies already using GoCarbonTracker to reduce their environmental impact.
          </p>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
