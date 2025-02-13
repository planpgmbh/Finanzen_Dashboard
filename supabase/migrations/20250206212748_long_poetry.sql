-- Drop the old employee_id column
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'personnel_employees' 
    AND column_name = 'employee_id'
  ) THEN
    ALTER TABLE personnel_employees 
    DROP COLUMN employee_id;
  END IF;
END $$;

-- Ensure global_employee_id is properly set
UPDATE personnel_employees pe
SET global_employee_id = ge.id
FROM global_employees ge
WHERE pe.name = ge.name
AND pe.global_employee_id IS NULL;

-- Add NOT NULL constraint
DO $$ 
BEGIN
  ALTER TABLE personnel_employees
  ALTER COLUMN global_employee_id SET NOT NULL;
EXCEPTION
  WHEN others THEN
    NULL;
END $$;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_personnel_employees_global_employee_id
ON personnel_employees(global_employee_id);

-- Recreate the unique constraint
DO $$ 
BEGIN
  ALTER TABLE personnel_employees
  DROP CONSTRAINT IF EXISTS unique_employee_per_year;

  ALTER TABLE personnel_employees
  ADD CONSTRAINT unique_employee_per_year 
  UNIQUE (year_id, global_employee_id);
EXCEPTION
  WHEN others THEN
    NULL;
END $$;