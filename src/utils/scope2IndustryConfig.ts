
export interface IndustryMultiplier {
  grid: number;
  renewable: number;
  intensity: number;
  cost: number;
}

export const industryMultipliers: Record<string, IndustryMultiplier> = {
  'Technology': { grid: 0.9, renewable: 1.2, intensity: 0.6, cost: 0.8 },
  'Software Development': { grid: 0.9, renewable: 1.2, intensity: 0.6, cost: 0.8 },
  'E-commerce & Cloud': { grid: 0.85, renewable: 1.3, intensity: 0.5, cost: 0.9 },
  'Software & Cloud': { grid: 0.85, renewable: 1.3, intensity: 0.5, cost: 0.9 },
  'Automotive': { grid: 1.2, renewable: 0.8, intensity: 1.8, cost: 1.5 },
  'Electric Vehicles': { grid: 1.0, renewable: 1.1, intensity: 1.4, cost: 1.2 },
  'Oil & Gas': { grid: 1.3, renewable: 0.6, intensity: 2.0, cost: 2.0 },
  'Energy': { grid: 0.8, renewable: 1.4, intensity: 1.2, cost: 1.0 },
  'Consumer Goods': { grid: 1.1, renewable: 0.9, intensity: 1.1, cost: 1.1 },
  'Food & Beverage': { grid: 1.2, renewable: 0.8, intensity: 1.4, cost: 1.3 },
  'Manufacturing': { grid: 1.3, renewable: 0.7, intensity: 1.6, cost: 1.4 },
  'Retail': { grid: 1.0, renewable: 0.9, intensity: 0.9, cost: 1.0 },
  'Healthcare': { grid: 1.1, renewable: 0.8, intensity: 1.2, cost: 1.2 },
  'Financial Services': { grid: 0.95, renewable: 1.0, intensity: 0.8, cost: 0.9 }
};

export const getIndustryMultiplier = (industry: string): IndustryMultiplier => {
  return industryMultipliers[industry] || industryMultipliers['Technology'];
};
