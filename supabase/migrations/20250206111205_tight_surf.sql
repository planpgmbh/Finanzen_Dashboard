/*
  # Add Personnel Data for 2023

  1. Changes
    - Insert year 2023 into personnel_years table
    - Add placeholder for employee data (will be updated once data is provided)

  2. Notes
    - Creates basic structure for 2023
    - Employee data needs to be added once available
*/

-- Insert year 2023
INSERT INTO personnel_years (year, total_cost)
VALUES (2023, 0)
ON CONFLICT (year) DO NOTHING;