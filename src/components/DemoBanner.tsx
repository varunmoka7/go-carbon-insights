import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle, ExternalLink, Home, BarChart, BookOpen, TrendingUp, Target, Users, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const DemoBanner: React.FC = () => {
  const location = useLocation();
  
  // Check if we're in demo mode
  const urlParams = new URLSearchParams(location.search);
  const isDemoMode = urlParams.get('demo') === 'true' || localStorage.getItem('demoMode') === 'true';
  
  if (!isDemoMode) {
    return null;
  }

  // Demo pages available
  const demoPages = [
    { name: 'Home', href: '/home?demo=true', icon: Home, description: 'Climate reality overview' },
    { name: 'Dashboard', href: '/dashboard?demo=true', icon: BarChart, description: 'Climate performance dashboard' },
    { name: 'Industry Glossary', href: '/industry-glossary?demo=true', icon: BookOpen, description: 'Industry terminology' },
    { name: 'Industry Analysis', href: '/industry-analysis?demo=true', icon: TrendingUp, description: 'Sector analysis' },
    { name: 'Scope 1', href: '/scope1?demo=true', icon: Target, description: 'Direct emissions' },
    { name: 'Scope 2', href: '/scope2?demo=true', icon: Target, description: 'Indirect emissions' },
    { name: 'Scope 3', href: '/scope3?demo=true', icon: Target, description: 'Value chain emissions' },
    { name: 'About', href: '/about?demo=true', icon: Info, description: 'Platform information' },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Demo Mode Notice */}
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <div>
              <Badge variant="outline" className="bg-blue-100 border-blue-300 text-blue-800">
                Demo Mode
              </Badge>
              <span className="ml-2 text-sm text-gray-700">
                You're exploring the platform with sample data
              </span>
            </div>
          </div>

          {/* Demo Navigation */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 mr-2">Demo Pages:</span>
            <div className="flex flex-wrap gap-1">
              {demoPages.slice(0, 4).map((page) => (
                <Link key={page.href} to={page.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs bg-white/80 hover:bg-white border border-blue-200"
                  >
                    <page.icon className="h-3 w-3 mr-1" />
                    {page.name}
                  </Button>
                </Link>
              ))}
              {demoPages.length > 4 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-xs bg-white/80 hover:bg-white border border-blue-200"
                  onClick={() => {
                    // Show all demo pages in a dropdown or modal
                    console.log('Show all demo pages');
                  }}
                >
                  +{demoPages.length - 4} more
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBanner; 