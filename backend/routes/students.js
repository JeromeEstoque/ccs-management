const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRoles, checkUserStatus, auditLog } = require('../middleware/auth');
const { profileUpload } = require('../middleware/upload');

// Get all students (Admin, Teacher, and Student for viewing)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { yearLevel, section, status, search, skill, skillType } = req.query;
    
    // For students, only allow basic info access
    const isStudent = req.user.role === 'student';
    
    let query = isStudent ? `
      SELECT DISTINCT s.id, s.first_name, s.last_name, s.student_id, s.year_level, s.section, s.status_record
      FROM students s
      JOIN users u ON s.user_id = u.id
    ` : `
      SELECT DISTINCT s.*, u.email as user_email, u.status as user_status, u.last_login
      FROM students s
      JOIN users u ON s.user_id = u.id
    `;
    
    // Always add JOINs if skill filtering is needed
    if (skill || skillType) {
      query += `
        JOIN student_skills ss ON s.id = ss.student_id
        JOIN skills sk ON ss.skill_id = sk.id
      `;
    }
    
    query += ' WHERE 1=1';
    const params = [];

    // Use parameterized queries to prevent SQL injection
    if (yearLevel) {
      query += ' AND s.year_level = ?';
      params.push(yearLevel);
    }
    if (section) {
      query += ' AND s.section = ?';
      params.push(section);
    }
    if (status) {
      query += ' AND s.status_record = ?';
      params.push(status);
    }
    if (search) {
      // Split search term to handle first name + last name searches
      const searchTerms = search.trim().split(/\s+/);
      if (searchTerms.length >= 2) {
        // If multiple words, search for first word in first_name and second word in last_name
        query += ' AND (s.first_name LIKE ? AND s.last_name LIKE ?)';
        params.push(`%${searchTerms[0]}%`, `%${searchTerms[1]}%`);
      } else {
        // Single word search
        query += ' AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.student_id LIKE ?)';
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
      }
    }
    if (skill) {
      query += ' AND sk.name = ?';
      params.push(skill);
    }
    if (skillType) {
      query += ' AND sk.type = ?';
      params.push(skillType);
    }

    query += ' ORDER BY s.last_name, s.first_name';

    const [students] = await pool.query(query, params);
    res.json({ success: true, students });

  } catch (error) {
    console.error('Get students error:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get student by user ID (for logged-in students to get their own profile)
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check access - student can only view their own profile
    if (req.user.role === 'student' && req.user.id !== parseInt(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const [students] = await pool.query(`
      SELECT s.*, u.email as user_email, u.status as user_status
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.user_id = ?
    `, [userId]);

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = students[0];

    // Get student skills
    const [skills] = await pool.query(`
      SELECT sk.name, sk.type
      FROM student_skills ss
      JOIN skills sk ON ss.skill_id = sk.id
      WHERE ss.student_id = ?
    `, [student.id]);

    res.json({ 
      success: true, 
      student: { ...student, skills }
    });

  } catch (error) {
    console.error('Get student by user ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get student by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check access - student can only view their own profile
    if (req.user.role === 'student') {
      const [ownProfile] = await pool.query(
        'SELECT id FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (ownProfile.length === 0 || ownProfile[0].id !== parseInt(id)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const [students] = await pool.query(`
      SELECT s.*, u.email as user_email, u.status as user_status
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = ?
    `, [id]);

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Get student skills
    const [skills] = await pool.query(`
      SELECT sk.name, sk.type
      FROM student_skills ss
      JOIN skills sk ON ss.skill_id = sk.id
      WHERE ss.student_id = ?
    `, [id]);

    // Get student violations
    const [violations] = await pool.query(`
      SELECT v.*, 
        CONCAT(t.first_name, ' ', t.last_name) as encoded_by_name
      FROM violations v
      JOIN users u ON v.encoded_by = u.id
      LEFT JOIN teachers t ON t.user_id = u.id
      WHERE v.student_id = ?
      ORDER BY v.date DESC
    `, [id]);

    // Get student certificates
    const [certificates] = await pool.query(
      'SELECT * FROM certificates WHERE student_id = ?',
      [id]
    );

    // Get student achievements
    const [achievements] = await pool.query(
      'SELECT * FROM achievements WHERE student_id = ? ORDER BY date_received DESC',
      [id]
    );

    res.json({
      success: true,
      student: {
        ...students[0],
        skills,
        violations,
        certificates,
        achievements
      }
    });

  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Create new student (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), auditLog('CREATE_STUDENT'), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      studentId, password, firstName, middleName, lastName,
      birthday, gender, email, contactNumber, address,
      yearLevel, section, statusRecord, lastSchoolAttended,
      guardianName, guardianContact, medicalRecords,
      workingStudent, workType, organizationRole, classRepresentative,
      skills
    } = req.body;

    // Validate required fields
    if (!studentId || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student ID, password, first name, and last name are required' 
      });
    }

    // Check if student ID already exists
    const [existing] = await connection.query(
      'SELECT id FROM students WHERE student_id = ?',
      [studentId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Student ID already exists' });
    }

    // Create user account
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await connection.query(
      `INSERT INTO users (username, email, password_hash, role, status)
       VALUES (?, ?, ?, 'student', 'active')`,
      [studentId, email || null, hashedPassword]
    );
    const userId = userResult.insertId;

    // Calculate age from birthday
    let age = null;
    if (birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    // Create student profile
    const [studentResult] = await connection.query(
      `INSERT INTO students (
        user_id, student_id, first_name, middle_name, last_name,
        birthday, gender, email, contact_number, address,
        year_level, section, status_record, last_school_attended,
        guardian_name, guardian_contact, medical_records,
        working_student, work_type, organization_role, class_representative
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, studentId, firstName, middleName || null, lastName,
        birthday || null, gender || null, email || null, contactNumber || null, address || null,
        yearLevel || null, section || null, statusRecord || 'Regular', lastSchoolAttended || null,
        guardianName || null, guardianContact || null, medicalRecords || null,
        workingStudent || 'No', workType || null, organizationRole || 'N/A', classRepresentative || null
      ]
    );
    const newStudentId = studentResult.insertId;

    // Add skills
    if (skills && skills.length > 0) {
      for (const skillName of skills) {
        const [skillRows] = await connection.query(
          'SELECT id FROM skills WHERE name = ?',
          [skillName]
        );
        if (skillRows.length > 0) {
          await connection.query(
            'INSERT IGNORE INTO student_skills (student_id, skill_id) VALUES (?, ?)',
            [newStudentId, skillRows[0].id]
          );
        }
      }
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      studentId: newStudentId
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create student error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    connection.release();
  }
});

// Update student
router.put('/:id', authenticateToken, checkUserStatus, auditLog('UPDATE_STUDENT'), async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;

    // Check access
    if (req.user.role === 'student') {
      const [ownProfile] = await connection.query(
        'SELECT id FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (ownProfile.length === 0 || ownProfile[0].id !== parseInt(id)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    const {
      firstName, middleName, lastName, birthday, gender,
      email, contactNumber, address, yearLevel, section,
      statusRecord, lastSchoolAttended, guardianName, guardianContact,
      medicalRecords, workingStudent, workType, organizationRole,
      classRepresentative, skills
    } = req.body;

    // Build update query dynamically
    const updates = [];
    const values = [];

    if (firstName) { updates.push('first_name = ?'); values.push(firstName); }
    if (middleName !== undefined) { updates.push('middle_name = ?'); values.push(middleName); }
    if (lastName) { updates.push('last_name = ?'); values.push(lastName); }
    if (birthday) { updates.push('birthday = ?'); values.push(birthday); }
    if (gender) { updates.push('gender = ?'); values.push(gender); }
    if (email !== undefined) { updates.push('email = ?'); values.push(email); }
    if (contactNumber !== undefined) { updates.push('contact_number = ?'); values.push(contactNumber); }
    if (address !== undefined) { updates.push('address = ?'); values.push(address); }
    if (yearLevel && req.user.role !== 'student') { updates.push('year_level = ?'); values.push(yearLevel); }
    if (section && req.user.role !== 'student') { updates.push('section = ?'); values.push(section); }
    if (statusRecord && req.user.role === 'admin') { updates.push('status_record = ?'); values.push(statusRecord); }
    if (lastSchoolAttended !== undefined) { updates.push('last_school_attended = ?'); values.push(lastSchoolAttended); }
    if (guardianName !== undefined) { updates.push('guardian_name = ?'); values.push(guardianName); }
    if (guardianContact !== undefined) { updates.push('guardian_contact = ?'); values.push(guardianContact); }
    if (medicalRecords !== undefined) { updates.push('medical_records = ?'); values.push(medicalRecords); }
    if (workingStudent !== undefined) { updates.push('working_student = ?'); values.push(workingStudent); }
    if (workType !== undefined) { updates.push('work_type = ?'); values.push(workType); }
    if (organizationRole !== undefined) { updates.push('organization_role = ?'); values.push(organizationRole); }
    if (classRepresentative !== undefined) { updates.push('class_representative = ?'); values.push(classRepresentative); }

    if (updates.length > 0) {
      values.push(id);
      await connection.query(
        `UPDATE students SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    // Update skills
    if (skills && Array.isArray(skills)) {
      await connection.query('DELETE FROM student_skills WHERE student_id = ?', [id]);
      for (const skillName of skills) {
        const [skillRows] = await connection.query(
          'SELECT id FROM skills WHERE name = ?',
          [skillName]
        );
        if (skillRows.length > 0) {
          await connection.query(
            'INSERT INTO student_skills (student_id, skill_id) VALUES (?, ?)',
            [id, skillRows[0].id]
          );
        }
      }
    }

    await connection.commit();
    res.json({ success: true, message: 'Student updated successfully' });

  } catch (error) {
    await connection.rollback();
    console.error('Update student error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  } finally {
    connection.release();
  }
});

// Update profile picture
router.put('/:id/profile-picture', authenticateToken, checkUserStatus, profileUpload.single('profilePicture'), async (req, res) => {
  try {
    const { id } = req.params;

    // Check access
    if (req.user.role === 'student') {
      const [ownProfile] = await pool.query(
        'SELECT id FROM students WHERE user_id = ?',
        [req.user.id]
      );
      if (ownProfile.length === 0 || ownProfile[0].id !== parseInt(id)) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `/uploads/profiles/${req.file.filename}`;

    await pool.query(
      'UPDATE students SET profile_picture = ? WHERE id = ?',
      [fileUrl, id]
    );

    res.json({ success: true, message: 'Profile picture updated', fileUrl });

  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete student (Admin only)
router.delete('/:id', authenticateToken, authorizeRoles('admin'), auditLog('DELETE_STUDENT'), async (req, res) => {
  try {
    const { id } = req.params;

    // Get user_id before deleting
    const [students] = await pool.query('SELECT user_id FROM students WHERE id = ?', [id]);
    
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Delete user (will cascade delete student)
    await pool.query('DELETE FROM users WHERE id = ?', [students[0].user_id]);

    res.json({ success: true, message: 'Student deleted successfully' });

  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Reset student password (Admin only)
router.post('/:id/reset-password', authenticateToken, authorizeRoles('admin'), auditLog('RESET_STUDENT_PASSWORD'), async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Password must be at least 6 characters' 
      });
    }

    // Get user_id
    const [students] = await pool.query('SELECT user_id FROM students WHERE id = ?', [id]);
    
    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password_hash = ?, failed_attempts = 0, locked_until = NULL WHERE id = ?',
      [hashedPassword, students[0].user_id]
    );

    res.json({ success: true, message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get students by section (Teacher and Admin)
router.get('/section/:section', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  try {
    const { section } = req.params;
    
    const [students] = await pool.query(`
      SELECT s.id, s.student_id, s.first_name, s.middle_name, s.last_name,
             s.year_level, s.section, s.status_record, s.profile_picture
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.section = ? AND u.status = 'active'
      ORDER BY s.last_name, s.first_name
    `, [section]);

    res.json({ success: true, students });

  } catch (error) {
    console.error('Get students by section error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get available skills
router.get('/skills/list', authenticateToken, async (req, res) => {
  try {
    const [skills] = await pool.query('SELECT * FROM skills ORDER BY type, name');
    res.json({ success: true, skills });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
