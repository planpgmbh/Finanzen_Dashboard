-- Create unique index on employees table to prevent duplicates
CREATE UNIQUE INDEX idx_employees_name ON employees(name);

-- Create function to get or create employee
CREATE OR REPLACE FUNCTION get_or_create_employee(p_name text)
RETURNS uuid
LANGUAGE plpgsql
AS $$
DECLARE
  v_employee_id uuid;
BEGIN
  -- Try to get existing employee
  SELECT id INTO v_employee_id
  FROM employees
  WHERE name = p_name;

  -- If not found, create new employee
  IF v_employee_id IS NULL THEN
    INSERT INTO employees (name)
    VALUES (p_name)
    RETURNING id INTO v_employee_id;
  END IF;

  RETURN v_employee_id;
END;
$$;

-- Migrate existing data
DO $$ 
DECLARE
  v_employee record;
BEGIN
  -- Update employee_id for all personnel_employees
  FOR v_employee IN (
    SELECT id, name 
    FROM personnel_employees
    WHERE employee_id IS NULL
  ) LOOP
    UPDATE personnel_employees
    SET employee_id = get_or_create_employee(v_employee.name)
    WHERE id = v_employee.id;
  END LOOP;
END $$;

-- Drop the function as it's no longer needed
DROP FUNCTION get_or_create_employee(text);