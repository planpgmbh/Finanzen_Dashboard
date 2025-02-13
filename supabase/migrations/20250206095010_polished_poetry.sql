/*
  # Add remaining employees for 2024

  1. Changes
    - Continue adding remaining employees and their monthly data for 2024
    - Includes data for:
      - Koch Leslie
      - Mende Linus
      - Mielke-Schmidt Katrin
      - Roß Melanie
      - Schmitz Miriam
      - Schuberth Philipp
      - Sobhe Arian
      - Stamer Thomas
      - Thomas Diana Melanie
      - Willer Kathrin
      - Willer Klaus-Jürgen
      - Willer Maria
      - Willer Teo
      - Willms Judith
      - Wöllner Claudia
      - van Olphen Tim
*/

DO $$ 
DECLARE
  v_year_id uuid;
  v_employee_id uuid;
BEGIN
  -- Get the year ID for 2024
  SELECT id INTO v_year_id FROM personnel_years WHERE year = 2024;

  -- Koch Leslie
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Koch Leslie')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 2, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 3, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 4, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 5, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 6, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 7, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 8, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 9, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 10, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 11, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 12, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08);

  -- Mende Linus
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Mende Linus')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 2100.0, 0.0, 195.3, 0.0, 0.0, 1.26, 52.29, 10.92),
    (v_employee_id, 2, 2024, 2350.0, 197.4, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, 3, 2024, 2350.0, 197.4, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, 4, 2024, 2350.0, 197.4, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, 5, 2024, 2350.0, 197.4, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, 6, 2024, 2350.0, 197.4, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, 7, 2024, 2350.0, 197.4, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, 8, 2024, 2350.0, 197.4, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, 9, 2024, 2350.0, 197.4, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, 10, 2024, 2350.0, 197.4, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, 11, 2024, 2350.0, 197.4, 218.55, 30.55, 39.95, 1.41, 58.52, 12.22),
    (v_employee_id, 12, 2024, 4700.0, 394.8, 437.1, 61.1, 79.9, 2.82, 58.52, 12.22);

  -- Mielke-Schmidt Katrin
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Mielke-Schmidt Katrin')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 2, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 3, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 4, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 5, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 6, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 7, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 8, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 9, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 10, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 11, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 12, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08);

  -- Roß Melanie
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Roß Melanie')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 2670.0, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41),
    (v_employee_id, 2, 2024, 2670.0, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41),
    (v_employee_id, 3, 2024, 2670.0, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41),
    (v_employee_id, 4, 2024, 2670.0, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41),
    (v_employee_id, 5, 2024, 2670.0, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41),
    (v_employee_id, 6, 2024, 2670.0, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41),
    (v_employee_id, 7, 2024, 2670.0, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41),
    (v_employee_id, 8, 2024, 2670.0, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41),
    (v_employee_id, 9, 2024, 2670.0, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41),
    (v_employee_id, 10, 2024, 2670.0, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41),
    (v_employee_id, 11, 2024, 2670.0, 224.15, 248.31, 34.71, 45.39, 1.6, 50.73, 10.41),
    (v_employee_id, 12, 2024, 5340.0, 448.3, 496.62, 69.42, 90.78, 3.2, 50.73, 10.41);

  -- Schmitz Miriam
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Schmitz Miriam')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 2, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 3, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 4, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 5, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 6, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 7, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 8, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 9, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 10, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 11, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 12, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

  -- Schuberth Philipp
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Schuberth Philipp')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 7677.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 2, 2024, 7677.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 3, 2024, 7677.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 4, 2024, 7677.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 5, 2024, 7677.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 6, 2024, 21412.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 7, 2024, 7677.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 8, 2024, 7677.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 9, 2024, 7677.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 10, 2024, 7677.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 11, 2024, 7677.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 12, 2024, 7677.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

  -- Sobhe Arian
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Sobhe Arian')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 2100.0, 171.15, 195.3, 27.3, 35.7, 1.26, 48.3, 7.77),
    (v_employee_id, 2, 2024, 2100.0, 171.15, 195.3, 27.3, 35.7, 1.26, 48.3, 7.77),
    (v_employee_id, 3, 2024, 2100.0, 171.15, 195.3, 27.3, 35.7, 1.26, 48.3, 7.77),
    (v_employee_id, 4, 2024, 2100.0, 171.15, 195.3, 27.3, 35.7, 1.26, 48.3, 7.77),
    (v_employee_id, 5, 2024, 3900.0, 317.85, 362.7, 50.7, 66.3, 2.34, 89.7, 14.43),
    (v_employee_id, 6, 2024, 2700.0, 220.05, 251.1, 35.1, 45.9, 1.62, 62.1, 9.99),
    (v_employee_id, 7, 2024, 2700.0, 220.05, 251.1, 35.1, 45.9, 1.62, 62.1, 9.99),
    (v_employee_id, 8, 2024, 2700.0, 220.05, 251.1, 35.1, 45.9, 1.62, 62.1, 9.99),
    (v_employee_id, 9, 2024, 2700.0, 220.05, 251.1, 35.1, 45.9, 1.62, 62.1, 7.83),
    (v_employee_id, 10, 2024, 2700.0, 220.05, 251.1, 35.1, 45.9, 1.62, 62.1, 7.83),
    (v_employee_id, 11, 2024, 2700.0, 220.05, 251.1, 35.1, 45.9, 1.62, 62.1, 7.83),
    (v_employee_id, 12, 2024, 5400.0, 440.1, 502.2, 70.2, 91.8, 3.24, 62.1, 7.83);

  -- Stamer Thomas
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Stamer Thomas')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 5650.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 2, 2024, 5650.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 3, 2024, 5650.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 4, 2024, 5650.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 5, 2024, 5066.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 6, 2024, 14110.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 7, 2024, 5650.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 8, 2024, 5650.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 9, 2024, 5650.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 10, 2024, 5650.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 11, 2024, 5650.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 12, 2024, 11650.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

  -- Thomas Diana Melanie
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Thomas Diana Melanie')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 3900.0, 308.1, 362.7, 50.7, 66.3, 2.34, 62.4, 17.16),
    (v_employee_id, 2, 2024, 3900.0, 308.1, 362.7, 50.7, 66.3, 2.34, 62.4, 17.16),
    (v_employee_id, 3, 2024, 3900.0, 308.1, 362.7, 50.7, 66.3, 2.34, 62.4, 17.16),
    (v_employee_id, 4, 2024, 3900.0, 308.1, 362.7, 50.7, 66.3, 2.34, 62.4, 17.16),
    (v_employee_id, 5, 2024, 3900.0, 308.1, 362.7, 50.7, 66.3, 2.34, 62.4, 17.16),
    (v_employee_id, 6, 2024, 3900.0, 308.1, 362.7, 50.7, 66.3, 2.34, 62.4, 17.16),
    (v_employee_id, 7, 2024, 2390.32, 188.83, 222.3, 31.07, 40.64, 1.43, 38.25, 10.52),
    (v_employee_id, 8, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 9, 2024, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 10, 2024, 4290.0, 338.91, 398.97, 55.77, 72.93, 2.57, 68.64, 18.88),
    (v_employee_id, 11, 2024, 3900.0, 308.1, 362.7, 50.7, 66.3, 2.34, 62.4, 17.16),
    (v_employee_id, 12, 2024, 3998.0, 308.1, 362.7, 50.7, 66.3, 2.34, 62.4, 17.16);

  -- Willer Kathrin
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Willer Kathrin')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, 2, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, 3, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, 4, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, 5, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, 6, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, 7, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, 8, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, 9, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, 10, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, 11, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58),
    (v_employee_id, 12, 2024, 3054.49, 249.23, 276.1, 38.59, 50.47, 1.78, 56.41, 11.58);

  -- Willer Klaus-Jürgen
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Willer Klaus-Jürgen')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 7190.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 2, 2024, 7190.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 3, 2024, 7239.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 4, 2024, 7239.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 5, 2024, 7239.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 6, 2024, 16038.26, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 7, 2024, 14615.42, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 8, 2024, 7417.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 9, 2024, 7417.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 10, 2024, 7417.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 11, 2024, 7417.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0),
    (v_employee_id, 12, 2024, 13417.21, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

  -- Willer Maria
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Willer Maria')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96),
    (v_employee_id, 2, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96),
    (v_employee_id, 3, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96),
    (v_employee_id, 4, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96),
    (v_employee_id, 5, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96),
    (v_employee_id, 6, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96),
    (v_employee_id, 7, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96),
    (v_employee_id, 8, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96),
    (v_employee_id, 9, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96),
    (v_employee_id, 10, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96),
    (v_employee_id, 11, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96),
    (v_employee_id, 12, 2024, 400.0, 52.0, 60.0, 0.0, 0.0, 0.24, 4.4, 0.96);

  -- Willer Teo
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Willer Teo')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 2750.0, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, 2, 2024, 2750.0, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, 3, 2024, 2750.0, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, 4, 2024, 2750.0, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, 5, 2024, 2750.0, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, 6, 2024, 2750.0, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, 7, 2024, 5500.0, 461.72, 511.5, 71.5, 93.5, 3.3, 52.25, 10.73),
    (v_employee_id, 8, 2024, 2750.0, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, 9, 2024, 2750.0, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, 10, 2024, 2750.0, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, 11, 2024, 2750.0, 230.86, 255.75, 35.75, 46.75, 1.65, 52.25, 10.73),
    (v_employee_id, 12, 2024, 5500.0, 461.72, 511.5, 71.5, 93.5, 3.3, 52.25, 10.73);

  -- Willms Judith
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Willms Judith')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38),
    (v_employee_id, 2, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38),
    (v_employee_id, 3, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38),
    (v_employee_id, 4, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38),
    (v_employee_id, 5, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38),
    (v_employee_id, 6, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38),
    (v_employee_id, 7, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38),
    (v_employee_id, 8, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38),
    (v_employee_id, 9, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38),
    (v_employee_id, 10, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38),
    (v_employee_id, 11, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38),
    (v_employee_id, 12, 2024, 2750.0, 221.24, 255.75, 35.75, 46.75, 1.65, 52.25, 12.38);

  -- Wöllner Claudia
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'Wöllner Claudia')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 3080.0, 243.32, 286.44, 40.04, 52.36, 1.85, 49.28, 13.55),
    (v_employee_id, 2, 2024, 3080.0, 243.32, 286.44, 40.04, 52.36, 1.85, 49.28, 13.55),
    (v_employee_id, 3, 2024, 4000.0, 316.0, 372.0, 52.0, 68.0, 2.4, 64.0, 17.6),
    (v_employee_id, 4, 2024, 4000.0, 316.0, 372.0, 52.0, 68.0, 2.4, 64.0, 17.6),
    (v_employee_id, 5, 2024, 4000.0, 316.0, 372.0, 52.0, 68.0, 2.4, 64.0, 17.6),
    (v_employee_id, 6, 2024, 4000.0, 316.0, 372.0, 52.0, 68.0, 2.4, 64.0, 17.6),
    (v_employee_id, 7, 2024, 4000.0, 316.0, 372.0, 52.0, 68.0, 2.4, 64.0, 17.6),
    (v_employee_id, 8, 2024, 4000.0, 316.0, 372.0, 52.0, 68.0, 2.4, 64.0, 17.6),
    (v_employee_id, 9, 2024, 4000.0, 316.0, 372.0, 52.0, 68.0, 2.4, 64.0, 17.6),
    (v_employee_id, 10, 2024, 4000.0, 316.0, 372.0, 52.0, 68.0, 2.4, 64.0, 17.6),
    (v_employee_id, 11, 2024, 4000.0, 316.0, 372.0, 52.0, 68.0, 2.4, 64.0, 17.6),
    (v_employee_id, 12, 2024, 5752.0, 316.0, 372.0, 52.0, 68.0, 2.4, 64.0, 17.6);

  -- van Olphen Tim
  INSERT INTO personnel_employees (year_id, name)
  VALUES (v_year_id, 'van Olphen Tim')
  RETURNING id INTO v_employee_id;

  INSERT INTO personnel_monthly_data (employee_id, month, year, grundgehalt, krankenversicherung, rentenversicherung, arbeitslosenversicherung, pflegeversicherung, insolvenzgeldumlage, umlage_u1, umlage_u2)
  VALUES
    (v_employee_id, 1, 2024, 3100.0, 244.9, 288.3, 40.3, 52.7, 1.86, 49.6, 13.64),
    (v_employee_id, 2, 2024, 3100.0, 244.9, 288.3, 40.3, 52.7, 1.86, 49.6, 13.64),
    (v_employee_id, 3, 2024, 3100.0, 244.9, 288.3, 40.3, 52.7, 1.86, 49.6, 13.64),
    (v_employee_id, 4, 2024, 3100.0, 244.9, 288.3, 40.3, 52.7, 1.86, 49.6, 13.64),
    (v_employee_id, 5, 2024, 3100.0, 244.9, 288.3, 40.3, 52.7, 1.86, 49.6, 13.64),
    (v_employee_id, 6, 2024, 3100.0, 244.9, 288.3, 40.3, 52.7, 1.86, 49.6, 13.64),
    (v_employee_id, 7, 2024, 3100.0, 244.9, 288.3, 40.3, 52.7, 1.86, 49.6, 13.64),
    (v_employee_id, 8, 2024, 3100.0, 244.9, 288.3, 40.3, 52.7, 1.86, 49.6, 13.64),
    (v_employee_id, 9, 2024, 3100.0, 244.9, 288.3, 40.3, 52.7, 1.86, 49.6, 13.64),
    (v_employee_id, 10, 2024, 3100.0, 244.9, 288.3, 40.3, 52.7, 1.86, 49.6, 13.64),
    (v_employee_id, 11, 2024, 3200.0, 252.8, 297.6, 41.6, 54.4, 1.92, 51.2, 14.08),
    (v_employee_id, 12, 2024, 6400.0, 505.6, 595.2, 83.2, 108.8, 3.84, 51.2, 14.08);

  -- Update the total cost for 2024
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
  WHERE year = 2024;
END $$;