/*
  # Add 2022 personnel data (continued)

  1. Changes
    - Add monthly data for remaining employees in 2022
    - Ensure all numeric values use 2 decimal places
    - Replace NaN/NULL values with 0.00
*/

DO $$ 
DECLARE
  v_year_id uuid;
  v_employee_id uuid;
  v_year integer := 2022;
BEGIN
  -- Get the year ID for 2022
  SELECT id INTO v_year_id FROM personnel_years WHERE year = v_year;

  -- Wöllner Claudia
  INSERT INTO global_employees (name)
  VALUES ('Wöllner Claudia')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Wöllner Claudia';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 3080.00, 243.32, 286.44, 36.96, 46.97, 2.77, 27.72, 20.02),
    (v_employee_id, v_year_id, 2, v_year, 3080.00, 243.32, 286.44, 36.96, 46.97, 2.77, 27.72, 20.02),
    (v_employee_id, v_year_id, 3, v_year, 3080.00, 243.32, 286.44, 36.96, 46.97, 2.77, 27.72, 20.02),
    (v_employee_id, v_year_id, 4, v_year, 3080.00, 243.32, 286.44, 36.96, 46.97, 2.77, 27.72, 20.02),
    (v_employee_id, v_year_id, 5, v_year, 3080.00, 243.32, 286.44, 36.96, 46.97, 2.77, 27.72, 20.02),
    (v_employee_id, v_year_id, 6, v_year, 3080.00, 243.32, 286.44, 36.96, 46.97, 2.77, 27.72, 20.02),
    (v_employee_id, v_year_id, 7, v_year, 3080.00, 243.32, 286.44, 36.96, 46.97, 2.77, 27.72, 20.02),
    (v_employee_id, v_year_id, 8, v_year, 3080.00, 243.32, 286.44, 36.96, 46.97, 2.77, 27.72, 20.02),
    (v_employee_id, v_year_id, 9, v_year, 3380.00, 243.32, 286.44, 36.96, 46.97, 2.77, 27.72, 20.02),
    (v_employee_id, v_year_id, 10, v_year, 3080.00, 243.32, 286.44, 36.96, 46.97, 2.77, 52.36, 17.86),
    (v_employee_id, v_year_id, 11, v_year, 3080.00, 243.32, 286.44, 36.96, 46.97, 2.77, 52.36, 17.86),
    (v_employee_id, v_year_id, 12, v_year, 5432.00, 243.32, 286.44, 36.96, 46.97, 2.77, 52.36, 17.86)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Arenz Rüdiger
  INSERT INTO global_employees (name)
  VALUES ('Arenz Rüdiger')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Arenz Rüdiger';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 450.00, 0.00, 67.50, 0.00, 0.00, 0.41, 4.05, 1.31),
    (v_employee_id, v_year_id, 2, v_year, 450.00, 0.00, 67.50, 0.00, 0.00, 0.41, 4.05, 1.31),
    (v_employee_id, v_year_id, 3, v_year, 450.00, 0.00, 67.50, 0.00, 0.00, 0.41, 4.05, 1.31),
    (v_employee_id, v_year_id, 4, v_year, 450.00, 0.00, 67.50, 0.00, 0.00, 0.41, 4.05, 1.31),
    (v_employee_id, v_year_id, 5, v_year, 450.00, 0.00, 67.50, 0.00, 0.00, 0.41, 4.05, 1.31),
    (v_employee_id, v_year_id, 6, v_year, 450.00, 0.00, 67.50, 0.00, 0.00, 0.41, 4.05, 1.31),
    (v_employee_id, v_year_id, 7, v_year, 450.00, 0.00, 67.50, 0.00, 0.00, 0.41, 4.05, 1.31),
    (v_employee_id, v_year_id, 8, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 9, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 10, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 11, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 12, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Willer Maria
  INSERT INTO global_employees (name)
  VALUES ('Willer Maria')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Willer Maria';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 400.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16),
    (v_employee_id, v_year_id, 2, v_year, 400.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16),
    (v_employee_id, v_year_id, 3, v_year, 400.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16),
    (v_employee_id, v_year_id, 4, v_year, 400.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16),
    (v_employee_id, v_year_id, 5, v_year, 400.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16),
    (v_employee_id, v_year_id, 6, v_year, 400.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16),
    (v_employee_id, v_year_id, 7, v_year, 400.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16),
    (v_employee_id, v_year_id, 8, v_year, 400.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16),
    (v_employee_id, v_year_id, 9, v_year, 400.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16),
    (v_employee_id, v_year_id, 10, v_year, 400.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16),
    (v_employee_id, v_year_id, 11, v_year, 400.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16),
    (v_employee_id, v_year_id, 12, v_year, 1000.00, 52.00, 60.00, 0.00, 0.00, 0.36, 3.60, 1.16)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

END $$;