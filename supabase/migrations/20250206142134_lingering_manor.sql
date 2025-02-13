/*
  # Remove year 2020
  
  1. Changes
    - Delete year 2020 from personnel_years table
    - This will cascade delete all related employees and monthly data
*/

DELETE FROM personnel_years
WHERE year = 2020;