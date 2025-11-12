-- Add amocrm_contact_id column to users table
ALTER TABLE users
    ADD COLUMN amocrm_contact_id INT NULL AFTER user_id;

