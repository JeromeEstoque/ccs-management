const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database connection
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ccs_management_system',
    multipleStatements: true
};

// Sample data for generating teachers
const firstNames = {
    male: ['John', 'Michael', 'David', 'Robert', 'James', 'William', 'Richard', 'Joseph', 'Thomas', 'Charles', 
           'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kevin',
           'Brian', 'George', 'Edward', 'Ronald', 'Timothy', 'Jason', 'Jeffrey', 'Ryan', 'Jacob', 'Gary',
           'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel',
           'Gregory', 'Frank', 'Alexander', 'Patrick', 'Raymond', 'Jack', 'Dennis', 'Jerry', 'Tyler', 'Aaron'],
    female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
             'Lisa', 'Nancy', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle',
             'Laura', 'Sarah', 'Kimberly', 'Deborah', 'Dorothy', 'Amy', 'Angela', 'Ashley', 'Brenda', 'Emma',
             'Olivia', 'Cynthia', 'Marie', 'Janet', 'Catherine', 'Frances', 'Heather', 'Tiffany', 'Christina', 'Samantha',
             'Debra', 'Rachel', 'Victoria', 'Stephanie', 'Rebecca', 'Emily', 'Megan', 'Anita', 'Crystal', 'Joyce']
};

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
                   'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
                   'Lee', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Young',
                   'Allen', 'King', 'Wright', 'Hall', 'Scott', 'Green', 'Adams', 'Baker', 'Nelson', 'Carter',
                   'Mitchell', 'Perez', 'Roberts', 'Turner', 'Phillips', 'Campbell', 'Parker', 'Evans', 'Edwards', 'Collins'];

const middleNames = ['Marie', 'James', 'Lynn', 'Grace', 'Rose', 'Ann', 'Lee', 'John', 'Paul', 'Jane',
                     'Michael', 'Elizabeth', 'David', 'Anne', 'Robert', 'Mary', 'William', 'Sue', 'Joseph', 'Kathleen'];

const positions = ['Professor', 'Associate Professor', 'Assistant Professor', 'Instructor', 'Lecturer', 'Senior Lecturer'];

const specializations = [
    'Web Development and Database Systems',
    'Artificial Intelligence and Machine Learning',
    'Network Security and Cybersecurity',
    'Mobile Development and UI/UX Design',
    'Software Engineering and Architecture',
    'Data Science and Analytics',
    'Cloud Computing and DevOps',
    'Game Development and Computer Graphics',
    'Blockchain and Distributed Systems',
    'Internet of Things (IoT) and Embedded Systems',
    'Computer Networks and Communications',
    'Algorithm Design and Analysis',
    'Computer Vision and Image Processing',
    'Natural Language Processing',
    'Big Data Engineering',
    'Cybersecurity and Digital Forensics',
    'Mobile Application Development',
    'Enterprise Software Development',
    'Database Administration and Design',
    'Full-Stack Web Development'
];

const cities = ['Quezon City', 'Makati City', 'Pasig City', 'Mandaluyong City', 'San Juan City', 
                'Pasay City', 'Caloocan City', 'Malabon City', 'Navotas City', 'San Jose del Monte',
                'Bacoor City', 'Cavite City', 'Tagaytay City', 'Lipa City', 'Batangas City'];

const streets = ['University Ave', 'Faculty St', 'Campus Rd', 'College Blvd', 'Academic Lane', 
                'Scholar Drive', 'Professor Way', 'Learning Street', 'Education Road', 'Institute Avenue'];

// Generate random teacher data
function generateTeacher(index) {
    const gender = Math.random() > 0.5 ? 'male' : 'female';
    const firstNameList = firstNames[gender];
    const firstName = firstNameList[Math.floor(Math.random() * firstNameList.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const middleName = middleNames[Math.floor(Math.random() * middleNames.length)];
    
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@ccs.edu`;
    
    const genderFull = gender.charAt(0).toUpperCase() + gender.slice(1);
    
    const position = ['Dean', 'Chairman', 'Instructor', 'Adviser'][Math.floor(Math.random() * 4)];
    const organization_department = 'College of Computer Studies';
    const specialization = specializations[Math.floor(Math.random() * specializations.length)];
    
    // Generate years of service (1-30 years)
    const yearsOfService = Math.floor(Math.random() * 30) + 1;
    
    const employmentStatus = Math.random() > 0.2 ? 'Full Time' : 'Part Time';
    
    // Generate degree (BSIT/BSCS focused with advanced degrees)
    const degrees = [
        'BS in Computer Science', 'BS in Information Technology', 
        'MS in Computer Science', 'MS in Information Technology',
        'PhD in Computer Science', 'PhD in Information Technology',
        'BS Computer Science', 'BS Information Technology'
    ];
    const degree = degrees[Math.floor(Math.random() * degrees.length)];
    
    // Generate university
    const universities = [
        'University of the Philippines', 'De La Salle University', 
        'Ateneo de Manila University', 'University of Santo Tomas',
        'Mapua University', 'Technological University of the Philippines',
        'Polytechnic University of the Philippines', 'Adamson University'
    ];
    const university = universities[Math.floor(Math.random() * universities.length)];
    
    // Generate graduation year (based on years of service)
    const currentYear = new Date().getFullYear();
    const yearGraduated = currentYear - yearsOfService - Math.floor(Math.random() * 10) - 22;
    
    const sectionAdvisory = Math.random() > 0.3 ? 
        `${Math.random() > 0.5 ? 'BSIT' : 'BSCS'}-${Math.floor(Math.random() * 4) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 3))}` : 
        null;
    
    const coursesHandled = Math.random() > 0.2 ? specialization : null;
    const capstoneAdviserAvailable = Math.random() > 0.4 ? 1 : 0;
    
    const capstoneSchedule = capstoneAdviserAvailable ? 
        `${['MWF', 'TTH', 'MW', 'WF'][Math.floor(Math.random() * 4)]} ${Math.floor(Math.random() * 12) + 8}:00 - ${Math.floor(Math.random() * 12) + 10}:00` : 
        null;
    
    return {
        firstName,
        middleName,
        lastName,
        email,
        gender: genderFull,
        sectionAdvisory,
        coursesHandled,
        organization_department,
        position,
        yearsOfService,
        employmentStatus,
        degree,
        university,
        yearGraduated,
        capstoneAdviserAvailable,
        capstoneSchedule
    };
}

// Generate expertise areas for teachers
function generateExpertiseAreas(specialization) {
    const expertiseMap = {
        'Web Development and Database Systems': ['Web Development', 'Database Management', 'Software Engineering', 'Frontend Development'],
        'Artificial Intelligence and Machine Learning': ['Machine Learning', 'Data Science', 'Python Programming', 'Deep Learning'],
        'Network Security and Cybersecurity': ['Cybersecurity', 'Network Security', 'Information Security', 'Ethical Hacking'],
        'Mobile Development and UI/UX Design': ['Mobile Development', 'UI/UX Design', 'React Native', 'Flutter'],
        'Software Engineering and Architecture': ['Software Engineering', 'System Architecture', 'Design Patterns', 'Agile Methodologies'],
        'Data Science and Analytics': ['Data Science', 'Analytics', 'Statistical Analysis', 'Data Visualization'],
        'Cloud Computing and DevOps': ['Cloud Computing', 'DevOps', 'AWS/Azure', 'Containerization'],
        'Game Development and Computer Graphics': ['Game Development', 'Computer Graphics', 'Unity', 'OpenGL'],
        'Blockchain and Distributed Systems': ['Blockchain', 'Distributed Systems', 'Cryptography', 'Smart Contracts'],
        'Internet of Things (IoT) and Embedded Systems': ['IoT', 'Embedded Systems', 'Arduino', 'Raspberry Pi'],
        'Computer Networks and Communications': ['Computer Networks', 'Network Protocols', 'TCP/IP', 'Wireless Communications'],
        'Algorithm Design and Analysis': ['Algorithms', 'Data Structures', 'Computational Complexity', 'Optimization'],
        'Computer Vision and Image Processing': ['Computer Vision', 'Image Processing', 'OpenCV', 'Pattern Recognition'],
        'Natural Language Processing': ['NLP', 'Text Processing', 'Machine Translation', 'Sentiment Analysis'],
        'Big Data Engineering': ['Big Data', 'Hadoop', 'Spark', 'Data Engineering'],
        'Cybersecurity and Digital Forensics': ['Digital Forensics', 'Security Analysis', 'Penetration Testing', 'Security Auditing'],
        'Mobile Application Development': ['Mobile Apps', 'iOS Development', 'Android Development', 'Cross-Platform'],
        'Enterprise Software Development': ['Enterprise Systems', 'ERP Systems', 'Business Applications', 'System Integration'],
        'Database Administration and Design': ['Database Administration', 'SQL', 'Database Design', 'Performance Tuning'],
        'Full-Stack Web Development': ['Full-Stack Development', 'MERN Stack', 'Web APIs', 'Progressive Web Apps']
    };
    
    return expertiseMap[specialization] || ['Computer Science', 'Programming', 'Software Development'];
}

async function generateTeachers() {
    let connection;
    
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection(dbConfig);
        
        // Get current max teacher ID
        const [maxIdResult] = await connection.execute('SELECT MAX(id) as max_id FROM teachers');
        const currentMaxId = maxIdResult[0].max_id || 0;
        console.log(`Current max teacher ID: ${currentMaxId}`);
        
        console.log('Generating 50 teachers with BSIT/BSCS specializations...');
        
        const teachers = [];
        
        for (let i = 0; i < 50; i++) {
            const teacher = generateTeacher(i);
            teachers.push(teacher);
        }
        
        // Insert teachers
        console.log('Inserting teachers...');
        
        for (let i = 0; i < teachers.length; i++) {
            const t = teachers[i];
            
            // First insert user record for the teacher
            const [userResult] = await connection.execute(
                'INSERT INTO users (username, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
                [t.email.split('@')[0], t.email, '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'teacher', 'active']
            );
            
            const userId = userResult.insertId;
            
            // Then insert teacher record
            await connection.execute(
                `INSERT INTO teachers (
                    user_id, profile_picture, first_name, middle_name, last_name, email, gender,
                    section_advisory, courses_handled, organization_department, position, years_of_service,
                    employment_status, degree, university, year_graduated, capstone_adviser_available,
                    capstone_schedule
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    userId,
                    null,
                    t.firstName,
                    t.middleName,
                    t.lastName,
                    t.email,
                    t.gender,
                    t.sectionAdvisory,
                    t.coursesHandled,
                    t.organization_department,
                    t.position,
                    t.yearsOfService,
                    t.employmentStatus,
                    t.degree,
                    t.university,
                    t.yearGraduated,
                    t.capstoneAdviserAvailable,
                    t.capstoneSchedule
                ]
            );
        }
        
        console.log('Successfully inserted 50 teachers!');
        
        // Display summary
        console.log('\n=== TEACHER GENERATION SUMMARY ===');
        console.log(`Total teachers generated: 50`);
        console.log(`BSIT/BSCS focused: Yes`);
        console.log(`All teachers have complete profiles with:`);
        console.log(`  - Personal information (name, email, gender)`);
        console.log(`  - Academic degrees from top universities`);
        console.log(`  - Professional positions (Dean, Chairman, Instructor, Adviser)`);
        console.log(`  - Years of service and employment status`);
        console.log(`  - Section advisory assignments`);
        console.log(`  - Courses handled specialization`);
        console.log(`  - Capstone adviser availability and schedule`);
        
        // Show sample of generated teachers
        console.log('\n=== SAMPLE TEACHERS ===');
        for (let i = 0; i < Math.min(5, teachers.length); i++) {
            const t = teachers[i];
            console.log(`${i + 1}. ${t.firstName} ${t.lastName} - ${t.position}`);
            console.log(`   Degree: ${t.degree} from ${t.university} (${t.yearGraduated})`);
            console.log(`   Email: ${t.email}`);
            console.log(`   Years of Service: ${t.yearsOfService} (${t.employmentStatus})`);
            console.log(`   Advisory: ${t.sectionAdvisory || 'None'}`);
            console.log(`   Courses: ${t.coursesHandled || 'General'}`);
            console.log(`   Capstone Adviser: ${t.capstoneAdviserAvailable ? 'Yes - ' + t.capstoneSchedule : 'No'}`);
            console.log('');
        }
        
    } catch (error) {
        console.error('Error generating teachers:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Database connection closed.');
        }
    }
}

// Run the generation
generateTeachers();
