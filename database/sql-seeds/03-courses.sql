-- Courses Table Seed Data
-- Student and Teacher Management System

INSERT INTO courses (
  id, course_code, course_name, description, credits, year_level, semester,
  department, prerequisite, instructor_id, schedule, room, max_students,
  current_enrollment, status, created_at, updated_at
) VALUES
  (
    1, 'CS101', 'Introduction to Computer Science', 
    'Fundamental concepts of computer science and programming', 3, '1st Year', 'First',
    'Computer Studies', NULL, 1, 'MWF 8:00 AM - 9:00 AM', 'Lab 101', 30, 25, 'Active',
    '2023-06-01T09:00:00Z', '2024-01-20T10:00:00Z'
  ),
  (
    2, 'CS201', 'Data Structures and Algorithms', 
    'Advanced data structures and algorithm analysis', 3, '2nd Year', 'First',
    'Computer Studies', 1, 1, 'TTH 10:00 AM - 11:30 AM', 'Lab 102', 25, 22, 'Active',
    '2023-06-01T10:00:00Z', '2024-01-18T14:00:00Z'
  ),
  (
    3, 'CS301', 'Web Development', 
    'Modern web development technologies and frameworks', 3, '3rd Year', 'First',
    'Computer Studies', 2, 4, 'MWF 1:00 PM - 2:30 PM', 'Lab 201', 20, 18, 'Active',
    '2023-06-01T11:00:00Z', '2024-01-19T09:30:00Z'
  ),
  (
    4, 'CS302', 'Database Management Systems', 
    'Database design, implementation, and management', 3, '3rd Year', 'First',
    'Computer Studies', 2, 1, 'TTH 1:00 PM - 2:30 PM', 'Lab 202', 25, 20, 'Active',
    '2023-06-01T12:00:00Z', '2024-01-18T11:00:00Z'
  ),
  (
    5, 'CS401', 'Machine Learning', 
    'Introduction to machine learning algorithms and applications', 3, '4th Year', 'First',
    'Computer Studies', 3, 2, 'MWF 10:00 AM - 11:30 AM', 'Lab 301', 20, 15, 'Active',
    '2023-06-01T13:00:00Z', '2024-01-22T13:15:00Z'
  ),
  (
    6, 'CS402', 'Network Security', 
    'Network security principles and practices', 3, '4th Year', 'First',
    'Computer Studies', 4, 3, 'TTH 8:00 AM - 9:30 AM', 'Lab 302', 20, 17, 'Active',
    '2023-06-01T14:00:00Z', '2024-01-21T15:45:00Z'
  ),
  (
    7, 'CS303', 'Software Engineering', 
    'Software development methodologies and project management', 3, '3rd Year', 'Second',
    'Computer Studies', 3, 1, 'MWF 3:00 PM - 4:30 PM', 'Lab 203', 25, 23, 'Active',
    '2023-06-01T15:00:00Z', '2024-01-20T16:00:00Z'
  ),
  (
    8, 'IS201', 'Information Systems Analysis', 
    'Analysis and design of information systems', 3, '2nd Year', 'First',
    'Information Systems', 1, 2, 'TTH 3:00 PM - 4:30 PM', 'Room 201', 30, 26, 'Active',
    '2023-06-01T16:00:00Z', '2024-01-18T10:30:00Z'
  ),
  (
    9, 'CS403', 'Capstone Project', 
    'Senior capstone project development', 6, '4th Year', 'Second',
    'Computer Studies', '5,6', 3, 'By Appointment', 'Project Lab', 15, 12, 'Active',
    '2023-06-01T17:00:00Z', '2024-01-22T14:20:00Z'
  ),
  (
    10, 'CS304', 'Mobile Application Development', 
    'Mobile app development for iOS and Android', 3, '3rd Year', 'Second',
    'Computer Studies', 3, 4, 'WF 10:00 AM - 11:30 AM', 'Lab 204', 20, 18, 'Active',
    '2023-06-01T18:00:00Z', '2024-01-19T12:45:00Z'
  ),
  (
    11, 'CS305', 'Game Development', 
    'Introduction to game development and design', 3, '3rd Year', 'Second',
    'Computer Studies', 3, 4, 'TTH 10:00 AM - 11:30 AM', 'Lab 205', 15, 13, 'Active',
    '2023-06-01T19:00:00Z', '2024-01-21T11:30:00Z'
  ),
  (
    12, 'IS202', 'UI/UX Design Principles', 
    'User interface and user experience design', 3, '2nd Year', 'Second',
    'Information Systems', NULL, 4, 'MWF 2:00 PM - 3:30 PM', 'Design Lab', 25, 22, 'Active',
    '2023-06-01T20:00:00Z', '2024-01-20T13:50:00Z'
  );
