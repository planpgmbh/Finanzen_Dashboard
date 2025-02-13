-- First drop dependent views
DROP VIEW IF EXISTS personnel_year_costs CASCADE;
DROP VIEW IF EXISTS employee_history CASCADE;

-- Drop old tables and constraints
DROP TABLE IF EXISTS employees CASCADE;

-- Clean up personnel_monthly_data
ALTER TABLE personnel_monthly_data
DROP CONSTRAINT IF EXISTS personnel_monthly_data_employee_id_fkey CASCADE;

-- Add global_employee_id to monthly data
ALTER TABLE personnel_monthly_data
ADD COLUMN global_employee_id uuid REFERENCES global_employees(id);

-- Update global_employee_id references
UPDATE personnel_monthly_data md
SET global_employee_id = pe.global_employee_id
FROM personnel_employees pe
WHERE md.employee_id = pe.id;

-- Add NOT NULL constraint
ALTER TABLE personnel_monthly_data
ALTER COLUMN global_employee_id SET NOT NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_monthly_data_global_employee
ON personnel_monthly_data(global_employee_id);

-- Add unique constraint to prevent duplicate entries
ALTER TABLE personnel_monthly_data
ADD CONSTRAINT unique_monthly_data 
UNIQUE (global_employee_id, year, month);

-- Now we can safely drop the old column
ALTER TABLE personnel_monthly_data
DROP COLUMN employee_id;

-- Recreate the views with new structure
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
LEFT JOIN personnel_monthly_data md ON md.global_employee_id = pe.global_employee_id
  AND md.year = py.year
GROUP BY py.id, py.year;

-- Clean up old data
DELETE FROM personnel_monthly_data
WHERE year < 2023;

DELETE FROM personnel_years 
WHERE year < 2023;

-- Clean up unused global employees
DELETE FROM global_employees ge
WHERE NOT EXISTS (
  SELECT 1 
  FROM personnel_employees pe 
  WHERE pe.global_employee_id = ge.id
);