-- Create running_cost_years table
CREATE TABLE running_cost_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create running_cost_categories table
CREATE TABLE running_cost_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create running_cost_entries table
CREATE TABLE running_cost_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_id uuid REFERENCES running_cost_years(id) ON DELETE CASCADE,
  category_id uuid REFERENCES running_cost_categories(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month BETWEEN 1 AND 12),
  cost numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(year_id, category_id, month)
);

-- Enable RLS
ALTER TABLE running_cost_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE running_cost_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE running_cost_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for running_cost_years
CREATE POLICY "Users can view running cost years"
  ON running_cost_years
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert running cost years"
  ON running_cost_years
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update running cost years"
  ON running_cost_years
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete running cost years"
  ON running_cost_years
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for running_cost_categories
CREATE POLICY "Users can view running cost categories"
  ON running_cost_categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert running cost categories"
  ON running_cost_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update running cost categories"
  ON running_cost_categories
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete running cost categories"
  ON running_cost_categories
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for running_cost_entries
CREATE POLICY "Users can view running cost entries"
  ON running_cost_entries
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert running cost entries"
  ON running_cost_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update running cost entries"
  ON running_cost_entries
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete running cost entries"
  ON running_cost_entries
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_running_cost_entries_year_id ON running_cost_entries(year_id);
CREATE INDEX idx_running_cost_entries_category_id ON running_cost_entries(category_id);
CREATE INDEX idx_running_cost_entries_month ON running_cost_entries(month);

-- Create view for total costs per year
CREATE OR REPLACE VIEW running_cost_year_totals AS
SELECT 
  y.id as year_id,
  y.year,
  COALESCE(SUM(e.cost), 0) as total_cost
FROM running_cost_years y
LEFT JOIN running_cost_entries e ON e.year_id = y.id
GROUP BY y.id, y.year;

-- Insert default categories
INSERT INTO running_cost_categories (name) VALUES
  ('Miete'),
  ('Strom'),
  ('Internet & Telefon'),
  ('Versicherungen'),
  ('Software-Lizenzen')
ON CONFLICT (name) DO NOTHING;

-- Insert years 2023-2025
INSERT INTO running_cost_years (year) VALUES
  (2023),
  (2024),
  (2025)
ON CONFLICT (year) DO NOTHING;