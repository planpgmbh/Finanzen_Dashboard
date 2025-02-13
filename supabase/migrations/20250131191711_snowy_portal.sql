/*
  # Credit Card Document Storage

  1. New Tables
    - `credit_card_documents`
      - `id` (uuid, primary key)
      - `filename` (text)
      - `storage_path` (text)
      - `uploaded_at` (timestamp)
      - `month` (integer)
      - `year` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `credit_card_documents` table
    - Add policies for authenticated users to manage their documents
*/

CREATE TABLE IF NOT EXISTS credit_card_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  storage_path text NOT NULL,
  uploaded_at timestamptz DEFAULT now(),
  month integer NOT NULL,
  year integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE credit_card_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view credit card documents"
  ON credit_card_documents
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert credit card documents"
  ON credit_card_documents
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their credit card documents"
  ON credit_card_documents
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Users can delete their credit card documents"
  ON credit_card_documents
  FOR DELETE
  TO authenticated
  USING (true);