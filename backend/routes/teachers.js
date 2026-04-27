const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const {
  authenticateToken,
  authorizeRoles,
  checkUserStatus,
  auditLog,
} = require("../middleware/auth");
const { profileUpload } = require("../middleware/upload");

// Get all teachers (Admin, Teacher, and Student for viewing)
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { position, employmentStatus, search, capstoneAdvising, department } =
      req.query;

    // For students and teachers, only allow basic info access
    const isStudentOrTeacher =
      req.user.role === "student" || req.user.role === "teacher";

    let query = isStudentOrTeacher
      ? `
      SELECT t.id, t.first_name, t.last_name, t.email, t.position, t.employment_status, 
             t.section_advisory, t.years_of_service, t.courses_handled,
             t.capstone_adviser_available, t.capstone_schedule
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `
      : `
      SELECT t.*, u.email as user_email, u.status as user_status, u.last_login
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (position) {
      query += " AND t.position = ?";
      params.push(position);
    }
    if (employmentStatus) {
      query += " AND t.employment_status = ?";
      params.push(employmentStatus);
    }
    if (department) {
      query +=
        " AND (t.organization_department LIKE ? OR t.section_advisory LIKE ?)";
      params.push(`%${department}%`, `%${department}%`);
    }
    if (capstoneAdvising) {
      if (capstoneAdvising === "available") {
        query += " AND t.capstone_adviser_available = TRUE";
      } else if (capstoneAdvising === "unavailable") {
        query += " AND t.capstone_adviser_available = FALSE";
      }
    }
    if (search) {
      query +=
        " AND (t.first_name LIKE ? OR t.last_name LIKE ? OR t.email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += " ORDER BY t.last_name, t.first_name";

    const [teachers] = await pool.query(query, params);
    res.json({ success: true, teachers });
  } catch (error) {
    console.error("Get teachers error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get teacher by user ID (for logged-in teachers to get their own profile or admins to access any teacher profile)
router.get("/user/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check access - admin can view any profile, teacher can only view their own profile
    if (req.user.role === "admin") {
      // Admins can access any teacher profile
    } else if (
      req.user.role === "teacher" &&
      req.user.id !== parseInt(userId)
    ) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied - teachers can only view their own profile",
        });
    } else if (req.user.role === "student") {
      return res
        .status(403)
        .json({
          success: false,
          message: "Access denied - students cannot view teacher profiles",
        });
    }

    const [teachers] = await pool.query(
      `
      SELECT t.*, u.email as user_email, u.status as user_status
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.user_id = ?
    `,
      [userId],
    );

    if (teachers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    const teacher = teachers[0];

    // Get teacher expertise
    const [expertise] = await pool.query(
      "SELECT expertise FROM teacher_expertise WHERE teacher_id = ?",
      [teacher.id],
    );

    res.json({
      success: true,
      teacher: {
        ...teacher,
        expertise: expertise.map((e) => e.expertise),
      },
    });
  } catch (error) {
    console.error("Get teacher by user ID error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get teacher by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check access - teacher can only view their own profile
    if (req.user.role === "teacher") {
      const [ownProfile] = await pool.query(
        "SELECT id FROM teachers WHERE user_id = ?",
        [req.user.id],
      );
      if (ownProfile.length === 0 || ownProfile[0].id !== parseInt(id)) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied" });
      }
    }

    const [teachers] = await pool.query(
      `
      SELECT t.*, u.email as user_email, u.status as user_status
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = ?
    `,
      [id],
    );

    if (teachers.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Teacher not found" });
    }

    // Get teacher expertise
    const [expertise] = await pool.query(
      "SELECT expertise FROM teacher_expertise WHERE teacher_id = ?",
      [id],
    );

    // Get capstone groups if adviser
    const [capstoneGroups] = await pool.query(
      `
      SELECT cg.*, 
        COUNT(cgm.student_id) as member_count
      FROM capstone_groups cg
      LEFT JOIN capstone_group_members cgm ON cg.id = cgm.group_id
      WHERE cg.adviser_id = ?
      GROUP BY cg.id
      ORDER BY cg.request_date DESC
    `,
      [id],
    );

    res.json({
      success: true,
      teacher: {
        ...teachers[0],
        expertise: expertise.map((e) => e.expertise),
        capstoneGroups,
      },
    });
  } catch (error) {
    console.error("Get teacher error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Create new teacher (Admin only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("admin"),
  auditLog("CREATE_TEACHER"),
  async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        email,
        password,
        firstName,
        middleName,
        lastName,
        gender,
        sectionAdvisory,
        coursesHandled,
        organizationDepartment,
        position,
        yearsOfService,
        employmentStatus,
        degree,
        university,
        yearGraduated,
        capstoneAdviserAvailable,
        capstoneSchedule,
        expertise,
      } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: "Email, password, first name, and last name are required",
        });
      }

      // Check if email already exists
      const [existingUser] = await connection.query(
        "SELECT id FROM users WHERE email = ?",
        [email],
      );
      if (existingUser.length > 0) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }

      // Create user account
      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(password, 10);

      const [userResult] = await connection.query(
        `INSERT INTO users (username, email, password_hash, role, status)
       VALUES (?, ?, ?, 'teacher', 'active')`,
        [email, email, hashedPassword],
      );
      const userId = userResult.insertId;

      // Create teacher profile
      const [teacherResult] = await connection.query(
        `INSERT INTO teachers (
        user_id, first_name, middle_name, last_name, email, gender,
        section_advisory, courses_handled, organization_department,
        position, years_of_service, employment_status, degree,
        university, year_graduated, capstone_adviser_available, capstone_schedule
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          firstName,
          middleName || null,
          lastName,
          email,
          gender || null,
          sectionAdvisory || null,
          coursesHandled || null,
          organizationDepartment || null,
          position || "Instructor",
          yearsOfService || 0,
          employmentStatus || "Full Time",
          degree || null,
          university || null,
          yearGraduated || null,
          capstoneAdviserAvailable || false,
          capstoneSchedule || null,
        ],
      );
      const newTeacherId = teacherResult.insertId;

      // Add expertise
      if (expertise && expertise.length > 0) {
        for (const exp of expertise) {
          await connection.query(
            "INSERT IGNORE INTO teacher_expertise (teacher_id, expertise) VALUES (?, ?)",
            [newTeacherId, exp],
          );
        }
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: "Teacher created successfully",
        teacherId: newTeacherId,
      });
    } catch (error) {
      await connection.rollback();
      console.error("Create teacher error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } finally {
      connection.release();
    }
  },
);

// Update teacher
router.put(
  "/:id",
  authenticateToken,
  checkUserStatus,
  auditLog("UPDATE_TEACHER"),
  async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const { id } = req.params;

      // Check access
      if (req.user.role === "teacher") {
        const [ownProfile] = await connection.query(
          "SELECT id FROM teachers WHERE user_id = ?",
          [req.user.id],
        );
        if (ownProfile.length === 0 || ownProfile[0].id !== parseInt(id)) {
          return res
            .status(403)
            .json({ success: false, message: "Access denied" });
        }
      }

      const {
        firstName,
        middleName,
        lastName,
        gender,
        email,
        sectionAdvisory,
        coursesHandled,
        organizationDepartment,
        position,
        yearsOfService,
        employmentStatus,
        degree,
        university,
        yearGraduated,
        capstoneAdviserAvailable,
        capstoneSchedule,
        expertise,
      } = req.body;

      // Build update query dynamically
      const updates = [];
      const values = [];

      if (firstName) {
        updates.push("first_name = ?");
        values.push(firstName);
      }
      if (middleName !== undefined) {
        updates.push("middle_name = ?");
        values.push(middleName);
      }
      if (lastName) {
        updates.push("last_name = ?");
        values.push(lastName);
      }
      if (gender) {
        updates.push("gender = ?");
        values.push(gender);
      }
      if (email) {
        updates.push("email = ?");
        values.push(email);
      }
      if (sectionAdvisory !== undefined) {
        updates.push("section_advisory = ?");
        values.push(sectionAdvisory);
      }
      if (coursesHandled !== undefined) {
        updates.push("courses_handled = ?");
        values.push(coursesHandled);
      }
      if (organizationDepartment !== undefined) {
        updates.push("organization_department = ?");
        values.push(organizationDepartment);
      }
      if (position) {
        updates.push("position = ?");
        values.push(position);
      }
      if (yearsOfService !== undefined) {
        updates.push("years_of_service = ?");
        values.push(yearsOfService);
      }
      if (employmentStatus && req.user.role === "admin") {
        updates.push("employment_status = ?");
        values.push(employmentStatus);
      }
      if (degree !== undefined) {
        updates.push("degree = ?");
        values.push(degree);
      }
      if (university !== undefined) {
        updates.push("university = ?");
        values.push(university);
      }
      if (yearGraduated !== undefined) {
        updates.push("year_graduated = ?");
        values.push(yearGraduated);
      }
      if (capstoneAdviserAvailable !== undefined) {
        updates.push("capstone_adviser_available = ?");
        values.push(capstoneAdviserAvailable);
      }
      if (capstoneSchedule !== undefined) {
        updates.push("capstone_schedule = ?");
        values.push(capstoneSchedule);
      }

      if (updates.length > 0) {
        values.push(id);
        await connection.query(
          `UPDATE teachers SET ${updates.join(", ")} WHERE id = ?`,
          values,
        );
      }

      // Update expertise
      if (expertise && Array.isArray(expertise)) {
        await connection.query(
          "DELETE FROM teacher_expertise WHERE teacher_id = ?",
          [id],
        );
        for (const exp of expertise) {
          await connection.query(
            "INSERT INTO teacher_expertise (teacher_id, expertise) VALUES (?, ?)",
            [id, exp],
          );
        }
      }

      await connection.commit();
      res.json({ success: true, message: "Teacher updated successfully" });
    } catch (error) {
      await connection.rollback();
      console.error("Update teacher error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    } finally {
      connection.release();
    }
  },
);

// Update profile picture
router.put(
  "/:id/profile-picture",
  authenticateToken,
  checkUserStatus,
  profileUpload.single("profilePicture"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Check access
      if (req.user.role === "teacher") {
        const [ownProfile] = await pool.query(
          "SELECT id FROM teachers WHERE user_id = ?",
          [req.user.id],
        );
        if (ownProfile.length === 0 || ownProfile[0].id !== parseInt(id)) {
          return res
            .status(403)
            .json({ success: false, message: "Access denied" });
        }
      }

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

      const fileUrl = `/uploads/profiles/${req.file.filename}`;

      await pool.query("UPDATE teachers SET profile_picture = ? WHERE id = ?", [
        fileUrl,
        id,
      ]);

      res.json({ success: true, message: "Profile picture updated", fileUrl });
    } catch (error) {
      console.error("Update profile picture error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

// Delete teacher (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("admin"),
  auditLog("DELETE_TEACHER"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Get user_id before deleting
      const [teachers] = await pool.query(
        "SELECT user_id FROM teachers WHERE id = ?",
        [id],
      );

      if (teachers.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Teacher not found" });
      }

      // Delete user (will cascade delete teacher)
      await pool.query("DELETE FROM users WHERE id = ?", [teachers[0].user_id]);

      res.json({ success: true, message: "Teacher deleted successfully" });
    } catch (error) {
      console.error("Delete teacher error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

// Reset teacher password (Admin only)
router.post(
  "/:id/reset-password",
  authenticateToken,
  authorizeRoles("admin"),
  auditLog("RESET_TEACHER_PASSWORD"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;

      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }

      // Get user_id
      const [teachers] = await pool.query(
        "SELECT user_id FROM teachers WHERE id = ?",
        [id],
      );

      if (teachers.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Teacher not found" });
      }

      const bcrypt = require("bcryptjs");
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await pool.query(
        "UPDATE users SET password_hash = ?, failed_attempts = 0, locked_until = NULL WHERE id = ?",
        [hashedPassword, teachers[0].user_id],
      );

      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

// Toggle capstone adviser availability
router.put(
  "/:id/capstone-availability",
  authenticateToken,
  authorizeRoles("teacher", "admin"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { available, schedule } = req.body;

      // Teacher can only update their own availability
      if (req.user.role === "teacher") {
        const [ownProfile] = await pool.query(
          "SELECT id FROM teachers WHERE user_id = ?",
          [req.user.id],
        );
        if (ownProfile.length === 0 || ownProfile[0].id !== parseInt(id)) {
          return res
            .status(403)
            .json({ success: false, message: "Access denied" });
        }
      }

      await pool.query(
        "UPDATE teachers SET capstone_adviser_available = ?, capstone_schedule = ? WHERE id = ?",
        [available, schedule || null, id],
      );

      res.json({ success: true, message: "Capstone availability updated" });
    } catch (error) {
      console.error("Update capstone availability error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

// Get capstone requests for teacher
router.get(
  "/:id/capstone-requests",
  authenticateToken,
  authorizeRoles("teacher", "admin"),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Teacher can only view their own requests
      if (req.user.role === "teacher") {
        const [ownProfile] = await pool.query(
          "SELECT id FROM teachers WHERE user_id = ?",
          [req.user.id],
        );
        if (ownProfile.length === 0 || ownProfile[0].id !== parseInt(id)) {
          return res
            .status(403)
            .json({ success: false, message: "Access denied" });
        }
      }

      const [requests] = await pool.query(
        `
      SELECT cg.*,
        GROUP_CONCAT(CONCAT(s.first_name, ' ', s.last_name) SEPARATOR ', ') as members
      FROM capstone_groups cg
      LEFT JOIN capstone_group_members cgm ON cg.id = cgm.group_id
      LEFT JOIN students s ON cgm.student_id = s.id
      WHERE cg.adviser_id = ?
      GROUP BY cg.id
      ORDER BY 
        CASE cg.status 
          WHEN 'Pending' THEN 1 
          WHEN 'Approved' THEN 2 
          ELSE 3 
        END,
        cg.request_date DESC
    `,
        [id],
      );

      res.json({ success: true, requests });
    } catch (error) {
      console.error("Get capstone requests error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

// Approve/Reject capstone request
router.put(
  "/capstone-requests/:groupId",
  authenticateToken,
  authorizeRoles("teacher", "admin"),
  async (req, res) => {
    try {
      const { groupId } = req.params;
      const { status } = req.body;

      if (!["Approved", "Rejected"].includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status" });
      }

      // Verify teacher owns this request
      if (req.user.role === "teacher") {
        const [teacher] = await pool.query(
          "SELECT id FROM teachers WHERE user_id = ?",
          [req.user.id],
        );
        const [group] = await pool.query(
          "SELECT adviser_id FROM capstone_groups WHERE id = ?",
          [groupId],
        );
        if (group.length === 0 || group[0].adviser_id !== teacher[0].id) {
          return res
            .status(403)
            .json({ success: false, message: "Access denied" });
        }
      }

      await pool.query(
        "UPDATE capstone_groups SET status = ?, approval_date = NOW() WHERE id = ?",
        [status, groupId],
      );

      res.json({
        success: true,
        message: `Capstone request ${status.toLowerCase()}`,
      });
    } catch (error) {
      console.error("Update capstone request error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

// Get available capstone advisers
router.get(
  "/capstone-advisers/available",
  authenticateToken,
  async (req, res) => {
    try {
      const [advisers] = await pool.query(`
      SELECT t.id, t.first_name, t.last_name, t.position, 
             t.capstone_schedule, t.organization_department,
             GROUP_CONCAT(te.expertise) as expertise
      FROM teachers t
      LEFT JOIN teacher_expertise te ON t.id = te.teacher_id
      WHERE t.capstone_adviser_available = TRUE
      GROUP BY t.id
      ORDER BY t.last_name, t.first_name
    `);

      res.json({ success: true, advisers });
    } catch (error) {
      console.error("Get capstone advisers error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

module.exports = router;
