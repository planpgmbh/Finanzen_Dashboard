-- Create function to cleanup unused employees
CREATE OR REPLACE FUNCTION cleanup_unused_employees()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete global employees that have no associated monthly data
  DELETE FROM global_employees ge
  WHERE NOT EXISTS (
    SELECT 1 
    FROM personnel_monthly_data md 
    WHERE md.global_employee_id = ge.id
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION cleanup_unused_employees TO authenticated;