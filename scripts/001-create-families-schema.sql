-- SANDA Collection Database Schema
-- Create tables for family management and payment tracking
-- Database: Neon PostgreSQL (deployed on Vercel)

-- Families table to store family information
CREATE TABLE IF NOT EXISTS families (
    family_code VARCHAR(20) UNIQUE NOT NULL,   -- Custom family identifier (e.g., FAM001)
    family_name VARCHAR(100) NOT NULL,
    id_card_no VARCHAR(12) NOT NULL,
    phone VARCHAR(20),
    sanda_amount VARCHAR(100),                 -- Monthly SANDA contribution target
    arrears VARCHAR(100)                       -- Outstanding balance
);

-- Receipts table to track issued receipts
CREATE TABLE IF NOT EXISTS receipts (
    id SERIAL PRIMARY KEY,                     -- Auto-increment, used for receipt number generation
    receipt_number VARCHAR(50) UNIQUE NOT NULL, -- Format: BGM-SANDA-{family_code}-{padded_id}
    receipt_date TIMESTAMP NOT NULL,
    receipt_html TEXT,                          -- Stored HTML content of the receipt
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment table for recording donation/collection transactions
CREATE TABLE IF NOT EXISTS payment (
    id SERIAL PRIMARY KEY,
    family_code VARCHAR(20) NOT NULL REFERENCES families(family_code),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL,       -- cash, card, cheque, online
    receipt_number VARCHAR(50) UNIQUE,
    collected_by VARCHAR(100),                 -- Staff member who collected
    transaction_date TIMESTAMP NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donation categories table
CREATE TABLE IF NOT EXISTS donation_categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily collection summary table (currently mock in API, reserved for future use)
CREATE TABLE IF NOT EXISTS daily_collections (
    id SERIAL PRIMARY KEY,
    collection_date DATE UNIQUE NOT NULL,
    total_amount DECIMAL(12,2) DEFAULT 0,
    total_transactions INTEGER DEFAULT 0,
    cash_amount DECIMAL(10,2) DEFAULT 0,
    card_amount DECIMAL(10,2) DEFAULT 0,
    cheque_amount DECIMAL(10,2) DEFAULT 0,
    online_amount DECIMAL(10,2) DEFAULT 0,
    opened_by VARCHAR(100),
    closed_by VARCHAR(100),
    opened_at TIMESTAMP,
    closed_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'open',         -- open, closed
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default donation categories
INSERT INTO donation_categories (category_name, description) VALUES
('General Donation', 'General masjid support and maintenance'),
('Zakat', 'Obligatory charity payment'),
('Sadaqah', 'Voluntary charity'),
('Building Fund', 'Masjid construction and renovation'),
('Education Fund', 'Islamic education and programs'),
('Utility Bills', 'Monthly utility payments'),
('Special Events', 'Eid celebrations and special programs'),
('Emergency Fund', 'Community emergency support')
ON CONFLICT (category_name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_families_family_code ON families(family_code);
CREATE INDEX IF NOT EXISTS idx_families_name ON families(family_name);
CREATE INDEX IF NOT EXISTS idx_payment_family_code ON payment(family_code);
CREATE INDEX IF NOT EXISTS idx_payment_receipt ON payment(receipt_number);
CREATE INDEX IF NOT EXISTS idx_payment_date ON payment(transaction_date);
CREATE INDEX IF NOT EXISTS idx_receipts_number ON receipts(receipt_number);
CREATE INDEX IF NOT EXISTS idx_daily_collections_date ON daily_collections(collection_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_payment_updated_at BEFORE UPDATE ON payment
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at BEFORE UPDATE ON receipts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
