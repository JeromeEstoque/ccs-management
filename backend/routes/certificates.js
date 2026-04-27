const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRoles, checkUserStatus, auditLog } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Get certificates by user ID (for logged-in students)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check access - student can only view their own certificates
    if (req.user.role === 'student' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Get student ID from user ID
    const [student] = await pool.query(
      'SELECT id FROM students WHERE user_id = ?',
      [userId]
    );

    if (student.length === 0) {
      return res.json({ success: true, certificates: [] });
    }

    const [certificates] = await pool.query(
      'SELECT * FROM certificates WHERE student_id = ? ORDER BY uploaded_at DESC',
      [student[0].id]
    );

    res.json({ success: true, certificates });

  } catch (error) {
    console.error('Get user certificates error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all certificates for a student
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check access - student can only view their own certificates
    if (req.user.role === 'student') {
      const [student] = await pool.query(
        'SELECT id FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (student.length === 0 || student[0].id !== parseInt(studentId)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const [certificates] = await pool.query(
      'SELECT * FROM certificates WHERE student_id = ? ORDER BY uploaded_at DESC',
      [studentId]
    );

    res.json({ success: true, certificates });

  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Upload certificate
router.post('/upload', authenticateToken, checkUserStatus, upload.single('certificate'), async (req, res) => {
  try {
    const { userId, certificateName } = req.body;

    if (!userId || !certificateName) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID and certificate name are required' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Check access - student can only upload their own certificates, admin can upload for anyone
    if (req.user.role === 'student' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Get student ID from user ID
    const [student] = await pool.query(
      'SELECT id FROM students WHERE user_id = ?',
      [userId]
    );

    if (student.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const studentId = student[0].id;
    const fileUrl = `/uploads/certificates/${req.file.filename}`;

    const [result] = await pool.query(
      'INSERT INTO certificates (student_id, certificate_name, file_url) VALUES (?, ?, ?)',
      [studentId, certificateName, fileUrl]
    );

    res.status(201).json({
      success: true,
      message: 'Certificate uploaded successfully',
      certificate: {
        id: result.insertId,
        certificateName,
        fileUrl
      }
    });

  } catch (error) {
    console.error('Upload certificate error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete certificate
router.delete('/:id', authenticateToken, checkUserStatus, async (req, res) => {
  try {
    const { id } = req.params;

    // Get certificate info
    const [certificates] = await pool.query(
      'SELECT * FROM certificates WHERE id = ?',
      [id]
    );

    if (certificates.length === 0) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Check access
    if (req.user.role === 'student') {
      const [student] = await pool.query(
        'SELECT id FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (student.length === 0 || student[0].id !== certificates[0].student_id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    // Delete file from filesystem
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(__dirname, '..', 'uploads', 'certificates', path.basename(certificates[0].file_url));
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await pool.query('DELETE FROM certificates WHERE id = ?', [id]);

    res.json({ success: true, message: 'Certificate deleted' });

  } catch (error) {
    console.error('Delete certificate error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get certificate by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const [certificates] = await pool.query(
      'SELECT * FROM certificates WHERE id = ?',
      [id]
    );

    if (certificates.length === 0) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    // Check access
    if (req.user.role === 'student') {
      const [student] = await pool.query(
        'SELECT id FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (student.length === 0 || student[0].id !== certificates[0].student_id) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    res.json({ success: true, certificate: certificates[0] });

  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
