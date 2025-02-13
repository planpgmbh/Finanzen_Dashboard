-- Create a view for listing users
CREATE OR REPLACE VIEW users_view AS
SELECT
  id,
  email,
  raw_user_meta_data->>'role' as role,
  created_at,
  last_sign_in_at
FROM auth.users;

-- Grant access to the view
GRANT SELECT ON users_view TO authenticated;

-- Create a function to delete users safely
CREATE OR REPLACE FUNCTION delete_user(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete the user from auth.users
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION delete_user TO authenticated;