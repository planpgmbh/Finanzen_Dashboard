-- Drop auth-related views if they exist
DROP VIEW IF EXISTS user_permissions_view CASCADE;

-- Drop auth-related functions if they exist
DROP FUNCTION IF EXISTS get_user_permissions CASCADE;
DROP FUNCTION IF EXISTS assign_role_to_user CASCADE;
DROP FUNCTION IF EXISTS remove_role_from_user CASCADE;
DROP FUNCTION IF EXISTS admin_delete_user CASCADE;
DROP FUNCTION IF EXISTS admin_create_user CASCADE;
DROP FUNCTION IF EXISTS admin_update_user_password CASCADE;

-- Drop auth-related tables if they exist
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Drop RLS policies for credit card documents
DROP POLICY IF EXISTS "Users can view credit card documents" ON credit_card_documents;
DROP POLICY IF EXISTS "Users can insert credit card documents" ON credit_card_documents;
DROP POLICY IF EXISTS "Users can update credit card documents" ON credit_card_documents;
DROP POLICY IF EXISTS "Users can delete credit card documents" ON credit_card_documents;

-- Create new open policies for credit card documents
CREATE POLICY "Public can view credit card documents" ON credit_card_documents FOR SELECT USING (true);
CREATE POLICY "Public can insert credit card documents" ON credit_card_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update credit card documents" ON credit_card_documents FOR UPDATE USING (true);
CREATE POLICY "Public can delete credit card documents" ON credit_card_documents FOR DELETE USING (true);

-- Drop storage policies
DROP POLICY IF EXISTS "Authenticated users can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;

-- Create new open storage policies
CREATE POLICY "Public can view documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Public can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Public can delete documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents');