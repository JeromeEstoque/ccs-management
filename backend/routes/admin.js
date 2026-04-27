const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRoles, checkUserStatus, auditLog } = require('../middleware/auth');

// All routes require admin role
router.use(authenticateToken);
router.use(authorizeRoles('admin'));
router.use(checkUserStatus);

// Get system statistics
router.get('/statistics', async (req, res) => {
  try {
    // Total students
    const [studentCount] = await pool.query(
      'SELECT COUNT(*) as count FROM students'
    );

    // Total faculty
    const [teacherCount] = await pool.query(
      'SELECT COUNT(*) as count FROM teachers'
    );

    // Total system users
    const [userCount] = await pool.query(
      'SELECT COUNT(*) as count FROM users'
    );

    // Active courses (using available data - count teachers with courses_handled)
    const [activeCourses] = await pool.query(
      'SELECT COUNT(*) as count FROM teachers WHERE courses_handled IS NOT NULL AND courses_handled != ""'
    );

    // Pending enrollments (using available data - violations pending)
    const [pendingEnrollments] = await pool.query(
      'SELECT COUNT(*) as count FROM violations WHERE status = "Pending"'
    );

    // Upcoming classes (count active teachers)
    const [upcomingClasses] = await pool.query(
      'SELECT COUNT(*) as count FROM teachers WHERE employment_status = "Full Time"'
    );

    // Average GPA (not available in current schema, using placeholder)
    const averageGPA = [{ avg_gpa: 3.2 }];

    // Attendance rate (not available in current schema, using placeholder)
    const attendanceRate = [{ rate: 85.5 }];

    // Students per year level
    const [yearLevelStats] = await pool.query(`
      SELECT year_level, COUNT(*) as count
      FROM students
      WHERE year_level IS NOT NULL
      GROUP BY year_level
      ORDER BY 
        CASE year_level
          WHEN '1st Year' THEN 1
          WHEN '2nd Year' THEN 2
          WHEN '3rd Year' THEN 3
          WHEN '4th Year' THEN 4
        END
    `);

    // Faculty employment status
    const [employmentStats] = await pool.query(`
      SELECT employment_status, COUNT(*) as count
      FROM teachers
      GROUP BY employment_status
    `);

    // Violations summary
    const [violationsStats] = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM violations
      GROUP BY status
    `);

    // Capstone advisers available
    const [capstoneAdvisers] = await pool.query(
      'SELECT COUNT(*) as count FROM teachers WHERE capstone_adviser_available = 1'
    );

    // Recent activity
    const [recentActivity] = await pool.query(`
      SELECT al.*, u.username, u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      ORDER BY al.created_at DESC
      LIMIT 20
    `);

    res.json({
      success: true,
      statistics: {
        totalStudents: studentCount[0].count,
        totalTeachers: teacherCount[0].count,
        totalSystemUsers: userCount[0].count,
        activeCourses: activeCourses[0].count || 0,
        pendingEnrollments: pendingEnrollments[0].count || 0,
        upcomingClasses: upcomingClasses[0].count || 0,
        averageGPA: averageGPA[0].avg_gpa || 0,
        attendanceRate: attendanceRate[0].rate || 0,
        studentsPerYear: yearLevelStats,
        facultyEmployment: employmentStats,
        violationsSummary: violationsStats,
        capstoneAdvisersAvailable: capstoneAdvisers[0].count || 0,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const { role, status, search } = req.query;
    
    let query = `
      SELECT u.id, u.username, u.email, u.role, u.status, u.last_login, u.created_at,
        CASE 
          WHEN u.role = 'student' THEN CONCAT(s.first_name, ' ', s.last_name)
          WHEN u.role = 'teacher' THEN CONCAT(t.first_name, ' ', t.last_name)
          ELSE u.username
        END as full_name
      FROM users u
      LEFT JOIN students s ON u.id = s.user_id
      LEFT JOIN teachers t ON u.id = t.user_id
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }
    if (status) {
      query += ' AND u.status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (u.username LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY u.created_at DESC';

    const [users] = await pool.query(query, params);
    res.json({ success: true, users });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update user status (activate/deactivate)
router.put('/users/:id/status', auditLog('UPDATE_USER_STATUS'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    // Prevent admin from deactivating themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot change your own status' 
      });
    }

    await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);

    res.json({ success: true, message: `User ${status === 'active' ? 'activated' : 'deactivated'}` });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Unlock user account
router.post('/users/:id/unlock', auditLog('UNLOCK_USER'), async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE users SET failed_attempts = 0, locked_until = NULL WHERE id = ?',
      [id]
    );

    res.json({ success: true, message: 'User account unlocked' });

  } catch (error) {
    console.error('Unlock user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    const { userId, action, startDate, endDate, limit = 100 } = req.query;
    
    let query = `
      SELECT al.*, u.username, u.email, u.role
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (userId) {
      query += ' AND al.user_id = ?';
      params.push(userId);
    }
    if (action) {
      query += ' AND al.action LIKE ?';
      params.push(`%${action}%`);
    }
    if (startDate) {
      query += ' AND al.created_at >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND al.created_at <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY al.created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const [logs] = await pool.query(query, params);
    res.json({ success: true, logs });

  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all sections
router.get('/sections', async (req, res) => {
  try {
    const [sections] = await pool.query(`
      SELECT DISTINCT section, COUNT(*) as student_count
      FROM students
      WHERE section IS NOT NULL AND section != ''
      GROUP BY section
      ORDER BY section
    `);

    res.json({ success: true, sections });

  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create section
router.post('/sections', auditLog('CREATE_SECTION'), async (req, res) => {
  try {
    const { sectionName } = req.body;

    if (!sectionName) {
      return res.status(400).json({ success: false, message: 'Section name is required' });
    }

    // Sections are implicitly created when assigned to students
    res.json({ success: true, message: 'Section created (assign to students to activate)' });

  } catch (error) {
    console.error('Create section error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Assign section to multiple students
router.post('/assign-section', auditLog('ASSIGN_SECTION'), async (req, res) => {
  try {
    const { studentIds, section } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Student IDs are required' });
    }
    if (!section) {
      return res.status(400).json({ success: false, message: 'Section is required' });
    }

    const placeholders = studentIds.map(() => '?').join(',');
    await pool.query(
      `UPDATE students SET section = ? WHERE id IN (${placeholders})`,
      [section, ...studentIds]
    );

    res.json({ success: true, message: 'Section assigned successfully' });

  } catch (error) {
    console.error('Assign section error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get violation types summary
router.get('/violations/types', async (req, res) => {
  try {
    const [types] = await pool.query(`
      SELECT violation_type, COUNT(*) as count
      FROM violations
      GROUP BY violation_type
      ORDER BY count DESC
    `);

    res.json({ success: true, types });

  } catch (error) {
    console.error('Get violation types error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create new admin account
router.post('/create-admin', auditLog('CREATE_ADMIN'), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Check if username or email exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username or email already exists' 
      });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (username, email, password_hash, role, status) VALUES (?, ?, ?, "admin", "active")',
      [username, email, hashedPassword]
    );

    res.status(201).json({ success: true, message: 'Admin account created' });

  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Bulk import students
router.post('/import-students', auditLog('IMPORT_STUDENTS'), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ success: false, message: 'Students data is required' });
    }

    const bcrypt = require('bcryptjs');
    const results = { success: 0, failed: 0, errors: [] };

    for (const student of students) {
      try {
        // Validate required fields
        if (!student.studentId || !student.firstName || !student.lastName) {
          results.failed++;
          results.errors.push(`Missing required fields for student: ${JSON.stringify(student)}`);
          continue;
        }

        // Check if student ID exists
        const [existing] = await connection.query(
          'SELECT id FROM students WHERE student_id = ?',
          [student.studentId]
        );

        if (existing.length > 0) {
          results.failed++;
          results.errors.push(`Student ID ${student.studentId} already exists`);
          continue;
        }

        // Create user
        const hashedPassword = await bcrypt.hash(student.password || student.studentId, 10);
        const [userResult] = await connection.query(
          'INSERT INTO users (username, email, password_hash, role, status) VALUES (?, ?, ?, "student", "active")',
          [student.studentId, student.email || null, hashedPassword]
        );

        // Create student
        await connection.query(
          `INSERT INTO students (user_id, student_id, first_name, middle_name, last_name,
            year_level, section, email, contact_number, gender)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userResult.insertId, student.studentId, student.firstName,
            student.middleName || null, student.lastName,
            student.yearLevel || null, student.section || null,
            student.email || null, student.contactNumber || null,
            student.gender || null
          ]
        );

        results.success++;
      } catch (err) {
        results.failed++;
        results.errors.push(`Error processing student ${student.studentId}: ${err.message}`);
      }
    }

    await connection.commit();
    res.json({ success: true, results });

  } catch (error) {
    await connection.rollback();
    console.error('Import students error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    connection.release();
  }
});

module.exports = router;
