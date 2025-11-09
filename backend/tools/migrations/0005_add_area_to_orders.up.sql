-- Add area column to orders table
ALTER TABLE orders
ADD COLUMN area DECIMAL(10,2) NULL AFTER cost;

