-- Add amocrm_lead_id column to orders table
ALTER TABLE orders
    ADD COLUMN amocrm_lead_id INT NULL after order_id;

