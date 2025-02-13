-- Drop existing functions
DROP FUNCTION IF EXISTS assign_role_to_user CASCADE;
DROP FUNCTION IF EXISTS remove_role_from_user CASCADE;

-- Function to assign role to user
CREATE OR REPLACE FUNCTION assign_role_to_user(
  target_user_id uuid,
  role_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role_id uuid;
  v_permission_id uuid;
BEGIN
  -- Check if user has admin role
  IF NOT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'administration'
  ) THEN
    RAISE EXCEPTION 'Access denied: User is not an administrator';
  END IF;

  -- Get or create role
  INSERT INTO roles (name)
  VALUES (role_name)
  ON CONFLICT (name) 
  DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_role_id;

  -- Get or create permission with same name
  INSERT INTO permissions (name)
  VALUES (role_name)
  ON CONFLICT (name) 
  DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO v_permission_id;

  -- Assign role to user
  INSERT INTO user_roles (user_id, role_id)
  VALUES (target_user_id, v_role_id)
  ON CONFLICT DO NOTHING;

  -- Assign permission to role
  INSERT INTO role_permissions (role_id, permission_id)
  VALUES (v_role_id, v_permission_id)
  ON CONFLICT DO NOTHING;
END;
$$;

-- Function to remove role from user
CREATE OR REPLACE FUNCTION remove_role_from_user(
  target_user_id uuid,
  role_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role_id uuid;
BEGIN
  -- Check if user has admin role
  IF NOT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'administration'
  ) THEN
    RAISE EXCEPTION 'Access denied: User is not an administrator';
  END IF;

  -- Get role ID
  SELECT id INTO v_role_id FROM roles WHERE name = role_name;
  
  -- Remove role from user
  DELETE FROM user_roles
  WHERE user_id = target_user_id AND role_id = v_role_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION assign_role_to_user TO authenticated;
GRANT EXECUTE ON FUNCTION remove_role_from_user TO authenticated;