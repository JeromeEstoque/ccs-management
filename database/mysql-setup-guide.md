# MySQL Database Setup Guide
## Student and Teacher Management System

This guide will help you set up the complete MySQL database for your Student and Teacher Management System.

## 📋 Prerequisites

1. **MySQL Server 8.0+** installed and running
2. **MySQL Command Line Client** or **MySQL Workbench**
3. **Administrator privileges** for database creation
4. **At least 500MB** of free disk space

## 🚀 Quick Setup (5 Minutes)

### Step 1: Connect to MySQL
```bash
# Using MySQL Command Line
mysql -u root -p

# Or using MySQL Workbench
# Connect with your root credentials
```

### Step 2: Run the Schema
```sql
-- Copy and paste the entire content of schema.sql
SOURCE /path/to/ccs-management-system/database/schema.sql;
```

### Step 3: Insert Sample Data
```sql
-- Run seed files in order
SOURCE /path/to/ccs-management-system/database/sql-seeds/01-students.sql;
SOURCE /path/to/ccs-management-system/database/sql-seeds/02-teachers.sql;
SOURCE /path/to/ccs-management-system/database/sql-seeds/03-courses.sql;
SOURCE /path/to/ccs-management-system/database/sql-seeds/04-relationships.sql;
```

### Step 4: Verify Installation
```sql
-- Check if database was created
SHOW DATABASES;
USE ccs_management_system;
SHOW TABLES;

-- Check sample data
SELECT COUNT(*) as total_students FROM students;
SELECT COUNT(*) as total_teachers FROM teachers;
SELECT COUNT(*) as total_courses FROM courses;
```

## 📁 File Structure

```
database/
├── schema.sql                    # Complete database schema
├── mysql-setup-guide.md          # This guide
├── sql-seeds/
│   ├── 01-students.sql          # Student data and skills
│   ├── 02-teachers.sql          # Teacher data and expertise
│   ├── 03-courses.sql           # Course information
│   └── 04-relationships.sql     # Enrollments, attendance, etc.
├── mock-data.js                 # JavaScript mock data
├── mock-data.json               # JSON format data
└── api-integration.js           # API mock functions
```

## 🔧 Detailed Setup Instructions

### 1. Database Schema Installation

The `schema.sql` file creates:
- **13 tables** with proper relationships
- **Indexes** for performance optimization
- **Views** for common queries
- **Stored procedures** for business logic
- **Triggers** for audit logging
- **Constraints** for data integrity

### 2. Sample Data Installation

The seed files provide:
- **5 students** with complete profiles
- **4 teachers** with expertise areas
- **12 courses** with schedules
- **Enrollments, attendance, grades, violations, certificates**

### 3. User Account Setup (Optional)

For production use, create dedicated users:

```sql
-- Application user (read/write)
CREATE USER 'ccs_app'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ccs_management_system.* TO 'ccs_app'@'localhost';

-- Read-only user (reporting)
CREATE USER 'ccs_readonly'@'localhost' IDENTIFIED BY 'your_readonly_password';
GRANT SELECT ON ccs_management_system.* TO 'ccs_readonly'@'localhost';

FLUSH PRIVILEGES;
```

## 🗄️ Database Tables Overview

### Core Tables
| Table | Purpose | Records |
|-------|---------|---------|
| `students` | Student information | 5 |
| `teachers` | Teacher information | 4 |
| `courses` | Course catalog | 12 |
| `enrollments` | Student-course relationships | 10 |
| `attendance` | Attendance tracking | 6 |
| `grades` | Grade records | 5 |
| `violations` | Disciplinary records | 5 |
| `certificates` | Achievement certificates | 5 |

### Supporting Tables
| Table | Purpose |
|-------|---------|
| `student_skills` | Student skills and competencies |
| `teacher_expertise` | Teacher areas of expertise |
| `system_statistics` | System-wide metrics |
| `audit_log` | Change tracking |

## 🔍 Key Features

### 1. **Data Integrity**
- Foreign key constraints
- Unique constraints
- Check constraints
- Cascade delete rules

### 2. **Performance Optimization**
- Strategic indexes
- Composite indexes
- Query optimization views
- Stored procedures

### 3. **Audit Trail**
- Automatic change logging
- Before/after values tracking
- User action recording

### 4. **Business Logic**
- GPA calculation procedures
- Enrollment management
- Attendance rate calculation

## 📊 Sample Queries

### Get Student Summary
```sql
SELECT 
    s.student_id,
    s.first_name,
    s.last_name,
    s.year_level,
    s.section,
    s.gpa,
    COUNT(e.id) as enrolled_courses,
    AVG(g.grade) as average_grade
FROM students s
LEFT JOIN enrollments e ON s.id = e.student_id
LEFT JOIN grades g ON s.id = g.student_id
GROUP BY s.id;
```

### Get Teacher Workload
```sql
SELECT 
    t.employee_id,
    t.first_name,
    t.last_name,
    COUNT(c.id) as courses_teaching,
    SUM(c.credits) as total_credits,
    COUNT(e.id) as total_students
FROM teachers t
LEFT JOIN courses c ON t.id = c.instructor_id
LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'Enrolled'
GROUP BY t.id;
```

### Get Course Enrollment Details
```sql
SELECT 
    c.course_code,
    c.course_name,
    c.max_students,
    COUNT(e.id) as enrolled,
    c.max_students - COUNT(e.id) as available,
    t.first_name as instructor
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'Enrolled'
LEFT JOIN teachers t ON c.instructor_id = t.id
GROUP BY c.id;
```

## 🔌 Application Integration

### Node.js/Express Connection
```javascript
const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ccs_app',
  password: 'your_secure_password',
  database: 'ccs_management_system',
  charset: 'utf8mb4'
});

// Example query
const getStudents = async () => {
  const [rows] = await connection.execute(
    'SELECT * FROM students ORDER BY last_name, first_name'
  );
  return rows;
};
```

### React Integration
```javascript
// api/students.js
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'ccs_app',
  password: process.env.DB_PASSWORD,
  database: 'ccs_management_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const getStudents = async () => {
  const [rows] = await pool.execute('SELECT * FROM students');
  return rows;
};
```

## 🛠️ Maintenance

### Regular Tasks
```sql
-- Update statistics
CALL update_course_enrollment(1);

-- Calculate GPA
CALL calculate_student_gpa(1);

-- Get attendance rate
CALL get_student_attendance_rate(1, '2024-01-01', '2024-01-31');

-- Clean old audit logs (older than 1 year)
DELETE FROM audit_log WHERE changed_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

### Backup Commands
```bash
# Full backup
mysqldump -u root -p ccs_management_system > backup_$(date +%Y%m%d).sql

# Compressed backup
mysqldump -u root -p ccs_management_system | gzip > backup_$(date +%Y%m%d).sql.gz
```

## 🔒 Security Considerations

1. **Use strong passwords** for database users
2. **Limit user privileges** to minimum required
3. **Enable SSL** for remote connections
4. **Regular backups** and test restores
5. **Monitor audit logs** for suspicious activity
6. **Keep MySQL updated** with security patches

## 🚨 Troubleshooting

### Common Issues

**1. Connection Failed**
```bash
# Check MySQL service
sudo systemctl status mysql
# Or on Windows
net start mysql
```

**2. Permission Denied**
```sql
-- Check user privileges
SHOW GRANTS FOR 'ccs_app'@'localhost';

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ccs_management_system.* TO 'ccs_app'@'localhost';
```

**3. Foreign Key Errors**
```sql
-- Check table status
SHOW ENGINE INNODB STATUS;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;
-- Run your imports
SET FOREIGN_KEY_CHECKS = 1;
```

**4. Character Set Issues**
```sql
-- Check character set
SHOW VARIABLES LIKE 'character_set%';

-- Set to UTF-8
ALTER DATABASE ccs_management_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## 📈 Performance Tuning

### MySQL Configuration (my.cnf)
```ini
[mysqld]
# Memory settings
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M

# Connection settings
max_connections = 200
max_connect_errors = 1000

# Query cache
query_cache_type = 1
query_cache_size = 64M

# Slow query log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

## 📞 Support

For database-related issues:
1. Check MySQL error logs: `/var/log/mysql/error.log`
2. Review this guide's troubleshooting section
3. Verify all SQL files executed successfully
4. Test with sample queries provided

## ✅ Setup Verification

Run these queries to verify your setup:

```sql
-- 1. Check all tables exist
SHOW TABLES;

-- 2. Verify sample data
SELECT 'Students' as table_name, COUNT(*) as count FROM students
UNION ALL
SELECT 'Teachers', COUNT(*) FROM teachers
UNION ALL
SELECT 'Courses', COUNT(*) FROM courses
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM enrollments;

-- 3. Test relationships
SELECT s.first_name, c.course_name 
FROM students s
JOIN enrollments e ON s.id = e.student_id
JOIN courses c ON e.course_id = c.id
LIMIT 5;

-- 4. Check system statistics
SELECT * FROM system_statistics;
```

If all queries return expected results, your MySQL database is ready for use! 🎉
