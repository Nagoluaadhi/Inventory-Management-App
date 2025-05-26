CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100),
  password VARCHAR(100),
  role ENUM('admin','user','supervisor')
);

CREATE TABLE inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_name VARCHAR(255),
  model_no VARCHAR(255),
  remark TEXT,
  qty INT DEFAULT 0
);

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255),
  address TEXT
);

CREATE TABLE stock_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_type ENUM('in', 'out'),
  user_id INT,
  client_id INT,
  inventory_id INT,
  date DATE,
  barcode VARCHAR(255),
  invoice_no VARCHAR(255),
  qty INT,
  remark TEXT
);