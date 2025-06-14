
import { useState, useEffect } from 'react';
import { generateScope2Data, getScope2Trends } from '@/utils/scope2DataGenerator';

export const useEnhancedScope2Data = (companyId?: string) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const scope2Data = generateScope2Data();
        const trends = getScope2Trends();
        
        setData({
          ...scope2Data,
          trends,
          // Add comprehensive energy KPIs
          energyKPIs: {
            gridCarbonIntensity: {
              value: 425,
              unit: 'kg CO2/MWh',
              industryAvg: 480,
              status: 'good'
            },
            renewableEnergyPercent: {
              value: 68,
              target: 80,
              status: 'good'
            },
            energyIntensity: {
              value: 2.4,
              unit: 'MWh/M revenue',
              rank: 15,
              total: 50
            },
            industryRank: {
              position: 12,
              total: 45,
              sector: 'Technology'
            },
            annualReduction: {
              value: 8.5,
              target: 10,
              status: 'good'
            },
            carbonCostExposure: {
              value: 125000,
              trend: 'decreasing'
            }
          },
          // Enhanced benchmarking data
          benchmarking: {
            efficiencyRank: 8,
            intensityPercentile: 75,
            renewableRank: 12,
            regionalRank: 6
          },
          // Regional energy intelligence
          regionalData: [
            {
              region: 'North America',
              gridIntensity: 400,
              gridStatus: 'stable',
              consumptionPercent: 45,
              renewableProgress: 78,
              opportunities: ['Solar PPA expansion', 'Battery storage'],
              achievements: ['ISO 50001 certified', 'Smart grid integration']
            },
            {
              region: 'Europe',
              gridIntensity: 280,
              gridStatus: 'improving',
              consumptionPercent: 30,
              renewableProgress: 85,
              opportunities: ['Wind energy contracts', 'Grid flexibility'],
              achievements: ['Green certificates', 'Energy efficiency upgrades']
            },
            {
              region: 'Asia Pacific',
              gridIntensity: 650,
              gridStatus: 'transitioning',
              consumptionPercent: 25,
              renewableProgress: 42,
              opportunities: ['Renewable certificates', 'Coal phase-out'],
              achievements: ['Energy management system', 'Efficiency targets met']
            }
          ],
          // Strategic insights
          insights: {
            marketLocationExplanation: {
              marketBased: 'Reflects actual energy purchasing decisions and renewable energy certificates',
              locationBased: 'Based on average grid emissions factor for physical location',
              impact: 'Market-based approach shows 15% lower emissions due to renewable energy procurement'
            },
            highlights: [
              'Achieved 68% renewable energy mix, above industry average of 45%',
              'Grid carbon intensity 12% below regional average',
              'Energy intensity improved 8.5% year-over-year',
              'Ranked #12 in sector for renewable energy adoption'
            ],
            opportunities: [
              {
                title: 'Solar PPA Expansion',
                impact: '15% emission reduction',
                description: 'Additional 50MW solar capacity through power purchase agreements'
              },
              {
                title: 'Energy Storage Integration',
                impact: '8% grid optimization',
                description: 'Battery storage to optimize renewable energy utilization'
              },
              {
                title: 'Smart Grid Technologies',
                impact: '12% efficiency gain',
                description: 'Advanced metering and demand response systems'
              }
            ]
          }
        });
      } catch (error) {
        console.error('Error loading Scope 2 data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [companyId]);

  return { data, isLoading };
};
