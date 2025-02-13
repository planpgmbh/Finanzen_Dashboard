-- Add einmalige_bezuege column to personnel_monthly_data
ALTER TABLE personnel_monthly_data
ADD COLUMN einmalige_bezuege numeric(10,2) NOT NULL DEFAULT 0;