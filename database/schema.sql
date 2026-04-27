-- Student and Teacher Management System Database Schema
-- MySQL 8.0+ Compatible

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS ccs_management_system 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE ccs_management_system;

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

-- ==================== TRIGGERS ====================

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

-- ==================== VIEWS ====================

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

-- ==================== STORED PROCEDURES ====================

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

-- ==================== INITIAL DATA ====================
-- Insert system statistics
INSERT INTO system_statistics (
    total_students, total_teachers, active_courses, pending_enrollments,
    upcoming_classes, recent_grades, attendance_rate, average_gpa,
    total_violations, resolved_violations, pending_violations,
    total_certificates, verified_certificates, pending_certificates
) VALUES (
    0, 0, 0, 0, 0, 0, 0.00, 0.00, 0, 0, 0, 0, 0, 0
);

-- ==================== INDEX OPTIMIZATION ====================
-- Composite indexes for common queries
CREATE INDEX idx_student_year_section ON students(year_level, section);
CREATE INDEX idx_course_semester_year ON courses(semester, year_level);
CREATE INDEX idx_enrollment_student_course ON enrollments(student_id, course_id);
CREATE INDEX idx_grade_student_course_period ON grades(student_id, course_id, grading_period);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_violation_student_date ON violations(student_id, date);

-- ==================== COMMENTS ====================
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

-- ==================== GRANTS (Optional) ====================
-- Uncomment and modify as needed for your environment
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

-- ==================== SETUP COMPLETE ====================
SELECT 'Database schema created successfully!' as status;
