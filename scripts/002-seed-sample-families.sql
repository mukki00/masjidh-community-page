-- Sample families data for testing SANDA Collection system
-- This creates a diverse set of families for testing purposes

INSERT INTO families (family_code, family_name, id_card_no, phone, sanda_amount, arrears) VALUES
('FAM001', 'Ahmed Family', '9012345678', '0452345678', '500', '0'),
('FAM002', 'Khan Family', '9112345678', '0452345679', '750', '250'),
('FAM003', 'Rahman Family', '9212345678', '0452345680', '600', '0'),
('FAM004', 'Hassan Family', '9312345678', '0452345681', '500', '100'),
('FAM005', 'Ibrahim Family', '9412345678', '0452345682', '1000', '0'),
('FAM006', 'Malik Family', '9512345678', '0452345683', '500', '0'),
('FAM007', 'Siddiqui Family', '9612345678', '0452345684', '800', '300'),
('FAM008', 'Qureshi Family', '9712345678', '0452345685', '500', '0'),
('FAM009', 'Ansari Family', '9812345678', '0452345686', '600', '150'),
('FAM010', 'Sheikh Family', '9912345678', '0452345687', '750', '0')
ON CONFLICT (family_code) DO NOTHING;

-- Seed initial receipts for sample payments
INSERT INTO receipts (receipt_number, receipt_date, receipt_html, created_at, updated_at) VALUES
('BGM-SANDA-FAM001-00001', CURRENT_TIMESTAMP, '<div>Receipt for FAM001</div>', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('BGM-SANDA-FAM002-00002', CURRENT_TIMESTAMP, '<div>Receipt for FAM002</div>', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('BGM-SANDA-FAM003-00003', CURRENT_TIMESTAMP, '<div>Receipt for FAM003</div>', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('BGM-SANDA-FAM004-00004', CURRENT_TIMESTAMP, '<div>Receipt for FAM004</div>', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('BGM-SANDA-FAM005-00005', CURRENT_TIMESTAMP, '<div>Receipt for FAM005</div>', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (receipt_number) DO NOTHING;

-- Add some sample payments
INSERT INTO payment (family_code, amount, payment_method, receipt_number, collected_by, transaction_date, created_at, updated_at) VALUES
('FAM001', 500.00, 'cash', 'BGM-SANDA-FAM001-00001', 'Admin User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('FAM002', 750.00, 'cash', 'BGM-SANDA-FAM002-00002', 'Admin User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('FAM003', 600.00, 'online', 'BGM-SANDA-FAM003-00003', 'Admin User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('FAM004', 400.00, 'cash', 'BGM-SANDA-FAM004-00004', 'Admin User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('FAM005', 1000.00, 'cheque', 'BGM-SANDA-FAM005-00005', 'Admin User', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (receipt_number) DO NOTHING;

-- Initialize today's collection summary
INSERT INTO daily_collections (collection_date, opened_by, opened_at, status) VALUES
(CURRENT_DATE, 'System', CURRENT_TIMESTAMP, 'open')
ON CONFLICT (collection_date) DO NOTHING;
