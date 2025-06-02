
import { supabase } from '@/integrations/supabase/client';

/**
 * Add new emission entry
 */
export async function addEmissionEntry(entryData: {
  company_id: string;
  date: string;
  category: string;
  amount: number;
  unit: string;
  description?: string;
}) {
  try {
    // For now, we'll add to a tracking table - you may want to create this table
    // This is a simplified version that adds to emissions_data
    const year = new Date(entryData.date).getFullYear();
    
    // Check if entry for this year exists
    const { data: existingEntry } = await supabase
      .from('emissions_data')
      .select('*')
      .eq('company_id', entryData.company_id)
      .eq('year', year)
      .single();

    if (existingEntry) {
      // Update existing entry (simplified logic)
      const updateData: any = {};
      if (entryData.category === 'electricity') {
        updateData.scope2 = existingEntry.scope2 + entryData.amount;
      } else if (entryData.category === 'fuel') {
        updateData.scope1 = existingEntry.scope1 + entryData.amount;
      } else {
        updateData.scope3 = existingEntry.scope3 + entryData.amount;
      }

      const { error } = await supabase
        .from('emissions_data')
        .update(updateData)
        .eq('id', existingEntry.id);

      if (error) throw error;
    } else {
      // Create new entry
      const newEntry = {
        company_id: entryData.company_id,
        year: year,
        scope1: entryData.category === 'fuel' ? entryData.amount : 0,
        scope2: entryData.category === 'electricity' ? entryData.amount : 0,
        scope3: !['fuel', 'electricity'].includes(entryData.category) ? entryData.amount : 0
      };

      const { error } = await supabase
        .from('emissions_data')
        .insert([newEntry]);

      if (error) throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding emission entry:', error);
    return { success: false, error };
  }
}
