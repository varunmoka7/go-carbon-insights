
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Target, FileText, TrendingDown, CheckCircle, Users, ArrowRight, Star, Quote } from 'lucide-react';
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

  const testimonials = [
    {
      quote: "GoCarbonTracker helped us reduce our emissions by 35% in just 12 months. The insights are game-changing.",
      author: "Sarah Chen",
      title: "Head of Sustainability, TechCorp",
      company: "Fortune 500 Technology Company"
    },
    {
      quote: "Finally, a platform that makes carbon tracking simple and actionable. Our board loves the clear reporting.",
      author: "Michael Rodriguez",
      title: "ESG Director, GreenManufacturing",
      company: "Leading Manufacturing Firm"
    },
    {
      quote: "The industry benchmarking feature showed us exactly where we stood and what we needed to improve.",
      author: "Emma Thompson",
      title: "Environmental Manager, RetailGiant",
      company: "Global Retail Chain"
    }
  ];

  const trustedCompanies = [
    "TechCorp", "GreenEnergy Inc", "SustainableCorp", "EcoTech Solutions", "CleanFuture Ltd"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50 overflow-hidden">
      {/* Hero Section with Enhanced Animation */}
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
                <BarChart className="h-16 w-16 text-teal-600 animate-pulse" />
              </div>
              <span className="text-3xl font-bold text-gray-900">GoCarbonTracker</span>
            </div>
          </div>

          {/* Enhanced Main Heading */}
          <h1 className="text-4xl md:text-7xl font-bold text-gray-900 mb-8 animate-fade-in">
            <span className="block animate-slide-in-right">Stop Guessing About</span>
            <span className="block text-teal-600 animate-slide-in-right delay-300">Your Carbon Impact</span>
            <span className="block animate-slide-in-right delay-500">Start Leading Your Industry</span>
          </h1>

          {/* Enhanced Subtitle with Emotional Appeal */}
          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-700 font-medium">
            Join over <span className="text-teal-600 font-bold">500+ forward-thinking companies</span> that have already 
            reduced their emissions by an average of <span className="text-green-600 font-bold">30%</span> using our 
            comprehensive carbon tracking platform. Your sustainability journey starts here.
          </p>

          {/* Enhanced CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-1000">
            <Link to="/dashboard">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-12 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl group border-2 border-teal-600">
                Start Your Free Analysis
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/tracking">
              <Button variant="outline" size="lg" className="border-3 border-teal-600 text-teal-700 hover:bg-teal-50 px-12 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">
                See Live Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 animate-fade-in delay-1200">
            <p className="text-sm text-gray-600 mb-4 font-medium">Trusted by industry leaders:</p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-sm font-medium">
              {trustedCompanies.map((company, index) => (
                <span key={index} className="hover:text-teal-600 transition-colors cursor-pointer">
                  {company}
                </span>
              ))}
            </div>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 animate-fade-in delay-1200">
            <div className="text-center group cursor-pointer p-4 rounded-lg hover:bg-white/50 transition-all">
              <div className="text-5xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform">500+</div>
              <div className="text-gray-700 font-medium">Companies Trust Us</div>
            </div>
            <div className="text-center group cursor-pointer p-4 rounded-lg hover:bg-white/50 transition-all">
              <div className="text-5xl font-bold text-green-600 mb-2 group-hover:scale-110 transition-transform">30%</div>
              <div className="text-gray-700 font-medium">Average Reduction</div>
            </div>
            <div className="text-center group cursor-pointer p-4 rounded-lg hover:bg-white/50 transition-all">
              <div className="text-5xl font-bold text-blue-600 mb-2 group-hover:scale-110 transition-transform">95%</div>
              <div className="text-gray-700 font-medium">Compliance Success</div>
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

      {/* Enhanced Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Why Companies Choose Us</h2>
            <p className="text-xl text-gray-700 font-medium">
              The tools you need to transform your environmental impact into competitive advantage
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-100 to-green-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-700 leading-relaxed font-medium">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What Our Customers Say</h2>
            <p className="text-xl text-gray-700">
              Real results from real companies making a real difference
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 relative hover:shadow-xl transition-shadow">
                <Quote className="h-8 w-8 text-teal-600 mb-4" />
                <p className="text-gray-700 mb-6 italic font-medium leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-teal-600 font-bold text-lg">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.title}</div>
                    <div className="text-xs text-gray-500">{testimonial.company}</div>
                  </div>
                </div>
                <div className="flex absolute top-4 right-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Benefits Section */}
      <div className="py-20 bg-gradient-to-r from-teal-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold text-gray-900 mb-8">
                Turn Environmental Responsibility Into Business Success
              </h2>
              <p className="text-xl text-gray-700 mb-10 font-medium leading-relaxed">
                Stop viewing sustainability as a cost center. Our platform transforms environmental 
                responsibility into measurable business value, helping you reduce costs, mitigate risks, 
                and unlock new opportunities while meeting stakeholder expectations.
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-teal-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-lg text-gray-800 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="grid grid-cols-2 gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-teal-600 mb-4">500+</div>
                    <div className="text-gray-700 font-medium">Companies Tracking</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600 mb-4">30%</div>
                    <div className="text-gray-700 font-medium">Avg. Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-blue-600 mb-4">95%</div>
                    <div className="text-gray-700 font-medium">Compliance Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-purple-600 mb-4">24/7</div>
                    <div className="text-gray-700 font-medium">Real-time Monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Final CTA Section */}
      <div className="py-20 bg-gradient-to-r from-teal-600 to-green-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Lead Your Industry in Sustainability?
          </h2>
          <p className="text-xl text-teal-100 mb-10 font-medium leading-relaxed">
            Join the hundreds of companies already transforming their environmental impact into competitive advantage. 
            Start your free analysis today and see what's possible for your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-gray-100 px-12 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">
                Start Your Free Analysis Now
              </Button>
            </Link>
            <Link to="/tracking">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-teal-600 px-10 py-6 text-xl font-semibold transition-all duration-300 hover:scale-105">
                Book a Demo
              </Button>
            </Link>
          </div>
          <p className="text-teal-100 mt-6 text-sm">
            ✓ No credit card required  ✓ 14-day free trial  ✓ Setup support included
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
