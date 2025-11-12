-- Add phone_number column to orders table
ALTER TABLE orders
    ADD COLUMN phone_number VARCHAR(20) NOT NULL AFTER cost;

