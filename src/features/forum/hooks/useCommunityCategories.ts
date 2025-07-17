import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCommunityCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('community_categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');
        if (error) throw error;
        setCategories(data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return { categories, loading, selectedCategory, setSelectedCategory };
} 