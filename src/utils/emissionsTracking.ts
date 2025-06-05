
import { supabase } from '@/integrations/supabase/client';

/**
 * Add new emission entry (secured by RLS policies)
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
    console.log('Adding emission entry with enhanced security...');
    
    const year = new Date(entryData.date).getFullYear();
    
    // Check if entry for this year exists (will be filtered by RLS)
    const { data: existingEntry, error: fetchError } = await supabase
      .from('emissions_data')
      .select('*')
      .eq('company_id', entryData.company_id)
      .eq('year', year)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Access denied or error checking existing entry:', fetchError.message);
      return { success: false, error: fetchError, noAccess: true };
    }

    if (existingEntry) {
      // Update existing entry (RLS will ensure user has write access)
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

      if (error) {
        console.error('Access denied updating emission entry:', error.message);
        return { success: false, error, noAccess: true };
      }
    } else {
      // Create new entry (RLS will ensure user has write access)
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

      if (error) {
        console.error('Access denied creating emission entry:', error.message);
        return { success: false, error, noAccess: true };
      }
    }

    console.log('Emission entry added successfully');
    return { success: true };
  } catch (error) {
    console.error('Error adding emission entry:', error);
    return { success: false, error };
  }
}
