
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Crown, TrendingUp, Building2, Target } from 'lucide-react';
import corporateData from '@/data/sources/corporate-climate-sources.json';

interface Country {
  name: string;
  sbti_companies: number;
  reporting_quality: number;
  top_sectors: string[];
  annual_improvement: string;
  climate_leadership_score: number;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const mockCountries: Country[] = [
  { name: "United States", sbti_companies: 234, reporting_quality: 78, top_sectors: ["Technology", "Financial Services"], annual_improvement: "+8%", climate_leadership_score: 82, color: "#4ade80", x: 100, y: 200, width: 180, height: 120 },
  { name: "United Kingdom", sbti_companies: 89, reporting_quality: 84, top_sectors: ["Financial Services", "Retail"], annual_improvement: "+12%", climate_leadership_score: 87, color: "#22c55e", x: 480, y: 180, width: 60, height: 80 },
  { name: "Germany", sbti_companies: 67, reporting_quality: 82, top_sectors: ["Automotive", "Manufacturing"], annual_improvement: "+12%", climate_leadership_score: 85, color: "#22c55e", x: 520, y: 180, width: 50, height: 60 },
  { name: "Denmark", sbti_companies: 29, reporting_quality: 90, top_sectors: ["Energy", "Pharmaceuticals"], annual_improvement: "+20%", climate_leadership_score: 93, color: "#065f46", x: 510, y: 160, width: 25, height: 30 },
  { name: "Sweden", sbti_companies: 38, reporting_quality: 88, top_sectors: ["Manufacturing", "Technology"], annual_improvement: "+18%", climate_leadership_score: 91, color: "#047857", x: 530, y: 140, width: 30, height: 50 },
  { name: "China", sbti_companies: 28, reporting_quality: 68, top_sectors: ["Technology", "Manufacturing"], annual_improvement: "+22%", climate_leadership_score: 72, color: "#84cc16", x: 700, y: 220, width: 120, height: 100 },
  { name: "Japan", sbti_companies: 45, reporting_quality: 75, top_sectors: ["Technology", "Automotive"], annual_improvement: "+13%", climate_leadership_score: 79, color: "#4ade80", x: 820, y: 240, width: 40, height: 60 }
];

const CorporateClimateMap = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw world map background (simplified)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw ocean
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw countries
    mockCountries.forEach(country => {
      const isHovered = hoveredCountry?.name === country.name;
      const isSelected = selectedCountry?.name === country.name;
      
      ctx.fillStyle = isHovered || isSelected ? adjustBrightness(country.color, 20) : country.color;
      ctx.strokeStyle = isSelected ? '#0f172a' : '#374151';
      ctx.lineWidth = isSelected ? 3 : (isHovered ? 2 : 1);
      
      ctx.beginPath();
      ctx.roundRect(country.x, country.y, country.width, country.height, 4);
      ctx.fill();
      ctx.stroke();

      // Add leadership indicator for top performers
      if (country.climate_leadership_score >= 90) {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(country.x + country.width - 10, country.y + 10, 4, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Add country label
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(country.name, country.x + country.width / 2, country.y + country.height + 15);
    });
  }, [hoveredCountry, selectedCountry]);

  const adjustBrightness = (color: string, amount: number) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setMousePosition({ x: event.clientX, y: event.clientY });

    const hoveredCountry = mockCountries.find(country => 
      x >= country.x && x <= country.x + country.width &&
      y >= country.y && y <= country.y + country.height
    );

    setHoveredCountry(hoveredCountry || null);
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredCountry) {
      setSelectedCountry(hoveredCountry);
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            <Building2 className="h-4 w-4 mr-2" />
            Corporate Climate Leadership Analysis
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Global Corporate Climate Action
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Interactive analysis of corporate climate commitments and performance across 14 countries
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Corporate Climate Leadership Map</CardTitle>
            <CardDescription>
              Hover over countries to see climate action metrics, click for detailed breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={1000}
                height={400}
                className="w-full border rounded-lg cursor-pointer"
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              
              {hoveredCountry && (
                <div 
                  className="absolute bg-white p-4 rounded-lg shadow-lg border z-50 pointer-events-none"
                  style={{
                    left: mousePosition.x - 300,
                    top: mousePosition.y - 200,
                    maxWidth: "300px"
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{hoveredCountry.name}</h3>
                    {hoveredCountry.climate_leadership_score >= 90 && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-sm text-gray-600">SBTi Companies:</span>
                      <span className="font-semibold ml-2">{hoveredCountry.sbti_companies}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Reporting Quality:</span>
                      <span className="font-semibold ml-2">{hoveredCountry.reporting_quality}%</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-gray-600">Top Sectors:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {hoveredCountry.top_sectors.map(sector => (
                        <span key={sector} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          {sector}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span>Annual Improvement: <span className="text-green-600 font-semibold">{hoveredCountry.annual_improvement}</span></span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {selectedCountry && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {selectedCountry.name} - Detailed Climate Action Profile
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCountry(null)}
                >
                  Close
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                      <div className="text-2xl font-bold">{selectedCountry.sbti_companies}</div>
                      <div className="text-sm text-gray-600">Companies with SBTi Targets</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <Building2 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold">{selectedCountry.reporting_quality}%</div>
                      <div className="text-sm text-gray-600">Reporting Quality Score</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold">{selectedCountry.annual_improvement}</div>
                      <div className="text-sm text-gray-600">Annual Improvement</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <ExternalLink className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Source Attribution</h3>
                <p className="text-blue-800 mb-2">
                  <strong>Primary Source:</strong> {corporateData.source_attribution.primary_source}
                </p>
                <p className="text-sm text-blue-700">
                  {corporateData.source_attribution.methodology}
                </p>
                <a 
                  href={corporateData.source_attribution.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 underline"
                >
                  {corporateData.source_attribution.url}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CorporateClimateMap;
