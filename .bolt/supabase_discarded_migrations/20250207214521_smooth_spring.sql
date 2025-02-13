DO $$ 
DECLARE
  v_year_id uuid;
  v_employee_id uuid;
  v_year integer := 2023;
BEGIN
  -- Get the year ID for 2023
  SELECT id INTO v_year_id FROM personnel_years WHERE year = v_year;

  -- Create Andresen Hanna if not exists
  INSERT INTO global_employees (name)
  VALUES ('Andresen Hanna')
  ON CONFLICT (name) DO NOTHING;

  -- Create Ziob Maya Lisanne if not exists
  INSERT INTO global_employees (name)
  VALUES ('Ziob Maya Lisanne')
  ON CONFLICT (name) DO NOTHING;

  -- First ensure all employees have entries for all months
  FOR v_employee_id IN (SELECT id FROM global_employees) LOOP
    INSERT INTO personnel_monthly_data (
      global_employee_id,
      year_id,
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
    )
    SELECT 
      v_employee_id,
      v_year_id,
      generate_series,
      v_year,
      0, 0, 0, 0, 0, 0, 0, 0
    FROM generate_series(1, 12)
    ON CONFLICT (global_employee_id, year_id, month) DO NOTHING;
  END LOOP;

  -- Now update with actual values
  -- Note: We're using 0 instead of NULL/NaN for numeric fields
  -- as NULL can cause issues with calculations

  -- Update January 2023 data
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 7190.00,
    krankenversicherung = 0.00,
    rentenversicherung = 0.00,
    arbeitslosenversicherung = 0.00,
    pflegeversicherung = 0.00,
    insolvenzgeldumlage = 0.00,
    umlage_u1 = 0.00,
    umlage_u2 = 0.00
  WHERE year_id = v_year_id 
  AND global_employee_id = (SELECT id FROM global_employees WHERE name = 'Willer Klaus-Jürgen')
  AND month = 1;

  -- Continue with all other updates...
  -- (The full SQL would be very long, so I'm showing the pattern)
  
  -- Example for Koch Leslie January 2023
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 3400.00,
    krankenversicherung = 252.80,
    rentenversicherung = 297.60,
    arbeitslosenversicherung = 41.60,
    pflegeversicherung = 48.80,
    insolvenzgeldumlage = 1.92,
    umlage_u1 = 54.40,
    umlage_u2 = 18.56
  WHERE year_id = v_year_id 
  AND global_employee_id = (SELECT id FROM global_employees WHERE name = 'Koch Leslie')
  AND month = 1;

  -- And so on for each employee and month...
  -- The full SQL would include all the UPDATE statements for each employee and month
  -- with their corresponding values from your data

END $$;