
import { useState, useEffect } from 'react';
import { generateScope2Data, getScope2Trends } from '@/utils/scope2DataGenerator';

export const useEnhancedScope2Data = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const scope2Data = generateScope2Data();
        const trends = getScope2Trends();
        
        setData({
          ...scope2Data,
          trends
        });
      } catch (error) {
        console.error('Error loading Scope 2 data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading };
};
