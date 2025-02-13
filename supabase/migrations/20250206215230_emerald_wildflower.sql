/*
  # Update numeric field precision

  1. Changes
    - Drop and recreate personnel_year_costs view
    - Increase precision of numeric fields from 10,2 to 12,2
    - Recreate view with updated column references

  2. Security
    - No changes to RLS policies needed
    - Existing data is preserved
*/

-- First drop the view that depends on these columns
DROP VIEW IF EXISTS personnel_year_costs;

-- Update precision for all numeric columns in personnel_monthly_data
ALTER TABLE personnel_monthly_data
  ALTER COLUMN grundgehalt TYPE numeric(12,2),
  ALTER COLUMN krankenversicherung TYPE numeric(12,2),
  ALTER COLUMN rentenversicherung TYPE numeric(12,2),
  ALTER COLUMN arbeitslosenversicherung TYPE numeric(12,2),
  ALTER COLUMN pflegeversicherung TYPE numeric(12,2),
  ALTER COLUMN insolvenzgeldumlage TYPE numeric(12,2),
  ALTER COLUMN umlage_u1 TYPE numeric(12,2),
  ALTER COLUMN umlage_u2 TYPE numeric(12,2);

-- Recreate the view with the updated column types
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