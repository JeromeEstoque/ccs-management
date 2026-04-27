const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdminUser() {
  let connection;
  try {
    // Connect to database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'ccs_management'
    });

    console.log('Connected to database');

    // Check if admin user exists
    const [existingAdmin] = await connection.query(
      "SELECT * FROM users WHERE (username = 'admin' OR email = 'admin') AND role = 'admin'"
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists:');
      console.log('Username:', existingAdmin[0].username);
      console.log('Email:', existingAdmin[0].email);
      console.log('Status:', existingAdmin[0].status);
      
      // Test password verification
      const isMatch = await bcrypt.compare('admin123', existingAdmin[0].password_hash);
      console.log('Password verification (admin123):', isMatch ? 'SUCCESS' : 'FAILED');
      
      if (!isMatch) {
        console.log('Updating password to admin123...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await connection.query(
          'UPDATE users SET password_hash = ?, failed_attempts = 0, locked_until = NULL WHERE id = ?',
          [hashedPassword, existingAdmin[0].id]
        );
        console.log('Password updated successfully');
      }
    } else {
      console.log('Admin user not found. Creating new admin user...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const [result] = await connection.query(`
        INSERT INTO users (username, email, password_hash, role, status) VALUES
        ('admin', 'admin', ?, 'admin', 'active')
      `, [hashedPassword]);
      
      console.log('Admin user created successfully!');
      console.log('Username: admin');
      console.log('Password: admin123');
      console.log('Email: admin');
      console.log('User ID:', result.insertId);
    }

    // Test the admin login query
    console.log('\nTesting admin login query...');
    const [testAdmin] = await connection.query(`
      SELECT u.id, u.username, u.email, u.password_hash, u.status, u.failed_attempts, u.locked_until
      FROM users u
      WHERE (u.username = ? OR u.email = ?) AND u.role = 'admin'
    `, ['admin', 'admin']);

    if (testAdmin.length > 0) {
      console.log('Admin login query SUCCESS');
      console.log('Found admin:', testAdmin[0].username);
      console.log('Status:', testAdmin[0].status);
      console.log('Failed attempts:', testAdmin[0].failed_attempts);
      console.log('Locked until:', testAdmin[0].locked_until);
    } else {
      console.log('Admin login query FAILED - no admin found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (connection) await connection.end();
  }
}

createAdminUser();
