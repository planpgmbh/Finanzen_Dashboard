-- First drop the existing foreign key constraint
ALTER TABLE personnel_monthly_data
DROP CONSTRAINT IF EXISTS personnel_monthly_data_year_id_fkey;

-- Re-add the constraint with ON DELETE CASCADE
ALTER TABLE personnel_monthly_data
ADD CONSTRAINT personnel_monthly_data_year_id_fkey
FOREIGN KEY (year_id)
REFERENCES personnel_years(id)
ON DELETE CASCADE;