
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Target, FileText, TrendingDown, CheckCircle, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const features = [
    {
      icon: BarChart,
      title: 'Company Comparison',
      description: 'Compare emissions performance across companies and track relative progress in your industry.'
    },
    {
      icon: Target,
      title: 'Sector & Industry Analysis',
      description: 'Deep-dive into sector-level performance with comprehensive industry benchmarking and trends.'
    },
    {
      icon: FileText,
      title: 'Track Your Companies',
      description: 'Monitor multiple companies\' performance and see detailed breakdowns of their carbon footprint.'
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 overflow-hidden">
      {/* Hero Section with Animation */}
      <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-teal-200 rounded-full opacity-30 animate-bounce delay-500"></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Logo with Animation */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="relative">
                <img 
                  src="/lovable-uploads/9efb52bb-4927-4097-8968-6bfba4ce29c0.png" 
                  alt="GoCarbonTracker Logo" 
                  className="h-16 w-16 animate-pulse"
                />
              </div>
              <span className="text-3xl font-bold text-gray-900">GoCarbonTracker</span>
            </div>
          </div>

          {/* Main Heading with Staggered Animation */}
          <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-8 animate-fade-in">
            <span className="block animate-slide-in-right">Track and Reduce</span>
            <span className="block text-teal-600 animate-slide-in-right delay-300">Your Company's</span>
            <span className="block animate-slide-in-right delay-500">Environmental Impact</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-700">
            Comprehensive carbon emission tracking and ESG performance management platform 
            designed to help companies monitor, analyze, and reduce their environmental footprint.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-1000">
            <Link to="/dashboard">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group">
                Explore Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/tracking">
              <Button variant="outline" size="lg" className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-10 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Stats with Animation */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 animate-fade-in delay-1200">
            <div className="text-center group cursor-pointer">
              <div className="text-4xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-gray-600">Companies in Database</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-4xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform">30%</div>
              <div className="text-gray-600">Average Reduction</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-4xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform">95%</div>
              <div className="text-gray-600">Compliance Rate</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-teal-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-teal-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Key Features</h2>
            <p className="text-xl text-gray-600">
              Everything you need to manage your environmental impact effectively
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-100 to-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-r from-teal-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                Why Choose GoCarbonTracker?
              </h2>
              <p className="text-xl text-gray-600 mb-10">
                Our platform provides comprehensive tools and insights to help your organization 
                achieve its sustainability goals and meet regulatory requirements with real-time 
                company tracking and sector analysis capabilities.
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-teal-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-teal-600 mb-4">500+</div>
                    <div className="text-gray-600 font-medium">Companies in Database</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-teal-600 mb-4">30%</div>
                    <div className="text-gray-600 font-medium">Average Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-teal-600 mb-4">95%</div>
                    <div className="text-gray-600 font-medium">Compliance Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-teal-600 mb-4">15+</div>
                    <div className="text-gray-600 font-medium">Industry Sectors</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="py-20 bg-gradient-to-r from-teal-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Sustainability Journey?
          </h2>
          <p className="text-xl text-teal-100 mb-10">
            Join hundreds of companies already using GoCarbonTracker to reduce their environmental impact.
          </p>
          <Link to="/dashboard">
            <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100 px-10 py-4 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              Get Started Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
