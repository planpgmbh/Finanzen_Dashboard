/*
  # Add cardholder column to credit_card_documents

  1. Changes
    - Add cardholder column to credit_card_documents table
    - Make cardholder column required
    - Add index for better query performance
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'credit_card_documents' 
    AND column_name = 'cardholder'
  ) THEN
    ALTER TABLE credit_card_documents 
    ADD COLUMN cardholder text NOT NULL DEFAULT 'Unbekannt';

    -- Remove default after adding the column
    ALTER TABLE credit_card_documents 
    ALTER COLUMN cardholder DROP DEFAULT;

    -- Add index for cardholder column
    CREATE INDEX idx_credit_card_documents_cardholder 
    ON credit_card_documents(cardholder);
  END IF;
END $$;