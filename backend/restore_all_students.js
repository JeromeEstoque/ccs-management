// Script to restore all student programs (not just BSIT/BSCS)
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ccs_management',
    multipleStatements: true
};

// Data generation functions (same as original)
const firstNames = {
    male: ['Juan', 'Jose', 'Pedro', 'Antonio', 'Francisco', 'Luis', 'Carlos', 'Miguel', 'Roberto', 'Fernando', 'Manuel', 'Rafael', 'Gabriel', 'Daniel', 'Andres', 'Diego', 'Santiago', 'Javier', 'Victor', 'Eduardo', 'Ricardo', 'Alberto', 'Jorge', 'Martin', 'Adrian', 'David', 'Pablo', 'Emilio', 'Nicolas', 'Samuel', 'Alejandro', 'Mateo', 'Leonardo', 'Sebastian', 'Benjamin', 'Christopher', 'Alexander', 'Julian', 'Thiago', 'Ian', 'Lucas', 'Bruno', 'Omar', 'Isaac', 'Aaron', 'Marco', 'Ivan', 'Tomas', 'Hugo', 'Eric', 'Kevin', 'Oscar', 'Sergio', 'Walter', 'Gonzalo', 'Jaime', 'Felipe', 'Esteban', 'Nicolas', 'Ramon', 'Angel', 'Ruben', 'Salvador', 'Hector', 'Luis', 'Mario', 'Eugenio', 'Alfonso', 'Vicente', 'Julio', 'Agustin', 'Francisco', 'Javier'],
    female: ['Maria', 'Ana', 'Carmen', 'Rosa', 'Patricia', 'Laura', 'Sofia', 'Isabella', 'Valentina', 'Daniela', 'Camila', 'Lucia', 'Mariana', 'Victoria', 'Paula', 'Sara', 'Andrea', 'Natalia', 'Rebecca', 'Monica', 'Claudia', 'Veronica', 'Gabriela', 'Elizabeth', 'Cecilia', 'Adriana', 'Beatriz', 'Teresa', 'Elena', 'Silvia', 'Alicia', 'Eva', 'Cristina', 'Irene', 'Lourdes', 'Rocio', 'Miriam', 'Nuria', 'Laura', 'Sonia', 'Raquel', 'Marta', 'Susana', 'Lidia', 'Elsa', 'Pilar', 'Teresa', 'Angela', 'Yolanda', 'Esther', 'Mercedes', 'Carolina', 'Gemma', 'Olivia', 'Clara', 'Jimena', 'Luna', 'Alba', 'Helena', 'Candela', 'Valeria', 'Diana', 'Abril', 'Cayetana', 'Paula', 'Jimena', 'Sofia', 'Lucia', 'Martina', 'Julia']
};

const middleNames = ['Antonio', 'Jose', 'Manuel', 'Francisco', 'Juan', 'Luis', 'Carlos', 'Miguel', 'Angel', 'Javier', 'Victor', 'Roberto', 'Fernando', 'Gabriel', 'Daniel', 'Andres', 'Diego', 'Santiago', 'Adrian', 'David', 'Pablo', 'Emilio', 'Nicolas', 'Samuel', 'Alejandro', 'Mateo', 'Leonardo', 'Sebastian', 'Benjamin', 'Christopher', 'Alexander', 'Julian', 'Thiago', 'Ian', 'Lucas', 'Bruno', 'Omar', 'Isaac', 'Aaron', 'Marco', 'Ivan', 'Tomas', 'Hugo', 'Eric', 'Kevin', 'Oscar', 'Sergio', 'Walter', 'Gonzalo', 'Jaime', 'Felipe', 'Esteban', 'Ramon', 'Angel', 'Ruben', 'Salvador', 'Hector', 'Mario', 'Eugenio', 'Alfonso', 'Vicente', 'Julio', 'Agustin', 'Maria', 'Ana', 'Carmen', 'Rosa', 'Patricia', 'Laura', 'Sofia', 'Isabella', 'Valentina', 'Daniela', 'Camila', 'Lucia', 'Mariana', 'Victoria', 'Paula', 'Sara', 'Andrea', 'Natalia', 'Rebecca', 'Monica', 'Claudia', 'Veronica', 'Gabriela', 'Elizabeth', 'Cecilia', 'Adriana', 'Beatriz', 'Teresa', 'Elena', 'Silvia', 'Alicia', 'Eva', 'Cristina', 'Irene', 'Lourdes', 'Rocio', 'Miriam', 'Nuria', 'Sonia', 'Raquel', 'Marta', 'Susana', 'Lidia', 'Elsa', 'Pilar', 'Angela', 'Yolanda', 'Esther', 'Mercedes', 'Carolina', 'Gemma', 'Olivia', 'Clara', 'Jimena', 'Luna', 'Alba', 'Helena', 'Candela', 'Valeria', 'Diana', 'Abril', 'Cayetana', 'Paula', 'Jimena', 'Sofia', 'Lucia', 'Martina', 'Julia'];

const lastNames = ['Garcia', 'Rodriguez', 'Gonzalez', 'Lopez', 'Martinez', 'Sanchez', 'Perez', 'Martin', 'Gomez', 'Sanz', 'Jimenez', 'Muñoz', 'Alvarez', 'Diaz', 'Moreno', 'Muñoz', 'Alvarez', 'Diaz', 'Moreno', 'Gimenez', 'Marin', 'Serrano', 'Blanco', 'Castro', 'Ortiz', 'Rubio', 'Torres', 'Vargas', 'Delgado', 'Molina', 'Suarez', 'Ramos', 'Fernandez', 'Cruz', 'Flores', 'Reyes', 'Morales', 'Leon', 'Castillo', 'Mendoza', 'Herrera', 'Guzman', 'Paredes', 'Vega', 'Cortes', 'Salazar', 'Rojas', 'Chavez', 'Valdez', 'Medina', 'Aguilar', 'Mora', 'Guerrero', 'Espinosa', 'Tovar', 'Cervantes', 'Velasquez', 'Mendez', 'Pacheco', 'Lara', 'Villanueva', 'Rivera', 'Cabrera', 'Pino', 'Campos', 'Gallardo', 'Nava', 'Rios', 'Luna', 'Villalobos', 'Soto', 'Cortez', 'Aguirre', 'Ochoa', 'Rojas', 'Paredes', 'Vargas', 'Delgado', 'Mendoza', 'Herrera', 'Guzman', 'Paredes', 'Vega', 'Cortes', 'Salazar', 'Rojas', 'Chavez', 'Valdez', 'Medina', 'Aguilar', 'Mora', 'Guerrero', 'Espinosa', 'Tovar', 'Cervantes', 'Velasquez', 'Mendez', 'Pacheco', 'Lara', 'Villanueva', 'Rivera', 'Cabrera', 'Pino', 'Campos', 'Gallardo', 'Nava', 'Rios', 'Luna', 'Villalobos', 'Soto'];

const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const courses = ['BSIT', 'BSCS', 'BSBA', 'BSTM', 'BSN', 'BSA', 'BFA', 'BSIS', 'BSCE', 'BSEE', 'BSP', 'BSEd', 'BSME', 'BSHM', 'BSPs', 'BSIE', 'BSEC', 'BEEd', 'BSPH'];

const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Maple Ln', 'Cedar Ct', 'Birch Way', 'Walnut Blvd', 'Ash St', 'Willow Ave', 'Spruce Rd', 'Fir Ln', 'Poplar Dr', 'Chestnut Ct', 'Beech Way', 'Sycamore Blvd', 'Dogwood St', 'Hickory Ave', 'Redwood Rd', 'Magnolia Ln', 'Cherry Ct', 'Apple Way', 'Pear Blvd', 'Peach St', 'Plum Ave', 'Apricot Rd', 'Mango Ln', 'Banana Ct', 'Orange Way', 'Lemon Blvd', 'Lime St', 'Grape Ave', 'Strawberry Rd', 'Blueberry Ln', 'Raspberry Ct', 'Blackberry Way', 'Cranberry Blvd'];

const cities = ['Manila', 'Quezon City', 'Caloocan', 'Davao City', 'Cebu City', 'Zamboanga City', 'Antipolo', 'Taguig', 'Pasig', 'Cagayan de Oro', 'Parañaque', 'Valenzuela', 'Las Piñas', 'Bacoor', 'General Santos', 'Makati', 'San Jose del Monte', 'Bacolod', 'Tarlac City', 'Mandaue', 'Lapu-Lapu City', 'San Pedro', 'Cainta', 'Taytay', 'Cabuyao', 'Meycauayan', 'Santa Rosa', 'San Pablo', 'Biñan', 'San Miguel', 'Tuguegarao', 'Calapan', 'Legazpi', 'Iriga', 'Lipa', 'Surigao', 'Puerto Princesa', 'Dasmariñas', 'Muntinlupa', 'Santa Cruz', 'Ligao', 'Tabaco', 'Sorsogon City', 'Masbate City', 'Panabo', 'Samal', 'Kidapawan', 'Malaybalay', 'Valencia', 'Oroquieta', 'Ozamiz', 'Tangub', 'Cagayan de Oro'];

const statuses = ['Regular', 'Irregular', 'Drop Out'];

const organizations = ['N/A', 'President', 'Vice President', 'Member', 'Treasurer', 'Secretary'];

const workPositions = ['Retail Associate', 'Food Service Worker', 'Warehouse Worker', 'Customer Service Representative', 'Sales Associate', 'Administrative Assistant', 'Delivery Driver', 'Security Guard', 'Cashier', 'Stock Clerk', 'Call Center Agent', 'Data Entry Clerk', 'Office Assistant', 'Production Worker', 'Maintenance Worker', 'Janitor', 'Housekeeper', 'Childcare Worker', 'Tutor', 'Teaching Assistant'];

// Helper functions
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generateStudentId(year, studentNum) {
    return `${year}-${String(studentNum).padStart(4, '0')}`;
}

function generateEmail(firstName, lastName, studentId, usedEmails) {
    const domains = ['ccs.edu', 'student.ccs.edu', 'college.ccs.edu'];
    const domain = getRandomElement(domains);
    const cleanName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/[^a-z0-9.]/g, '');
    
    let email = `${cleanName}@${domain}`;
    let counter = 1;
    
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

function generateBirthdate(yearLevel) {
    const currentYear = new Date().getFullYear();
    let age;
    
    switch (yearLevel) {
        case '1st Year': age = getRandomNumber(16, 18); break;
        case '2nd Year': age = getRandomNumber(17, 19); break;
        case '3rd Year': age = getRandomNumber(18, 20); break;
        case '4th Year': age = getRandomNumber(19, 21); break;
        default: age = getRandomNumber(16, 21);
    }
    
    const birthYear = currentYear - age;
    return getRandomDate(birthYear, birthYear);
}

function getRandomDate(year) {
    const month = getRandomNumber(1, 12);
    const day = getRandomNumber(1, 28);
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

async function getAvailableSkills(connection) {
    const [rows] = await connection.execute('SELECT id, name, type FROM skills');
    return rows;
}

function generateSkills(studentId, availableSkills) {
    const skills = [];
    const usedSkillIds = new Set();
    const numSkills = getRandomNumber(2, 5);
    
    for (let i = 0; i < numSkills; i++) {
        let skillId;
        let attempts = 0;
        
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

async function restoreAllStudents() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('Starting restoration of all student programs...');
        
        // Get current max IDs
        const [maxStudentIdResult] = await connection.execute('SELECT MAX(id) as max_id FROM students');
        const [maxUserIdResult] = await connection.execute('SELECT MAX(id) as max_id FROM users');
        const currentMaxStudentId = maxStudentIdResult[0].max_id || 0;
        const currentMaxUserId = maxUserIdResult[0].max_id || 0;
        const startId = Math.max(currentMaxStudentId, currentMaxUserId) + 1;
        
        console.log(`Starting from student ID: ${startId}`);
        
        // Generate additional students to reach ~1000 total with all programs
        const students = [];
        const skills = [];
        const users = [];
        const usedEmails = new Set();
        const usedUsernames = new Set();
        
        // Get available skills
        const availableSkills = await getAvailableSkills(connection);
        console.log(`Found ${availableSkills.length} available skills in database`);
        
        // Generate 900 more students to reach ~1000 total
        for (let i = 0; i < 900; i++) {
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
            
            // Create user record
            const user = {
                id: studentNum,
                username: username,
                email: email,
                password_hash: '$2b$10$example.hash.for.demonstration.purposes',
                role: 'student',
                status: 'active',
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            
            users.push(user);
            
            const student = {
                id: studentNum,
                user_id: studentNum,
                student_id: studentId,
                first_name: firstName,
                middle_name: middleName,
                last_name: lastName,
                email: email,
                contact_number: generatePhoneNumber(),
                birthday: generateBirthdate(yearLevel),
                gender: gender,
                address: generateAddress(),
                year_level: yearLevel,
                section: section,
                status_record: getRandomElement(statuses),
                organization_role: getRandomElement(organizations),
                guardian_name: null,
                guardian_contact: null,
                profile_picture: null,
                working_student: Math.random() > 0.7 ? 'Yes' : 'No',
                work_type: Math.random() > 0.7 ? getRandomElement(workPositions) : null,
                class_representative: Math.random() > 0.9 ? getRandomElement(['Class President', 'Secretary', 'Treasurer']) : null,
                last_school_attended: `${getRandomElement(['National High School', 'Science High School', 'Technical High School', 'Senior High School'])}`,
                medical_records: `Blood Type: ${getRandomElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])}, Allergies: ${Math.random() > 0.8 ? getRandomElement(['None', 'Penicillin', 'Dust', 'Pollen', 'Seafood']) : 'None'}`,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            
            students.push(student);
            
            // Generate skills
            const studentSkills = generateSkills(studentNum, availableSkills);
            skills.push(...studentSkills);
            
            if ((i + 1) % 100 === 0) {
                console.log(`Generated ${i + 1} students...`);
            }
        }
        
        console.log('Inserting users and students into database...');
        
        // Insert users first
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
        
        // Insert students
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
        
        console.log(`Successfully restored and generated ${users.length} users and ${students.length} students with all programs!`);
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
        const fs = require('fs');
        const path = require('path');
        fs.writeFileSync(
            path.join(__dirname, 'student_restoration_summary.json'),
            JSON.stringify(summary, null, 2)
        );
        
        console.log('Restoration summary saved to student_restoration_summary.json');
        console.log('Student restoration completed successfully!');
        
    } catch (error) {
        console.error('Error during restoration:', error);
    } finally {
        await connection.end();
    }
}

restoreAllStudents();
