import { supabase } from '../lib/supabase';
import type { YearData, Employee, MonthlyData } from '../types/personnel';

export const personnelService = {
  async fetchYearList(): Promise<YearData[]> {
    try {
      // Get all years with their total costs
      const { data: years, error } = await supabase
        .from('total_yearly_costs')
        .select('year_id, year, total_cost')
        .order('year', { ascending: false });

      if (error) throw error;

      return years.map(year => ({
        id: year.year_id,
        year: year.year,
        employees: [],
        totalCost: year.total_cost || 0
      }));
    } catch (error) {
      console.error('Error fetching year list:', error);
      throw error;
    }
  },

  async fetchYearDetails(yearId: string): Promise<YearData> {
    try {
      // Get year info with total cost
      const { data: year, error: yearError } = await supabase
        .from('total_yearly_costs')
        .select('year_id, year, total_cost')
        .eq('year_id', yearId)
        .single();

      if (yearError) throw yearError;

      // Get monthly data for this year
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('personnel_monthly_data')
        .select(`
          *,
          global_employee_id,
          global_employees (
            id,
            name
          )
        `)
        .eq('year_id', yearId);

      if (monthlyError) throw monthlyError;

      // Group data by employee
      const employeeMap = new Map<string, Employee>();

      monthlyData.forEach(md => {
        if (!md.global_employees) return;

        const employeeId = md.global_employee_id;
        if (!employeeMap.has(employeeId)) {
          employeeMap.set(employeeId, {
            id: employeeId,
            name: md.global_employees.name,
            monthlyData: []
          });
        }

        const employee = employeeMap.get(employeeId)!;
        employee.monthlyData.push({
          month: md.month,
          year: md.year,
          grundgehalt: md.grundgehalt,
          krankenversicherung: md.krankenversicherung,
          rentenversicherung: md.rentenversicherung,
          arbeitslosenversicherung: md.arbeitslosenversicherung,
          pflegeversicherung: md.pflegeversicherung,
          insolvenzgeldumlage: md.insolvenzgeldumlage,
          umlageU1: md.umlage_u1,
          umlageU2: md.umlage_u2
        });
      });

      // Sort monthly data for each employee
      const employees = Array.from(employeeMap.values()).map(employee => ({
        ...employee,
        monthlyData: employee.monthlyData.sort((a, b) => a.month - b.month)
      }));

      return {
        id: year.year_id,
        year: year.year,
        employees: employees.sort((a, b) => a.name.localeCompare(b.name)),
        totalCost: year.total_cost || 0
      };
    } catch (error) {
      console.error('Error fetching year details:', error);
      throw error;
    }
  },

  async updateEmployee(
    employeeId: string,
    yearId: string,
    name: string,
    monthlyData: MonthlyData[]
  ): Promise<void> {
    try {
      // First update the employee name if it changed
      const { error: nameError } = await supabase
        .from('global_employees')
        .update({ name })
        .eq('id', employeeId);

      if (nameError) throw nameError;

      // Then update all monthly data entries
      for (const data of monthlyData) {
        const { error: monthlyError } = await supabase
          .from('personnel_monthly_data')
          .upsert({
            global_employee_id: employeeId,
            year_id: yearId,
            month: data.month,
            year: data.year,
            grundgehalt: data.grundgehalt,
            krankenversicherung: data.krankenversicherung,
            rentenversicherung: data.rentenversicherung,
            arbeitslosenversicherung: data.arbeitslosenversicherung,
            pflegeversicherung: data.pflegeversicherung,
            insolvenzgeldumlage: data.insolvenzgeldumlage,
            umlage_u1: data.umlageU1,
            umlage_u2: data.umlageU2
          }, {
            onConflict: 'global_employee_id,year_id,month'
          });

        if (monthlyError) throw monthlyError;
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to update employee');
    }
  },

  async deleteEmployee(employeeId: string, yearId: string): Promise<void> {
    try {
      // Validate input
      if (!employeeId) throw new Error('Employee ID is required');
      if (!yearId) throw new Error('Year ID is required');

      // Delete all monthly data for this employee in this year
      const { error: deleteMonthlyError } = await supabase
        .from('personnel_monthly_data')
        .delete()
        .eq('year_id', yearId)
        .eq('global_employee_id', employeeId);

      if (deleteMonthlyError) throw deleteMonthlyError;

      // Check if this employee exists in other years
      const { data: otherYearData, error: checkOtherError } = await supabase
        .from('personnel_monthly_data')
        .select('id')
        .eq('global_employee_id', employeeId)
        .neq('year_id', yearId)
        .limit(1);

      if (checkOtherError) throw checkOtherError;

      // If employee doesn't exist in other years, delete from global_employees
      if (!otherYearData?.length) {
        const { error: deleteEmployeeError } = await supabase
          .from('global_employees')
          .delete()
          .eq('id', employeeId);

        if (deleteEmployeeError) throw deleteEmployeeError;
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to delete employee');
    }
  },

  async duplicateEmployee(yearId: string, employeeId: string): Promise<void> {
    try {
      // Get the source employee data
      const { data: sourceEmployee, error: sourceError } = await supabase
        .from('global_employees')
        .select('name')
        .eq('id', employeeId)
        .single();

      if (sourceError) {
        if (sourceError.code === 'PGRST116') {
          throw new Error('Source employee not found');
        }
        throw sourceError;
      }
      if (!sourceEmployee) throw new Error('Source employee not found');

      // Check if an employee with the same name already exists
      const copyName = `${sourceEmployee.name} (Kopie)`;
      const { data: existingEmployee, error: existingError } = await supabase
        .from('global_employees')
        .select('id')
        .eq('name', copyName)
        .maybeSingle();

      if (existingError) throw existingError;
      if (existingEmployee) throw new Error(`An employee named "${copyName}" already exists`);

      // Create new global employee with "(Kopie)" suffix
      const { data: newEmployee, error: newEmployeeError } = await supabase
        .from('global_employees')
        .insert([{ name: copyName }])
        .select()
        .single();

      if (newEmployeeError) {
        if (newEmployeeError.code === '23505') { // Unique constraint violation
          throw new Error(`An employee named "${copyName}" already exists`);
        }
        throw newEmployeeError;
      }
      if (!newEmployee) throw new Error('Failed to create new employee');

      // Get source monthly data
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('personnel_monthly_data')
        .select('*')
        .eq('year_id', yearId)
        .eq('global_employee_id', employeeId);

      if (monthlyError) throw monthlyError;
      if (!monthlyData?.length) throw new Error('Source monthly data not found');

      // Create new monthly data entries
      const newEntries = monthlyData.map(entry => ({
        year_id: yearId,
        global_employee_id: newEmployee.id,
        month: entry.month,
        year: entry.year,
        grundgehalt: entry.grundgehalt,
        krankenversicherung: entry.krankenversicherung,
        rentenversicherung: entry.rentenversicherung,
        arbeitslosenversicherung: entry.arbeitslosenversicherung,
        pflegeversicherung: entry.pflegeversicherung,
        insolvenzgeldumlage: entry.insolvenzgeldumlage,
        umlage_u1: entry.umlage_u1,
        umlage_u2: entry.umlage_u2
      }));

      const { error: insertError } = await supabase
        .from('personnel_monthly_data')
        .insert(newEntries);

      if (insertError) {
        // Clean up the created employee if monthly data insertion fails
        await supabase
          .from('global_employees')
          .delete()
          .eq('id', newEmployee.id);
        throw insertError;
      }
    } catch (error) {
      console.error('Error duplicating employee:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to duplicate employee');
    }
  },

  async duplicateYear(yearId: string, newYear: number): Promise<void> {
    try {
      // Check if source year exists
      const { data: sourceYear, error: sourceError } = await supabase
        .from('personnel_years')
        .select('*')
        .eq('id', yearId)
        .single();

      if (sourceError) {
        if (sourceError.code === 'PGRST116') {
          throw new Error('Source year not found');
        }
        throw sourceError;
      }

      // Check if target year already exists
      const { data: existingYear, error: existingError } = await supabase
        .from('personnel_years')
        .select('id')
        .eq('year', newYear)
        .maybeSingle();

      if (existingError) throw existingError;
      if (existingYear) throw new Error(`Year ${newYear} already exists`);

      // Create new year
      const { data: newYearData, error: yearError } = await supabase
        .from('personnel_years')
        .insert([{ year: newYear }])
        .select()
        .single();

      if (yearError) throw yearError;

      // Get existing monthly data
      const { data: monthlyData, error: monthlyError } = await supabase
        .from('personnel_monthly_data')
        .select('*')
        .eq('year_id', yearId);

      if (monthlyError) throw monthlyError;

      // Create new monthly data entries if there are any
      if (monthlyData && monthlyData.length > 0) {
        const newEntries = monthlyData.map(entry => ({
          year_id: newYearData.id,
          global_employee_id: entry.global_employee_id,
          month: entry.month,
          year: newYear,
          grundgehalt: entry.grundgehalt,
          krankenversicherung: entry.krankenversicherung,
          rentenversicherung: entry.rentenversicherung,
          arbeitslosenversicherung: entry.arbeitslosenversicherung,
          pflegeversicherung: entry.pflegeversicherung,
          insolvenzgeldumlage: entry.insolvenzgeldumlage,
          umlage_u1: entry.umlage_u1,
          umlage_u2: entry.umlage_u2
        }));

        const { error: insertError } = await supabase
          .from('personnel_monthly_data')
          .insert(newEntries);

        if (insertError) {
          // Clean up the created year if inserting monthly data fails
          await supabase
            .from('personnel_years')
            .delete()
            .eq('id', newYearData.id);
          throw insertError;
        }
      }
    } catch (error) {
      console.error('Error duplicating year:', error);
      throw error;
    }
  },

  async deleteYear(yearId: string): Promise<void> {
    try {
      // First check if the year exists
      const { data: year, error: checkError } = await supabase
        .from('personnel_years')
        .select('id')
        .eq('id', yearId)
        .single();

      if (checkError) {
        if (checkError.code === 'PGRST116') {
          throw new Error('Year not found');
        }
        throw checkError;
      }

      // Delete the year (cascade will handle monthly data)
      const { error: deleteError } = await supabase
        .from('personnel_years')
        .delete()
        .eq('id', yearId);

      if (deleteError) throw deleteError;
    } catch (error) {
      console.error('Error deleting year:', error);
      throw error;
    }
  },

  async getPersonnelCosts(startDate: Date, endDate: Date): Promise<number> {
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
        .from('personnel_years')
        .select('id, year')
        .in('year', years);

      if (yearError) {
        console.error('Error fetching year data:', yearError);
        return 0;
      }
      
      if (!yearData?.length) return 0;

      const yearIds = yearData.map(y => y.id);

      // Get all costs from employee_monthly_costs view
      const { data, error } = await supabase
        .from('employee_monthly_costs')
        .select('total_cost')
        .in('year_id', yearIds)
        .gte('month', startMonth)
        .lte('month', endMonth);

      if (error) {
        console.error('Error fetching monthly costs:', error);
        return 0;
      }

      // Sum up all costs
      return data?.reduce((sum, entry) => sum + (entry.total_cost || 0), 0) || 0;
    } catch (error) {
      console.error('Error calculating personnel costs:', error);
      return 0;
    }
  }
};