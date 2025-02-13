/*
  # Add 2022 personnel data (batch 4)

  1. Changes
    - Add monthly data for Sobhe Arian
    - Add monthly data for Mielke-Schmidt Katrin
    - Add monthly data for Willer Kathrin
    - Add monthly data for Thomas Diana Melanie
    - Add monthly data for Mende Linus
    - Add monthly data for Haase Sophie
    - Add monthly data for van Olphen Tim
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

  -- Sobhe Arian
  INSERT INTO global_employees (name)
  VALUES ('Sobhe Arian')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Sobhe Arian';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 2100.00, 171.15, 195.30, 27.30, 35.70, 1.26, 48.30, 7.77),
    (v_employee_id, v_year_id, 2, v_year, 2100.00, 171.15, 195.30, 27.30, 35.70, 1.26, 48.30, 7.77),
    (v_employee_id, v_year_id, 3, v_year, 2100.00, 171.15, 195.30, 27.30, 35.70, 1.26, 48.30, 7.77),
    (v_employee_id, v_year_id, 4, v_year, 2100.00, 171.15, 195.30, 27.30, 35.70, 1.26, 48.30, 7.77),
    (v_employee_id, v_year_id, 5, v_year, 3900.00, 317.85, 362.70, 50.70, 66.30, 2.34, 89.70, 14.43),
    (v_employee_id, v_year_id, 6, v_year, 2700.00, 220.05, 251.10, 35.10, 45.90, 1.62, 62.10, 9.99),
    (v_employee_id, v_year_id, 7, v_year, 2700.00, 220.05, 251.10, 35.10, 45.90, 1.62, 62.10, 9.99),
    (v_employee_id, v_year_id, 8, v_year, 2700.00, 220.05, 251.10, 35.10, 45.90, 1.62, 62.10, 9.99),
    (v_employee_id, v_year_id, 9, v_year, 3000.00, 220.05, 251.10, 35.10, 45.90, 1.62, 62.10, 7.83),
    (v_employee_id, v_year_id, 10, v_year, 2700.00, 220.05, 251.10, 35.10, 45.90, 1.62, 62.10, 7.83),
    (v_employee_id, v_year_id, 11, v_year, 2700.00, 220.05, 251.10, 35.10, 45.90, 1.62, 62.10, 7.83),
    (v_employee_id, v_year_id, 12, v_year, 5400.00, 440.10, 502.20, 70.20, 91.80, 3.24, 62.10, 7.83)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Mielke-Schmidt Katrin
  INSERT INTO global_employees (name)
  VALUES ('Mielke-Schmidt Katrin')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Mielke-Schmidt Katrin';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 3200.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 2, v_year, 3200.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 3, v_year, 3200.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 4, v_year, 3200.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 5, v_year, 3200.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 6, v_year, 3200.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 7, v_year, 3200.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 8, v_year, 3200.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 9, v_year, 3500.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 10, v_year, 3200.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 11, v_year, 3200.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 12, v_year, 6400.00, 505.60, 595.20, 83.20, 108.80, 3.84, 51.20, 14.08)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Willer Kathrin
  INSERT INTO global_employees (name)
  VALUES ('Willer Kathrin')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Willer Kathrin';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 3054.49, 249.23, 276.10, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, v_year_id, 2, v_year, 3054.49, 249.23, 276.10, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, v_year_id, 3, v_year, 3054.49, 249.23, 276.10, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, v_year_id, 4, v_year, 3054.49, 249.23, 276.10, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, v_year_id, 5, v_year, 3054.49, 249.23, 276.10, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, v_year_id, 6, v_year, 3054.49, 249.23, 276.10, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, v_year_id, 7, v_year, 3054.49, 249.23, 276.10, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, v_year_id, 8, v_year, 3054.49, 249.23, 276.10, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, v_year_id, 9, v_year, 3354.49, 249.23, 276.10, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, v_year_id, 10, v_year, 3054.49, 249.23, 276.10, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, v_year_id, 11, v_year, 3054.49, 249.23, 276.10, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, v_year_id, 12, v_year, 6108.98, 498.46, 552.20, 77.18, 100.94, 3.56, 56.41, 11.58)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Thomas Diana Melanie
  INSERT INTO global_employees (name)
  VALUES ('Thomas Diana Melanie')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Thomas Diana Melanie';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 3900.00, 308.10, 362.70, 50.70, 66.30, 2.34, 62.40, 17.16),
    (v_employee_id, v_year_id, 2, v_year, 3900.00, 308.10, 362.70, 50.70, 66.30, 2.34, 62.40, 17.16),
    (v_employee_id, v_year_id, 3, v_year, 3900.00, 308.10, 362.70, 50.70, 66.30, 2.34, 62.40, 17.16),
    (v_employee_id, v_year_id, 4, v_year, 3900.00, 308.10, 362.70, 50.70, 66.30, 2.34, 62.40, 17.16),
    (v_employee_id, v_year_id, 5, v_year, 3900.00, 308.10, 362.70, 50.70, 66.30, 2.34, 62.40, 17.16),
    (v_employee_id, v_year_id, 6, v_year, 3900.00, 308.10, 362.70, 50.70, 66.30, 2.34, 62.40, 17.16),
    (v_employee_id, v_year_id, 7, v_year, 2390.32, 188.83, 222.30, 31.07, 40.64, 1.43, 38.25, 10.52),
    (v_employee_id, v_year_id, 8, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 9, v_year, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00),
    (v_employee_id, v_year_id, 10, v_year, 4290.00, 338.91, 398.97, 55.77, 72.93, 2.57, 68.64, 18.88),
    (v_employee_id, v_year_id, 11, v_year, 3900.00, 308.10, 362.70, 50.70, 66.30, 2.34, 62.40, 17.16),
    (v_employee_id, v_year_id, 12, v_year, 7800.00, 616.20, 725.40, 101.40, 132.60, 4.68, 62.40, 17.16)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Mende Linus
  INSERT INTO global_employees (name)
  VALUES ('Mende Linus')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Mende Linus';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 2100.00, 0.00, 195.30, 0.00, 0.00, 1.26, 52.29, 10.92),
    (v_employee_id, v_year_id, 2, v_year, 2350.00, 197.40, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, v_year_id, 3, v_year, 2350.00, 197.40, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, v_year_id, 4, v_year, 2350.00, 197.40, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, v_year_id, 5, v_year, 2350.00, 197.40, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, v_year_id, 6, v_year, 2350.00, 197.40, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, v_year_id, 7, v_year, 2350.00, 197.40, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, v_year_id, 8, v_year, 2350.00, 197.40, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, v_year_id, 9, v_year, 2650.00, 197.40, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, v_year_id, 10, v_year, 2350.00, 197.40, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, v_year_id, 11, v_year, 2350.00, 197.40, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, v_year_id, 12, v_year, 4700.00, 394.80, 437.10, 61.10, 79.90, 2.82, 58.52, 12.22)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Haase Sophie
  INSERT INTO global_employees (name)
  VALUES ('Haase Sophie')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Haase Sophie';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 2350.00, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58),
    (v_employee_id, v_year_id, 2, v_year, 2350.00, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58),
    (v_employee_id, v_year_id, 3, v_year, 2350.00, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58),
    (v_employee_id, v_year_id, 4, v_year, 2350.00, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58),
    (v_employee_id, v_year_id, 5, v_year, 2350.00, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58),
    (v_employee_id, v_year_id, 6, v_year, 2350.00, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58),
    (v_employee_id, v_year_id, 7, v_year, 2350.00, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58),
    (v_employee_id, v_year_id, 8, v_year, 2350.00, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58),
    (v_employee_id, v_year_id, 9, v_year, 2650.00, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58),
    (v_employee_id, v_year_id, 10, v_year, 2350.00, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58),
    (v_employee_id, v_year_id, 11, v_year, 2350.00, 189.06, 218.55, 30.55, 39.95, 1.41, 44.65, 10.58),
    (v_employee_id, v_year_id, 12, v_year, 4700.00, 378.12, 437.10, 61.10, 79.90, 2.82, 44.65, 10.58)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- van Olphen Tim
  INSERT INTO global_employees (name)
  VALUES ('van Olphen Tim')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'van Olphen Tim';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, v_year, 3100.00, 244.90, 288.30, 40.30, 52.70, 1.86, 49.60, 13.64),
    (v_employee_id, v_year_id, 2, v_year, 3100.00, 244.90, 288.30, 40.30, 52.70, 1.86, 49.60, 13.64),
    (v_employee_id, v_year_id, 3, v_year, 3100.00, 244.90, 288.30, 40.30, 52.70, 1.86, 49.60, 13.64),
    (v_employee_id, v_year_id, 4, v_year, 3100.00, 244.90, 288.30, 40.30, 52.70, 1.86, 49.60, 13.64),
    (v_employee_id, v_year_id, 5, v_year, 3100.00, 244.90, 288.30, 40.30, 52.70, 1.86, 49.60, 13.64),
    (v_employee_id, v_year_id, 6, v_year, 3100.00, 244.90, 288.30, 40.30, 52.70, 1.86, 49.60, 13.64),
    (v_employee_id, v_year_id, 7, v_year, 3100.00, 244.90, 288.30, 40.30, 52.70, 1.86, 49.60, 13.64),
    (v_employee_id, v_year_id, 8, v_year, 3100.00, 244.90, 288.30, 40.30, 52.70, 1.86, 49.60, 13.64),
    (v_employee_id, v_year_id, 9, v_year, 3400.00, 244.90, 288.30, 40.30, 52.70, 1.86, 49.60, 13.64),
    (v_employee_id, v_year_id, 10, v_year, 3100.00, 244.90, 288.30, 40.30, 52.70, 1.86, 49.60, 13.64),
    (v_employee_id, v_year_id, 11, v_year, 3200.00, 252.80, 297.60, 41.60, 54.40, 1.92, 51.20, 14.08),
    (v_employee_id, v_year_id, 12, v_year, 6400.00, 505.60, 595.20, 83.20, 108.80, 3.84, 51.20, 14.08)
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