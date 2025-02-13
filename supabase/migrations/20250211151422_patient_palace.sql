-- Drop existing objects if they exist
DROP VIEW IF EXISTS user_permissions_view CASCADE;
DROP FUNCTION IF EXISTS get_user_permissions CASCADE;
DROP FUNCTION IF EXISTS assign_role_to_user CASCADE;
DROP FUNCTION IF EXISTS remove_role_from_user CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Create roles table
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create permissions table
CREATE TABLE permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user_roles table
CREATE TABLE user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Create role_permissions table
CREATE TABLE role_permissions (
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view roles" ON roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view permissions" ON permissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view user_roles" ON user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can view role_permissions" ON role_permissions FOR SELECT TO authenticated USING (true);

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
  -- Get or create role
  INSERT INTO roles (name)
  VALUES (role_name)
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id INTO role_id;

  -- Assign role to user
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
  
  -- Remove role from user
  DELETE FROM user_roles
  WHERE user_id = target_user_id AND role_id = role_id;
END;
$$;

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES
  ('dashboard', 'Access to Dashboard'),
  ('invoices', 'Access to Invoices'),
  ('expenses', 'Access to Expenses'),
  ('credit-cards', 'Access to Credit Cards'),
  ('running-costs', 'Access to Running Costs'),
  ('personnel', 'Access to Personnel'),
  ('administration', 'Access to Administration'),
  ('design', 'Access to Design System'),
  ('edit_running_costs', 'Edit, duplicate, and delete running costs'),
  ('edit_personnel_costs', 'Edit, duplicate, delete personnel costs and upload JSON')
ON CONFLICT (name) DO NOTHING;

-- Grant permissions
GRANT SELECT ON roles TO authenticated;
GRANT SELECT ON permissions TO authenticated;
GRANT SELECT ON user_roles TO authenticated;
GRANT SELECT ON role_permissions TO authenticated;
GRANT SELECT ON user_permissions_view TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_permissions TO authenticated;
GRANT EXECUTE ON FUNCTION assign_role_to_user TO authenticated;
GRANT EXECUTE ON FUNCTION remove_role_from_user TO authenticated;