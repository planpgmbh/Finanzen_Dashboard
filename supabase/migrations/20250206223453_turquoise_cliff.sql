-- Create year 2022 if it doesn't exist
INSERT INTO personnel_years (year)
VALUES (2022)
ON CONFLICT (year) DO NOTHING;

DO $$ 
DECLARE
  v_year_id uuid;
  v_employee_id uuid;
BEGIN
  -- Get the year ID for 2022
  SELECT id INTO v_year_id FROM personnel_years WHERE year = 2022;

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
    (v_employee_id, v_year_id, 1, 2022, 7368.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, v_year_id, 2, 2022, 7368.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, v_year_id, 3, 2022, 7368.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, v_year_id, 4, 2022, 7368.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, v_year_id, 5, 2022, 7368.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, v_year_id, 6, 2022, 7368.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, v_year_id, 7, 2022, 7368.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, v_year_id, 8, 2022, 6411.16, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, v_year_id, 9, 2022, 7490.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, v_year_id, 10, 2022, 7190.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, v_year_id, 11, 2022, 7190.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, v_year_id, 12, 2022, 23210.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Volk Katharina
  INSERT INTO global_employees (name)
  VALUES ('Volk Katharina')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Volk Katharina';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, 2022, 3000.0, 241.5, 279.0, 36.0, 45.75, 2.7, 45.0, 17.7)
  ON CONFLICT (global_employee_id, year_id, month) DO UPDATE SET
    grundgehalt = EXCLUDED.grundgehalt,
    krankenversicherung = EXCLUDED.krankenversicherung,
    rentenversicherung = EXCLUDED.rentenversicherung,
    arbeitslosenversicherung = EXCLUDED.arbeitslosenversicherung,
    pflegeversicherung = EXCLUDED.pflegeversicherung,
    insolvenzgeldumlage = EXCLUDED.insolvenzgeldumlage,
    umlage_u1 = EXCLUDED.umlage_u1,
    umlage_u2 = EXCLUDED.umlage_u2;

  -- Koch Leslie
  INSERT INTO global_employees (name)
  VALUES ('Koch Leslie')
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO v_employee_id;

  IF v_employee_id IS NULL THEN
    SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Koch Leslie';
  END IF;

  INSERT INTO personnel_monthly_data (
    global_employee_id, year_id, month, year,
    grundgehalt, krankenversicherung, rentenversicherung,
    arbeitslosenversicherung, pflegeversicherung,
    insolvenzgeldumlage, umlage_u1, umlage_u2
  ) VALUES
    (v_employee_id, v_year_id, 1, 2022, 3200.0, 252.8, 297.6, 38.4, 48.8, 2.88, 28.8, 20.8),
    (v_employee_id, v_year_id, 2, 2022, 3200.0, 252.8, 297.6, 38.4, 48.8, 2.88, 28.8, 20.8),
    (v_employee_id, v_year_id, 3, 2022, 3200.0, 252.8, 297.6, 38.4, 48.8, 2.88, 28.8, 20.8),
    (v_employee_id, v_year_id, 4, 2022, 3200.0, 252.8, 297.6, 38.4, 48.8, 2.88, 28.8, 20.8),
    (v_employee_id, v_year_id, 5, 2022, 3200.0, 252.8, 297.6, 38.4, 48.8, 2.88, 28.8, 20.8),
    (v_employee_id, v_year_id, 6, 2022, 3200.0, 252.8, 297.6, 38.4, 48.8, 2.88, 28.8, 20.8),
    (v_employee_id, v_year_id, 7, 2022, 3200.0, 252.8, 297.6, 38.4, 48.8, 2.88, 28.8, 20.8),
    (v_employee_id, v_year_id, 8, 2022, 3200.0, 252.8, 297.6, 38.4, 48.8, 2.88, 28.8, 20.8),
    (v_employee_id, v_year_id, 9, 2022, 3500.0, 252.8, 297.6, 38.4, 48.8, 2.88, 28.8, 20.8),
    (v_employee_id, v_year_id, 10, 2022, 3200.0, 252.8, 297.6, 38.4, 48.8, 2.88, 54.4, 18.56),
    (v_employee_id, v_year_id, 11, 2022, 3200.0, 252.8, 297.6, 38.4, 48.8, 2.88, 54.4, 18.56),
    (v_employee_id, v_year_id, 12, 2022, 3800.0, 252.8, 297.6, 38.4, 48.8, 2.88, 54.4, 18.56)
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