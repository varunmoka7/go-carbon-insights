
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Target, FileText, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { EmissionsArchetypeFilter } from '@/components/EmissionsArchetypeFilter';

const Index = () => {
  const features = [
    {
      icon: BarChart,
      title: 'Emissions Tracking',
      description: 'Track and monitor your carbon emissions across all scopes',
      path: '/tracking'
    },
    {
      icon: Target,
      title: 'Decarbonization',
      description: 'Set science-based targets and track progress',
      path: '/decarbonization'
    },
    {
      icon: FileText,
      title: 'Reports & Analysis',
      description: 'Generate comprehensive sustainability reports',
      path: '/reports'
    },
    {
      icon: TrendingDown,
      title: 'Dashboard',
      description: 'View your emissions data and trends',
      path: '/dashboard'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center space-x-3 mb-8">
            <BarChart className="h-12 w-12 text-teal-600" />
            <span className="text-3xl font-bold text-gray-900">GoCarbonTracker</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Carbon Management
            <span className="block text-teal-600">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive carbon emission tracking and ESG performance management platform 
            designed to help companies monitor, analyze, and reduce their environmental footprint.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Link key={index} to={feature.path}>
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                <CardHeader>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Platform Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">500+</div>
              <div className="text-gray-600">Companies Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">15+</div>
              <div className="text-gray-600">Industry Sectors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">30%</div>
              <div className="text-gray-600">Avg. Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">95%</div>
              <div className="text-gray-600">Compliance Rate</div>
            </div>
          </div>
        </div>

        {/* Emissions Archetype Filter */}
        <div className="mb-16">
          <EmissionsArchetypeFilter />
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Start Your Sustainability Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Explore our comprehensive carbon management tools and start tracking your emissions today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/community">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 px-8 py-3 font-montserrat font-semibold">
                Join Now
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 px-8 py-3">
                View Dashboard
              </Button>
            </Link>
            <Link to="/tracking">
              <Button variant="outline" size="lg" className="border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-3">
                Start Tracking
              </Button>
            </Link>
          </div>
          
          {/* Community CTA Section */}
          <div className="mt-16 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
            <div className="text-center">
              <h3 className="text-2xl font-montserrat font-semibold text-emerald-600 mb-4">
                Join Our Professional Community
              </h3>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                Connect with carbon accounting experts, discuss Scope 3 emissions, supply chain decarbonization, 
                GHG Protocol implementation, and ESG reporting best practices.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-emerald-600 mb-6">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Expert Knowledge Sharing</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Professional Discussions</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Industry Best Practices</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Networking Opportunities</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to="/community">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 font-montserrat font-semibold px-8 py-3 text-lg">
                    Join Community →
                  </Button>
                </Link>
                <p className="text-sm text-gray-600">
                  Free access • Professional network • Expert insights
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
