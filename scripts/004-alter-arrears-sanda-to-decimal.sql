-- Migration: Change arrears and sanda_amount from VARCHAR to DECIMAL
-- Safe conversion that handles existing string data

-- Convert sanda_amount from VARCHAR to DECIMAL
ALTER TABLE families
  ALTER COLUMN sanda_amount TYPE DECIMAL(10,2)
  USING COALESCE(NULLIF(TRIM(sanda_amount), ''), '0')::DECIMAL(10,2);

-- Convert arrears from VARCHAR to DECIMAL
ALTER TABLE families
  ALTER COLUMN arrears TYPE DECIMAL(10,2)
  USING COALESCE(NULLIF(TRIM(arrears), ''), '0')::DECIMAL(10,2);

-- Set default values so new rows get 0.00 if not specified
ALTER TABLE families ALTER COLUMN sanda_amount SET DEFAULT 0.00;
ALTER TABLE families ALTER COLUMN arrears SET DEFAULT 0.00;

-- Add updated_at column to families if it doesn't exist (needed for monthly cron)
ALTER TABLE families ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add trigger for families updated_at
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_families_updated_at'
  ) THEN
    CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;
