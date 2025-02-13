-- Create new employees table for global employee records
CREATE TABLE IF NOT EXISTS global_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE global_employees ENABLE ROW LEVEL SECURITY;

-- Create policies for global_employees
CREATE POLICY "Users can view global employees"
  ON global_employees
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert global employees"
  ON global_employees
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update global employees"
  ON global_employees
  FOR UPDATE
  TO authenticated
  USING (true);

-- Migrate existing employees to global_employees
INSERT INTO global_employees (name)
SELECT DISTINCT name 
FROM personnel_employees
ON CONFLICT (name) DO NOTHING;

-- Add global_employee_id to personnel_employees
ALTER TABLE personnel_employees 
ADD COLUMN global_employee_id uuid REFERENCES global_employees(id);

-- Update references
UPDATE personnel_employees pe
SET global_employee_id = ge.id
FROM global_employees ge
WHERE pe.name = ge.name;

-- Make global_employee_id required
ALTER TABLE personnel_employees
ALTER COLUMN global_employee_id SET NOT NULL;

-- Add unique constraint to prevent duplicate employees per year
ALTER TABLE personnel_employees
ADD CONSTRAINT unique_employee_per_year UNIQUE (year_id, global_employee_id);

-- Update the view to use global employee information
CREATE OR REPLACE VIEW employee_history AS
SELECT 
  ge.id as employee_id,
  ge.name as employee_name,
  py.year,
  py.id as year_id,
  pe.id as personnel_entry_id,
  COALESCE(SUM(
    md.grundgehalt + md.krankenversicherung + md.rentenversicherung +
    md.arbeitslosenversicherung + md.pflegeversicherung + md.insolvenzgeldumlage +
    md.umlage_u1 + md.umlage_u2
  ), 0) as total_cost
FROM global_employees ge
LEFT JOIN personnel_employees pe ON pe.global_employee_id = ge.id
LEFT JOIN personnel_years py ON py.id = pe.year_id
LEFT JOIN personnel_monthly_data md ON md.employee_id = pe.id
GROUP BY ge.id, ge.name, py.year, py.id, pe.id
ORDER BY ge.name, py.year DESC;