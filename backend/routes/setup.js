const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/database');

// Setup admin user in production database
router.post('/admin', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    
    console.log('Setting up admin user in production database...');

    // Create users table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE,
        email VARCHAR(150) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'teacher', 'student') NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        failed_attempts INT DEFAULT 0,
        locked_until DATETIME NULL,
        last_login DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create students table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE,
        student_id VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create teachers table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT UNIQUE,
        employee_id VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        position VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Check if admin user exists
    const [existingAdmin] = await connection.query(
      "SELECT * FROM users WHERE (username = 'admin' OR email = 'admin') AND role = 'admin'"
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists in production database');
      
      // Test password verification
      const isMatch = await bcrypt.compare('admin123', existingAdmin[0].password_hash);
      
      if (!isMatch) {
        console.log('Updating admin password...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await connection.query(
          'UPDATE users SET password_hash = ?, failed_attempts = 0, locked_until = NULL WHERE id = ?',
          [hashedPassword, existingAdmin[0].id]
        );
        console.log('Admin password updated successfully');
      }
    } else {
      console.log('Creating admin user in production database...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const [result] = await connection.query(`
        INSERT INTO users (username, email, password_hash, role, status) VALUES
        ('admin', 'admin', ?, 'admin', 'active')
      `, [hashedPassword]);
      
      console.log('Admin user created successfully in production database');
    }

    // Test admin login
    const [testAdmin] = await connection.query(`
      SELECT u.id, u.username, u.email, u.password_hash, u.status, u.failed_attempts, u.locked_until
      FROM users u
      WHERE (u.username = ? OR u.email = ?) AND u.role = 'admin'
    `, ['admin', 'admin']);

    if (testAdmin.length > 0) {
      const passwordTest = await bcrypt.compare('admin123', testAdmin[0].password_hash);
      
      if (passwordTest) {
        res.json({
          success: true,
          message: 'Admin setup completed successfully',
          credentials: {
            username: 'admin',
            password: 'admin123'
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Admin setup failed - password verification error'
        });
      }
    } else {
      res.status(500).json({
        success: false,
        message: 'Admin setup failed - admin not found after creation'
      });
    }

  } catch (error) {
    console.error('Admin setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Admin setup failed',
      error: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
