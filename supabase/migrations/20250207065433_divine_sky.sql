-- Helper function to insert monthly data
CREATE OR REPLACE FUNCTION insert_monthly_costs(
  p_year_id uuid,
  p_category_id uuid,
  p_monthly_cost numeric
) RETURNS void AS $$
BEGIN
  INSERT INTO running_cost_entries (year_id, category_id, month, cost)
  SELECT 
    p_year_id,
    p_category_id,
    generate_series,
    p_monthly_cost
  FROM generate_series(1, 12);
END;
$$ LANGUAGE plpgsql;

DO $$ 
DECLARE
  v_year_id uuid;
  v_category_id uuid;
BEGIN
  -- 2025 Data
  SELECT id INTO v_year_id FROM running_cost_years WHERE year = 2025;

  -- Miete
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Miete';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 2500.00);

  -- Strom
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Strom';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 180.00);

  -- Internet & Telefon
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Internet & Telefon';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 150.00);

  -- Versicherungen
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Versicherungen';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 350.00);

  -- Software-Lizenzen
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Software-Lizenzen';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 300.00);

  -- 2024 Data (same costs)
  SELECT id INTO v_year_id FROM running_cost_years WHERE year = 2024;

  -- Miete
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Miete';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 2500.00);

  -- Strom
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Strom';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 180.00);

  -- Internet & Telefon
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Internet & Telefon';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 150.00);

  -- Versicherungen
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Versicherungen';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 350.00);

  -- Software-Lizenzen
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Software-Lizenzen';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 300.00);

  -- 2023 Data (slightly lower costs)
  SELECT id INTO v_year_id FROM running_cost_years WHERE year = 2023;

  -- Miete
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Miete';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 2400.00);

  -- Strom
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Strom';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 160.00);

  -- Internet & Telefon
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Internet & Telefon';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 140.00);

  -- Versicherungen
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Versicherungen';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 320.00);

  -- Software-Lizenzen
  SELECT id INTO v_category_id FROM running_cost_categories WHERE name = 'Software-Lizenzen';
  PERFORM insert_monthly_costs(v_year_id, v_category_id, 280.00);
END $$;

-- Drop the helper function
DROP FUNCTION insert_monthly_costs;