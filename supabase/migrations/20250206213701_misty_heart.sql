-- First drop dependent views
DROP VIEW IF EXISTS personnel_year_costs CASCADE;
DROP VIEW IF EXISTS employee_history CASCADE;

-- Drop old tables and constraints
DROP TABLE IF EXISTS employees CASCADE;

-- Drop personnel_employees table since we'll use global_employees directly
DROP TABLE personnel_employees CASCADE;

-- Add year_id to monthly data to directly link with years
ALTER TABLE personnel_monthly_data
ADD COLUMN year_id uuid REFERENCES personnel_years(id);

-- Update year_id references
UPDATE personnel_monthly_data md
SET year_id = py.id
FROM personnel_years py
WHERE md.year = py.year;

-- Add NOT NULL constraint
ALTER TABLE personnel_monthly_data
ALTER COLUMN year_id SET NOT NULL;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_monthly_data_year
ON personnel_monthly_data(year_id);

-- Drop old unique constraint if it exists
ALTER TABLE personnel_monthly_data
DROP CONSTRAINT IF EXISTS unique_monthly_data;

-- Add new unique constraint
ALTER TABLE personnel_monthly_data
ADD CONSTRAINT unique_monthly_data_new
UNIQUE (global_employee_id, year_id, month);

-- Recreate the view with simplified structure
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
LEFT JOIN personnel_monthly_data md ON md.year_id = py.id
GROUP BY py.id, py.year;