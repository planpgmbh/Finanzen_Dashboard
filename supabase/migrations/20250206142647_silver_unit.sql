/*
  # Refactor Personnel Schema

  1. New Tables
    - `employees` table for centralized employee management
      - `id` (uuid, primary key)
      - `name` (text)
      - `created_at` (timestamp)

  2. Changes
    - Add `employee_id` to `personnel_employees` table
    - Remove redundant `total_cost` from `personnel_years`
    - Add view for calculating total costs

  3. Security
    - Enable RLS on new table
    - Add policies for authenticated users
*/

-- Create employees table
CREATE TABLE employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- Create policies for employees table
CREATE POLICY "Users can view employees"
  ON employees
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert employees"
  ON employees
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update employees"
  ON employees
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete employees"
  ON employees
  FOR DELETE
  TO authenticated
  USING (true);

-- Add employee_id to personnel_employees
ALTER TABLE personnel_employees
ADD COLUMN employee_id uuid REFERENCES employees(id);

-- Create view for total costs
CREATE OR REPLACE VIEW personnel_year_costs AS
SELECT 
  py.id as year_id,
  py.year,
  COALESCE(SUM(
    md.grundgehalt + md.krankenversicherung + md.rentenversicherung +
    md.arbeitslosenversicherung + md.pflegeversicherung + md.insolvenzgeldumlage +
    md.umlage_u1 + md.umlage_u2
  ), 0) as total_cost
FROM personnel_years py
LEFT JOIN personnel_employees pe ON pe.year_id = py.id
LEFT JOIN personnel_monthly_data md ON md.employee_id = pe.id
GROUP BY py.id, py.year;

-- Insert existing employees into new table and update references
DO $$ 
DECLARE
  v_employee record;
  v_new_id uuid;
BEGIN
  -- Get distinct employee names
  FOR v_employee IN (
    SELECT DISTINCT name 
    FROM personnel_employees 
    ORDER BY name
  ) LOOP
    -- Insert into employees table
    INSERT INTO employees (name)
    VALUES (v_employee.name)
    RETURNING id INTO v_new_id;

    -- Update references in personnel_employees
    UPDATE personnel_employees
    SET employee_id = v_new_id
    WHERE name = v_employee.name;
  END LOOP;
END $$;

-- Make employee_id NOT NULL after data migration
ALTER TABLE personnel_employees
ALTER COLUMN employee_id SET NOT NULL;

-- Remove total_cost from personnel_years
ALTER TABLE personnel_years
DROP COLUMN total_cost;