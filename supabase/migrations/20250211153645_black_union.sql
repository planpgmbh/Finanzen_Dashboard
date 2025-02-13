-- Drop existing functions
DROP FUNCTION IF EXISTS admin_delete_user CASCADE;
DROP FUNCTION IF EXISTS admin_create_user CASCADE;
DROP FUNCTION IF EXISTS admin_update_user_password CASCADE;

-- Create function to delete users with proper parameters
CREATE OR REPLACE FUNCTION admin_delete_user(
  target_user_id uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  -- Delete user from auth.users (will cascade to user_roles)
  DELETE FROM auth.users
  WHERE id = target_user_id;
END;
$$;

-- Create function to create users with proper parameters
CREATE OR REPLACE FUNCTION admin_create_user(
  email text,
  password text,
  email_confirm boolean DEFAULT true
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
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

  -- Insert new user
  INSERT INTO auth.users (
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    email,
    crypt(password, gen_salt('bf')),
    CASE WHEN email_confirm THEN now() ELSE NULL END,
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    'authenticated',
    'authenticated'
  )
  RETURNING id INTO new_user_id;

  RETURN new_user_id;
END;
$$;

-- Create function to update user password with proper parameters
CREATE OR REPLACE FUNCTION admin_update_user_password(
  user_id uuid,
  new_password text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

  -- Update user password
  UPDATE auth.users
  SET encrypted_password = crypt(new_password, gen_salt('bf'))
  WHERE id = user_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION admin_delete_user TO authenticated;
GRANT EXECUTE ON FUNCTION admin_create_user TO authenticated;
GRANT EXECUTE ON FUNCTION admin_update_user_password TO authenticated;