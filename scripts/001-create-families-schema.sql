-- SANDA Collection Database Schema
-- Create tables for family management and donation tracking

-- Families table to store family information
CREATE TABLE IF NOT EXISTS families (
    id SERIAL PRIMARY KEY,
    family_id VARCHAR(20) UNIQUE NOT NULL, -- Custom family identifier (e.g., FAM001)
    family_name VARCHAR(100) NOT NULL,
    head_of_family VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    postal_code VARCHAR(10),
    city VARCHAR(50),
    country VARCHAR(50) DEFAULT 'Canada',
    membership_status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family members table for tracking individual family members
CREATE TABLE IF NOT EXISTS family_members (
    id SERIAL PRIMARY KEY,
    family_id INTEGER REFERENCES families(id) ON DELETE CASCADE,
    member_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50), -- head, spouse, child, parent, etc.
    age_group VARCHAR(20), -- adult, child, senior
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donation categories table
CREATE TABLE IF NOT EXISTS donation_categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donations/Collections table
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    donation_id VARCHAR(30) UNIQUE NOT NULL, -- Custom donation ID (e.g., DON-2024-001)
    family_id INTEGER REFERENCES families(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES donation_categories(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL, -- cash, card, cheque, online
    payment_status VARCHAR(20) DEFAULT 'completed', -- pending, completed, failed, refunded
    receipt_number VARCHAR(30) UNIQUE,
    collection_date DATE NOT NULL,
    collected_by VARCHAR(100), -- Staff member who collected
    notes TEXT,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily collection summary table
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
    status VARCHAR(20) DEFAULT 'open', -- open, closed
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
CREATE INDEX IF NOT EXISTS idx_families_family_id ON families(family_id);
CREATE INDEX IF NOT EXISTS idx_families_name ON families(family_name);
CREATE INDEX IF NOT EXISTS idx_donations_family_id ON donations(family_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(collection_date);
CREATE INDEX IF NOT EXISTS idx_donations_receipt ON donations(receipt_number);
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
CREATE TRIGGER update_families_updated_at BEFORE UPDATE ON families
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
