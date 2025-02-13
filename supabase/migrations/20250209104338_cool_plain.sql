-- Create view for monthly employee costs
CREATE OR REPLACE VIEW employee_monthly_costs AS
SELECT 
  md.global_employee_id,
  md.year_id,
  md.month,
  (
    md.grundgehalt + 
    md.krankenversicherung + 
    md.rentenversicherung + 
    md.arbeitslosenversicherung + 
    md.pflegeversicherung + 
    md.insolvenzgeldumlage + 
    md.umlage_u1 + 
    md.umlage_u2
  ) as total_cost
FROM personnel_monthly_data md;

-- Create view for yearly employee costs
CREATE OR REPLACE VIEW employee_yearly_costs AS
SELECT 
  ge.id as employee_id,
  ge.name as employee_name,
  md.year_id,
  py.year,
  SUM(
    md.grundgehalt + 
    md.krankenversicherung + 
    md.rentenversicherung + 
    md.arbeitslosenversicherung + 
    md.pflegeversicherung + 
    md.insolvenzgeldumlage + 
    md.umlage_u1 + 
    md.umlage_u2
  ) as yearly_cost
FROM global_employees ge
JOIN personnel_monthly_data md ON md.global_employee_id = ge.id
JOIN personnel_years py ON py.id = md.year_id
GROUP BY ge.id, ge.name, md.year_id, py.year;

-- Create view for total yearly costs
CREATE OR REPLACE VIEW total_yearly_costs AS
SELECT 
  py.id as year_id,
  py.year,
  SUM(
    md.grundgehalt + 
    md.krankenversicherung + 
    md.rentenversicherung + 
    md.arbeitslosenversicherung + 
    md.pflegeversicherung + 
    md.insolvenzgeldumlage + 
    md.umlage_u1 + 
    md.umlage_u2
  ) as total_cost
FROM personnel_years py
LEFT JOIN personnel_monthly_data md ON md.year_id = py.id
GROUP BY py.id, py.year;

-- Create function to get employee monthly cost
CREATE OR REPLACE FUNCTION get_employee_monthly_cost(
  p_employee_id uuid,
  p_year_id uuid,
  p_month integer
)
RETURNS numeric
LANGUAGE sql
STABLE
AS $$
  SELECT 
    grundgehalt + 
    krankenversicherung + 
    rentenversicherung + 
    arbeitslosenversicherung + 
    pflegeversicherung + 
    insolvenzgeldumlage + 
    umlage_u1 + 
    umlage_u2
  FROM personnel_monthly_data
  WHERE global_employee_id = p_employee_id
    AND year_id = p_year_id
    AND month = p_month;
$$;

-- Create function to get total monthly cost for a year
CREATE OR REPLACE FUNCTION get_total_monthly_cost(
  p_year_id uuid,
  p_month integer
)
RETURNS numeric
LANGUAGE sql
STABLE
AS $$
  SELECT SUM(
    grundgehalt + 
    krankenversicherung + 
    rentenversicherung + 
    arbeitslosenversicherung + 
    pflegeversicherung + 
    insolvenzgeldumlage + 
    umlage_u1 + 
    umlage_u2
  )
  FROM personnel_monthly_data
  WHERE year_id = p_year_id
    AND month = p_month;
$$;

-- Grant permissions
GRANT SELECT ON employee_monthly_costs TO authenticated;
GRANT SELECT ON employee_yearly_costs TO authenticated;
GRANT SELECT ON total_yearly_costs TO authenticated;
GRANT EXECUTE ON FUNCTION get_employee_monthly_cost TO authenticated;
GRANT EXECUTE ON FUNCTION get_total_monthly_cost TO authenticated;