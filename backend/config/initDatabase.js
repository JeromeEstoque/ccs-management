const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  let connection;
  try {
    // Connect without database to create it if not exists
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: parseInt(process.env.DB_PORT) || 3306
    });

    console.log('Connected to MySQL server');

    // Create database if not exists
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'ccs_management'}`);
    console.log(`Database '${process.env.DB_NAME || 'ccs_management'}' created or already exists`);

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'ccs_management'}`);

    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE,
        email VARCHAR(100) UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('student', 'teacher', 'admin') NOT NULL,
        status ENUM('active', 'inactive') DEFAULT 'active',
        failed_attempts INT DEFAULT 0,
        locked_until DATETIME NULL,
        last_login DATETIME NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created');

    // Create Students table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        student_id VARCHAR(20) UNIQUE NOT NULL,
        profile_picture VARCHAR(255),
        first_name VARCHAR(50) NOT NULL,
        middle_name VARCHAR(50),
        last_name VARCHAR(50) NOT NULL,
        birthday DATE,
        gender ENUM('Male', 'Female', 'Other'),
        email VARCHAR(100),
        contact_number VARCHAR(20),
        address TEXT,
        year_level ENUM('1st Year', '2nd Year', '3rd Year', '4th Year'),
        section VARCHAR(20),
        status_record ENUM('Regular', 'Irregular', 'Drop Out') DEFAULT 'Regular',
        last_school_attended VARCHAR(255),
        guardian_name VARCHAR(100),
        guardian_contact VARCHAR(20),
        medical_records TEXT,
        working_student ENUM('Yes', 'No') DEFAULT 'No',
        work_type VARCHAR(100),
        organization_role ENUM('N/A', 'President', 'Vice President', 'Member', 'Treasurer', 'Secretary') DEFAULT 'N/A',
        class_representative VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Students table created');

    // Create Teachers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        profile_picture VARCHAR(255),
        first_name VARCHAR(50) NOT NULL,
        middle_name VARCHAR(50),
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        gender ENUM('Male', 'Female', 'Other'),
        section_advisory VARCHAR(20),
        courses_handled TEXT,
        organization_department VARCHAR(100),
        position ENUM('Dean', 'Chairman', 'Instructor', 'Adviser') DEFAULT 'Instructor',
        years_of_service INT DEFAULT 0,
        employment_status ENUM('Full Time', 'Part Time') DEFAULT 'Full Time',
        degree VARCHAR(100),
        university VARCHAR(100),
        year_graduated INT,
        capstone_adviser_available BOOLEAN DEFAULT FALSE,
        capstone_schedule TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Teachers table created');

    // Create Skills table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        type ENUM('technical', 'sport') NOT NULL
      )
    `);
    console.log('Skills table created');

    // Create Student Skills junction table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS student_skills (
        student_id INT NOT NULL,
        skill_id INT NOT NULL,
        PRIMARY KEY (student_id, skill_id),
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
      )
    `);
    console.log('Student Skills table created');

    // Create Teacher Expertise junction table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teacher_expertise (
        teacher_id INT NOT NULL,
        expertise VARCHAR(50) NOT NULL,
        PRIMARY KEY (teacher_id, expertise),
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
      )
    `);
    console.log('Teacher Expertise table created');

    // Create Violations table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS violations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        violation_type VARCHAR(100) NOT NULL,
        remarks TEXT,
        status ENUM('Pending', 'Resolved') DEFAULT 'Pending',
        date DATE NOT NULL,
        encoded_by INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (encoded_by) REFERENCES users(id)
      )
    `);
    console.log('Violations table created');

    // Create Certificates table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        certificate_name VARCHAR(255) NOT NULL,
        file_url VARCHAR(255),
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);
    console.log('Certificates table created');

    // Create Achievements table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        achievement_type VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date_received DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);
    console.log('Achievements table created');

    // Create Capstone Groups table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS capstone_groups (
        id INT AUTO_INCREMENT PRIMARY KEY,
        adviser_id INT NOT NULL,
        group_name VARCHAR(100) NOT NULL,
        status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
        request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        approval_date DATETIME,
        FOREIGN KEY (adviser_id) REFERENCES teachers(id) ON DELETE CASCADE
      )
    `);
    console.log('Capstone Groups table created');

    // Create Capstone Group Members table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS capstone_group_members (
        group_id INT NOT NULL,
        student_id INT NOT NULL,
        PRIMARY KEY (group_id, student_id),
        FOREIGN KEY (group_id) REFERENCES capstone_groups(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
      )
    `);
    console.log('Capstone Group Members table created');

    // Create Audit Logs table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(100) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('Audit Logs table created');

    // Insert default skills
    const [skillsCheck] = await connection.query('SELECT COUNT(*) as count FROM skills');
    if (skillsCheck[0].count === 0) {
      await connection.query(`
        INSERT INTO skills (name, type) VALUES
        ('Programming', 'technical'),
        ('Networking', 'technical'),
        ('Database', 'technical'),
        ('UI/UX', 'technical'),
        ('Cybersecurity', 'technical'),
        ('Basketball', 'sport'),
        ('Volleyball', 'sport'),
        ('Esports', 'sport'),
        ('Chess', 'sport')
      `);
      console.log('Default skills inserted');
    }

    // Create default admin user
    const [adminCheck] = await connection.query("SELECT COUNT(*) as count FROM users WHERE role = 'admin'");
    if (adminCheck[0].count === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.query(`
        INSERT INTO users (username, email, password_hash, role, status) VALUES
        ('admin', 'admin', ?, 'admin', 'active')
      `, [hashedPassword]);
      console.log('Default admin user created (username: admin, password: admin123)');
    }

    console.log('\n✅ Database initialization completed successfully!');
    console.log('Default admin credentials: username=admin, password=admin123');

  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

// Run initialization
initializeDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
