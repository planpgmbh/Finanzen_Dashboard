-- Drop the old view first
DROP VIEW IF EXISTS personnel_year_costs;

-- Recreate the view without total_cost column
CREATE OR REPLACE VIEW personnel_year_costs AS
SELECT 
  py.id as year_id,
  py.year
FROM personnel_years py;