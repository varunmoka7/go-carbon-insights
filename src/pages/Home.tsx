
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Target, FileText, TrendingDown, CheckCircle, Users, Factory, Zap, Globe, ArrowRight, PlayCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EducationalSection from '@/components/EducationalSection';
import { useTheme } from '@/contexts/ThemeContext';

const Home = () => {
  const { isDarkMode, toggleDarkMode, isHighContrast, toggleHighContrast } = useTheme();

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
      }
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        toggleHighContrast();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleDarkMode, toggleHighContrast]);

  const features = [
    {
      icon: BarChart,
      title: 'Emissions Tracking',
      description: 'Monitor carbon footprint across operations with detailed breakdowns across all emission scopes.',
      href: '/tracking',
      badge: 'Real-time'
    },
    {
      icon: Target,
      title: 'Target Setting',
      description: 'Establish and track science-based sustainability goals aligned with global climate commitments.',
      href: '/decarbonization',
      badge: 'SBTi Aligned'
    },
    {
      icon: FileText,
      title: 'Compliance Reporting',
      description: 'Generate comprehensive reports for regulatory requirements and stakeholder communications.',
      href: '/reports',
      badge: 'Automated'
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

  const stats = [
    { value: '500+', label: 'Companies Tracking', description: 'Global organizations using our platform' },
    { value: '30%', label: 'Average Reduction', description: 'Emission reductions achieved by users' },
    { value: '95%', label: 'Compliance Rate', description: 'Successful regulatory reporting' },
    { value: '24/7', label: 'Monitoring', description: 'Continuous emission tracking' }
  ];

  const scopeIntro = [
    {
      icon: Factory,
      scope: 'Scope 1',
      title: 'Direct Emissions',
      description: 'Emissions from owned or controlled sources',
      color: 'text-red-500 bg-red-50 dark:bg-red-950/20',
      examples: ['Company vehicles', 'On-site fuel combustion', 'Manufacturing processes']
    },
    {
      icon: Zap,
      scope: 'Scope 2',
      title: 'Energy Indirect',
      description: 'Emissions from purchased energy',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
      examples: ['Purchased electricity', 'Steam and heating', 'Cooling systems']
    },
    {
      icon: Globe,
      scope: 'Scope 3',
      title: 'Value Chain',
      description: 'All other indirect emissions',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
      examples: ['Supply chain', 'Employee commuting', 'Product lifecycle']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center animate-fade-in">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Globe className="h-4 w-4 mr-2" />
            Leading Carbon Management Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Track and Reduce Your Company's{' '}
            <span className="text-teal-600 bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">
              Environmental Impact
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Comprehensive carbon emission tracking and ESG performance management platform 
            designed to help companies monitor, analyze, and reduce their environmental footprint through 
            precise scope-based reporting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 group">
                Explore the Dashboard
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/tracking">
              <Button variant="outline" size="lg" className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/20 px-8 py-3 group">
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Tracking
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Scope Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in delay-300">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Understanding Carbon Emissions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Emissions are categorized into three scopes to provide comprehensive coverage of an organization's carbon footprint
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {scopeIntro.map((scope, index) => (
            <Card key={index} className={`group hover:shadow-xl transition-all duration-300 animate-slide-in-right delay-${(index + 1) * 200} border-l-4 border-l-current ${scope.color}`}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${scope.color}`}>
                    <scope.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">{scope.scope}</Badge>
                    <CardTitle className="text-lg">{scope.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{scope.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white">Examples:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    {scope.examples.map((example, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to manage your environmental impact effectively
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Link key={index} to={feature.href} className="group">
              <Card className="h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-teal-600" />
                  </div>
                  <Badge variant="secondary">{feature.badge}</Badge>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 group-hover:text-teal-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center text-teal-600 group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose GoCarbonTracker?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Our platform provides comprehensive tools and insights to help your organization 
                achieve its sustainability goals and meet regulatory requirements through evidence-based decision making.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                    <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/methodology">
                  <Button variant="outline" className="group">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Learn Our Methodology
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/30 dark:to-green-950/30 rounded-xl p-8 animate-slide-in-right">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-teal-600 mb-2">{stat.value}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">{stat.label}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{stat.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EducationalSection />
      </div>

      {/* CTA Section */}
      <div className="bg-teal-600 dark:bg-teal-700 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Sustainability Journey?
          </h2>
          <p className="text-xl text-teal-100 mb-8">
            Join hundreds of companies already using GoCarbonTracker to reduce their environmental impact 
            through comprehensive scope-based emission tracking and strategic decarbonization planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 group">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/tracking">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
