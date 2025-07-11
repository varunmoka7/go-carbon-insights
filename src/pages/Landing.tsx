import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Target, FileText, TrendingDown, ArrowRight, Users, Globe, Award, Factory, Zap, Building, TreePine, Recycle, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Logo from '@/components/ui/Logo';
import atmosphericHero from '@/assets/atmospheric-hero-bg.jpg';

const Landing = () => {
  const navigate = useNavigate();

  const handleExplorePlatform = () => {
    console.log('🚀 Explore Platform button clicked');
    navigate('/home');
  };

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

  const whyTrackingMatters = [
    'Science-based reduction pathways are becoming mandatory for climate goals',
    'Supply chain emissions (Scope 3) represent 70%+ of most companies\' carbon footprint',
    'Industry collaboration and transparency drive collective decarbonization',
    'Regulatory frameworks (CSRD, CDP, TCFD) require comprehensive emissions reporting',
    'Benchmarking against industry peers identifies improvement opportunities',
    'Shared knowledge platforms accelerate sustainable technology adoption'
  ];

  const scopeEducation = [
    {
      icon: Factory,
      scope: 'Scope 1',
      title: 'Direct Emissions',
      description: 'Emissions from owned or controlled sources like company vehicles and on-site fuel combustion',
      color: 'text-red-500 bg-red-50',
      examples: ['Company fleet vehicles', 'On-site manufacturing', 'Facility heating systems']
    },
    {
      icon: Zap,
      scope: 'Scope 2',
      title: 'Energy Indirect',
      description: 'Emissions from purchased electricity, steam, heating and cooling for own use',
      color: 'text-amber-500 bg-amber-50',
      examples: ['Purchased electricity', 'District heating/cooling', 'Steam consumption']
    },
    {
      icon: Globe,
      scope: 'Scope 3',
      title: 'Value Chain Emissions',
      description: 'All other indirect emissions in the upstream and downstream value chain',
      color: 'text-emerald-500 bg-emerald-50',
      examples: ['Supplier emissions', 'Product transportation', 'End-of-life treatment']
    }
  ];

  const collaborationBenefits = [
    {
      icon: Building,
      title: 'Industry Hotspot Identification',
      description: 'Analyze emissions data across sectors to identify the highest-impact areas for reduction efforts.'
    },
    {
      icon: Users,
      title: 'Expert Knowledge Sharing',
      description: 'Connect with industry experts and peers to share decarbonization strategies and technologies.'
    },
    {
      icon: TreePine,
      title: 'Science-Based Targets',
      description: 'Set credible reduction pathways aligned with climate science and track progress transparently.'
    },
    {
      icon: Recycle,
      title: 'Sustainable Technology Adoption',
      description: 'Discover and implement proven sustainable technologies through collaborative learning.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Demo Mode Notice */}
      <div className="bg-gradient-to-r from-atmospheric-primary to-atmospheric-deep text-white py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-sm font-medium">Prototype Demo</span>
          </div>
        </div>
      </div>

      {/* Hero Section with Atmospheric Background */}
      <div 
        className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: `url(${atmosphericHero})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Atmospheric Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20"></div>

        <div className="relative max-w-7xl mx-auto text-center">
          {/* Logo with Animation */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center space-y-2 animate-fade-in">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Logo size="large" className="h-16 w-auto animate-pulse" />
                </div>
                 <span className="text-3xl font-bold drop-shadow-lg" style={{ color: '#000000' }}>GoCarbonTracker</span>
               </div>
                <span className="text-lg font-medium drop-shadow" style={{ color: '#228B22' }}>
                  Global Supply Chain Emissions Intelligence Platform
                </span>
            </div>
          </div>

          {/* Enhanced Main Heading */}
          <h1 className="text-4xl md:text-7xl font-bold mb-8 animate-fade-in drop-shadow-lg" style={{ color: '#1E4A2B' }}>
            <span className="block animate-slide-in-right">The GPS of</span>
            <span className="block animate-slide-in-right delay-300">Corporate Carbon</span>
            <span className="block animate-slide-in-right delay-500">Emissions</span>
          </h1>

          {/* Enhanced Subtitle with Mission Focus */}
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-700 font-medium drop-shadow" style={{ color: '#1E4A2B' }}>
            Navigate the complex landscape of global supply chain emissions with precision. Our platform delivers 
            <span className="font-bold"> granular industry benchmarking</span>, identifies critical emission hotspots, 
            and connects you with a <span className="font-bold">collaborative expert network</span> driving 
            real decarbonization outcomes across all sectors.
          </p>

          {/* Cloud-like CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-1000">
            <Link to="/home">
              <Button size="lg" className="bg-white/90 backdrop-blur-sm hover:bg-atmospheric-light text-gray-900 hover:text-white px-12 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group border-2 border-atmospheric-primary/20">
                Explore Platform
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/community">
              <Button size="lg" className="bg-atmospheric-primary hover:bg-atmospheric-deep text-white px-12 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-2 border-atmospheric-primary">
                <Users className="mr-3 h-6 w-6" />
                Join Our Community
              </Button>
            </Link>
            <Link to="/tracking">
              <Button variant="outline" size="lg" className="border-2 border-white/80 text-white hover:bg-white/20 backdrop-blur-sm px-12 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                View Emissions Intelligence
              </Button>
            </Link>
          </div>

          {/* Platform Capabilities */}
          <div className="mt-12 animate-fade-in delay-1200">
            <p className="text-sm text-white/70 mb-4 font-medium">Platform Capabilities:</p>
            <div className="text-white/90 text-lg font-medium max-w-4xl mx-auto drop-shadow">
              Granular supply chain tracking • Industry-specific benchmarking • Global emissions database • Expert collaboration network
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-fade-in delay-1200">
            <div className="text-center group cursor-pointer p-4 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all">
              <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform drop-shadow-lg">15K+</div>
              <div className="text-white/90 font-medium drop-shadow">Global Companies Tracked</div>
            </div>
            <div className="text-center group cursor-pointer p-4 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all">
              <div className="text-5xl font-bold text-atmospheric-light mb-2 group-hover:scale-110 transition-transform drop-shadow-lg">50+</div>
              <div className="text-white/90 font-medium drop-shadow">Industry Sectors Covered</div>
            </div>
            <div className="text-center group cursor-pointer p-4 rounded-lg hover:bg-white/20 backdrop-blur-sm transition-all">
              <div className="text-5xl font-bold text-atmospheric-cloud mb-2 group-hover:scale-110 transition-transform drop-shadow-lg">500+</div>
              <div className="text-white/90 font-medium drop-shadow">Expert Network Members</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/80 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-3 bg-white/80 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Understanding Supply Chain Emissions Section - Stratosphere */}
      <div className="py-20 bg-muted relative">
        {/* Cloud border effect */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Understanding Supply Chain Emissions</h2>
            <p className="text-xl text-gray-700 font-medium max-w-4xl mx-auto">
              Emissions are categorized into three scopes to provide comprehensive coverage of an organization's carbon footprint. 
              Understanding these is crucial for effective decarbonization strategies.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {scopeEducation.map((scope, index) => (
              <div key={index} className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border-2 border-atmospheric-light/30 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-atmospheric-primary/50">
                <div className="w-16 h-16 bg-atmospheric-light/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-2 border-atmospheric-primary/20">
                  <scope.icon className="h-8 w-8 text-atmospheric-primary" />
                </div>
                <div className="mb-4">
                  <span className="text-sm font-bold text-atmospheric-primary uppercase tracking-wide">{scope.scope}</span>
                  <h3 className="text-2xl font-semibold text-gray-900 mt-1">{scope.title}</h3>
                </div>
                <p className="text-gray-700 leading-relaxed font-medium mb-6">{scope.description}</p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Examples:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {scope.examples.map((example, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-3 w-3 text-atmospheric-primary flex-shrink-0" />
                        {example}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center bg-gradient-to-r from-atmospheric-light/20 to-atmospheric-primary/20 backdrop-blur-sm rounded-3xl p-8 border border-atmospheric-primary/30">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Value Chain Studies Matter</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Most emissions occur in supply chains (Scope 3). Companies must work together with industry experts 
              to identify hotspots and implement collaborative solutions for meaningful decarbonization.
            </p>
          </div>
        </div>
      </div>

      {/* Platform Features Section */}
      <div className="py-20 relative" style={{ background: 'linear-gradient(135deg, #F0FFF0 0%, #E8F5E8 50%, #DFF0DF 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6" style={{ color: '#228B22' }}>Platform Features</h2>
            <p className="text-xl font-medium" style={{ color: '#3A6B47' }}>
              Tools designed to drive transparency and collaborative decarbonization
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white/90 backdrop-blur-sm rounded-3xl shadow-lg border-2 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2" style={{ borderColor: '#50C878', borderLeftWidth: '4px' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border-2" style={{ background: 'linear-gradient(135deg, #50C878 0%, #228B22 100%)', borderColor: '#228B22' }}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-semibold mb-4" style={{ color: '#1E4A2B' }}>{feature.title}</h3>
                <p className="leading-relaxed font-medium" style={{ color: '#3A6B47' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose GoCarbonTracker Section */}
      <div className="py-20" style={{ background: 'linear-gradient(135deg, #228B22 0%, #50C878 50%, #9CAF88 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-white mb-8 drop-shadow-lg">
                Why Choose GoCarbonTracker?
              </h2>
              <p className="text-xl mb-10 font-medium leading-relaxed drop-shadow" style={{ color: '#E8F5E8' }}>
                As the definitive platform for supply chain carbon intelligence, we provide unparalleled visibility 
                into global emissions patterns, industry-specific benchmarking, and access to the world's largest 
                collaborative network of decarbonization experts driving measurable climate outcomes.
              </p>
              <div className="space-y-6">
                {whyTrackingMatters.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 group-hover:scale-110 transition-transform mt-1" style={{ color: '#50C878' }} />
                    </div>
                    <span className="text-lg font-medium leading-relaxed drop-shadow" style={{ color: '#F0FFF0' }}>{reason}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              {/* Collaboration info section */}
              <div className="backdrop-blur-sm rounded-3xl shadow-2xl p-10 border-2" style={{ backgroundColor: 'rgba(30, 74, 43, 0.2)', borderColor: 'rgba(255, 255, 255, 0.3)' }}>
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4" style={{ color: '#000000' }}>The Collaboration Imperative</h3>
                  <p className="text-lg text-white">Working together for collective impact</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {collaborationBenefits.map((benefit, index) => (
                    <div key={index} className="text-center p-6 rounded-2xl border" style={{ backgroundColor: 'rgba(80, 200, 120, 0.1)', borderColor: 'rgba(80, 200, 120, 0.3)' }}>
                      <benefit.icon className="h-10 w-10 mx-auto mb-4" style={{ color: '#50C878' }} />
                      <div className="text-lg font-semibold text-white mb-3">{benefit.title}</div>
                      <div className="text-base text-white leading-relaxed">{benefit.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section - Ready to Navigate Your Carbon Future? */}
      <div className="py-20" style={{ background: 'linear-gradient(135deg, #1E4A2B 0%, #228B22 50%, #2D5A3D 100%)' }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">
            Ready to Navigate Your Carbon Future?
          </h2>
          <p className="text-xl mb-10 font-medium leading-relaxed drop-shadow" style={{ color: '#9CAF88' }}>
            Join the world's most comprehensive supply chain emissions intelligence platform. Access granular 
            industry benchmarking, identify critical hotspots, and collaborate with leading experts to implement 
            science-based decarbonization strategies that deliver measurable climate impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/home">
              <Button 
                size="lg" 
                className="text-white px-12 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #50C878 0%, #228B22 100%)' }}
              >
                Start Tracking Now
              </Button>
            </Link>
            <Link to="/methodology">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 px-10 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                style={{ borderColor: '#50C878', color: '#50C878' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#50C878';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#50C878';
                }}
              >
                Explore Our Intelligence
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm drop-shadow" style={{ color: '#9CAF88' }}>
            ✓ Global emissions database  ✓ Industry-specific benchmarking  ✓ Expert collaboration network
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
