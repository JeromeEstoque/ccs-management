-- Teachers Table Seed Data
-- Student and Teacher Management System

INSERT INTO teachers (
  id, employee_id, first_name, middle_name, last_name, email, phone,
  birth_date, gender, address, position, department, specialization,
  hire_date, status, profile_picture, advisory_section, teaching_load,
  capstone_adviser_available, capstone_schedule, created_at, updated_at
) VALUES
  (
    1, 'T-001', 'Sarah', 'Michelle', 'Johnson', 'sarah.johnson@ccs.edu', '+639123456789',
    '1985-05-20', 'Female', '123 University Ave, Quezon City, Metro Manila', 'Associate Professor',
    'College of Computer Studies', 'Web Development and Database Systems', '2018-08-15', 'Active',
    NULL, 'BSIT-3A', 18, true, 'MW 10:00 AM - 12:00 PM',
    '2018-08-15T09:00:00Z', '2024-01-20T10:30:00Z'
  ),
  (
    2, 'T-002', 'Michael', 'David', 'Chen', 'michael.chen@ccs.edu', '+639234567890',
    '1982-08-10', 'Male', '456 Faculty St, Makati City, Metro Manila', 'Assistant Professor',
    'College of Computer Studies', 'Artificial Intelligence and Machine Learning', '2019-06-01', 'Active',
    NULL, 'BSCS-4A', 15, true, 'TTH 2:00 PM - 4:00 PM',
    '2019-06-01T10:00:00Z', '2024-01-18T14:15:00Z'
  ),
  (
    3, 'T-003', 'Elena', 'Maria', 'Rodriguez', 'elena.rodriguez@ccs.edu', '+639345678901',
    '1980-12-15', 'Female', '789 Campus Rd, Pasig City, Metro Manila', 'Professor',
    'College of Computer Studies', 'Network Security and Cybersecurity', '2015-01-10', 'Active',
    NULL, 'BSIT-4B', 12, false, NULL,
    '2015-01-10T08:00:00Z', '2024-01-22T11:45:00Z'
  ),
  (
    4, 'T-004', 'James', 'Robert', 'Wilson', 'james.wilson@ccs.edu', '+639456789012',
    '1987-03-25', 'Male', '321 College Blvd, Mandaluyong City, Metro Manila', 'Instructor',
    'College of Computer Studies', 'Mobile Development and UI/UX Design', '2020-01-15', 'Active',
    NULL, 'BSIS-2A', 21, true, 'WF 1:00 PM - 3:00 PM',
    '2020-01-15T11:00:00Z', '2024-01-19T15:20:00Z'
  );

-- Teacher Expertise (Many-to-Many relationship)
INSERT INTO teacher_expertise (teacher_id, expertise_area) VALUES
  -- Dr. Sarah Johnson's Expertise
  (1, 'Web Development'),
  (1, 'Database Management'),
  (1, 'Software Engineering'),
  
  -- Prof. Michael Chen's Expertise
  (2, 'Machine Learning'),
  (2, 'Data Science'),
  (2, 'Python Programming'),
  
  -- Dr. Elena Rodriguez's Expertise
  (3, 'Cybersecurity'),
  (3, 'Network Security'),
  (3, 'Information Security'),
  
  -- Prof. James Wilson's Expertise
  (4, 'Mobile Development'),
  (4, 'UI/UX Design'),
  (4, 'React Native');
