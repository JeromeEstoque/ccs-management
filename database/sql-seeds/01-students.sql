-- Students Table Seed Data
-- Student and Teacher Management System

INSERT INTO students (
  id, student_id, first_name, middle_name, last_name, email, phone, 
  birth_date, gender, address, year_level, section, gpa, status_record, 
  organization_role, guardian_name, guardian_contact, profile_picture, 
  created_at, updated_at
) VALUES 
  (
    1, '2023-1001', 'John', 'Michael', 'Doe', 'john.doe@ccs.edu', '+639123456789',
    '2002-03-15', 'Male', '123 Main St, Quezon City, Metro Manila', '3rd Year', 'BSIT-3A', 
    '3.75', 'Regular', 'Student Council Member', 'Jane Doe', '+639987654321', 
    NULL, '2023-06-15T10:00:00Z', '2024-01-20T14:30:00Z'
  ),
  (
    2, '2023-1002', 'Jane', 'Elizabeth', 'Smith', 'jane.smith@ccs.edu', '+639234567890',
    '2002-07-22', 'Female', '456 Oak Ave, Makati City, Metro Manila', '3rd Year', 'BSIT-3B', 
    '3.92', 'Regular', 'Class President', 'Robert Smith', '+639876543210', 
    NULL, '2023-06-15T11:00:00Z', '2024-01-18T09:15:00Z'
  ),
  (
    3, '2022-2001', 'Carlos', 'Reyes', 'Santos', 'carlos.santos@ccs.edu', '+639345678901',
    '2001-11-08', 'Male', '789 Pine St, Pasig City, Metro Manila', '4th Year', 'BSCS-4A', 
    '3.45', 'Regular', 'Programming Club Member', 'Maria Santos', '+639765432109', 
    NULL, '2022-06-15T12:00:00Z', '2024-01-22T16:45:00Z'
  ),
  (
    4, '2023-3001', 'Maria', 'Luisa', 'Garcia', 'maria.garcia@ccs.edu', '+639456789012',
    '2003-01-30', 'Female', '321 Elm Rd, Mandaluyong City, Metro Manila', '2nd Year', 'BSIS-2A', 
    '3.68', 'Regular', 'Library Assistant', 'Juan Garcia', '+639654321098', 
    NULL, '2023-06-15T13:00:00Z', '2024-01-19T11:20:00Z'
  ),
  (
    5, '2021-4001', 'Roberto', 'Chan', 'Lim', 'roberto.lim@ccs.edu', '+639567890123',
    '2000-09-12', 'Male', '654 Maple Dr, San Juan City, Metro Manila', '4th Year', 'BSIT-4B', 
    '3.28', 'Irregular', 'Sports Coordinator', 'Elena Lim', '+639543210987', 
    NULL, '2021-06-15T14:00:00Z', '2024-01-21T13:10:00Z'
  );

-- Student Skills (Many-to-Many relationship)
INSERT INTO student_skills (student_id, skill_name, skill_type, skill_level) VALUES
  -- John Doe's Skills
  (1, 'React', 'technical', 'Advanced'),
  (1, 'Node.js', 'technical', 'Intermediate'),
  (1, 'Basketball', 'sports', 'Advanced'),
  
  -- Jane Smith's Skills
  (2, 'Python', 'technical', 'Advanced'),
  (2, 'Machine Learning', 'technical', 'Intermediate'),
  (2, 'Volleyball', 'sports', 'Intermediate'),
  
  -- Carlos Santos's Skills
  (3, 'Java', 'technical', 'Advanced'),
  (3, 'Android Development', 'technical', 'Intermediate'),
  (3, 'Chess', 'sports', 'Advanced'),
  
  -- Maria Garcia's Skills
  (4, 'HTML/CSS', 'technical', 'Advanced'),
  (4, 'UI/UX Design', 'technical', 'Intermediate'),
  (4, 'Badminton', 'sports', 'Intermediate'),
  
  -- Roberto Lim's Skills
  (5, 'C++', 'technical', 'Advanced'),
  (5, 'Game Development', 'technical', 'Intermediate'),
  (5, 'Table Tennis', 'sports', 'Advanced');
