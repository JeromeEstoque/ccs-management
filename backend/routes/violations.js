const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRoles, checkUserStatus, auditLog } = require('../middleware/auth');

// Get all violations (Admin and Teacher)
router.get('/', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  try {
    const { status, studentId, startDate, endDate, search } = req.query;
    
    let query = `
      SELECT v.*, 
        s.student_id, s.first_name as student_first_name, s.last_name as student_last_name,
        s.section, s.year_level,
        CONCAT(t.first_name, ' ', t.last_name) as encoded_by_name
      FROM violations v
      JOIN students s ON v.student_id = s.id
      LEFT JOIN teachers t ON t.user_id = v.encoded_by
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND v.status = ?';
      params.push(status);
    }
    if (studentId) {
      query += ' AND v.student_id = ?';
      params.push(studentId);
    }
    if (startDate) {
      query += ' AND v.date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND v.date <= ?';
      params.push(endDate);
    }
    if (search) {
      query += ' AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.student_id LIKE ? OR v.violation_type LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY v.date DESC, v.created_at DESC';

    const [violations] = await pool.query(query, params);
    res.json({ success: true, violations });

  } catch (error) {
    console.error('Get violations error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get violations by student - MUST come before /:id route
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check access - student can only view their own violations
    if (req.user.role === 'student') {
      const [student] = await pool.query(
        'SELECT id FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (student.length === 0 || student[0].id !== parseInt(studentId)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const [violations] = await pool.query(`
      SELECT v.*, 
        CONCAT(t.first_name, ' ', t.last_name) as encoded_by_name
      FROM violations v
      LEFT JOIN teachers t ON t.user_id = v.encoded_by
      WHERE v.student_id = ?
      ORDER BY v.date DESC
    `, [studentId]);

    res.json({ success: true, violations });

  } catch (error) {
    console.error('Get student violations error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get violation statistics - MUST come before /:id route
router.get('/stats/summary', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  try {
    // By status
    const [byStatus] = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM violations
      GROUP BY status
    `);

    // By type
    const [byType] = await pool.query(`
      SELECT violation_type, COUNT(*) as count
      FROM violations
      GROUP BY violation_type
      ORDER BY count DESC
      LIMIT 10
    `);

    // By section
    const [bySection] = await pool.query(`
      SELECT s.section, COUNT(*) as count
      FROM violations v
      JOIN students s ON v.student_id = s.id
      WHERE s.section IS NOT NULL
      GROUP BY s.section
      ORDER BY count DESC
    `);

    // Recent violations (last 30 days)
    const [recent] = await pool.query(`
      SELECT COUNT(*) as count
      FROM violations
      WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    `);

    res.json({
      success: true,
      statistics: {
        byStatus,
        byType,
        bySection,
        recentCount: recent[0].count
      }
    });

  } catch (error) {
    console.error('Get violation stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get violations by user ID (for logged-in students)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check access - student can only view their own violations
    if (req.user.role === 'student' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Get student ID from user ID
    const [student] = await pool.query(
      'SELECT id FROM students WHERE user_id = ?',
      [userId]
    );

    if (student.length === 0) {
      return res.json({ success: true, violations: [] });
    }

    const [violations] = await pool.query(`
      SELECT v.*, 
        CONCAT(t.first_name, ' ', t.last_name) as encoded_by_name
      FROM violations v
      LEFT JOIN teachers t ON t.user_id = v.encoded_by
      WHERE v.student_id = ?
      ORDER BY v.date DESC
    `, [student[0].id]);

    res.json({ success: true, violations });

  } catch (error) {
    console.error('Get user violations error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get violation by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [violations] = await pool.query(`
      SELECT v.*, 
        s.student_id, s.first_name as student_first_name, s.last_name as student_last_name,
        s.section, s.year_level, s.profile_picture,
        CONCAT(t.first_name, ' ', t.last_name) as encoded_by_name
      FROM violations v
      JOIN students s ON v.student_id = s.id
      LEFT JOIN teachers t ON t.user_id = v.encoded_by
      WHERE v.id = ?
    `, [id]);

    if (violations.length === 0) {
      return res.status(404).json({ success: false, message: 'Violation not found' });
    }

    // Check access - student can only view their own violations
    if (req.user.role === 'student') {
      const [student] = await pool.query(
        'SELECT id FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (student.length === 0 || student[0].id !== violations[0].student_id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    res.json({ success: true, violation: violations[0] });

  } catch (error) {
    console.error('Get violation error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create new violation (Admin and Teacher)
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), checkUserStatus, auditLog('CREATE_VIOLATION'), async (req, res) => {
  try {
    const { studentId, violationType, remarks, date } = req.body;

    if (!studentId || !violationType || !date) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student ID, violation type, and date are required' 
      });
    }

    // Verify student exists
    const [student] = await pool.query('SELECT id FROM students WHERE id = ?', [studentId]);
    if (student.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const [result] = await pool.query(
      `INSERT INTO violations (student_id, violation_type, remarks, date, status, encoded_by)
       VALUES (?, ?, ?, ?, 'Pending', ?)`,
      [studentId, violationType, remarks || null, date, req.user.id]
    );

    res.status(201).json({
      success: true,
      message: 'Violation recorded successfully',
      violationId: result.insertId
    });

  } catch (error) {
    console.error('Create violation error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Update violation
router.put('/:id', authenticateToken, authorizeRoles('admin', 'teacher'), checkUserStatus, auditLog('UPDATE_VIOLATION'), async (req, res) => {
  try {
    const { id } = req.params;
    const { violationType, remarks, status, date } = req.body;

    const updates = [];
    const values = [];

    if (violationType) { updates.push('violation_type = ?'); values.push(violationType); }
    if (remarks !== undefined) { updates.push('remarks = ?'); values.push(remarks); }
    if (status) { updates.push('status = ?'); values.push(status); }
    if (date) { updates.push('date = ?'); values.push(date); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    values.push(id);
    await pool.query(`UPDATE violations SET ${updates.join(', ')} WHERE id = ?`, values);

    res.json({ success: true, message: 'Violation updated successfully' });

  } catch (error) {
    console.error('Update violation error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Resolve violation
router.put('/:id/resolve', authenticateToken, authorizeRoles('admin', 'teacher'), checkUserStatus, auditLog('RESOLVE_VIOLATION'), async (req, res) => {
  try {
    const { id } = req.params;
    const { remarks } = req.body;

    await pool.query(
      'UPDATE violations SET status = ?, remarks = CONCAT(IFNULL(remarks, ""), ?) WHERE id = ?',
      ['Resolved', `\n[Resolved] ${remarks || ''}`, id]
    );

    res.json({ success: true, message: 'Violation resolved' });

  } catch (error) {
    console.error('Resolve violation error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete violation (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), auditLog('DELETE_VIOLATION'), async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM violations WHERE id = ?', [id]);

    res.json({ success: true, message: 'Violation deleted' });

  } catch (error) {
    console.error('Delete violation error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
