-- Add active column to families table for soft-delete functionality
-- Existing records default to true (active)

ALTER TABLE families ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;

-- Create index for faster queries filtering by active status
CREATE INDEX IF NOT EXISTS idx_families_active ON families(active);
