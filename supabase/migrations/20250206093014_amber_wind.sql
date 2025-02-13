/*
  # Remove einmaligeBezuege column

  1. Changes
    - Remove einmalige_bezuege column from personnel_monthly_data table
*/

ALTER TABLE personnel_monthly_data
DROP COLUMN einmalige_bezuege;