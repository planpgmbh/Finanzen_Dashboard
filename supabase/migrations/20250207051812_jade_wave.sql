/*
  # Add 2022 personnel data (continued)

  1. Changes
    - Add monthly data for Willms Judith
    - Add monthly data for Ziob Maya Lisanne
    - Add monthly data for Stamer Thomas
    - Add monthly data for Schmitz Miriam
    - Add monthly data for Gruber Isabelle
    - All numeric values use 2 decimal places
    - NaN/NULL values replaced with 0.00
*/

DO $$ 
DECLARE
  v_year_id uuid;
  v_employee_id uuid;
  v_year integer := 2022;
BEGIN
  -- Get the year ID for 2022
  SELECT id INTO v_year_id FROM personnel_years WHERE year = v_year;

  -- Willms Judith
  INSERT INTO global_employees (name)
  VALUES ('Willms Judith')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Willms Judith';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 2750.00, 218.49, 255.75, 33.00, 41.94, 2.48, 38.50, 15.40),
    (v_employee_id, v_year_id, 2, v_year, 2483.87, 197.34, 231.00, 29.81, 37.88, 2.24, 34.77, 13.91),
    (v_employee_id, v_year_id, 3, v_year, 2661.29, 211.44, 247.50, 31.94, 40.58, 2.40, 37.26, 14.90),
    (v_employee_id, v_year_id, 4, v_year, 2569.62, 204.16, 238.97, 30.83, 39.19, 2.31, 35.98, 14.40),
    (v_employee_id, v_year_id, 5, v_year, 2750.00, 218.49, 255.75, 33.00, 41.94, 2.48, 38.50, 15.40),
    (v_employee_id, v_year_id, 6, v_year, 2750.00, 218.49, 255.75, 33.00, 41.94, 2.48, 38.50, 15.40),
    (v_employee_id, v_year_id, 7, v_year, 2661.61, 211.47, 247.53, 31.94, 40.60, 2.37, 36.91, 14.96),
    (v_employee_id, v_year_id, 8, v_year, 2661.29, 211.44, 247.50, 31.94, 40.58, 2.40, 37.26, 14.90),
    (v_employee_id, v_year_id, 9, v_year, 3050.00, 218.49, 255.75, 33.00, 41.94, 2.48, 38.50, 15.40),
    (v_employee_id, v_year_id, 10, v_year, 2750.00, 218.49, 255.75, 33.00, 41.94, 2.48, 38.50, 15.40),
    (v_employee_id, v_year_id, 11, v_year, 2750.00, 218.49, 255.75, 33.00, 41.94, 2.48, 38.50, 15.40),
    (v_employee_id, v_year_id, 12, v_year, 3350.00, 218.49, 255.75, 33.00, 41.94, 2.48, 38.50, 15.40)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Ziob Maya Lisanne
  INSERT INTO global_employees (name)
  VALUES ('Ziob Maya Lisanne')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Ziob Maya Lisanne';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 2, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 3, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 4, v_year, 2393.70, 181.70, 213.90, 27.60, 35.08, 2.07, 20.70, 14.95),
    (v_employee_id, v_year_id, 5, v_year, 2393.70, 181.70, 213.90, 27.60, 35.08, 2.07, 20.70, 14.95),
    (v_employee_id, v_year_id, 6, v_year, 2309.00, 181.70, 213.90, 27.60, 35.08, 2.07, 20.70, 14.95),
    (v_employee_id, v_year_id, 7, v_year, 2309.00, 181.70, 213.90, 27.60, 35.08, 2.07, 20.70, 14.95),
    (v_employee_id, v_year_id, 8, v_year, 2309.00, 181.70, 213.90, 27.60, 35.08, 2.07, 20.70, 14.95),
    (v_employee_id, v_year_id, 9, v_year, 1313.74, 72.68, 85.56, 11.04, 14.03, 0.83, 8.28, 5.98),
    (v_employee_id, v_year_id, 10, v_year, 2393.70, 181.70, 213.90, 27.60, 35.08, 2.07, 39.10, 13.34),
    (v_employee_id, v_year_id, 11, v_year, 2393.70, 181.70, 213.90, 27.60, 35.08, 2.07, 39.10, 13.34),
    (v_employee_id, v_year_id, 12, v_year, 5293.70, 363.40, 427.80, 55.20, 70.16, 4.14, 39.10, 13.34)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Stamer Thomas
  INSERT INTO global_employees (name)
  VALUES ('Stamer Thomas')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Stamer Thomas';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 5804.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 2, v_year, 5804.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 3, v_year, 5804.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 4, v_year, 5804.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 5, v_year, 5804.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 6, v_year, 5804.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 7, v_year, 5804.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 8, v_year, 5804.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 9, v_year, 6104.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 10, v_year, 5804.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 11, v_year, 5804.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 12, v_year, 19854.94, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Schmitz Miriam
  INSERT INTO global_employees (name)
  VALUES ('Schmitz Miriam')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Schmitz Miriam';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 2, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 3, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 4, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 5, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 6, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 7, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
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

  -- Gruber Isabelle
  INSERT INTO global_employees (name)
  VALUES ('Gruber Isabelle')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Gruber Isabelle';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 1000.00, 76.45, 93.00, 12.00, 15.25, 0.86, 13.45, 6.24),
    (v_employee_id, v_year_id, 2, v_year, 1000.00, 76.45, 93.00, 12.00, 15.25, 0.86, 13.45, 6.24),
    (v_employee_id, v_year_id, 3, v_year, 1000.00, 76.45, 93.00, 12.00, 15.25, 0.86, 13.45, 6.24),
    (v_employee_id, v_year_id, 4, v_year, 1000.00, 76.45, 93.00, 12.00, 15.25, 0.86, 13.45, 6.24),
    (v_employee_id, v_year_id, 5, v_year, 1000.00, 76.45, 93.00, 12.00, 15.25, 0.86, 13.45, 6.24),
    (v_employee_id, v_year_id, 6, v_year, 1000.00, 76.45, 93.00, 12.00, 15.25, 0.86, 13.45, 6.24),
    (v_employee_id, v_year_id, 7, v_year, 1000.00, 76.45, 93.00, 12.00, 15.25, 0.86, 13.45, 6.24),
    (v_employee_id, v_year_id, 8, v_year, 1000.00, 76.45, 93.00, 12.00, 15.25, 0.86, 13.45, 6.24),
    (v_employee_id, v_year_id, 9, v_year, 1300.00, 76.45, 93.00, 12.00, 15.25, 0.86, 13.45, 6.24),
    (v_employee_id, v_year_id, 10, v_year, 1000.00, 85.32, 103.79, 13.39, 17.02, 0.82, 12.79, 5.94),
    (v_employee_id, v_year_id, 11, v_year, 1000.00, 85.32, 103.79, 13.39, 17.02, 0.82, 12.79, 5.94),
    (v_employee_id, v_year_id, 12, v_year, 1600.00, 85.32, 103.79, 13.39, 17.02, 0.82, 12.79, 5.94)
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