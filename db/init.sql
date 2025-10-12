CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS scheduled_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  account VARCHAR(100) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(50) NOT NULL
);

INSERT INTO scheduled_transactions (description, category, account, amount, date, type) VALUES
('Entertainment (Subscription)', 'Entertainment', 'Bank account', -12.00, '2025-09-27', 'subscription'),
('Transportation', 'Transport', 'Bank account', -37.00, '2025-10-01', 'expense'),
('Home', 'Housing', 'Bank account', -30.00, '2025-10-01', 'expense');

