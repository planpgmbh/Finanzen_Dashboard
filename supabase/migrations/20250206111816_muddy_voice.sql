/*
  # Add Historical Years 2020-2022

  1. Changes
    - Insert years 2022, 2021, and 2020 into personnel_years table
    - Sets up basic structure for historical data

  2. Notes
    - Creates placeholder entries for historical years
    - Employee data needs to be added once available
*/

-- Insert historical years
INSERT INTO personnel_years (year, total_cost)
VALUES 
  (2022, 0),
  (2021, 0),
  (2020, 0)
ON CONFLICT (year) DO NOTHING;