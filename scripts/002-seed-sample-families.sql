-- Sample families data for testing SANDA Collection system
-- This creates a diverse set of families for testing purposes

INSERT INTO families (family_id, family_name, head_of_family, phone, email, address, postal_code, city, membership_status) VALUES
('FAM001', 'Ahmed Family', 'Mohammad Ahmed', '416-555-0101', 'ahmed.family@email.com', '123 Maple Street', 'M1A 1A1', 'Toronto', 'active'),
('FAM002', 'Khan Family', 'Ali Khan', '416-555-0102', 'khan.family@email.com', '456 Oak Avenue', 'M2B 2B2', 'Toronto', 'active'),
('FAM003', 'Rahman Family', 'Abdul Rahman', '416-555-0103', 'rahman.family@email.com', '789 Pine Road', 'M3C 3C3', 'Toronto', 'active'),
('FAM004', 'Hassan Family', 'Omar Hassan', '416-555-0104', 'hassan.family@email.com', '321 Elm Street', 'M4D 4D4', 'Toronto', 'active'),
('FAM005', 'Ibrahim Family', 'Yusuf Ibrahim', '416-555-0105', 'ibrahim.family@email.com', '654 Cedar Lane', 'M5E 5E5', 'Toronto', 'active'),
('FAM006', 'Malik Family', 'Tariq Malik', '416-555-0106', 'malik.family@email.com', '987 Birch Court', 'M6F 6F6', 'Toronto', 'active'),
('FAM007', 'Siddiqui Family', 'Hamza Siddiqui', '416-555-0107', 'siddiqui.family@email.com', '147 Willow Drive', 'M7G 7G7', 'Toronto', 'active'),
('FAM008', 'Qureshi Family', 'Bilal Qureshi', '416-555-0108', 'qureshi.family@email.com', '258 Spruce Way', 'M8H 8H8', 'Toronto', 'active'),
('FAM009', 'Ansari Family', 'Usman Ansari', '416-555-0109', 'ansari.family@email.com', '369 Poplar Street', 'M9I 9I9', 'Toronto', 'active'),
('FAM010', 'Sheikh Family', 'Imran Sheikh', '416-555-0110', 'sheikh.family@email.com', '741 Ash Boulevard', 'M1J 1J1', 'Toronto', 'active')
ON CONFLICT (family_id) DO NOTHING;

-- Add family members for some families
INSERT INTO family_members (family_id, member_name, relationship, age_group, gender) VALUES
-- Ahmed Family
(1, 'Mohammad Ahmed', 'head', 'adult', 'male'),
(1, 'Fatima Ahmed', 'spouse', 'adult', 'female'),
(1, 'Aisha Ahmed', 'child', 'child', 'female'),
(1, 'Omar Ahmed', 'child', 'child', 'male'),

-- Khan Family  
(2, 'Ali Khan', 'head', 'adult', 'male'),
(2, 'Khadija Khan', 'spouse', 'adult', 'female'),
(2, 'Hassan Khan', 'child', 'child', 'male'),

-- Rahman Family
(3, 'Abdul Rahman', 'head', 'adult', 'male'),
(3, 'Maryam Rahman', 'spouse', 'adult', 'female'),
(3, 'Zainab Rahman', 'child', 'child', 'female'),
(3, 'Ibrahim Rahman', 'child', 'child', 'male'),
(3, 'Abdullah Rahman', 'parent', 'senior', 'male'),

-- Hassan Family
(4, 'Omar Hassan', 'head', 'adult', 'male'),
(4, 'Amina Hassan', 'spouse', 'adult', 'female'),

-- Ibrahim Family
(5, 'Yusuf Ibrahim', 'head', 'adult', 'male'),
(5, 'Safiya Ibrahim', 'spouse', 'adult', 'female'),
(5, 'Mariam Ibrahim', 'child', 'child', 'female'),
(5, 'Salman Ibrahim', 'child', 'child', 'male'),
(5, 'Yaqub Ibrahim', 'child', 'child', 'male')
ON CONFLICT DO NOTHING;

-- Add some sample donations
INSERT INTO donations (donation_id, family_id, category_id, amount, payment_method, receipt_number, collection_date, collected_by) VALUES
('DON-2024-001', 1, 1, 100.00, 'cash', 'REC-001', CURRENT_DATE, 'Admin User'),
('DON-2024-002', 2, 2, 250.00, 'card', 'REC-002', CURRENT_DATE, 'Admin User'),
('DON-2024-003', 3, 1, 75.00, 'cash', 'REC-003', CURRENT_DATE, 'Admin User'),
('DON-2024-004', 4, 3, 50.00, 'cash', 'REC-004', CURRENT_DATE, 'Admin User'),
('DON-2024-005', 5, 1, 150.00, 'cheque', 'REC-005', CURRENT_DATE, 'Admin User')
ON CONFLICT (donation_id) DO NOTHING;

-- Initialize today's collection summary
INSERT INTO daily_collections (collection_date, opened_by, opened_at, status) VALUES
(CURRENT_DATE, 'System', CURRENT_TIMESTAMP, 'open')
ON CONFLICT (collection_date) DO NOTHING;
