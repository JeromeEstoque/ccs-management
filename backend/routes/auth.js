const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { authenticateToken, authorizeRoles, checkUserStatus } = require('../middleware/auth');

// Maximum login attempts before lockout
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Student Login
router.post('/student/login', async (req, res) => {
  try {
    const { studentId, password } = req.body;

    if (!studentId || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student ID and password are required' 
      });
    }

    // Find student by student_id
    const [students] = await pool.query(`
      SELECT s.*, u.password_hash, u.status, u.failed_attempts, u.locked_until, u.id as user_id
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.student_id = ?
    `, [studentId]);

    if (students.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid Student ID or password' });
    }

    const student = students[0];

    // Check if account is locked
    if (student.locked_until && new Date(student.locked_until) > new Date()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is temporarily locked. Please try again later.' 
      });
    }

    // Check if account is active
    if (student.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, student.password_hash);

    if (!isMatch) {
      // Increment failed attempts
      const failedAttempts = (student.failed_attempts || 0) + 1;
      
      if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION);
        await pool.query(
          'UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?',
          [failedAttempts, lockedUntil, student.user_id]
        );
        return res.status(403).json({ 
          success: false, 
          message: 'Account locked due to too many failed attempts. Please try again in 15 minutes.' 
        });
      }

      await pool.query(
        'UPDATE users SET failed_attempts = ? WHERE id = ?',
        [failedAttempts, student.user_id]
      );

      return res.status(401).json({ 
        success: false, 
        message: `Invalid Student ID or password. ${MAX_LOGIN_ATTEMPTS - failedAttempts} attempts remaining.` 
      });
    }

    // Reset failed attempts and update last login
    await pool.query(
      'UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = ?',
      [student.user_id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: student.user_id, studentId: student.student_id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: student.id,
        userId: student.user_id,
        studentId: student.student_id,
        firstName: student.first_name,
        lastName: student.last_name,
        role: 'student'
      }
    });

  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Teacher Login
router.post('/teacher/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }

    // Find teacher by email
    const [teachers] = await pool.query(`
      SELECT t.*, u.password_hash, u.status, u.failed_attempts, u.locked_until, u.id as user_id
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.email = ? OR u.email = ?
    `, [email, email]);

    if (teachers.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const teacher = teachers[0];

    // Check if account is locked
    if (teacher.locked_until && new Date(teacher.locked_until) > new Date()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is temporarily locked. Please try again later.' 
      });
    }

    // Check if account is active
    if (teacher.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, teacher.password_hash);

    if (!isMatch) {
      const failedAttempts = (teacher.failed_attempts || 0) + 1;
      
      if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION);
        await pool.query(
          'UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?',
          [failedAttempts, lockedUntil, teacher.user_id]
        );
        return res.status(403).json({ 
          success: false, 
          message: 'Account locked due to too many failed attempts. Please try again in 15 minutes.' 
        });
      }

      await pool.query(
        'UPDATE users SET failed_attempts = ? WHERE id = ?',
        [failedAttempts, teacher.user_id]
      );

      return res.status(401).json({ 
        success: false, 
        message: `Invalid email or password. ${MAX_LOGIN_ATTEMPTS - failedAttempts} attempts remaining.` 
      });
    }

    // Reset failed attempts and update last login
    await pool.query(
      'UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = ?',
      [teacher.user_id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: teacher.user_id, email: teacher.email, role: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: teacher.id,
        userId: teacher.user_id,
        email: teacher.email,
        firstName: teacher.first_name,
        lastName: teacher.last_name,
        role: 'teacher',
        position: teacher.position
      }
    });

  } catch (error) {
    console.error('Teacher login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Find admin by username or email
    const [admins] = await pool.query(`
      SELECT u.id, u.username, u.email, u.password_hash, u.status, u.failed_attempts, u.locked_until
      FROM users u
      WHERE (u.username = ? OR u.email = ?) AND u.role = 'admin'
    `, [username, username]);

    if (admins.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const admin = admins[0];

    // Check if account is locked
    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is temporarily locked. Please try again later.' 
      });
    }

    // Check if account is active
    if (admin.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Account is inactive' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password_hash);

    if (!isMatch) {
      const failedAttempts = (admin.failed_attempts || 0) + 1;
      
      if (failedAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION);
        await pool.query(
          'UPDATE users SET failed_attempts = ?, locked_until = ? WHERE id = ?',
          [failedAttempts, lockedUntil, admin.id]
        );
        return res.status(403).json({ 
          success: false, 
          message: 'Account locked due to too many failed attempts. Please try again in 15 minutes.' 
        });
      }

      await pool.query(
        'UPDATE users SET failed_attempts = ? WHERE id = ?',
        [failedAttempts, admin.id]
      );

      return res.status(401).json({ 
        success: false, 
        message: `Invalid username or password. ${MAX_LOGIN_ATTEMPTS - failedAttempts} attempts remaining.` 
      });
    }

    // Reset failed attempts and update last login
    await pool.query(
      'UPDATE users SET failed_attempts = 0, locked_until = NULL, last_login = NOW() WHERE id = ?',
      [admin.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get current user info
router.get('/me', authenticateToken, checkUserStatus, async (req, res) => {
  try {
    let user = null;
    let profileId = null;

    if (req.user.role === 'student') {
      const [students] = await pool.query(`
        SELECT s.*, u.email as user_email, u.status, u.last_login
        FROM students s
        JOIN users u ON s.user_id = u.id
        WHERE s.user_id = ?
      `, [req.user.id]);
      user = students[0];
      profileId = user?.id; // student table ID
    } else if (req.user.role === 'teacher') {
      const [teachers] = await pool.query(`
        SELECT t.*, u.status, u.last_login
        FROM teachers t
        JOIN users u ON t.user_id = u.id
        WHERE t.user_id = ?
      `, [req.user.id]);
      user = teachers[0];
      profileId = user?.id; // teacher table ID
    } else if (req.user.role === 'admin') {
      const [admins] = await pool.query(`
        SELECT id, username, email, status, last_login, created_at
        FROM users
        WHERE id = ? AND role = 'admin'
      `, [req.user.id]);
      user = admins[0];
      profileId = user?.id;
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ 
      success: true, 
      user: { 
        ...user, 
        id: req.user.id, // user table ID (from JWT)
        profileId, // student/teacher table ID
        role: req.user.role 
      } 
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Change password
router.put('/change-password', authenticateToken, checkUserStatus, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be at least 6 characters' 
      });
    }

    // Get current password hash
    const [users] = await pool.query(
      'SELECT password_hash FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, users[0].password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [hashedPassword, req.user.id]
    );

    res.json({ success: true, message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Logout (client-side token removal, but we can log it)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Log the logout action
    await pool.query(
      'INSERT INTO audit_logs (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
      [req.user.id, 'LOGOUT', JSON.stringify({ role: req.user.role }), req.ip]
    );

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Verify token validity
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Token is valid', user: req.user });
});

module.exports = router;
