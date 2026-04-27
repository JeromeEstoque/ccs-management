const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { authenticateToken, authorizeRoles, checkUserStatus } = require('../middleware/auth');

// Get dashboard statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const role = req.user.role;
    let stats = {};

    if (role === 'admin') {
      // Admin dashboard stats
      const [studentCount] = await pool.query('SELECT COUNT(*) as count FROM students');
      const [teacherCount] = await pool.query('SELECT COUNT(*) as count FROM teachers');
      
      const [studentsPerYear] = await pool.query(`
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

      const [violationsSummary] = await pool.query(`
        SELECT status, COUNT(*) as count
        FROM violations
        GROUP BY status
      `);

      const [facultyEmployment] = await pool.query(`
        SELECT employment_status, COUNT(*) as count
        FROM teachers
        GROUP BY employment_status
      `);

      const [capstoneAdvisers] = await pool.query(`
        SELECT COUNT(*) as count
        FROM teachers
        WHERE capstone_adviser_available = TRUE
      `);

      const [recentViolations] = await pool.query(`
        SELECT v.*, s.student_id, s.first_name, s.last_name
        FROM violations v
        JOIN students s ON v.student_id = s.id
        ORDER BY v.created_at DESC
        LIMIT 5
      `);

      stats = {
        totalStudents: studentCount[0].count,
        totalTeachers: teacherCount[0].count,
        studentsPerYear,
        violationsSummary,
        facultyEmployment,
        capstoneAdvisersAvailable: capstoneAdvisers[0].count,
        recentViolations
      };

    } else if (role === 'teacher') {
      // Teacher dashboard stats
      const [teacher] = await pool.query(
        'SELECT * FROM teachers WHERE user_id = ?',
        [req.user.id]
      );

      if (teacher.length > 0) {
        // Advisory students count
        const [advisoryCount] = await pool.query(
          'SELECT COUNT(*) as count FROM students WHERE section = ?',
          [teacher[0].section_advisory]
        );

        // Violations encoded
        const [violationsEncoded] = await pool.query(
          'SELECT COUNT(*) as count FROM violations WHERE encoded_by = ?',
          [req.user.id]
        );

        // Capstone requests
        const [capstoneRequests] = await pool.query(`
          SELECT COUNT(*) as count
          FROM capstone_groups
          WHERE adviser_id = ? AND status = 'Pending'
        `, [teacher[0].id]);

        // Recent violations by this teacher
        const [recentViolations] = await pool.query(`
          SELECT v.*, s.student_id, s.first_name, s.last_name
          FROM violations v
          JOIN students s ON v.student_id = s.id
          WHERE v.encoded_by = ?
          ORDER BY v.created_at DESC
          LIMIT 5
        `, [req.user.id]);

        stats = {
          advisorySection: teacher[0].section_advisory,
          advisoryCount: advisoryCount[0].count,
          violationsEncoded: violationsEncoded[0].count,
          capstoneRequests: capstoneRequests[0].count,
          isCapstoneAdviser: teacher[0].capstone_adviser_available,
          recentViolations
        };
      }

    } else if (role === 'student') {
      // Student dashboard stats
      const [student] = await pool.query(`
        SELECT s.*, 
          (SELECT COUNT(*) FROM violations v WHERE v.student_id = s.id AND v.status = 'Pending') as pending_violations,
          (SELECT COUNT(*) FROM certificates c WHERE c.student_id = s.id) as certificate_count,
          (SELECT COUNT(*) FROM achievements a WHERE a.student_id = s.id) as achievement_count
        FROM students s
        WHERE s.user_id = ?
      `, [req.user.id]);

      if (student.length > 0) {
        // Get skills
        const [skills] = await pool.query(`
          SELECT sk.name, sk.type
          FROM student_skills ss
          JOIN skills sk ON ss.skill_id = sk.id
          WHERE ss.student_id = ?
        `, [student[0].id]);

        // Recent violations
        const [recentViolations] = await pool.query(`
          SELECT * FROM violations
          WHERE student_id = ?
          ORDER BY date DESC
          LIMIT 3
        `, [student[0].id]);

        stats = {
          profile: student[0],
          skills,
          pendingViolations: student[0].pending_violations,
          certificateCount: student[0].certificate_count,
          achievementCount: student[0].achievement_count,
          recentViolations
        };
      }
    }

    res.json({ success: true, stats });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get chart data for admin
router.get('/charts/students-per-year', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [data] = await pool.query(`
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

    res.json({ success: true, data });

  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/charts/violations-summary', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM violations
      GROUP BY status
    `);

    res.json({ success: true, data });

  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/charts/faculty-employment', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT employment_status, COUNT(*) as count
      FROM teachers
      GROUP BY employment_status
    `);

    res.json({ success: true, data });

  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/charts/violations-by-section', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT s.section, COUNT(*) as count
      FROM violations v
      JOIN students s ON v.student_id = s.id
      WHERE s.section IS NOT NULL AND s.section != ''
      GROUP BY s.section
      ORDER BY count DESC
      LIMIT 10
    `);

    res.json({ success: true, data });

  } catch (error) {
    console.error('Get chart data error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
