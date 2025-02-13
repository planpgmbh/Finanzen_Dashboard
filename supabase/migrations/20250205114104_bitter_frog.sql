/*
  # Insert Initial Personnel Data

  1. Data Structure
    - Creates initial year 2025
    - Inserts all employees for 2025
    - Sets up monthly data for each employee

  2. Data Overview
    - Year: 2025
    - 19 employees with their monthly costs
    - 14 months of data per employee (including 13th and 14th month)

  3. Notes
    - All monetary values are in EUR
    - Months 13 and 14 represent special payments
*/

-- Insert year 2025
INSERT INTO personnel_years (year, total_cost)
VALUES (2025, 0)
RETURNING id;

-- Create temporary function to help with employee creation
CREATE OR REPLACE FUNCTION temp_create_employee_with_data(
  year_id uuid,
  emp_name text,
  grundgehalt numeric,
  krankenversicherung numeric,
  rentenversicherung numeric,
  arbeitslosenversicherung numeric,
  pflegeversicherung numeric,
  insolvenzgeldumlage numeric,
  umlage_u1 numeric,
  umlage_u2 numeric
) RETURNS void AS $$
DECLARE
  emp_id uuid;
BEGIN
  -- Insert employee
  INSERT INTO personnel_employees (year_id, name)
  VALUES (year_id, emp_name)
  RETURNING id INTO emp_id;

  -- Insert monthly data for months 1-12
  INSERT INTO personnel_monthly_data (
    employee_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage,
    umlage_u1, umlage_u2
  )
  SELECT 
    emp_id, generate_series(1, 12), 2025,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage,
    umlage_u1, umlage_u2;

  -- Insert data for month 13 (all values 0)
  INSERT INTO personnel_monthly_data (
    employee_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage,
    umlage_u1, umlage_u2
  )
  VALUES (
    emp_id, 13, 2025,
    0, 0, 0, 0, 0, 0, 0, 0
  );

  -- Insert data for month 14 (all values 0)
  INSERT INTO personnel_monthly_data (
    employee_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage,
    umlage_u1, umlage_u2
  )
  VALUES (
    emp_id, 14, 2025,
    0, 0, 0, 0, 0, 0, 0, 0
  );
END;
$$ LANGUAGE plpgsql;

-- Insert employees and their data
DO $$ 
DECLARE
  v_year_id uuid;
BEGIN
  -- Get the year ID
  SELECT id INTO v_year_id FROM personnel_years WHERE year = 2025;

  -- Insert employees with their data
  PERFORM temp_create_employee_with_data(
    v_year_id, 'Willer Klaus-Jürgen',
    7190, 0, 0, 0, 0, 0, 0, 0
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Koch Leslie',
    3200, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Wöllner Claudia',
    3080, 243.32, 286.44, 40.04, 52.36, 1.85, 49.28, 13.55
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Willer Maria',
    400, 52, 60, 0, 0, 0.24, 4.4, 0.96
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Willms Judith',
    2750, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Stamer Thomas',
    5650, 0, 0, 0, 0, 0, 0, 0
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Schmitz Miriam',
    0, 0, 0, 0, 0, 0, 0, 0
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Gruber Isabelle',
    1000, 88.48, 105.64, 14.76, 19.32, 0.53, 15.91, 3.36
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Roß Melanie',
    2670, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Schuberth Philipp',
    7677, 0, 0, 0, 0, 0, 0, 0
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Gollmer Sabine',
    645.08, 68.37, 77.12, 10.78, 14.09, 0.29, 9.27, 2.2
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Willer Teo',
    2750, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Beuth Gunnar',
    3500, 276.5, 325.5, 45.5, 59.5, 2.1, 56, 15.4
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Sobhe Arian',
    2100, 171.15, 195.3, 27.3, 35.7, 1.26, 48.3, 7.77
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Mielke-Schmidt Katrin',
    3200, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Willer Kathrin',
    3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Thomas Diana Melanie',
    3900, 308.1, 362.7, 50.7, 66.3, 2.34, 62.4, 17.16
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Mende Linus',
    2350, 197.4, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'Haase Sophie',
    2350, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58
  );

  PERFORM temp_create_employee_with_data(
    v_year_id, 'van Olphen Tim',
    3100, 244.9, 288.3, 40.3, 52.7, 1.86, 49.6, 13.64
  );
END $$;

-- Drop the temporary function
DROP FUNCTION temp_create_employee_with_data;

-- Update the total cost for the year
UPDATE personnel_years
SET total_cost = (
  SELECT SUM(
    grundgehalt + krankenversicherung + rentenversicherung +
    arbeitslosenversicherung + pflegeversicherung + insolvenzgeldumlage +
    umlage_u1 + umlage_u2
  )
  FROM personnel_monthly_data md
  JOIN personnel_employees e ON md.employee_id = e.id
  WHERE e.year_id = personnel_years.id
)
WHERE year = 2025;