
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search as SearchIcon, FileText, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Search = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Search
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Search through carbon tracking data, industry insights, and community discussions.
          </p>
        </div>

        {/* Coming Soon Message */}
        <Card className="max-w-2xl mx-auto bg-white dark:bg-gray-800 border-2 border-dashed border-emerald-200 dark:border-emerald-700">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              Advanced Search Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600 dark:text-gray-300">
              We're building powerful search capabilities to help you find exactly what you need 
              in the carbon tracking ecosystem.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <SearchIcon className="w-4 h-4" />
                <span>Smart Search</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <FileText className="w-4 h-4" />
                <span>Data Discovery</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>Trend Analysis</span>
              </div>
            </div>

            <div className="pt-4">
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/home">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Search;
