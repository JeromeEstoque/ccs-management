-- Relationships and Transactional Data
-- Student and Teacher Management System

-- Enrollments Table
INSERT INTO enrollments (
  id, student_id, course_id, enrollment_date, status, grade,
  instructor_id, semester, academic_year, created_at, updated_at
) VALUES
  (1, 1, 1, '2023-06-15', 'Enrolled', NULL, 1, 'First', '2023-2024', '2023-06-15T09:00:00Z', '2024-01-20T10:00:00Z'),
  (2, 1, 2, '2023-06-15', 'Enrolled', '1.75', 1, 'First', '2023-2024', '2023-06-15T09:30:00Z', '2024-01-18T14:00:00Z'),
  (3, 1, 3, '2023-06-15', 'Enrolled', '1.5', 4, 'First', '2023-2024', '2023-06-15T10:00:00Z', '2024-01-19T09:30:00Z'),
  (4, 2, 1, '2023-06-15', 'Enrolled', '1.25', 1, 'First', '2023-2024', '2023-06-15T10:30:00Z', '2024-01-20T11:00:00Z'),
  (5, 2, 4, '2023-06-15', 'Enrolled', '1.0', 1, 'First', '2023-2024', '2023-06-15T11:00:00Z', '2024-01-18T11:00:00Z'),
  (6, 2, 5, '2023-06-15', 'Enrolled', '1.5', 2, 'First', '2023-2024', '2023-06-15T11:30:00Z', '2024-01-22T13:15:00Z'),
  (7, 3, 2, '2022-06-15', 'Completed', '2.0', 1, 'First', '2022-2023', '2022-06-15T12:00:00Z', '2023-12-15T10:00:00Z'),
  (8, 3, 6, '2023-06-15', 'Enrolled', NULL, 3, 'First', '2023-2024', '2023-06-15T12:30:00Z', '2024-01-21T15:45:00Z'),
  (9, 3, 7, '2023-06-15', 'Enrolled', NULL, 1, 'Second', '2023-2024', '2023-06-15T13:00:00Z', '2024-01-20T16:00:00Z'),
  (10, 4, 3, '2023-06-15', 'Enrolled', '1.75', 4, 'First', '2023-2024', '2023-06-15T13:30:00Z', '2024-01-19T09:30:00Z');

-- Attendance Table
INSERT INTO attendance (
  id, student_id, course_id, date, status, time_in, time_out,
  instructor_id, remarks, created_at, updated_at
) VALUES
  (1, 1, 1, '2024-01-15', 'Present', '8:00 AM', '9:00 AM', 1, NULL, '2024-01-15T08:05:00Z', '2024-01-15T09:05:00Z'),
  (2, 1, 2, '2024-01-16', 'Late', '10:15 AM', '11:30 AM', 1, '15 minutes late', '2024-01-16T10:15:00Z', '2024-01-16T11:35:00Z'),
  (3, 2, 1, '2024-01-15', 'Present', '8:00 AM', '9:00 AM', 1, NULL, '2024-01-15T08:02:00Z', '2024-01-15T09:02:00Z'),
  (4, 2, 4, '2024-01-16', 'Present', '1:00 PM', '2:30 PM', 1, NULL, '2024-01-16T13:00:00Z', '2024-01-16T14:32:00Z'),
  (5, 3, 2, '2024-01-15', 'Absent', NULL, NULL, 1, 'Sick leave', '2024-01-15T10:00:00Z', '2024-01-15T11:30:00Z'),
  (6, 4, 3, '2024-01-15', 'Present', '1:00 PM', '2:30 PM', 4, NULL, '2024-01-15T13:01:00Z', '2024-01-15T14:31:00Z');

-- Violations Table
INSERT INTO violations (
  id, student_id, teacher_id, violation_type, description, severity,
  date, status, action_taken, points_deducted, created_at, updated_at
) VALUES
  (1, 1, 1, 'Late Submission', 'Submitted project 2 days after deadline', 'Minor', 
   '2024-01-15', 'Pending', NULL, NULL, '2024-01-15T14:30:00Z', '2024-01-15T14:30:00Z'),
  (2, 2, 1, 'Absence', 'Unauthorized absence from class', 'Moderate', 
   '2024-01-14', 'Resolved', 'Warning issued', 5, '2024-01-14T10:00:00Z', '2024-01-16T09:00:00Z'),
  (3, 3, 2, 'Cheating', 'Caught using unauthorized materials during exam', 'Major', 
   '2024-01-10', 'Pending', 'Case filed for disciplinary action', 20, '2024-01-10T15:00:00Z', '2024-01-10T15:00:00Z'),
  (4, 4, 4, 'Dress Code', 'Improper attire for laboratory class', 'Minor', 
   '2024-01-12', 'Resolved', 'Verbal warning', 2, '2024-01-12T13:30:00Z', '2024-01-12T14:00:00Z'),
  (5, 5, 3, 'Plagiarism', 'Submitted work with copied content', 'Major', 
   '2024-01-08', 'Resolved', 'Failed assignment, parent notified', 15, '2024-01-08T16:00:00Z', '2024-01-09T10:00:00Z');

-- Certificates Table
INSERT INTO certificates (
  id, student_id, certificate_name, description, issuing_organization,
  issue_date, expiry_date, certificate_type, file_url, status, created_at, updated_at
) VALUES
  (1, 1, 'Web Development Excellence', 'Awarded for outstanding performance in Web Development course', 
   'College of Computer Studies', '2023-12-15', NULL, 'Academic', '/certificates/web-dev-excellence.pdf', 
   'Verified', '2023-12-15T10:00:00Z', '2024-01-20T11:00:00Z'),
  (2, 1, 'Basketball MVP', 'Most Valuable Player in Inter-College Basketball Tournament', 
   'Sports Department', '2023-10-20', NULL, 'Sports', '/certificates/basketball-mvp.pdf', 
   'Verified', '2023-10-20T14:00:00Z', '2024-01-18T12:00:00Z'),
  (3, 2, 'Dean''s List', 'Academic excellence recognition for 1st Semester 2023', 
   'Academic Affairs', '2023-12-01', NULL, 'Academic', '/certificates/deans-list.pdf', 
   'Verified', '2023-12-01T09:00:00Z', '2024-01-18T09:30:00Z'),
  (4, 2, 'Python Programming', 'Professional certification in Python programming', 
   'Tech Institute Philippines', '2023-08-15', '2025-08-15', 'Professional', '/certificates/python-cert.pdf', 
   'Verified', '2023-08-15T11:00:00Z', '2024-01-19T10:15:00Z'),
  (5, 3, 'Chess Champion', 'First place in University Chess Competition', 
   'Student Activities', '2023-09-10', NULL, 'Sports', '/certificates/chess-champion.pdf', 
   'Verified', '2023-09-10T15:00:00Z', '2024-01-22T13:45:00Z');

-- Grades Table
INSERT INTO grades (
  id, student_id, course_id, instructor_id, grade, grade_points, letter_grade,
  semester, academic_year, grading_period, date_posted, remarks, created_at, updated_at
) VALUES
  (1, 1, 1, 1, '1.75', 3.0, 'B+', 'First', '2023-2024', 'Midterm', '2024-01-18', 
   'Good performance, needs improvement in algorithms', '2024-01-18T14:00:00Z', '2024-01-18T14:00:00Z'),
  (2, 1, 2, 1, '1.5', 3.5, 'A-', 'First', '2023-2024', 'Midterm', '2024-01-18', 
   'Excellent understanding of data structures', '2024-01-18T14:30:00Z', '2024-01-18T14:30:00Z'),
  (3, 1, 3, 4, '1.5', 3.5, 'A-', 'First', '2023-2024', 'Midterm', '2024-01-19', 
   'Strong project work and participation', '2024-01-19T09:30:00Z', '2024-01-19T09:30:00Z'),
  (4, 2, 1, 1, '1.25', 3.75, 'A', 'First', '2023-2024', 'Midterm', '2024-01-20', 
   'Outstanding performance throughout', '2024-01-20T11:00:00Z', '2024-01-20T11:00:00Z'),
  (5, 2, 4, 1, '1.0', 4.0, 'A+', 'First', '2023-2024', 'Midterm', '2024-01-18', 
   'Perfect scores in all assessments', '2024-01-18T11:30:00Z', '2024-01-18T11:30:00Z');

-- System Statistics (for dashboard)
INSERT INTO system_statistics (
  total_students, total_teachers, active_courses, pending_enrollments,
  upcoming_classes, recent_grades, attendance_rate, average_gpa,
  total_violations, resolved_violations, pending_violations,
  total_certificates, verified_certificates, pending_certificates,
  updated_at
) VALUES (
  1247, 89, 45, 156, 23, 78, 92.5, 3.4,
  45, 32, 13, 234, 198, 36,
  NOW()
);
