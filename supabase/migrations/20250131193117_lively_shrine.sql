/*
  # Add extracted text field to credit card documents

  1. Changes
    - Add `extracted_text` column to `credit_card_documents` table
    - Column is nullable to support existing records
    - Text type to store extracted PDF content

  2. Security
    - No changes to RLS policies needed
    - Existing policies cover the new column
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'credit_card_documents' 
    AND column_name = 'extracted_text'
  ) THEN
    ALTER TABLE credit_card_documents 
    ADD COLUMN extracted_text text;
  END IF;
END $$;