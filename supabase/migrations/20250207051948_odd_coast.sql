/*
  # Add 2022 personnel data (batch 3)

  1. Changes
    - Add monthly data for Roß Melanie
    - Add monthly data for Schuberth Philipp
    - Add monthly data for Gollmer Sabine
    - Add monthly data for Willer Teo
    - Add monthly data for Beuth Gunnar
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

  -- Roß Melanie
  INSERT INTO global_employees (name)
  VALUES ('Roß Melanie')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Roß Melanie';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 2670.00, 224.15, 248.31, 34.71, 45.39, 1.60, 50.73, 10.41),
    (v_employee_id, v_year_id, 2, v_year, 2670.00, 224.15, 248.31, 34.71, 45.39, 1.60, 50.73, 10.41),
    (v_employee_id, v_year_id, 3, v_year, 2670.00, 224.15, 248.31, 34.71, 45.39, 1.60, 50.73, 10.41),
    (v_employee_id, v_year_id, 4, v_year, 2670.00, 224.15, 248.31, 34.71, 45.39, 1.60, 50.73, 10.41),
    (v_employee_id, v_year_id, 5, v_year, 2670.00, 224.15, 248.31, 34.71, 45.39, 1.60, 50.73, 10.41),
    (v_employee_id, v_year_id, 6, v_year, 2670.00, 224.15, 248.31, 34.71, 45.39, 1.60, 50.73, 10.41),
    (v_employee_id, v_year_id, 7, v_year, 2670.00, 224.15, 248.31, 34.71, 45.39, 1.60, 50.73, 10.41),
    (v_employee_id, v_year_id, 8, v_year, 2670.00, 224.15, 248.31, 34.71, 45.39, 1.60, 50.73, 10.41),
    (v_employee_id, v_year_id, 9, v_year, 2970.00, 224.15, 248.31, 34.71, 45.39, 1.60, 50.73, 10.41),
    (v_employee_id, v_year_id, 10, v_year, 2670.00, 224.15, 248.31, 34.71, 45.39, 1.60, 50.73, 10.41),
    (v_employee_id, v_year_id, 11, v_year, 2670.00, 224.15, 248.31, 34.71, 45.39, 1.60, 50.73, 10.41),
    (v_employee_id, v_year_id, 12, v_year, 5340.00, 448.30, 496.62, 69.42, 90.78, 3.20, 50.73, 10.41)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Schuberth Philipp
  INSERT INTO global_employees (name)
  VALUES ('Schuberth Philipp')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Schuberth Philipp';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 7677.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 2, v_year, 7677.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 3, v_year, 7677.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 4, v_year, 7677.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 5, v_year, 7677.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 6, v_year, 21412.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 7, v_year, 7677.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 8, v_year, 7677.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 9, v_year, 7977.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 10, v_year, 7677.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 11, v_year, 7677.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 12, v_year, 15677.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Gollmer Sabine
  INSERT INTO global_employees (name)
  VALUES ('Gollmer Sabine')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Gollmer Sabine';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 645.08, 68.37, 77.12, 10.78, 14.09, 0.29, 9.27, 2.20),
    (v_employee_id, v_year_id, 2, v_year, 645.08, 68.37, 77.12, 10.78, 14.09, 0.29, 9.27, 2.20),
    (v_employee_id, v_year_id, 3, v_year, 645.08, 68.37, 77.12, 10.78, 14.09, 0.29, 9.27, 2.20),
    (v_employee_id, v_year_id, 4, v_year, 645.08, 68.37, 77.12, 10.78, 14.09, 0.29, 9.27, 2.20),
    (v_employee_id, v_year_id, 5, v_year, 645.08, 68.37, 77.12, 10.78, 14.09, 0.29, 9.27, 2.20),
    (v_employee_id, v_year_id, 6, v_year, 645.08, 68.37, 77.12, 10.78, 14.09, 0.29, 9.27, 2.20),
    (v_employee_id, v_year_id, 7, v_year, 645.78, 71.16, 77.17, 10.78, 14.11, 0.29, 9.28, 2.20),
    (v_employee_id, v_year_id, 8, v_year, 645.78, 71.16, 77.17, 10.78, 14.11, 0.29, 9.28, 2.20),
    (v_employee_id, v_year_id, 9, v_year, 945.78, 71.16, 77.17, 10.78, 14.11, 0.29, 9.28, 2.20),
    (v_employee_id, v_year_id, 10, v_year, 646.49, 74.12, 77.22, 10.79, 14.12, 0.29, 9.30, 2.20),
    (v_employee_id, v_year_id, 11, v_year, 646.49, 74.12, 77.22, 10.79, 14.12, 0.29, 9.30, 2.20),
    (v_employee_id, v_year_id, 12, v_year, 1046.49, 74.12, 77.22, 10.79, 14.12, 0.29, 9.30, 2.20)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Willer Teo
  INSERT INTO global_employees (name)
  VALUES ('Willer Teo')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Willer Teo';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 2750.00, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, v_year_id, 2, v_year, 2750.00, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, v_year_id, 3, v_year, 2750.00, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, v_year_id, 4, v_year, 2750.00, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, v_year_id, 5, v_year, 2750.00, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, v_year_id, 6, v_year, 2750.00, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, v_year_id, 7, v_year, 5500.00, 461.72, 511.50, 71.50, 93.50, 3.30, 52.25, 10.73),
    (v_employee_id, v_year_id, 8, v_year, 2750.00, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, v_year_id, 9, v_year, 3050.00, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, v_year_id, 10, v_year, 2750.00, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, v_year_id, 11, v_year, 2750.00, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, v_year_id, 12, v_year, 5500.00, 461.72, 511.50, 71.50, 93.50, 3.30, 52.25, 10.73)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Beuth Gunnar
  INSERT INTO global_employees (name)
  VALUES ('Beuth Gunnar')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Beuth Gunnar';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 3500.00, 276.50, 325.50, 45.50, 59.50, 2.10, 56.00, 15.40),
    (v_employee_id, v_year_id, 2, v_year, 3500.00, 276.50, 325.50, 45.50, 59.50, 2.10, 56.00, 15.40),
    (v_employee_id, v_year_id, 3, v_year, 3500.00, 276.50, 325.50, 45.50, 59.50, 2.10, 56.00, 15.40),
    (v_employee_id, v_year_id, 4, v_year, 3500.00, 276.50, 325.50, 45.50, 59.50, 2.10, 56.00, 15.40),
    (v_employee_id, v_year_id, 5, v_year, 3500.00, 276.50, 325.50, 45.50, 59.50, 2.10, 56.00, 15.40),
    (v_employee_id, v_year_id, 6, v_year, 3500.00, 276.50, 325.50, 45.50, 59.50, 2.10, 56.00, 15.40),
    (v_employee_id, v_year_id, 7, v_year, 3500.00, 276.50, 325.50, 45.50, 59.50, 2.10, 56.00, 15.40),
    (v_employee_id, v_year_id, 8, v_year, 3500.00, 276.50, 325.50, 45.50, 59.50, 2.10, 56.00, 15.40),
    (v_employee_id, v_year_id, 9, v_year, 3800.00, 276.50, 325.50, 45.50, 59.50, 2.10, 56.00, 15.40),
    (v_employee_id, v_year_id, 10, v_year, 3500.00, 276.50, 325.50, 45.50, 59.50, 2.10, 56.00, 15.40),
    (v_employee_id, v_year_id, 11, v_year, 3500.00, 276.50, 325.50, 45.50, 59.50, 2.10, 56.00, 15.40),
    (v_employee_id, v_year_id, 12, v_year, 7000.00, 553.00, 651.00, 91.00, 119.00, 4.20, 56.00, 15.40)
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