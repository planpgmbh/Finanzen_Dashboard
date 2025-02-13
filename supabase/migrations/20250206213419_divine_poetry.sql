-- Drop unused tables
DROP TABLE IF EXISTS employees CASCADE;

-- Drop unused views
DROP VIEW IF EXISTS employee_history CASCADE;

-- Clean up personnel_monthly_data
DELETE FROM personnel_monthly_data
WHERE year < 2023;

-- Clean up personnel_years
DELETE FROM personnel_years 
WHERE year < 2023;

-- Clean up unused global employees
DELETE FROM global_employees ge
WHERE NOT EXISTS (
  SELECT 1 
  FROM personnel_employees pe 
  WHERE pe.global_employee_id = ge.id
);