-- Add missing fields to teachers table
-- These fields are referenced in the frontend but missing from the database

USE ccs_management_system;

ALTER TABLE teachers 
ADD COLUMN IF NOT EXISTS years_of_service INT DEFAULT 0 AFTER teaching_load,
ADD COLUMN IF NOT EXISTS organization_department VARCHAR(100) AFTER department,
ADD COLUMN IF NOT EXISTS degree VARCHAR(200) AFTER specialization,
ADD COLUMN IF NOT EXISTS university VARCHAR(200) AFTER degree,
ADD COLUMN IF NOT EXISTS year_graduated INT AFTER university,
ADD COLUMN IF NOT EXISTS courses_handled TEXT AFTER position,
ADD COLUMN IF NOT EXISTS employment_status ENUM('Full Time', 'Part Time') DEFAULT 'Full Time' AFTER status;
