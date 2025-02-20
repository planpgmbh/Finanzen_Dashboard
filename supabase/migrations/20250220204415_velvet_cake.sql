-- Add permissions column with default structure
ALTER TABLE app_users ADD COLUMN IF NOT EXISTS permissions JSONB NOT NULL DEFAULT jsonb_build_object(
  'pages', jsonb_build_object(
    'dashboard', true,
    'invoices', false,
    'expenses', false,
    'runningCosts', false,
    'personnel', false,
    'administration', false
  ),
  'features', jsonb_build_object(
    'editRunningCosts', false,
    'editPersonnelCosts', false
  )
);

-- Add check constraint to ensure permissions structure
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'valid_permissions_structure'
  ) THEN
    ALTER TABLE app_users ADD CONSTRAINT valid_permissions_structure CHECK (
      jsonb_typeof(permissions->'pages') = 'object' AND
      jsonb_typeof(permissions->'features') = 'object' AND
      (permissions->'pages'->>'dashboard')::boolean IS NOT NULL AND
      (permissions->'pages'->>'invoices')::boolean IS NOT NULL AND
      (permissions->'pages'->>'expenses')::boolean IS NOT NULL AND
      (permissions->'pages'->>'runningCosts')::boolean IS NOT NULL AND
      (permissions->'pages'->>'personnel')::boolean IS NOT NULL AND
      (permissions->'pages'->>'administration')::boolean IS NOT NULL AND
      (permissions->'features'->>'editRunningCosts')::boolean IS NOT NULL AND
      (permissions->'features'->>'editPersonnelCosts')::boolean IS NOT NULL
    );
  END IF;
END $$;

-- Enable RLS
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own data" ON app_users;
DROP POLICY IF EXISTS "Admins can manage all users" ON app_users;

-- Create policies
CREATE POLICY "Users can read own data"
  ON app_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can manage all users"
  ON app_users
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt()->>'app_metadata')::jsonb->>'is_admin' = 'true'
  );

-- Create function to update user admin status
CREATE OR REPLACE FUNCTION update_user_admin_status(user_id UUID, is_admin BOOLEAN, is_superadmin BOOLEAN)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = 
    CASE 
      WHEN is_superadmin THEN
        jsonb_build_object('is_admin', true, 'is_superadmin', true)
      ELSE
        jsonb_build_object('is_admin', is_admin)
    END,
    role = CASE WHEN is_superadmin THEN 'service_role' ELSE 'authenticated' END
  WHERE id = user_id;
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION update_user_admin_status TO authenticated;

-- Set initial admin status for philipp@plan-p.de
DO $$
DECLARE
  philipp_id UUID;
BEGIN
  SELECT id INTO philipp_id
  FROM auth.users
  WHERE email = 'philipp@plan-p.de';
  
  IF philipp_id IS NOT NULL THEN
    PERFORM update_user_admin_status(philipp_id, true, true);
  END IF;
END $$;