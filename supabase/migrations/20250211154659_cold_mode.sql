-- Restore RLS policies for running costs
DROP POLICY IF EXISTS "Users can view running cost years" ON running_cost_years;
DROP POLICY IF EXISTS "Users can insert running cost years" ON running_cost_years;
DROP POLICY IF EXISTS "Users can update running cost years" ON running_cost_years;
DROP POLICY IF EXISTS "Users can delete running cost years" ON running_cost_years;

CREATE POLICY "Public can view running cost years" ON running_cost_years FOR SELECT USING (true);
CREATE POLICY "Public can insert running cost years" ON running_cost_years FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update running cost years" ON running_cost_years FOR UPDATE USING (true);
CREATE POLICY "Public can delete running cost years" ON running_cost_years FOR DELETE USING (true);

DROP POLICY IF EXISTS "Users can view running cost categories" ON running_cost_categories;
DROP POLICY IF EXISTS "Users can insert running cost categories" ON running_cost_categories;
DROP POLICY IF EXISTS "Users can update running cost categories" ON running_cost_categories;
DROP POLICY IF EXISTS "Users can delete running cost categories" ON running_cost_categories;

CREATE POLICY "Public can view running cost categories" ON running_cost_categories FOR SELECT USING (true);
CREATE POLICY "Public can insert running cost categories" ON running_cost_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update running cost categories" ON running_cost_categories FOR UPDATE USING (true);
CREATE POLICY "Public can delete running cost categories" ON running_cost_categories FOR DELETE USING (true);

DROP POLICY IF EXISTS "Users can view running cost entries" ON running_cost_entries;
DROP POLICY IF EXISTS "Users can insert running cost entries" ON running_cost_entries;
DROP POLICY IF EXISTS "Users can update running cost entries" ON running_cost_entries;
DROP POLICY IF EXISTS "Users can delete running cost entries" ON running_cost_entries;

CREATE POLICY "Public can view running cost entries" ON running_cost_entries FOR SELECT USING (true);
CREATE POLICY "Public can insert running cost entries" ON running_cost_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update running cost entries" ON running_cost_entries FOR UPDATE USING (true);
CREATE POLICY "Public can delete running cost entries" ON running_cost_entries FOR DELETE USING (true);

-- Restore RLS policies for personnel costs
DROP POLICY IF EXISTS "Users can view personnel years" ON personnel_years;
DROP POLICY IF EXISTS "Users can insert personnel years" ON personnel_years;
DROP POLICY IF EXISTS "Users can update personnel years" ON personnel_years;
DROP POLICY IF EXISTS "Users can delete personnel years" ON personnel_years;

CREATE POLICY "Public can view personnel years" ON personnel_years FOR SELECT USING (true);
CREATE POLICY "Public can insert personnel years" ON personnel_years FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update personnel years" ON personnel_years FOR UPDATE USING (true);
CREATE POLICY "Public can delete personnel years" ON personnel_years FOR DELETE USING (true);

DROP POLICY IF EXISTS "Users can view global employees" ON global_employees;
DROP POLICY IF EXISTS "Users can insert global employees" ON global_employees;
DROP POLICY IF EXISTS "Users can update global employees" ON global_employees;
DROP POLICY IF EXISTS "Users can delete global employees" ON global_employees;

CREATE POLICY "Public can view global employees" ON global_employees FOR SELECT USING (true);
CREATE POLICY "Public can insert global employees" ON global_employees FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update global employees" ON global_employees FOR UPDATE USING (true);
CREATE POLICY "Public can delete global employees" ON global_employees FOR DELETE USING (true);

DROP POLICY IF EXISTS "Users can view personnel monthly data" ON personnel_monthly_data;
DROP POLICY IF EXISTS "Users can insert personnel monthly data" ON personnel_monthly_data;
DROP POLICY IF EXISTS "Users can update personnel monthly data" ON personnel_monthly_data;
DROP POLICY IF EXISTS "Users can delete personnel monthly data" ON personnel_monthly_data;

CREATE POLICY "Public can view personnel monthly data" ON personnel_monthly_data FOR SELECT USING (true);
CREATE POLICY "Public can insert personnel monthly data" ON personnel_monthly_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update personnel monthly data" ON personnel_monthly_data FOR UPDATE USING (true);
CREATE POLICY "Public can delete personnel monthly data" ON personnel_monthly_data FOR DELETE USING (true);