
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Award, Globe, ExternalLink } from 'lucide-react';
import { useIndustryBenchmarks } from '@/hooks/useIndustryBenchmarks';

const IndustryBenchmarking = () => {
  const { data: benchmarks, isLoading, error } = useIndustryBenchmarks();

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading industry benchmarks...</div>
        </div>
      </div>
    );
  }

  if (error || !benchmarks) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-red-600">Error loading benchmarks</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Award className="h-4 w-4 mr-2" />
            Industry Leadership Analysis
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Global Industry Benchmarking
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Compare sector performance and identify climate leaders across industries and regions
          </p>
        </div>

        {/* Sector Performance Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {benchmarks.map((benchmark, index) => (
            <Card key={benchmark.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{benchmark.sector}</CardTitle>
                  <Badge variant={benchmark.avg_emission_intensity < 1 ? "default" : "secondary"}>
                    {benchmark.avg_emission_intensity.toFixed(1)} tCO₂e/M$
                  </Badge>
                </div>
                <CardDescription>
                  Industry average: {benchmark.industry_avg_intensity.toFixed(1)} tCO₂e/M$ revenue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Leading Companies */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Top Performers
                    </h4>
                    <div className="space-y-2">
                      {benchmark.leading_companies.slice(0, 3).map((company, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{company.company}</span>
                            <p className="text-sm text-gray-600">{company.achievement}</p>
                          </div>
                          <Badge variant="outline">{company.score}/100</Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regional Leaders */}
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Regional Leaders
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(benchmark.regional_leaders).map(([region, leader]) => (
                        <div key={region} className="text-center p-2 bg-blue-50 rounded">
                          <div className="text-xs text-gray-600">{region}</div>
                          <div className="text-sm font-medium">{leader}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Best Practices */}
                  <div>
                    <h4 className="font-semibold mb-2">Best Practices</h4>
                    <div className="flex flex-wrap gap-1">
                      {benchmark.best_practices.map((practice, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {practice}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Insights Section */}
        <Card className="bg-indigo-100 border-indigo-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              Key Industry Insights
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-2">85%</div>
                <div className="text-sm text-gray-700">SBTi target growth year-over-year</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-2">Scope 3</div>
                <div className="text-sm text-gray-700">Primary focus area for supply chain decarbonization</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-2">Nordic</div>
                <div className="text-sm text-gray-700">Regional leadership in climate action</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Source Attribution */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p className="flex items-center justify-center gap-2">
            Data sourced from CDP Global 500 Climate Report and Science Based Targets initiative
            <a href="#" className="text-blue-600 hover:text-blue-700">
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndustryBenchmarking;
