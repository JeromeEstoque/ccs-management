// ========================================
// Student Data Generator for CCS Management System
// Generates 1000+ students with complete information
// ========================================

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ccs_management',
    multipleStatements: true
};

// Data arrays for realistic generation
const firstNames = {
    male: ['Juan', 'Jose', 'Francisco', 'Antonio', 'Miguel', 'Pedro', 'Angel', 'Luis', 'Carlos', 'Roberto', 
           'Fernando', 'Ricardo', 'Gabriel', 'Daniel', 'Andres', 'Manuel', 'Javier', 'Victor', 'Eduardo', 'Santiago',
           'Alejandro', 'Sebastian', 'Nicolas', 'Diego', 'Adrian', 'Mateo', 'Pablo', 'Emilio', 'Hugo', 'Rafael',
           'Marco', 'Omar', 'Isaac', 'Leonardo', 'Bruno', 'Ivan', 'Tomas', 'Jorge', 'Martin', 'Sergio',
           'Christian', 'David', 'Kevin', 'Brian', 'Mark', 'Paul', 'James', 'John', 'Michael', 'Robert',
           'William', 'Richard', 'Charles', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Steven'],
    female: ['Maria', 'Ana', 'Carmen', 'Rosa', 'Patricia', 'Luz', 'Sofia', 'Isabella', 'Valentina', 'Camila',
             'Mariana', 'Victoria', 'Gabriela', 'Sara', 'Daniela', 'Lucia', 'Paula', 'Valeria', 'Regina', 'Fernanda',
             'Ximena', 'Andrea', 'Natalia', 'Beatriz', 'Claudia', 'Monica', 'Teresa', 'Elena', 'Laura', 'Cecilia',
             'Adriana', 'Veronica', 'Liliana', 'Karla', 'Susana', 'Norma', 'Alicia', 'Patricia', 'Rosa', 'Eva',
             'Jennifer', 'Jessica', 'Ashley', 'Amanda', 'Sarah', 'Emily', 'Hannah', 'Alexis', 'Megan', 'Taylor',
             'Lauren', 'Rachel', 'Courtney', 'Stephanie', 'Rebecca', 'Melissa', 'Nicole', 'Kimberly', 'Brittany', 'Crystal']
};

const middleNames = ['Antonio', 'Miguel', 'Jose', 'Francisco', 'Pedro', 'Luis', 'Carlos', 'Roberto', 'Fernando', 'Ricardo',
                     'Gabriel', 'Daniel', 'Andres', 'Manuel', 'Javier', 'Victor', 'Eduardo', 'Santiago', 'Alejandro', 'Sebastian',
                     'Maria', 'Ana', 'Carmen', 'Rosa', 'Patricia', 'Luz', 'Sofia', 'Isabella', 'Valentina', 'Camila',
                     'Elizabeth', 'Grace', 'Rose', 'Marie', 'Lynn', 'Ann', 'Jean', 'Katherine', 'Margaret', 'Barbara'];

const lastNames = ['Garcia', 'Rodriguez', 'Hernandez', 'Lopez', 'Martinez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres',
                  'Flores', 'Rivera', 'Cruz', 'Morales', 'Reyes', 'Jimenez', 'Diaz', 'Vargas', 'Castillo', 'Mendoza',
                  'Silva', 'Ramos', 'Cortez', 'Molina', 'Ortiz', 'Guerrero', 'Santos', 'Vargas', 'Castro', 'Fernandez',
                  'Paredes', 'Rojas', 'Mendoza', 'Velasquez', 'Cabrera', 'Rosario', 'Villanueva', 'Salazar', 'Quintero', 'Zamora',
                  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
                  'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris'];

const cities = ['Quezon City', 'Makati City', 'Manila', 'Pasig City', 'Mandaluyong City', 'San Juan City', 'Caloocan', 'Pasay City',
                'Parañaque', 'Las Piñas', 'Muntinlupa', 'Marikina', 'Taguig', 'Cainta', 'Taytay', 'Antipolo', 'San Mateo', 'Montalban',
                'Valenzuela', 'Malabon', 'Navotas', 'San Jose del Monte', 'Bocaue', 'Meycauayan', 'San Miguel', 'Gapan', 'Cabiao'];

const streets = ['Main St', 'Oak Ave', 'Pine St', 'Elm Rd', 'Maple Dr', 'Cedar Ln', 'Walnut St', 'Birch Ave', 'Ash St', 'Spruce Rd',
                 'Fir Ln', 'Willow Way', 'Poplar St', 'Sycamore Dr', 'Chestnut Ave', 'Beech St', 'Magnolia Ln', 'Dogwood Rd', 'Hickory St', 'Redwood Ave',
                 'University Ave', 'Faculty St', 'Campus Rd', 'College Blvd', 'Academic Dr', 'Scholar Ln', 'Research Rd', 'Innovation Ave', 'Technology St', 'Science Dr'];

const courses = ['BSIT', 'BSCS', 'BSIS', 'BSCE', 'BSEE', 'BSECE', 'BSME', 'BSIE', 'BSA', 'BSBA', 'BSHM', 'BSTM', 'BSP', 'BSN', 'BSPH', 'BSPh', 'BSPsych', 'BSEd', 'BEEd', 'BFA'];
const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const statuses = ['Regular', 'Irregular', 'Probation'];
const organizations = ['Student Council Member', 'Class President', 'Programming Club Member', 'Library Assistant', 'Sports Coordinator',
                      'Debate Club Member', 'Drama Club Member', 'Music Club Member', 'Art Club Member', 'Science Club Member',
                      'Math Club Member', 'English Club Member', 'History Club Member', 'Geography Club Member', 'Computer Club Member',
                      'Photography Club Member', 'Journalism Club Member', 'Peer Mentor', 'Campus Ambassador', 'Event Organizer'];

const technicalSkills = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'HTML/CSS', 'PHP', 'MySQL', 'MongoDB',
                        'Angular', 'Vue.js', 'TypeScript', 'Flutter', 'Swift', 'Kotlin', 'Ruby', 'Go', 'Rust', 'Dart',
                        'Android Development', 'iOS Development', 'Web Development', 'Mobile Development', 'Game Development', 'UI/UX Design',
                        'Machine Learning', 'Data Science', 'Artificial Intelligence', 'Cloud Computing', 'DevOps', 'Cybersecurity',
                        'Blockchain', 'Internet of Things', 'Robotics', 'Augmented Reality', 'Virtual Reality', 'Data Analysis'];

const sportsSkills = ['Basketball', 'Volleyball', 'Football', 'Badminton', 'Table Tennis', 'Tennis', 'Chess', 'Swimming',
                      'Track and Field', 'Baseball', 'Softball', 'Bowling', 'Golf', 'Martial Arts', 'Boxing', 'Taekwondo',
                      'Karate', 'Judo', 'Wrestling', 'Gymnastics', 'Dancing', 'Cheerleading', 'Fencing', 'Archery'];

const artsSkills = ['Painting', 'Drawing', 'Sculpture', 'Photography', 'Music', 'Singing', 'Dancing', 'Acting', 'Writing', 'Poetry',
                   'Graphic Design', 'Digital Art', 'Animation', 'Film Making', 'Video Editing', 'Sound Engineering', 'Fashion Design',
                   'Interior Design', 'Calligraphy', 'Pottery', 'Woodworking', 'Crafting', 'Knitting', 'Sewing', 'Embroidery'];

const leadershipSkills = ['Public Speaking', 'Team Leadership', 'Project Management', 'Event Planning', 'Mentoring', 'Coaching',
                         'Conflict Resolution', 'Negotiation', 'Strategic Planning', 'Decision Making', 'Problem Solving', 'Critical Thinking',
                         'Time Management', 'Communication', 'Presentation Skills', 'Networking', 'Delegation', 'Motivation', 'Facilitation'];

const otherSkills = ['Cooking', 'Baking', 'Gardening', 'Fishing', 'Hiking', 'Camping', 'Traveling', 'Reading', 'Writing', 'Blogging',
                    'Social Media Management', 'Content Creation', 'Video Blogging', 'Podcasting', 'Teaching', 'Tutoring', 'Volunteering'];

const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

const workPositions = ['Intern', 'Part-time Developer', 'Freelance Designer', 'Teaching Assistant', 'Research Assistant',
                       'Customer Service Representative', 'Sales Associate', 'Administrative Assistant', 'Data Entry Clerk',
                       'Warehouse Worker', 'Food Service Worker', 'Retail Associate', 'Cashier', 'Delivery Driver',
                       'Security Guard', 'Cleaner', 'Maintenance Worker', 'Construction Worker', 'Factory Worker'];

const companies = ['Tech Solutions Inc.', 'Digital Innovations Corp.', 'Software Development Co.', 'Web Design Studio', 'Mobile App Factory',
                  'Data Analytics Firm', 'Cloud Computing Services', 'Cybersecurity Solutions', 'AI Research Lab', 'Game Development Studio',
                  'E-commerce Platform', 'Social Media Agency', 'Digital Marketing Firm', 'Content Creation Studio', 'Video Production House',
                  'Retail Store Chain', 'Restaurant Group', 'Hotel Chain', 'Transportation Company', 'Construction Firm'];

// Utility functions
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFloat(min, max, decimals = 2) {
    return (Math.random() * (max - min) + min).toFixed(decimals);
}

function getRandomDate(startYear, endYear) {
    const year = getRandomNumber(startYear, endYear);
    const month = String(getRandomNumber(1, 12)).padStart(2, '0');
    const day = String(getRandomNumber(1, 28)).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function generateStudentId(year, index) {
    return `${year}-${String(index).padStart(4, '0')}`;
}

function generateEmail(firstName, lastName, studentId, usedEmails) {
    const domains = ['ccs.edu', 'student.ccs.edu', 'college.ccs.edu'];
    const domain = getRandomElement(domains);
    const cleanName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/[^a-z0-9.]/g, '');
    
    let email = `${cleanName}@${domain}`;
    let counter = 1;
    
    // Ensure email uniqueness
    while (usedEmails.has(email)) {
        email = `${cleanName}${counter}@${domain}`;
        counter++;
    }
    
    usedEmails.add(email);
    return email;
}

function generateUsername(firstName, lastName, usedUsernames) {
    const baseUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}`.replace(/[^a-z0-9]/g, '');
    let username = baseUsername;
    let counter = 1;
    
    // Ensure username uniqueness
    while (usedUsernames.has(username)) {
        username = `${baseUsername}${counter}`;
        counter++;
    }
    
    usedUsernames.add(username);
    return username;
}

function generatePhoneNumber() {
    return `+639${getRandomNumber(10, 99)}${getRandomNumber(1000000, 9999999)}`;
}

function generateAddress() {
    const streetNum = getRandomNumber(1, 999);
    const street = getRandomElement(streets);
    const city = getRandomElement(cities);
    const province = 'Metro Manila';
    return `${streetNum} ${street}, ${city}, ${province}`;
}

function generateGpa() {
    // Generate realistic GPA distribution (more students around 2.5-3.5)
    const random = Math.random();
    if (random < 0.1) return getRandomFloat(1.0, 2.0); // 10% low GPA
    if (random < 0.6) return getRandomFloat(2.0, 3.5); // 50% average GPA
    if (random < 0.9) return getRandomFloat(3.5, 3.8); // 30% good GPA
    return getRandomFloat(3.8, 4.0); // 10% excellent GPA
}

function generateBirthdate(yearLevel) {
    const currentYear = 2024;
    let age;
    
    switch(yearLevel) {
        case '1st Year': age = getRandomNumber(17, 19); break;
        case '2nd Year': age = getRandomNumber(18, 20); break;
        case '3rd Year': age = getRandomNumber(19, 21); break;
        case '4th Year': age = getRandomNumber(20, 23); break;
        default: age = getRandomNumber(17, 23);
    }
    
    const birthYear = currentYear - age;
    return getRandomDate(birthYear, birthYear);
}

async function getAvailableSkills(connection) {
    const [rows] = await connection.execute('SELECT id, name, type FROM skills');
    return rows;
}

function generateSkills(studentId, availableSkills) {
    const skills = [];
    const usedSkillIds = new Set();
    const numSkills = getRandomNumber(2, 5); // Each student has 2-5 skills
    
    for (let i = 0; i < numSkills; i++) {
        let skillId;
        let attempts = 0;
        
        // Try to find a unique skill ID
        do {
            skillId = getRandomElement(availableSkills).id;
            attempts++;
        } while (usedSkillIds.has(skillId) && attempts < 10);
        
        if (!usedSkillIds.has(skillId)) {
            usedSkillIds.add(skillId);
            skills.push({
                student_id: studentId,
                skill_id: skillId
            });
        }
    }
    
    return skills;
}

function generateWorkInformation(studentId) {
    // Only 30% of students have work experience
    if (Math.random() > 0.3) return null;
    
    return {
        student_id: studentId,
        company_name: getRandomElement(companies),
        position: getRandomElement(workPositions),
        start_date: getRandomDate(2022, 2024),
        is_current: Math.random() > 0.3,
        hours_per_week: getRandomNumber(10, 30)
    };
}

function generateGuardianInfo() {
    const guardianFirstNames = ['Juan', 'Maria', 'Jose', 'Ana', 'Antonio', 'Carmen', 'Francisco', 'Rosa', 'Luis', 'Patricia'];
    const guardianLastNames = ['Garcia', 'Rodriguez', 'Hernandez', 'Lopez', 'Martinez', 'Gonzalez', 'Perez', 'Sanchez', 'Ramirez', 'Torres'];
    const relationships = ['Father', 'Mother', 'Guardian', 'Uncle', 'Aunt', 'Grandfather', 'Grandmother'];
    
    return {
        name: `${getRandomElement(guardianFirstNames)} ${getRandomElement(guardianLastNames)}`,
        relationship: getRandomElement(relationships),
        contact: generatePhoneNumber(),
        email: `guardian${getRandomNumber(1000, 9999)}@email.com`
    };
}

async function generateStudents() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('Starting student data generation...');
        
        // Get current max IDs to avoid conflicts
        const [maxStudentIdResult] = await connection.execute('SELECT MAX(id) as max_id FROM students');
        const [maxUserIdResult] = await connection.execute('SELECT MAX(id) as max_id FROM users');
        const currentMaxStudentId = maxStudentIdResult[0].max_id || 0;
        const currentMaxUserId = maxUserIdResult[0].max_id || 0;
        const startId = Math.max(currentMaxStudentId, currentMaxUserId) + 1;
        
        console.log(`Starting from student ID: ${startId}`);
        
        const students = [];
        const skills = [];
        const users = [];
        const usedEmails = new Set();
        const usedUsernames = new Set();
        
        // Get available skills from database
        const availableSkills = await getAvailableSkills(connection);
        console.log(`Found ${availableSkills.length} available skills in database`);
        
        // Generate 1000 students
        for (let i = 0; i < 1000; i++) {
            const studentNum = startId + i;
            const gender = Math.random() > 0.5 ? 'Male' : 'Female';
            const firstName = getRandomElement(firstNames[gender === 'Male' ? 'male' : 'female']);
            const middleName = getRandomElement(middleNames);
            const lastName = getRandomElement(lastNames);
            const yearLevel = getRandomElement(yearLevels);
            const course = getRandomElement(courses);
            const section = `${course}-${getRandomNumber(1, 4)}${getRandomElement(sections)}`;
            const studentId = generateStudentId(2024 - getRandomNumber(0, 3), studentNum);
            const email = generateEmail(firstName, lastName, studentId, usedEmails);
            const username = generateUsername(firstName, lastName, usedUsernames);
            
            // Create user record first
            const user = {
                id: studentNum,
                username: username,
                email: email,
                password_hash: '$2b$10$example.hash.for.demonstration.purposes', // Example hash
                role: 'student',
                status: 'active',
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            
            users.push(user);
            
            const student = {
                id: studentNum,
                user_id: studentNum, // Add user_id field
                student_id: studentId,
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                email: email,
                contact_number: generatePhoneNumber(), // Changed from phone to contact_number
                birthday: generateBirthdate(yearLevel), // Changed from birth_date to birthday
                gender: gender,
                address: generateAddress(),
                year_level: yearLevel,
                section: section,
                status_record: getRandomElement(['Regular', 'Irregular', 'Drop Out']), // Updated to match enum
                organization_role: getRandomElement(['N/A', 'President', 'Vice President', 'Member', 'Treasurer', 'Secretary']), // Updated to match enum
                guardian_name: null, // Will be filled from guardians array
                guardian_contact: null, // Will be filled from guardians array
                profile_picture: null,
                working_student: Math.random() > 0.7 ? 'Yes' : 'No', // 30% working students
                work_type: Math.random() > 0.7 ? getRandomElement(workPositions) : null,
                class_representative: Math.random() > 0.9 ? getRandomElement(['Class President', 'Secretary', 'Treasurer']) : null,
                last_school_attended: `${getRandomElement(['National High School', 'Science High School', 'Technical High School', 'Senior High School'])}`,
                medical_records: `Blood Type: ${getRandomElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])}, Allergies: ${Math.random() > 0.8 ? getRandomElement(['None', 'Penicillin', 'Dust', 'Pollen', 'Seafood']) : 'None'}`,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format for MySQL timestamp
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            
            students.push(student);
            
            // Generate skills for this student
            const studentSkills = generateSkills(studentNum, availableSkills);
            skills.push(...studentSkills);
            
            // Progress logging
            if ((i + 1) % 100 === 0) {
                console.log(`Generated ${i + 1} students...`);
            }
        }
        
        console.log('Inserting users and students into database...');
        
        // Insert users first in batches
        const batchSize = 100;
        for (let i = 0; i < users.length; i += batchSize) {
            const userBatch = users.slice(i, i + batchSize);
            const userValues = userBatch.map(u => [
                u.id, u.username, u.email, u.password_hash, u.role, u.status,
                u.created_at, u.updated_at
            ]);
            
            const userQuery = `
                INSERT INTO users (id, username, email, password_hash, role, status, created_at, updated_at) 
                VALUES ?
            `;
            
            await connection.query(userQuery, [userValues]);
        }
        
        // Now insert students in batches
        for (let i = 0; i < students.length; i += batchSize) {
            const batch = students.slice(i, i + batchSize);
            const studentValues = batch.map(s => [
                s.id, s.user_id, s.student_id, s.first_name, s.middle_name, s.last_name, s.email, s.contact_number,
                s.birthday, s.gender, s.address, s.year_level, s.section, s.status_record,
                s.organization_role, s.guardian_name, s.guardian_contact, s.profile_picture,
                s.working_student, s.work_type, s.class_representative, s.last_school_attended, s.medical_records,
                s.created_at, s.updated_at
            ]);
            
            const studentQuery = `
                INSERT INTO students (
                    id, user_id, student_id, first_name, middle_name, last_name, email, contact_number, 
                    birthday, gender, address, year_level, section, status_record, 
                    organization_role, guardian_name, guardian_contact, profile_picture, 
                    working_student, work_type, class_representative, last_school_attended, medical_records,
                    created_at, updated_at
                ) VALUES ?
            `;
            
            await connection.query(studentQuery, [studentValues]);
            
            // Insert skills for this batch
            const batchSkills = skills.filter(skill => 
                batch.some(s => s.id === skill.student_id)
            );
            
            if (batchSkills.length > 0) {
                const skillValues = batchSkills.map(s => [
                    s.student_id, s.skill_id
                ]);
                
                const skillQuery = `
                    INSERT INTO student_skills (student_id, skill_id) 
                    VALUES ?
                `;
                
                await connection.query(skillQuery, [skillValues]);
            }
            
            console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(students.length/batchSize)}`);
        }
        
        // Update student count
        console.log('Updating database statistics...');
        
        console.log(`Successfully generated and inserted ${users.length} users and ${students.length} students with complete information!`);
        console.log(`- ${skills.length} skills entries`);
        
        // Generate summary report
        const summary = {
            total_students: students.length,
            gender_distribution: {
                male: students.filter(s => s.gender === 'Male').length,
                female: students.filter(s => s.gender === 'Female').length
            },
            year_level_distribution: {
                '1st Year': students.filter(s => s.year_level === '1st Year').length,
                '2nd Year': students.filter(s => s.year_level === '2nd Year').length,
                '3rd Year': students.filter(s => s.year_level === '3rd Year').length,
                '4th Year': students.filter(s => s.year_level === '4th Year').length
            },
            students_with_skills: skills.filter((s, i, arr) => arr.findIndex(x => x.student_id === s.student_id) === i).length,
            working_students: students.filter(s => s.working_student === 'Yes').length,
            generation_date: new Date().toISOString()
        };
        
        // Save summary to file
        fs.writeFileSync(
            path.join(__dirname, 'student_generation_summary.json'),
            JSON.stringify(summary, null, 2)
        );
        
        console.log('Summary report saved to student_generation_summary.json');
        
    } catch (error) {
        console.error('Error generating students:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

// Run the generation
if (require.main === module) {
    generateStudents()
        .then(() => {
            console.log('Student generation completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Student generation failed:', error);
            process.exit(1);
        });
}

module.exports = { generateStudents };
