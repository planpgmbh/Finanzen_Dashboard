-- Create a function to safely duplicate a running cost year
CREATE OR REPLACE FUNCTION duplicate_running_cost_year(
  source_year_id uuid,
  new_year integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_year_id uuid;
  source_entry RECORD;
BEGIN
  -- Check if the year already exists
  IF EXISTS (
    SELECT 1 FROM running_cost_years WHERE year = new_year
  ) THEN
    RAISE EXCEPTION 'Year % already exists', new_year;
  END IF;

  -- Create the new year
  INSERT INTO running_cost_years (year)
  VALUES (new_year)
  RETURNING id INTO new_year_id;

  -- Copy all entries from the source year
  FOR source_entry IN 
    SELECT * FROM running_cost_entries 
    WHERE year_id = source_year_id
  LOOP
    INSERT INTO running_cost_entries (
      year_id,
      category_id,
      month,
      cost
    ) VALUES (
      new_year_id,
      source_entry.category_id,
      source_entry.month,
      source_entry.cost
    );
  END LOOP;

  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    -- If anything fails, ensure we clean up
    IF new_year_id IS NOT NULL THEN
      DELETE FROM running_cost_years WHERE id = new_year_id;
    END IF;
    RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION duplicate_running_cost_year TO authenticated;