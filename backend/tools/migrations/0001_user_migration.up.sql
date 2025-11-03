-- Create users table
CREATE TABLE IF NOT EXISTS users (
  user_id CHAR(36) NOT NULL,
  last_name VARCHAR(100) NULL,
  first_name VARCHAR(100) NULL,
  birthday_date DATE NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(100) NULL,
  PRIMARY KEY (user_id),
  UNIQUE KEY uniq_users_phone (phone_number),
  UNIQUE KEY uniq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS notifications (
  user_id CHAR(36) NOT NULL,
  by_sms TINYINT(1) NOT NULL DEFAULT 0,
  by_email TINYINT(1) NOT NULL DEFAULT 0,
  KEY idx_notifications_user_id (user_id),
  CONSTRAINT notifications_user_FK FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Create sessions table
CREATE TABLE IF NOT EXISTS sessions (
  session_hash CHAR(64) NOT NULL,
  user_id CHAR(36) NOT NULL,
  issued_at DATETIME NOT NULL,
  expires_at DATETIME NOT NULL,
  revoked TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (session_hash),
  KEY idx_sessions_user_id (user_id),
  KEY idx_sessions_expires_at (expires_at),
  CONSTRAINT sessions_users_FK FOREIGN KEY (user_id) REFERENCES users(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
