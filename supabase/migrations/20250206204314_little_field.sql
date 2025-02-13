-- Drop the view first
DROP VIEW IF EXISTS personnel_year_costs;

-- Clean up and standardize personnel data

-- 1. Ensure all decimal values are properly formatted and replace NULLs with 0.00
ALTER TABLE personnel_monthly_data
ALTER COLUMN grundgehalt SET DEFAULT 0.00,
ALTER COLUMN krankenversicherung SET DEFAULT 0.00,
ALTER COLUMN rentenversicherung SET DEFAULT 0.00,
ALTER COLUMN arbeitslosenversicherung SET DEFAULT 0.00,
ALTER COLUMN pflegeversicherung SET DEFAULT 0.00,
ALTER COLUMN insolvenzgeldumlage SET DEFAULT 0.00,
ALTER COLUMN umlage_u1 SET DEFAULT 0.00,
ALTER COLUMN umlage_u2 SET DEFAULT 0.00;

UPDATE personnel_monthly_data
SET 
  grundgehalt = COALESCE(grundgehalt, 0.00),
  krankenversicherung = COALESCE(krankenversicherung, 0.00),
  rentenversicherung = COALESCE(rentenversicherung, 0.00),
  arbeitslosenversicherung = COALESCE(arbeitslosenversicherung, 0.00),
  pflegeversicherung = COALESCE(pflegeversicherung, 0.00),
  insolvenzgeldumlage = COALESCE(insolvenzgeldumlage, 0.00),
  umlage_u1 = COALESCE(umlage_u1, 0.00),
  umlage_u2 = COALESCE(umlage_u2, 0.00);

-- 2. Add NOT NULL constraints
ALTER TABLE personnel_monthly_data
ALTER COLUMN grundgehalt SET NOT NULL,
ALTER COLUMN krankenversicherung SET NOT NULL,
ALTER COLUMN rentenversicherung SET NOT NULL,
ALTER COLUMN arbeitslosenversicherung SET NOT NULL,
ALTER COLUMN pflegeversicherung SET NOT NULL,
ALTER COLUMN insolvenzgeldumlage SET NOT NULL,
ALTER COLUMN umlage_u1 SET NOT NULL,
ALTER COLUMN umlage_u2 SET NOT NULL;

-- 3. Ensure all employees have 12 monthly entries
DO $$
DECLARE
  v_employee record;
  v_year record;
  v_month integer;
BEGIN
  FOR v_employee IN (
    SELECT pe.id, pe.year_id, py.year
    FROM personnel_employees pe
    JOIN personnel_years py ON pe.year_id = py.id
  ) LOOP
    FOR v_month IN 1..12 LOOP
      IF NOT EXISTS (
        SELECT 1 
        FROM personnel_monthly_data 
        WHERE employee_id = v_employee.id 
        AND month = v_month
        AND year = v_employee.year
      ) THEN
        INSERT INTO personnel_monthly_data (
          employee_id,
          month,
          year,
          grundgehalt,
          krankenversicherung,
          rentenversicherung,
          arbeitslosenversicherung,
          pflegeversicherung,
          insolvenzgeldumlage,
          umlage_u1,
          umlage_u2
        ) VALUES (
          v_employee.id,
          v_month,
          v_employee.year,
          0.00,
          0.00,
          0.00,
          0.00,
          0.00,
          0.00,
          0.00,
          0.00
        );
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- 4. Remove any entries beyond month 12
DELETE FROM personnel_monthly_data
WHERE month > 12;

-- 5. Add constraint to ensure month is between 1 and 12
ALTER TABLE personnel_monthly_data
DROP CONSTRAINT IF EXISTS month_range_check,
ADD CONSTRAINT month_range_check 
CHECK (month BETWEEN 1 AND 12);

-- 6. Ensure employee_id references are set correctly
DO $$
DECLARE
  v_employee record;
  v_global_employee_id uuid;
BEGIN
  FOR v_employee IN (
    SELECT pe.id, pe.name, pe.employee_id
    FROM personnel_employees pe
    WHERE pe.employee_id IS NULL
  ) LOOP
    SELECT id INTO v_global_employee_id
    FROM employees
    WHERE name = v_employee.name;
    
    IF v_global_employee_id IS NULL THEN
      INSERT INTO employees (name)
      VALUES (v_employee.name)
      RETURNING id INTO v_global_employee_id;
    END IF;
    
    UPDATE personnel_employees
    SET employee_id = v_global_employee_id
    WHERE id = v_employee.id;
  END LOOP;
END $$;

-- 7. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_personnel_monthly_data_employee_month
ON personnel_monthly_data (employee_id, month);

CREATE INDEX IF NOT EXISTS idx_personnel_monthly_data_year_month
ON personnel_monthly_data (year, month);

-- 8. Add constraint for required employee_id reference
ALTER TABLE personnel_employees
ALTER COLUMN employee_id SET NOT NULL;

-- 9. Recreate the view with the cleaned up data
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