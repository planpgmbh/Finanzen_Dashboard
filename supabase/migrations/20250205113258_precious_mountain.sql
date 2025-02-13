/*
  # Personnel Database Schema

  1. New Tables
    - `personnel_years`
      - Tracks yearly personnel data
      - Contains total cost and year information
    
    - `personnel_employees`
      - Stores employee information
      - Links to personnel_years
    
    - `personnel_monthly_data`
      - Stores monthly salary data for each employee
      - Contains all salary components
      - Links to personnel_employees

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create personnel_years table
CREATE TABLE personnel_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL UNIQUE,
  total_cost numeric(12,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create personnel_employees table
CREATE TABLE personnel_employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year_id uuid REFERENCES personnel_years(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create personnel_monthly_data table
CREATE TABLE personnel_monthly_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid REFERENCES personnel_employees(id) ON DELETE CASCADE,
  month integer NOT NULL CHECK (month BETWEEN 1 AND 14),
  year integer NOT NULL,
  grundgehalt numeric(10,2) NOT NULL DEFAULT 0,
  krankenversicherung numeric(10,2) NOT NULL DEFAULT 0,
  rentenversicherung numeric(10,2) NOT NULL DEFAULT 0,
  arbeitslosenversicherung numeric(10,2) NOT NULL DEFAULT 0,
  pflegeversicherung numeric(10,2) NOT NULL DEFAULT 0,
  insolvenzgeldumlage numeric(10,2) NOT NULL DEFAULT 0,
  umlage_u1 numeric(10,2) NOT NULL DEFAULT 0,
  umlage_u2 numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, month, year)
);

-- Enable RLS
ALTER TABLE personnel_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel_employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE personnel_monthly_data ENABLE ROW LEVEL SECURITY;

-- Create policies for personnel_years
CREATE POLICY "Users can view personnel years"
  ON personnel_years
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert personnel years"
  ON personnel_years
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update personnel years"
  ON personnel_years
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete personnel years"
  ON personnel_years
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for personnel_employees
CREATE POLICY "Users can view personnel employees"
  ON personnel_employees
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert personnel employees"
  ON personnel_employees
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update personnel employees"
  ON personnel_employees
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete personnel employees"
  ON personnel_employees
  FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for personnel_monthly_data
CREATE POLICY "Users can view personnel monthly data"
  ON personnel_monthly_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert personnel monthly data"
  ON personnel_monthly_data
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update personnel monthly data"
  ON personnel_monthly_data
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete personnel monthly data"
  ON personnel_monthly_data
  FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_personnel_employees_year_id ON personnel_employees(year_id);
CREATE INDEX idx_personnel_monthly_data_employee_id ON personnel_monthly_data(employee_id);
CREATE INDEX idx_personnel_monthly_data_year ON personnel_monthly_data(year);