import { supabase } from '../lib/supabase';
import type { YearData, RunningCost } from '../types/runningCosts';

export const runningCostsService = {
  async fetchAllYears(): Promise<YearData[]> {
    try {
      // Get all years
      const { data: years, error: yearsError } = await supabase
        .from('running_cost_years')
        .select('*')
        .order('year', { ascending: false });

      if (yearsError) throw yearsError;

      // Get all entries with category info
      const { data: entries, error: entriesError } = await supabase
        .from('running_cost_entries')
        .select(`
          *,
          running_cost_categories (
            id,
            name
          )
        `);

      if (entriesError) throw entriesError;

      // Transform the data into the expected format
      return years.map(year => {
        const yearEntries = entries?.filter(e => e.year_id === year.id) || [];
        
        const categories = new Map<string, {
          id: string;
          name: string;
          monthlyData: { month: number; cost: number; }[];
        }>();

        yearEntries.forEach(entry => {
          const category = entry.running_cost_categories;
          if (!category) return;

          if (!categories.has(category.id)) {
            categories.set(category.id, {
              id: category.id,
              name: category.name,
              monthlyData: []
            });
          }

          const categoryData = categories.get(category.id)!;
          categoryData.monthlyData.push({
            month: entry.month,
            cost: entry.cost || 0
          });
        });

        const costs: RunningCost[] = Array.from(categories.values()).map(category => {
          const monthlyData = Array.from({ length: 12 }, (_, i) => {
            const existingData = category.monthlyData.find(m => m.month === i + 1);
            return existingData || { month: i + 1, cost: 0 };
          }).sort((a, b) => a.month - b.month);

          return {
            id: category.id,
            name: category.name,
            monthlyData
          };
        });

        const totalCost = costs.reduce((sum, cost) => 
          sum + cost.monthlyData.reduce((monthSum, month) => monthSum + month.cost, 0)
        , 0);

        return {
          id: year.id,
          year: year.year,
          costs: costs.sort((a, b) => a.name.localeCompare(b.name)),
          totalCost
        };
      });
    } catch (error) {
      console.error('Error fetching running costs data:', error);
      throw new Error('Fehler beim Laden der Daten');
    }
  },

  async updateYear(yearId: string, newYear: number): Promise<void> {
    try {
      // Check if year already exists
      const { data: existingYear, error: checkError } = await supabase
        .from('running_cost_years')
        .select('id')
        .eq('year', newYear)
        .neq('id', yearId)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existingYear) throw new Error('Dieses Jahr existiert bereits');

      // Update year
      const { error: updateError } = await supabase
        .from('running_cost_years')
        .update({ year: newYear })
        .eq('id', yearId);

      if (updateError) throw updateError;
    } catch (error) {
      console.error('Error updating year:', error);
      throw new Error(error instanceof Error ? error.message : 'Fehler beim Aktualisieren des Jahres');
    }
  },

  async deleteYear(yearId: string): Promise<void> {
    try {
      // Delete the year (cascade will handle entries)
      const { error: deleteError } = await supabase
        .from('running_cost_years')
        .delete()
        .eq('id', yearId);

      if (deleteError) {
        console.error('Error deleting year:', deleteError);
        throw new Error('Fehler beim Löschen des Jahres');
      }
    } catch (error) {
      console.error('Error deleting year:', error);
      throw new Error('Fehler beim Löschen des Jahres');
    }
  },

  async duplicateYear(yearId: string, nextYear: number): Promise<void> {
    try {
      // First get all data from the source year
      const { data: sourceYear, error: yearError } = await supabase
        .from('running_cost_years')
        .select('*')
        .eq('id', yearId)
        .single();

      if (yearError) throw yearError;

      // Check if target year already exists
      const { data: existingYear, error: existingError } = await supabase
        .from('running_cost_years')
        .select('id')
        .eq('year', nextYear)
        .maybeSingle();

      if (existingError) throw existingError;
      if (existingYear) throw new Error('Dieses Jahr existiert bereits');

      // Create new year
      const { data: newYear, error: newYearError } = await supabase
        .from('running_cost_years')
        .insert([{ year: nextYear }])
        .select()
        .single();

      if (newYearError) throw newYearError;

      // Get all entries from source year
      const { data: entries, error: entriesError } = await supabase
        .from('running_cost_entries')
        .select('*')
        .eq('year_id', yearId);

      if (entriesError) throw entriesError;

      // Create new entries for the new year
      if (entries && entries.length > 0) {
        const newEntries = entries.map(entry => ({
          year_id: newYear.id,
          category_id: entry.category_id,
          month: entry.month,
          cost: entry.cost
        }));

        const { error: insertError } = await supabase
          .from('running_cost_entries')
          .insert(newEntries);

        if (insertError) {
          // If inserting entries fails, clean up the created year
          await supabase
            .from('running_cost_years')
            .delete()
            .eq('id', newYear.id);
          throw insertError;
        }
      }
    } catch (error) {
      console.error('Error duplicating year:', error);
      throw new Error(error instanceof Error ? error.message : 'Fehler beim Duplizieren des Jahres');
    }
  },

  async updateCost(yearId: string, categoryId: string, name: string, monthlyData: Array<{ month: number; cost: number; }>): Promise<void> {
    try {
      // Update category name
      const { error: categoryError } = await supabase
        .from('running_cost_categories')
        .update({ name })
        .eq('id', categoryId);

      if (categoryError) throw categoryError;

      // Update monthly entries
      for (const data of monthlyData) {
        const { error: entryError } = await supabase
          .from('running_cost_entries')
          .upsert({
            year_id: yearId,
            category_id: categoryId,
            month: data.month,
            cost: data.cost
          }, {
            onConflict: 'year_id,category_id,month'
          });

        if (entryError) throw entryError;
      }
    } catch (error) {
      console.error('Error updating cost:', error);
      throw new Error(error instanceof Error ? error.message : 'Fehler beim Aktualisieren des Kostenpunkts');
    }
  },

  async duplicateCost(yearId: string, categoryId: string): Promise<void> {
    try {
      // Get the source category
      const { data: category, error: categoryError } = await supabase
        .from('running_cost_categories')
        .select('name')
        .eq('id', categoryId)
        .single();

      if (categoryError) throw categoryError;

      // Generate a unique name by adding a number suffix if needed
      let newName = `${category.name} (Kopie)`;
      let counter = 1;
      let isUnique = false;

      while (!isUnique) {
        const { data: existing, error: checkError } = await supabase
          .from('running_cost_categories')
          .select('id')
          .eq('name', newName)
          .maybeSingle();

        if (checkError) throw checkError;

        if (!existing) {
          isUnique = true;
        } else {
          counter++;
          newName = `${category.name} (Kopie ${counter})`;
        }
      }

      // Create new category with unique name
      const { data: newCategory, error: newCategoryError } = await supabase
        .from('running_cost_categories')
        .insert([{ name: newName }])
        .select()
        .single();

      if (newCategoryError) throw newCategoryError;

      // Get source entries
      const { data: entries, error: entriesError } = await supabase
        .from('running_cost_entries')
        .select('*')
        .eq('year_id', yearId)
        .eq('category_id', categoryId);

      if (entriesError) throw entriesError;

      // Create new entries
      if (entries && entries.length > 0) {
        const newEntries = entries.map(entry => ({
          year_id: yearId,
          category_id: newCategory.id,
          month: entry.month,
          cost: entry.cost
        }));

        const { error: insertError } = await supabase
          .from('running_cost_entries')
          .insert(newEntries);

        if (insertError) {
          // Clean up if entry creation fails
          await supabase
            .from('running_cost_categories')
            .delete()
            .eq('id', newCategory.id);
          throw insertError;
        }
      }
    } catch (error) {
      console.error('Error duplicating cost:', error);
      throw new Error(error instanceof Error ? error.message : 'Fehler beim Duplizieren des Kostenpunkts');
    }
  },

  async deleteCost(yearId: string, categoryId: string): Promise<void> {
    try {
      // Delete all entries for this category in the year
      const { error: entriesError } = await supabase
        .from('running_cost_entries')
        .delete()
        .eq('year_id', yearId)
        .eq('category_id', categoryId);

      if (entriesError) throw entriesError;

      // Check if category is used in other years
      const { data: otherEntries, error: checkError } = await supabase
        .from('running_cost_entries')
        .select('id')
        .eq('category_id', categoryId)
        .neq('year_id', yearId)
        .limit(1);

      if (checkError) throw checkError;

      // If category is not used elsewhere, delete it
      if (!otherEntries?.length) {
        const { error: categoryError } = await supabase
          .from('running_cost_categories')
          .delete()
          .eq('id', categoryId);

        if (categoryError) throw categoryError;
      }
    } catch (error) {
      console.error('Error deleting cost:', error);
      throw new Error(error instanceof Error ? error.message : 'Fehler beim Löschen des Kostenpunkts');
    }
  },

  async getRunningCosts(startDate: Date, endDate: Date): Promise<number> {
    try {
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth() + 1;
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth() + 1;

      // Get all years between start and end year (inclusive)
      const years = Array.from(
        { length: endYear - startYear + 1 },
        (_, i) => startYear + i
      );

      // Get all year IDs
      const { data: yearData, error: yearError } = await supabase
        .from('running_cost_years')
        .select('id, year')
        .in('year', years);

      if (yearError) {
        console.error('Error fetching year data:', yearError);
        return 0;
      }
      
      if (!yearData?.length) return 0;

      const yearIds = yearData.map(y => y.id);

      // Get all costs for these years
      const { data, error } = await supabase
        .from('running_cost_entries')
        .select('cost, year_id, month, running_cost_years!inner(year)')
        .in('year_id', yearIds)
        .gte('month', startMonth)
        .lte('month', endMonth);

      if (error) {
        console.error('Error fetching cost entries:', error);
        return 0;
      }

      if (!data) return 0;

      // Filter and sum the costs
      return data.reduce((sum, entry) => {
        if (!entry.running_cost_years?.year) return sum;
        
        const year = entry.running_cost_years.year;
        const month = entry.month;

        // Check if this entry should be included based on date range
        if (year === startYear && month < startMonth) return sum;
        if (year === endYear && month > endMonth) return sum;

        return sum + (entry.cost || 0);
      }, 0);
    } catch (error) {
      console.error('Error fetching running costs:', error);
      return 0;
    }
  }
};