
import React, { useState } from 'react';
import { 
  Factory, 
  TrendingUp, 
  Recycle, 
  AlertTriangle,
  Filter,
  Download,
  Users,
  Building,
  Truck,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  enhancedPlasticCompanies, 
  globalPlasticKPIs,
  kpiDefinitions,
  categoryPerformanceData
} from '@/data/enhancedPlasticPackagingData';
import { 
  plasticPackagingCompanies,
  plasticPackagingKPIs,
  valueChainData,
  benchmarkData
} from '@/data/plasticPackagingData';
import EnhancedCompanyCard from '@/components/EnhancedCompanyCard';
import CategoryKPIOverview from '@/components/CategoryKPIOverview';
import PlasticKPICard from '@/components/PlasticKPICard';

const PlasticPackaging = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'producer' | 'converter' | 'brand' | 'waste-management'>('all');

  const filteredCompanies = plasticPackagingCompanies.filter(company => 
    selectedCategory === 'all' || company.category === selectedCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'producer': return Factory;
      case 'converter': return Building;
      case 'brand': return Users;
      case 'waste-management': return Truck;
      default: return Factory;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'producer': return 'bg-red-100 text-red-800 border-red-200';
      case 'converter': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'brand': return 'bg-green-100 text-green-800 border-green-200';
      case 'waste-management': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatEmissions = (emissions: number) => {
    if (emissions >= 1000000) {
      return `${(emissions / 1000000).toFixed(1)}M`;
    }
    return `${(emissions / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30 rounded-xl flex items-center justify-center">
            <Factory className="h-8 w-8 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Plastic Packaging Analysis
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Comprehensive value chain emissions and circular economy tracking
            </p>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-red-700 dark:text-red-300 text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Total Emissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {plasticPackagingKPIs.totalEmissions}
            </div>
            <div className="text-sm text-red-600/80 dark:text-red-400/80">
              3.4% of global GHG emissions
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-amber-700 dark:text-amber-300 text-lg flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Waste Generation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {plasticPackagingKPIs.wasteGeneration}
            </div>
            <div className="text-sm text-amber-600/80 dark:text-amber-400/80">
              {plasticPackagingKPIs.oceanPollution} to oceans
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-700 dark:text-blue-300 text-lg flex items-center gap-2">
              <Recycle className="h-5 w-5" />
              Recycling Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {plasticPackagingKPIs.recyclingRate}
            </div>
            <div className="text-sm text-blue-600/80 dark:text-blue-400/80">
              Current global average
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-700 dark:text-green-300 text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Circular Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {plasticPackagingKPIs.circularEconomyPotential}
            </div>
            <div className="text-sm text-green-600/80 dark:text-green-400/80">
              {plasticPackagingKPIs.jobsCreated} jobs created
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="companies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="companies">Company Tracking</TabsTrigger>
          <TabsTrigger value="value-chain">Value Chain</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-6">
          {/* Category Filtering */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              All Companies ({plasticPackagingCompanies.length})
            </Button>
            <Button
              variant={selectedCategory === 'producer' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('producer')}
              className="flex items-center gap-2"
            >
              <Factory className="h-4 w-4" />
              Producers
            </Button>
            <Button
              variant={selectedCategory === 'converter' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('converter')}
              className="flex items-center gap-2"
            >
              <Building className="h-4 w-4" />
              Converters
            </Button>
            <Button
              variant={selectedCategory === 'brand' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('brand')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Brands
            </Button>
            <Button
              variant={selectedCategory === 'waste-management' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('waste-management')}
              className="flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              Waste Management
            </Button>
          </div>

          {/* Company Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => {
              const CategoryIcon = getCategoryIcon(company.category);
              
              return (
                <Card key={company.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{company.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          {company.country}
                        </CardDescription>
                      </div>
                      <Badge className={`${getCategoryColor(company.category)} border flex items-center gap-1`}>
                        <CategoryIcon className="h-3 w-3" />
                        {company.category.replace('-', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Emissions</div>
                        <div className="text-gray-600 dark:text-gray-300">{formatEmissions(company.emissions)} tCO2e</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Revenue</div>
                        <div className="text-gray-600 dark:text-gray-300">${company.revenue}B</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Circular Economy Score</span>
                          <span className="text-gray-600 dark:text-gray-300">{company.circularEconomyScore}/100</span>
                        </div>
                        <Progress value={company.circularEconomyScore} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Recycled Content</span>
                          <span className="text-gray-600 dark:text-gray-300">{company.recycledContent}%</span>
                        </div>
                        <Progress value={company.recycledContent} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Recyclability Score</span>
                          <span className="text-gray-600 dark:text-gray-300">{company.recyclabilityScore}/100</span>
                        </div>
                        <Progress value={company.recyclabilityScore} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="value-chain" className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Plastic Packaging Value Chain Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {valueChainData.stages.map((stage, index) => (
                <Card key={index} className="relative">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold text-sm">
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">{stage.name}</CardTitle>
                    </div>
                    <CardDescription>{stage.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 text-sm">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Companies</div>
                        <div className="text-gray-600 dark:text-gray-300">{stage.companies} tracked</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">Avg Emissions</div>
                        <div className="text-gray-600 dark:text-gray-300">{formatEmissions(stage.avgEmissions)} tCO2e</div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {index < valueChainData.stages.length - 1 && (
                    <div className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-white dark:bg-gray-900 border-2 border-teal-200 dark:border-teal-800 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-teal-600 dark:bg-teal-400 rounded-full"></div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="benchmarks" className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Industry Benchmarking & Leaders
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Industry Leaders */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Industry Leaders
                  </CardTitle>
                  <CardDescription>
                    Top performers across key sustainability metrics
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {benchmarkData.industryLeaders.map((leader, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{leader.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{leader.metric}</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {leader.score}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Sector Averages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Sector Averages
                  </CardTitle>
                  <CardDescription>
                    Performance benchmarks by value chain position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(benchmarkData.sectorAverages).map(([sector, averages]) => (
                    <div key={sector} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {sector.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                          <div className="font-medium">{averages.circularScore}</div>
                          <div className="text-gray-600 dark:text-gray-400">Circular Score</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                          <div className="font-medium">{averages.toxicityElimination}</div>
                          <div className="text-gray-600 dark:text-gray-400">Toxicity Elim.</div>
                        </div>
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded">
                          <div className="font-medium">{averages.recycledContent}%</div>
                          <div className="text-gray-600 dark:text-gray-400">Recycled Content</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlasticPackaging;
