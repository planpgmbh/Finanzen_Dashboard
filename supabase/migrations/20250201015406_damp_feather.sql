/*
  # Add Role Permissions System

  1. New Tables
    - `roles` - Defines available roles
    - `permissions` - Defines available permissions (pages)
    - `role_permissions` - Maps roles to permissions
    - `user_roles` - Maps users to roles

  2. Views
    - `user_permissions_view` - Shows all permissions for each user

  3. Functions
    - `get_user_permissions` - Gets permissions for a user
    - `assign_role_to_user` - Assigns a role to a user
    - `remove_role_from_user` - Removes a role from a user
*/

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create role_permissions table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Create view for user permissions
CREATE OR REPLACE VIEW user_permissions_view AS
SELECT 
  u.id as user_id,
  u.email,
  array_agg(DISTINCT r.name) as roles,
  array_agg(DISTINCT p.name) as permissions
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
LEFT JOIN role_permissions rp ON r.id = rp.role_id
LEFT JOIN permissions p ON rp.permission_id = p.id
GROUP BY u.id, u.email;

-- Function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_id uuid)
RETURNS TABLE (permission_name text)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DISTINCT p.name
  FROM permissions p
  JOIN role_permissions rp ON p.id = rp.permission_id
  JOIN user_roles ur ON rp.role_id = ur.role_id
  WHERE ur.user_id = user_id;
$$;

-- Function to assign role to user
CREATE OR REPLACE FUNCTION assign_role_to_user(
  target_user_id uuid,
  role_name text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  role_id uuid;
BEGIN
  -- Get role ID
  SELECT id INTO role_id FROM roles WHERE name = role_name;
  IF role_id IS NULL THEN
    RAISE EXCEPTION 'Role not found';
  END IF;

  -- Insert role assignment
  INSERT INTO user_roles (user_id, role_id)
  VALUES (target_user_id, role_id)
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
AS $$
DECLARE
  role_id uuid;
BEGIN
  -- Get role ID
  SELECT id INTO role_id FROM roles WHERE name = role_name;
  IF role_id IS NULL THEN
    RAISE EXCEPTION 'Role not found';
  END IF;

  -- Remove role assignment
  DELETE FROM user_roles
  WHERE user_id = target_user_id AND role_id = role_id;
END;
$$;

-- Insert default roles
INSERT INTO roles (name, description) VALUES
('admin', 'Administrator with full access'),
('user', 'Standard user')
ON CONFLICT (name) DO NOTHING;

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
('dashboard', 'Access to Dashboard'),
('invoices', 'Access to Invoices'),
('expenses', 'Access to Expenses'),
('credit-cards', 'Access to Credit Cards'),
('running-costs', 'Access to Running Costs'),
('personnel', 'Access to Personnel'),
('administration', 'Access to Administration'),
('settings', 'Access to Settings')
ON CONFLICT (name) DO NOTHING;

-- Assign all permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- Assign basic permissions to user role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'user'
AND p.name IN ('dashboard', 'invoices', 'expenses', 'settings')
ON CONFLICT DO NOTHING;

-- Grant access to tables and functions
GRANT SELECT ON roles TO authenticated;
GRANT SELECT ON permissions TO authenticated;
GRANT SELECT ON role_permissions TO authenticated;
GRANT SELECT ON user_roles TO authenticated;
GRANT SELECT ON user_permissions_view TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_permissions TO authenticated;
GRANT EXECUTE ON FUNCTION assign_role_to_user TO authenticated;
GRANT EXECUTE ON FUNCTION remove_role_from_user TO authenticated;