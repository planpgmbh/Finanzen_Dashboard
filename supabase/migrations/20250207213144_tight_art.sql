DO $$ 
DECLARE
  v_year_id uuid;
  v_employee_id uuid;
  v_year integer := 2023;
BEGIN
  -- Get the year ID for 2023
  SELECT id INTO v_year_id FROM personnel_years WHERE year = v_year;

  -- Willer Klaus-Jürgen
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Willer Klaus-Jürgen';
  
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
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Koch Leslie
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Koch Leslie';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 3200.00,
    krankenversicherung = 252.80,
    rentenversicherung = 297.60,
    arbeitslosenversicherung = 41.60,
    pflegeversicherung = 54.40,
    insolvenzgeldumlage = 1.92,
    umlage_u1 = 51.20,
    umlage_u2 = 14.08
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Wöllner Claudia
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Wöllner Claudia';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 3080.00,
    krankenversicherung = 243.32,
    rentenversicherung = 286.44,
    arbeitslosenversicherung = 40.04,
    pflegeversicherung = 52.36,
    insolvenzgeldumlage = 1.85,
    umlage_u1 = 49.28,
    umlage_u2 = 13.55
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Willer Maria
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Willer Maria';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 400.00,
    krankenversicherung = 52.00,
    rentenversicherung = 60.00,
    arbeitslosenversicherung = 0.00,
    pflegeversicherung = 0.00,
    insolvenzgeldumlage = 0.24,
    umlage_u1 = 4.40,
    umlage_u2 = 0.96
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Willms Judith
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Willms Judith';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 2750.00,
    krankenversicherung = 221.24,
    rentenversicherung = 255.75,
    arbeitslosenversicherung = 35.75,
    pflegeversicherung = 46.75,
    insolvenzgeldumlage = 1.65,
    umlage_u1 = 52.25,
    umlage_u2 = 12.38
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Stamer Thomas
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Stamer Thomas';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 5650.00,
    krankenversicherung = 0.00,
    rentenversicherung = 0.00,
    arbeitslosenversicherung = 0.00,
    pflegeversicherung = 0.00,
    insolvenzgeldumlage = 0.00,
    umlage_u1 = 0.00,
    umlage_u2 = 0.00
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Schmitz Miriam
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Schmitz Miriam';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 0.00,
    krankenversicherung = 0.00,
    rentenversicherung = 0.00,
    arbeitslosenversicherung = 0.00,
    pflegeversicherung = 0.00,
    insolvenzgeldumlage = 0.00,
    umlage_u1 = 0.00,
    umlage_u2 = 0.00
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Gruber Isabelle
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Gruber Isabelle';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 1000.00,
    krankenversicherung = 88.48,
    rentenversicherung = 105.64,
    arbeitslosenversicherung = 14.76,
    pflegeversicherung = 19.32,
    insolvenzgeldumlage = 0.53,
    umlage_u1 = 15.91,
    umlage_u2 = 3.36
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Roß Melanie
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Roß Melanie';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 2670.00,
    krankenversicherung = 224.15,
    rentenversicherung = 248.31,
    arbeitslosenversicherung = 34.71,
    pflegeversicherung = 45.39,
    insolvenzgeldumlage = 1.60,
    umlage_u1 = 50.73,
    umlage_u2 = 10.41
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Schuberth Philipp
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Schuberth Philipp';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 7677.00,
    krankenversicherung = 0.00,
    rentenversicherung = 0.00,
    arbeitslosenversicherung = 0.00,
    pflegeversicherung = 0.00,
    insolvenzgeldumlage = 0.00,
    umlage_u1 = 0.00,
    umlage_u2 = 0.00
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Beuth Gunnar
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Beuth Gunnar';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 3500.00,
    krankenversicherung = 276.50,
    rentenversicherung = 325.50,
    arbeitslosenversicherung = 45.50,
    pflegeversicherung = 59.50,
    insolvenzgeldumlage = 2.10,
    umlage_u1 = 56.00,
    umlage_u2 = 15.40
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Sobhe Arian
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Sobhe Arian';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 2100.00,
    krankenversicherung = 171.15,
    rentenversicherung = 195.30,
    arbeitslosenversicherung = 27.30,
    pflegeversicherung = 35.70,
    insolvenzgeldumlage = 1.26,
    umlage_u1 = 48.30,
    umlage_u2 = 7.77
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Mielke-Schmidt Katrin
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Mielke-Schmidt Katrin';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 3200.00,
    krankenversicherung = 252.80,
    rentenversicherung = 297.60,
    arbeitslosenversicherung = 41.60,
    pflegeversicherung = 54.40,
    insolvenzgeldumlage = 1.92,
    umlage_u1 = 51.20,
    umlage_u2 = 14.08
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Willer Kathrin
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Willer Kathrin';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 3054.49,
    krankenversicherung = 249.23,
    rentenversicherung = 276.10,
    arbeitslosenversicherung = 38.59,
    pflegeversicherung = 50.47,
    insolvenzgeldumlage = 1.78,
    umlage_u1 = 56.41,
    umlage_u2 = 11.58
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Thomas Diana Melanie
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Thomas Diana Melanie';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 3900.00,
    krankenversicherung = 308.10,
    rentenversicherung = 362.70,
    arbeitslosenversicherung = 50.70,
    pflegeversicherung = 66.30,
    insolvenzgeldumlage = 2.34,
    umlage_u1 = 62.40,
    umlage_u2 = 17.16
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Mende Linus
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Mende Linus';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 2350.00,
    krankenversicherung = 197.40,
    rentenversicherung = 218.55,
    arbeitslosenversicherung = 30.55,
    pflegeversicherung = 39.95,
    insolvenzgeldumlage = 1.41,
    umlage_u1 = 58.52,
    umlage_u2 = 12.22
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- Haase Sophie
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'Haase Sophie';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 2350.00,
    krankenversicherung = 189.06,
    rentenversicherung = 218.55,
    arbeitslosenversicherung = 30.55,
    pflegeversicherung = 39.95,
    insolvenzgeldumlage = 1.41,
    umlage_u1 = 44.65,
    umlage_u2 = 10.58
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

  -- van Olphen Tim
  SELECT id INTO v_employee_id FROM global_employees WHERE name = 'van Olphen Tim';
  
  UPDATE personnel_monthly_data
  SET 
    grundgehalt = 3100.00,
    krankenversicherung = 244.90,
    rentenversicherung = 288.30,
    arbeitslosenversicherung = 40.30,
    pflegeversicherung = 52.70,
    insolvenzgeldumlage = 1.86,
    umlage_u1 = 49.60,
    umlage_u2 = 13.64
  WHERE year_id = v_year_id AND global_employee_id = v_employee_id;

END $$;