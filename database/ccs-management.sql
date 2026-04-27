-- ========================================
-- Student and Teacher Management System
-- Complete Database Schema and Seed Data
-- MySQL 8.0+ Compatible
-- ========================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ccs_management_system 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ccs_management_system;

-- ========================================
-- TABLE SCHEMAS
-- ========================================

-- ==================== STUDENTS TABLE ====================
CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    gender ENUM('Male', 'Female', 'Other'),
    address TEXT,
    year_level VARCHAR(20),
    section VARCHAR(20),
    gpa DECIMAL(3,2),
    status_record ENUM('Regular', 'Irregular', 'Probation') DEFAULT 'Regular',
    organization_role VARCHAR(100),
    guardian_name VARCHAR(150),
    guardian_contact VARCHAR(20),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_student_id (student_id),
    INDEX idx_email (email),
    INDEX idx_year_level (year_level),
    INDEX idx_section (section),
    INDEX idx_gpa (gpa)
);

-- ==================== TEACHERS TABLE ====================
CREATE TABLE teachers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    gender ENUM('Male', 'Female', 'Other'),
    address TEXT,
    position VARCHAR(100),
    department VARCHAR(100),
    specialization TEXT,
    hire_date DATE,
    status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
    profile_picture VARCHAR(255),
    advisory_section VARCHAR(20),
    teaching_load INT DEFAULT 0,
    capstone_adviser_available BOOLEAN DEFAULT FALSE,
    capstone_schedule VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_employee_id (employee_id),
    INDEX idx_email (email),
    INDEX idx_department (department),
    INDEX idx_status (status)
);

-- ==================== COURSES TABLE ====================
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    description TEXT,
    credits INT NOT NULL,
    year_level VARCHAR(20),
    semester ENUM('First', 'Second', 'Summer'),
    department VARCHAR(100),
    prerequisite INT,
    instructor_id INT,
    schedule VARCHAR(100),
    room VARCHAR(50),
    max_students INT,
    current_enrollment INT DEFAULT 0,
    status ENUM('Active', 'Inactive', 'Archived') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (prerequisite) REFERENCES courses(id) ON DELETE SET NULL,
    FOREIGN KEY (instructor_id) REFERENCES teachers(id) ON DELETE SET NULL,
    
    INDEX idx_course_code (course_code),
    INDEX idx_year_level (year_level),
    INDEX idx_semester (semester),
    INDEX idx_department (department),
    INDEX idx_instructor (instructor_id)
);

-- ==================== ENROLLMENTS TABLE ====================
CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE NOT NULL,
    status ENUM('Enrolled', 'Completed', 'Dropped', 'Withdrawn') DEFAULT 'Enrolled',
    grade DECIMAL(3,2),
    instructor_id INT,
    semester VARCHAR(20),
    academic_year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES teachers(id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_enrollment (student_id, course_id, academic_year, semester),
    INDEX idx_student_course (student_id, course_id),
    INDEX idx_enrollment_date (enrollment_date),
    INDEX idx_status (status)
);

-- ==================== ATTENDANCE TABLE ====================
CREATE TABLE attendance (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL,
    time_in TIME,
    time_out TIME,
    instructor_id INT,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES teachers(id) ON DELETE SET NULL,
    
    UNIQUE KEY unique_attendance (student_id, course_id, date),
    INDEX idx_student_attendance (student_id, date),
    INDEX idx_course_attendance (course_id, date),
    INDEX idx_status (status)
);

-- ==================== VIOLATIONS TABLE ====================
CREATE TABLE violations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    teacher_id INT NOT NULL,
    violation_type VARCHAR(100) NOT NULL,
    description TEXT,
    severity ENUM('Minor', 'Moderate', 'Major') NOT NULL,
    date DATE NOT NULL,
    status ENUM('Pending', 'Resolved', 'Under Review', 'Dismissed') DEFAULT 'Pending',
    action_taken TEXT,
    points_deducted INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    
    INDEX idx_student_violations (student_id, date),
    INDEX idx_teacher_violations (teacher_id, date),
    INDEX idx_severity (severity),
    INDEX idx_status (status)
);

-- ==================== CERTIFICATES TABLE ====================
CREATE TABLE certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    certificate_name VARCHAR(200) NOT NULL,
    description TEXT,
    issuing_organization VARCHAR(150),
    issue_date DATE,
    expiry_date DATE,
    certificate_type ENUM('Academic', 'Sports', 'Professional', 'Leadership') NOT NULL,
    file_url VARCHAR(255),
    status ENUM('Verified', 'Pending', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    
    INDEX idx_student_certificates (student_id, issue_date),
    INDEX idx_certificate_type (certificate_type),
    INDEX idx_status (status)
);

-- ==================== GRADES TABLE ====================
CREATE TABLE grades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    instructor_id INT NOT NULL,
    grade DECIMAL(3,2) NOT NULL,
    grade_points DECIMAL(3,2),
    letter_grade VARCHAR(5),
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    grading_period ENUM('Prelim', 'Midterm', 'Final', 'Final Grade') NOT NULL,
    date_posted DATE NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES teachers(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_grade (student_id, course_id, academic_year, semester, grading_period),
    INDEX idx_student_grades (student_id, academic_year),
    INDEX idx_course_grades (course_id, academic_year),
    INDEX idx_grading_period (grading_period)
);

-- ==================== STUDENT SKILLS TABLE ====================
CREATE TABLE student_skills (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    skill_name VARCHAR(100) NOT NULL,
    skill_type ENUM('technical', 'sports', 'arts', 'leadership', 'other') NOT NULL,
    skill_level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_student_skill (student_id, skill_name),
    INDEX idx_student_skills (student_id, skill_type),
    INDEX idx_skill_type (skill_type)
);

-- ==================== TEACHER EXPERTISE TABLE ====================
CREATE TABLE teacher_expertise (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    expertise_area VARCHAR(100) NOT NULL,
    years_experience INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    
    UNIQUE KEY unique_teacher_expertise (teacher_id, expertise_area),
    INDEX idx_teacher_expertise (teacher_id, expertise_area)
);

-- ==================== SYSTEM STATISTICS TABLE ====================
CREATE TABLE system_statistics (
    id INT PRIMARY KEY AUTO_INCREMENT,
    total_students INT DEFAULT 0,
    total_teachers INT DEFAULT 0,
    active_courses INT DEFAULT 0,
    pending_enrollments INT DEFAULT 0,
    upcoming_classes INT DEFAULT 0,
    recent_grades INT DEFAULT 0,
    attendance_rate DECIMAL(5,2) DEFAULT 0.00,
    average_gpa DECIMAL(3,2) DEFAULT 0.00,
    total_violations INT DEFAULT 0,
    resolved_violations INT DEFAULT 0,
    pending_violations INT DEFAULT 0,
    total_certificates INT DEFAULT 0,
    verified_certificates INT DEFAULT 0,
    pending_certificates INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ==================== AUDIT LOG TABLE ====================
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_action (action),
    INDEX idx_changed_at (changed_at)
);

-- ========================================
-- TRIGGERS
-- ========================================

-- Trigger to log changes to students table
DELIMITER //
CREATE TRIGGER students_audit_insert
AFTER INSERT ON students
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, new_values, changed_by)
    VALUES ('students', NEW.id, 'INSERT', JSON_OBJECT(
        'id', NEW.id,
        'student_id', NEW.student_id,
        'first_name', NEW.first_name,
        'last_name', NEW.last_name,
        'email', NEW.email
    ), USER());
END//

CREATE TRIGGER students_audit_update
AFTER UPDATE ON students
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, new_values, changed_by)
    VALUES ('students', NEW.id, 'UPDATE', JSON_OBJECT(
        'id', OLD.id,
        'student_id', OLD.student_id,
        'first_name', OLD.first_name,
        'last_name', OLD.last_name,
        'email', OLD.email,
        'gpa', OLD.gpa
    ), JSON_OBJECT(
        'id', NEW.id,
        'student_id', NEW.student_id,
        'first_name', NEW.first_name,
        'last_name', NEW.last_name,
        'email', NEW.email,
        'gpa', NEW.gpa
    ), USER());
END//

CREATE TRIGGER students_audit_delete
AFTER DELETE ON students
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action, old_values, changed_by)
    VALUES ('students', OLD.id, 'DELETE', JSON_OBJECT(
        'id', OLD.id,
        'student_id', OLD.student_id,
        'first_name', OLD.first_name,
        'last_name', OLD.last_name,
        'email', OLD.email
    ), USER());
END//

DELIMITER ;

-- ========================================
-- VIEWS
-- ========================================

-- View for student enrollment summary
CREATE VIEW student_enrollment_summary AS
SELECT 
    s.id,
    s.student_id,
    s.first_name,
    s.last_name,
    s.year_level,
    s.section,
    s.gpa,
    COUNT(e.id) as enrolled_courses,
    SUM(CASE WHEN e.status = 'Completed' THEN 1 ELSE 0 END) as completed_courses,
    AVG(e.grade) as average_grade
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
GROUP BY s.id, s.student_id, s.first_name, s.last_name, s.year_level, s.section, s.gpa;

-- View for teacher workload
CREATE VIEW teacher_workload AS
SELECT 
    t.id,
    t.employee_id,
    t.first_name,
    t.last_name,
    t.position,
    t.department,
    COUNT(c.id) as courses_teaching,
    SUM(c.credits) as total_credits,
    COUNT(e.id) as total_students,
    t.teaching_load
FROM teachers t
LEFT JOIN courses c ON t.id = c.instructor_id
LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'Enrolled'
GROUP BY t.id, t.employee_id, t.first_name, t.last_name, t.position, t.department, t.teaching_load;

-- View for course enrollment details
CREATE VIEW course_enrollment_details AS
SELECT 
    c.id,
    c.course_code,
    c.course_name,
    c.credits,
    c.year_level,
    c.semester,
    c.max_students,
    COUNT(e.id) as enrolled_count,
    c.max_students - COUNT(e.id) as available_slots,
    t.first_name as instructor_first_name,
    t.last_name as instructor_last_name
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'Enrolled'
LEFT JOIN teachers t ON c.instructor_id = t.id
GROUP BY c.id, c.course_code, c.course_name, c.credits, c.year_level, c.semester, c.max_students, t.first_name, t.last_name;

-- ========================================
-- STORED PROCEDURES
-- ========================================

-- Procedure to calculate student GPA
DELIMITER //
CREATE PROCEDURE calculate_student_gpa(IN student_id_param INT)
BEGIN
    DECLARE avg_gpa DECIMAL(3,2);
    
    SELECT AVG(grade) INTO avg_gpa
    FROM grades
    WHERE student_id = student_id_param AND grade IS NOT NULL;
    
    UPDATE students 
    SET gpa = avg_gpa
    WHERE id = student_id_param;
    
    SELECT avg_gpa as calculated_gpa;
END//

-- Procedure to update course enrollment count
DELIMITER //
CREATE PROCEDURE update_course_enrollment(IN course_id_param INT)
BEGIN
    DECLARE enrollment_count INT;
    
    SELECT COUNT(*) INTO enrollment_count
    FROM enrollments
    WHERE course_id = course_id_param AND status = 'Enrolled';
    
    UPDATE courses 
    SET current_enrollment = enrollment_count
    WHERE id = course_id_param;
    
    SELECT enrollment_count as updated_enrollment;
END//

-- Procedure to get student attendance rate
DELIMITER //
CREATE PROCEDURE get_student_attendance_rate(IN student_id_param INT, IN start_date DATE, IN end_date DATE)
BEGIN
    DECLARE total_sessions INT;
    DECLARE present_sessions INT;
    DECLARE attendance_rate DECIMAL(5,2);
    
    SELECT COUNT(*) INTO total_sessions
    FROM attendance
    WHERE student_id = student_id_param AND date BETWEEN start_date AND end_date;
    
    SELECT COUNT(*) INTO present_sessions
    FROM attendance
    WHERE student_id = student_id_param AND date BETWEEN start_date AND end_date 
    AND status IN ('Present', 'Late');
    
    IF total_sessions > 0 THEN
        SET attendance_rate = (present_sessions / total_sessions) * 100;
    ELSE
        SET attendance_rate = 0;
    END IF;
    
    SELECT attendance_rate;
END//

DELIMITER ;

-- ========================================
-- INDEX OPTIMIZATION
-- ========================================

-- Composite indexes for common queries
CREATE INDEX idx_student_year_section ON students(year_level, section);
CREATE INDEX idx_course_semester_year ON courses(semester, year_level);
CREATE INDEX idx_enrollment_student_course ON enrollments(student_id, course_id);
CREATE INDEX idx_grade_student_course_period ON grades(student_id, course_id, grading_period);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_violation_student_date ON violations(student_id, date);

-- ========================================
-- TABLE COMMENTS
-- ========================================

ALTER TABLE students COMMENT 'Student information and academic records';
ALTER TABLE teachers COMMENT 'Teacher information and professional details';
ALTER TABLE courses COMMENT 'Course catalog and scheduling information';
ALTER TABLE enrollments COMMENT 'Student course enrollment records';
ALTER TABLE attendance COMMENT 'Student attendance tracking';
ALTER TABLE violations COMMENT 'Student disciplinary records';
ALTER TABLE certificates COMMENT 'Student achievement certificates';
ALTER TABLE grades COMMENT 'Student grade records';
ALTER TABLE student_skills COMMENT 'Student skills and competencies';
ALTER TABLE teacher_expertise COMMENT 'Teacher areas of expertise';
ALTER TABLE system_statistics COMMENT 'System-wide statistics and metrics';
ALTER TABLE audit_log COMMENT 'Audit trail for data changes';

-- ========================================
-- SEED DATA
-- ========================================

-- ==================== STUDENTS DATA ====================
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

-- ==================== TEACHERS DATA ====================
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

-- ==================== COURSES DATA ====================
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
    'Computer Studies', 5, 3, 'By Appointment', 'Project Lab', 15, 12, 'Active',
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

-- ==================== STUDENT SKILLS DATA ====================
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

-- ==================== TEACHER EXPERTISE DATA ====================
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

-- ==================== ENROLLMENTS DATA ====================
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

-- ==================== ATTENDANCE DATA ====================
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

-- ==================== VIOLATIONS DATA ====================
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

-- ==================== CERTIFICATES DATA ====================
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

-- ==================== GRADES DATA ====================
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

-- ==================== SYSTEM STATISTICS ====================
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

-- ========================================
-- OPTIONAL USER GRANTS (UNCOMMENT TO USE)
-- ========================================

/*
-- Create application user
CREATE USER 'ccs_app'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ccs_management_system.* TO 'ccs_app'@'localhost';
GRANT EXECUTE ON ccs_management_system.* TO 'ccs_app'@'localhost';

-- Create read-only user for reporting
CREATE USER 'ccs_readonly'@'localhost' IDENTIFIED BY 'your_readonly_password';
GRANT SELECT ON ccs_management_system.* TO 'ccs_readonly'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;
*/

-- ========================================
-- SETUP COMPLETE
-- ========================================

SELECT 'CCS Management System database setup completed successfully!' as status;
SELECT 'Database: ccs_management_system' as database_name;
SELECT 'Tables created: 13' as tables_count;
SELECT 'Sample records loaded: 5 students, 4 teachers, 12 courses, and related data' as data_summary;
