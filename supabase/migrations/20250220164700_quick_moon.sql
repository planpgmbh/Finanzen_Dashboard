/*
  # Add user permissions

  1. Changes
    - Add permissions JSONB column to app_users table
    - Set default permissions for all users
    - Add check constraint to ensure permissions structure

  2. Security
    - Enable RLS on app_users table
    - Add policies for users to read their own data
    - Add policies for admins to manage all users
*/

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