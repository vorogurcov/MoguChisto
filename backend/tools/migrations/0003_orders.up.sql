-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  order_id CHAR(36) NOT NULL,
  user_id CHAR(36) NULL,
  type ENUM('express','comfort','elite') NOT NULL,
  cost DECIMAL(15,2) NOT NULL,
  status ENUM('pending','in_progress','completed') NOT NULL,
  start_date TIME NULL,
  cleaners JSON NULL,
  PRIMARY KEY (order_id),
  KEY idx_orders_user_id (user_id),
  CONSTRAINT orders_user_FK FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


