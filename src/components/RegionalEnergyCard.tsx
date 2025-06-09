
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface RegionalEnergyCardProps {
  region: string;
  gridIntensity: number;
  gridStatus: 'good' | 'average' | 'poor';
  consumptionPercent: number;
  renewableProgress: number;
  opportunities: string[];
  achievements: string[];
}

const RegionalEnergyCard = ({
  region,
  gridIntensity,
  gridStatus,
  consumptionPercent,
  renewableProgress,
  opportunities,
  achievements
}: RegionalEnergyCardProps) => {
  const getGridStatusColor = () => {
    switch (gridStatus) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getGridStatusText = () => {
    switch (gridStatus) {
      case 'good': return 'Clean Grid';
      case 'poor': return 'High Carbon';
      default: return 'Mixed Grid';
    }
  };

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          {region}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGridStatusColor()}`}>
            {getGridStatusText()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Grid Carbon Intensity */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Grid Carbon Intensity</span>
          <span className="text-lg font-semibold">{gridIntensity} kg CO2/MWh</span>
        </div>

        {/* Energy Consumption */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Energy Consumption</span>
          <span className="text-lg font-semibold">{consumptionPercent}%</span>
        </div>

        {/* Renewable Energy Progress */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Renewable Energy</span>
            <span>{renewableProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, renewableProgress)}%` }}
            ></div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Achievements
          </h4>
          <ul className="space-y-1">
            {achievements.slice(0, 2).map((achievement, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                <div className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                {achievement}
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div>
          <h4 className="text-sm font-medium text-gray-800 mb-2 flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-teal-600" />
            Opportunities
          </h4>
          <ul className="space-y-1">
            {opportunities.slice(0, 2).map((opportunity, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                <div className="w-1 h-1 bg-teal-600 rounded-full mt-2 flex-shrink-0"></div>
                {opportunity}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegionalEnergyCard;
