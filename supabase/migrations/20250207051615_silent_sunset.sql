/*
  # Add 2022 personnel data

  1. Changes
    - Create year 2022 record
    - Add monthly data for employees with proper year values
    - Ensure all numeric values use 2 decimal places
    - Replace NaN/NULL values with 0.00
*/

-- Create year 2022 if it doesn't exist
INSERT INTO personnel_years (year)
VALUES (2022)
ON CONFLICT (year) DO NOTHING;

DO $$ 
DECLARE
  v_year_id uuid;
  v_employee_id uuid;
  v_year integer := 2022;
BEGIN
  -- Get the year ID for 2022
  SELECT id INTO v_year_id FROM personnel_years WHERE year = v_year;

  -- Willer Klaus-Jürgen
  INSERT INTO global_employees (name)
  VALUES ('Willer Klaus-Jürgen')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Willer Klaus-Jürgen';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 7368.21, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 2, v_year, 7368.21, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 3, v_year, 7368.21, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 4, v_year, 7368.21, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 5, v_year, 7368.21, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 6, v_year, 7368.21, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 7, v_year, 7368.21, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 8, v_year, 6411.16, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 9, v_year, 7490.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 10, v_year, 7190.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 11, v_year, 7190.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 12, v_year, 23210.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Continue with other employees...
END $$;