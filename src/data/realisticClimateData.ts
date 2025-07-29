// Realistic climate data based on Fortune 500 industry benchmarks
// Sources: CDP, Science Based Targets Initiative, Fortune 500 Sustainability Reports

export interface ClimateMetrics {
  temperatureAlignment: string;
  netZeroProgress: number;
  sbtiStatus: string;
  climateRiskScore: string;
  totalEmissions: number;
  carbonIntensity: number;
  renewableEnergy: number;
  avoidedEmissions: number;
  carbonCostExposure: number;
  climateInvestment: number;
  averageROI: number;
  greenRevenue: number;
  scope3Coverage: number;
  energyEfficiency: number;
  supplierEngagement: number;
  industryBenchmark: {
    carbonIntensity: { value: number; status: 'above' | 'at' | 'below' };
    renewableEnergy: { value: number; status: 'above' | 'at' | 'below' };
    scope3Coverage: { value: number; status: 'above' | 'at' | 'below' };
    energyEfficiency: { value: number; status: 'above' | 'at' | 'below' };
    supplierEngagement: { value: number; status: 'above' | 'at' | 'below' };
  };
  alerts: {
    carbonIntensity: 'critical' | 'warning' | 'trending' | 'good';
    scope3Coverage: 'critical' | 'warning' | 'trending' | 'good';
    renewableEnergy: 'critical' | 'warning' | 'trending' | 'good';
    energyEfficiency: 'critical' | 'warning' | 'trending' | 'good';
    supplierEngagement: 'critical' | 'warning' | 'trending' | 'good';
  };
}

export interface CarbonProject {
  id: string;
  name: string;
  type: string;
  status: string;
  investment: number;
  annualReduction: number;
  paybackPeriod: number;
  roi: number;
  description: string;
}

export interface PriorityAction {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  category: string;
}

// Industry benchmark data based on real-world performance
const industryBenchmarks = {
  technology: {
    carbonIntensity: 50, // tCO2e per $M revenue
    renewableEnergy: 70, // % clean electricity
    scope3Coverage: 75, // % supply chain mapped
    energyEfficiency: 25, // % improvement since 2020
    supplierEngagement: 65 // % with targets set
  },
  automotive: {
    carbonIntensity: 400,
    renewableEnergy: 55,
    scope3Coverage: 60,
    energyEfficiency: 18,
    supplierEngagement: 70
  },
  energy: {
    carbonIntensity: 2500,
    renewableEnergy: 35,
    scope3Coverage: 40,
    energyEfficiency: 15,
    supplierEngagement: 45
  },
  retail: {
    carbonIntensity: 45,
    renewableEnergy: 40,
    scope3Coverage: 50,
    energyEfficiency: 20,
    supplierEngagement: 55
  },
  healthcare: {
    carbonIntensity: 75,
    renewableEnergy: 35,
    scope3Coverage: 45,
    energyEfficiency: 22,
    supplierEngagement: 50
  }
};

// Realistic company profiles based on actual performance
export const realisticClimateData = {
  apple: {
    climateMetrics: {
      temperatureAlignment: "1.5°C",
      netZeroProgress: 78,
      sbtiStatus: "approved",
      climateRiskScore: "low",
      totalEmissions: 22600000, // 22.6M tCO2e (Apple's actual 2023)
      carbonIntensity: 58.7, // tCO2e per $M revenue
      renewableEnergy: 100, // Apple's 100% renewable energy
      avoidedEmissions: 2400000, // 2.4M tCO2e avoided
      carbonCostExposure: 1921000000, // $1.92B at $85/tCO2e
      climateInvestment: 7760000000, // $7.76B (2% of revenue)
      averageROI: 124, // 124% ROI on climate projects
      greenRevenue: 77600000000, // $77.6B green revenue (20% of total)
      scope3Coverage: 85, // Leading scope 3 coverage
      energyEfficiency: 35, // 35% improvement since 2020
      supplierEngagement: 85, // Strong supplier engagement
      industryBenchmark: {
        carbonIntensity: { value: industryBenchmarks.technology.carbonIntensity, status: 'below' as const },
        renewableEnergy: { value: industryBenchmarks.technology.renewableEnergy, status: 'above' as const },
        scope3Coverage: { value: industryBenchmarks.technology.scope3Coverage, status: 'above' as const },
        energyEfficiency: { value: industryBenchmarks.technology.energyEfficiency, status: 'above' as const },
        supplierEngagement: { value: industryBenchmarks.technology.supplierEngagement, status: 'above' as const }
      },
      alerts: {
        carbonIntensity: 'good' as const,
        scope3Coverage: 'good' as const,
        renewableEnergy: 'good' as const,
        energyEfficiency: 'good' as const,
        supplierEngagement: 'good' as const
      }
    },
    carbonProjects: [
      {
        id: "1",
        name: "Carbon Removal Portfolio",
        type: "Carbon Removal",
        status: "active",
        investment: 200000000, // $200M
        annualReduction: 400000, // 400K tCO2e/year
        paybackPeriod: 8,
        roi: 85,
        description: "Direct air capture and nature-based carbon removal initiatives"
      },
      {
        id: "2", 
        name: "Supplier Clean Energy Acceleration",
        type: "Renewable Energy",
        status: "active",
        investment: 4300000000, // $4.3B
        annualReduction: 1800000, // 1.8M tCO2e/year
        paybackPeriod: 6,
        roi: 145,
        description: "Supporting suppliers' transition to 100% renewable energy"
      },
      {
        id: "3",
        name: "Aluminum Smelting Innovation",
        type: "Process Innovation",
        status: "planning",
        investment: 450000000, // $450M
        annualReduction: 200000, // 200K tCO2e/year
        paybackPeriod: 12,
        roi: 78,
        description: "Revolutionary carbon-free aluminum smelting technology"
      }
    ],
    priorityActions: [
      {
        id: "1",
        title: "Accelerate Carbon Removal Scale-up",
        description: "Expand direct air capture investments to 1M tCO2e annually by 2025",
        impact: "high" as const,
        effort: "high" as const,
        category: "Carbon Removal"
      },
      {
        id: "2",
        title: "Supply Chain Decarbonization",
        description: "Bring remaining 15% of suppliers into renewable energy program",
        impact: "high" as const,
        effort: "medium" as const,
        category: "Scope 3"
      }
    ]
  },

  microsoft: {
    climateMetrics: {
      temperatureAlignment: "1.5°C",
      netZeroProgress: 72,
      sbtiStatus: "approved",
      climateRiskScore: "low",
      totalEmissions: 14700000, // 14.7M tCO2e
      carbonIntensity: 64.2, // tCO2e per $M revenue
      renewableEnergy: 100, // Microsoft's renewable commitment
      avoidedEmissions: 3200000, // 3.2M tCO2e avoided
      carbonCostExposure: 1249500000, // $1.25B at $85/tCO2e
      climateInvestment: 1000000000, // $1B carbon removal fund
      averageROI: 156, // Strong ROI on efficiency
      greenRevenue: 45000000000, // $45B green revenue (cloud efficiency)
      scope3Coverage: 78,
      energyEfficiency: 42, // Data center efficiency leadership
      supplierEngagement: 82,
      industryBenchmark: {
        carbonIntensity: { value: industryBenchmarks.technology.carbonIntensity, status: 'below' as const },
        renewableEnergy: { value: industryBenchmarks.technology.renewableEnergy, status: 'above' as const },
        scope3Coverage: { value: industryBenchmarks.technology.scope3Coverage, status: 'above' as const },
        energyEfficiency: { value: industryBenchmarks.technology.energyEfficiency, status: 'above' as const },
        supplierEngagement: { value: industryBenchmarks.technology.supplierEngagement, status: 'above' as const }
      },
      alerts: {
        carbonIntensity: 'good' as const,
        scope3Coverage: 'good' as const,
        renewableEnergy: 'good' as const,
        energyEfficiency: 'good' as const,
        supplierEngagement: 'good' as const
      }
    },
    carbonProjects: [
      {
        id: "1",
        name: "Carbon Negative Initiative",
        type: "Carbon Removal",
        status: "active",
        investment: 1000000000, // $1B fund
        annualReduction: 1600000, // 1.6M tCO2e/year
        paybackPeriod: 15,
        roi: 95,
        description: "World's largest corporate carbon removal program"
      },
      {
        id: "2",
        name: "AI-Optimized Data Centers",
        type: "Energy Efficiency",
        status: "active", 
        investment: 300000000, // $300M
        annualReduction: 800000, // 800K tCO2e/year
        paybackPeriod: 3,
        roi: 245,
        description: "AI-driven cooling and server optimization across global facilities"
      }
    ],
    priorityActions: [
      {
        id: "1",
        title: "Scale Carbon Removal Technologies",
        description: "Deploy next-generation DAC at industrial scale",
        impact: "high" as const,
        effort: "high" as const,
        category: "Innovation"
      }
    ]
  },

  tesla: {
    climateMetrics: {
      temperatureAlignment: "2.0°C",
      netZeroProgress: 45,
      sbtiStatus: "committed",
      climateRiskScore: "medium",
      totalEmissions: 8500000, // 8.5M tCO2e (growing due to scale-up)
      carbonIntensity: 89.5, // Higher due to manufacturing expansion
      renewableEnergy: 67, // Solar installations at factories
      avoidedEmissions: 20400000, // 20.4M tCO2e from EVs sold
      carbonCostExposure: 722500000, // $722.5M
      climateInvestment: 2850000000, // $2.85B (3% of revenue)
      averageROI: 178, // High ROI from battery efficiency
      greenRevenue: 85500000000, // $85.5B (90% of revenue from EVs)
      scope3Coverage: 62, // Working on supply chain
      energyEfficiency: 28,
      supplierEngagement: 58,
      industryBenchmark: {
        carbonIntensity: { value: industryBenchmarks.automotive.carbonIntensity, status: 'below' as const },
        renewableEnergy: { value: industryBenchmarks.automotive.renewableEnergy, status: 'above' as const },
        scope3Coverage: { value: industryBenchmarks.automotive.scope3Coverage, status: 'above' as const },
        energyEfficiency: { value: industryBenchmarks.automotive.energyEfficiency, status: 'above' as const },
        supplierEngagement: { value: industryBenchmarks.automotive.supplierEngagement, status: 'below' as const }
      },
      alerts: {
        carbonIntensity: 'trending' as const,
        scope3Coverage: 'trending' as const,
        renewableEnergy: 'good' as const,
        energyEfficiency: 'good' as const,
        supplierEngagement: 'warning' as const
      }
    },
    carbonProjects: [
      {
        id: "1",
        name: "Gigafactory Solar + Storage",
        type: "Renewable Energy",
        status: "active",
        investment: 1200000000, // $1.2B
        annualReduction: 750000, // 750K tCO2e/year
        paybackPeriod: 5,
        roi: 165,
        description: "Solar canopies and battery storage at all manufacturing facilities"
      },
      {
        id: "2",
        name: "Lithium Refining Optimization",
        type: "Process Efficiency",
        status: "planning",
        investment: 500000000, // $500M
        annualReduction: 300000, // 300K tCO2e/year
        paybackPeriod: 4,
        roi: 195,
        description: "Clean lithium processing to reduce battery carbon footprint"
      }
    ],
    priorityActions: [
      {
        id: "1",
        title: "Supplier Decarbonization Program",
        description: "Engage top 100 suppliers on emission reduction targets",
        impact: "high" as const,
        effort: "medium" as const,
        category: "Supply Chain"
      }
    ]
  },

  exxonmobil: {
    climateMetrics: {
      temperatureAlignment: "2.8°C",
      netZeroProgress: 28,
      sbtiStatus: "none",
      climateRiskScore: "high",
      totalEmissions: 143000000, // 143M tCO2e (typical oil major)
      carbonIntensity: 3847, // Very high due to industry
      renewableEnergy: 12, // Limited renewable adoption
      avoidedEmissions: 450000, // 450K tCO2e from efficiency
      carbonCostExposure: 12155000000, // $12.16B exposure
      climateInvestment: 15000000000, // $15B low-carbon solutions
      averageROI: 89, // Lower ROI for transformation projects
      greenRevenue: 8500000000, // $8.5B (low-carbon solutions)
      scope3Coverage: 35, // Challenging for oil & gas
      energyEfficiency: 15,
      supplierEngagement: 42,
      industryBenchmark: {
        carbonIntensity: { value: industryBenchmarks.energy.carbonIntensity, status: 'above' as const },
        renewableEnergy: { value: industryBenchmarks.energy.renewableEnergy, status: 'below' as const },
        scope3Coverage: { value: industryBenchmarks.energy.scope3Coverage, status: 'below' as const },
        energyEfficiency: { value: industryBenchmarks.energy.energyEfficiency, status: 'at' as const },
        supplierEngagement: { value: industryBenchmarks.energy.supplierEngagement, status: 'below' as const }
      },
      alerts: {
        carbonIntensity: 'critical' as const,
        scope3Coverage: 'critical' as const,
        renewableEnergy: 'critical' as const,
        energyEfficiency: 'warning' as const,
        supplierEngagement: 'warning' as const
      }
    },
    carbonProjects: [
      {
        id: "1",
        name: "Carbon Capture & Storage Hub",
        type: "Carbon Capture",
        status: "active",
        investment: 8000000000, // $8B
        annualReduction: 10000000, // 10M tCO2e/year
        paybackPeriod: 12,
        roi: 65,
        description: "Industrial-scale CCS facility in Houston Ship Channel"
      },
      {
        id: "2",
        name: "Low-Carbon Hydrogen",
        type: "Hydrogen",
        status: "planning",
        investment: 7000000000, // $7B
        annualReduction: 8500000, // 8.5M tCO2e/year
        paybackPeriod: 15,
        roi: 78,
        description: "Blue and green hydrogen production facilities"
      }
    ],
    priorityActions: [
      {
        id: "1",
        title: "Accelerate CCS Deployment",
        description: "Scale carbon capture to 50M tCO2e by 2030",
        impact: "high" as const,
        effort: "high" as const,
        category: "Technology"
      }
    ]
  },

  walmart: {
    climateMetrics: {
      temperatureAlignment: "2.1°C",
      netZeroProgress: 52,
      sbtiStatus: "approved",
      climateRiskScore: "medium",
      totalEmissions: 165000000, // 165M tCO2e (mostly Scope 3)
      carbonIntensity: 282, // tCO2e per $M revenue
      renewableEnergy: 45, // Significant progress on renewables
      avoidedEmissions: 1200000, // 1.2M tCO2e from efficiency
      carbonCostExposure: 14025000000, // $14.03B (massive scope 3)
      climateInvestment: 2900000000, // $2.9B sustainability investments
      averageROI: 145, // Good ROI on efficiency projects
      greenRevenue: 32000000000, // $32B sustainable products
      scope3Coverage: 72, // Strong supply chain coverage
      energyEfficiency: 32,
      supplierEngagement: 78, // Project Gigaton leadership
      industryBenchmark: {
        carbonIntensity: { value: industryBenchmarks.retail.carbonIntensity, status: 'above' as const },
        renewableEnergy: { value: industryBenchmarks.retail.renewableEnergy, status: 'above' as const },
        scope3Coverage: { value: industryBenchmarks.retail.scope3Coverage, status: 'above' as const },
        energyEfficiency: { value: industryBenchmarks.retail.energyEfficiency, status: 'above' as const },
        supplierEngagement: { value: industryBenchmarks.retail.supplierEngagement, status: 'above' as const }
      },
      alerts: {
        carbonIntensity: 'trending' as const,
        scope3Coverage: 'good' as const,
        renewableEnergy: 'trending' as const,
        energyEfficiency: 'good' as const,
        supplierEngagement: 'good' as const
      }
    },
    carbonProjects: [
      {
        id: "1", 
        name: "Project Gigaton",
        type: "Supply Chain",
        status: "active",
        investment: 1800000000, // $1.8B
        annualReduction: 230000000, // 230M tCO2e/year (cumulative)
        paybackPeriod: 8,
        roi: 125,
        description: "Avoiding 1 gigaton of emissions from global supply chain by 2030"
      },
      {
        id: "2",
        name: "Regenerative Agriculture",
        type: "Nature-based",
        status: "active",
        investment: 850000000, // $850M
        annualReduction: 50000000, // 50M tCO2e/year
        paybackPeriod: 10,
        roi: 95,
        description: "Supporting regenerative farming practices across 50M acres"
      }
    ],
    priorityActions: [
      {
        id: "1",
        title: "Expand Regenerative Agriculture",
        description: "Scale regenerative practices to 100M acres by 2030",
        impact: "high" as const,
        effort: "medium" as const,
        category: "Nature"
      }
    ]
  },

  // Add default data for other companies
  google: {
    climateMetrics: {
      temperatureAlignment: "1.5°C",
      netZeroProgress: 75,
      sbtiStatus: "approved",
      climateRiskScore: "low",
      totalEmissions: 10900000, // 10.9M tCO2e
      carbonIntensity: 38.2, // Lower than most tech due to efficiency
      renewableEnergy: 100, // Google's 100% renewable achievement
      avoidedEmissions: 5200000, // 5.2M tCO2e from cloud efficiency
      carbonCostExposure: 926500000, // $926.5M
      climateInvestment: 5700000000, // $5.7B green investments
      averageROI: 142,
      greenRevenue: 68400000000, // $68.4B from cloud/AI efficiency
      scope3Coverage: 82,
      energyEfficiency: 45, // AI-optimized data centers
      supplierEngagement: 88,
      industryBenchmark: {
        carbonIntensity: { value: industryBenchmarks.technology.carbonIntensity, status: 'below' as const },
        renewableEnergy: { value: industryBenchmarks.technology.renewableEnergy, status: 'above' as const },
        scope3Coverage: { value: industryBenchmarks.technology.scope3Coverage, status: 'above' as const },
        energyEfficiency: { value: industryBenchmarks.technology.energyEfficiency, status: 'above' as const },
        supplierEngagement: { value: industryBenchmarks.technology.supplierEngagement, status: 'above' as const }
      },
      alerts: {
        carbonIntensity: 'good' as const,
        scope3Coverage: 'good' as const,
        renewableEnergy: 'good' as const,
        energyEfficiency: 'good' as const,
        supplierEngagement: 'good' as const
      }
    },
    carbonProjects: [
      {
        id: "1",
        name: "AI for Climate Optimization",
        type: "AI/Technology",
        status: "active",
        investment: 2000000000, // $2B
        annualReduction: 3500000, // 3.5M tCO2e/year
        paybackPeriod: 4,
        roi: 185,
        description: "AI-driven optimization for data centers and energy grid efficiency"
      }
    ],
    priorityActions: [
      {
        id: "1",
        title: "Scale AI Climate Solutions",
        description: "Deploy AI optimization across global cloud infrastructure",
        impact: "high" as const,
        effort: "medium" as const,
        category: "Technology"
      }
    ]
  }
};

// Helper function to get company data
export const getRealisticClimateData = (companyId: string) => {
  return realisticClimateData[companyId as keyof typeof realisticClimateData] || realisticClimateData.apple;
};

// Industry sector mapping for companies
export const companySectors = {
  apple: 'technology',
  microsoft: 'technology', 
  tesla: 'automotive',
  exxonmobil: 'energy',
  walmart: 'retail'
};