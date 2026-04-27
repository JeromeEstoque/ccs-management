// Simple script to add students with all programs to complement existing BSIT/BSCS students
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ccs_management',
    multipleStatements: true
};

// Course programs to add (excluding BSIT and BSCS since they already exist)
const additionalCourses = ['BSBA', 'BSTM', 'BSN', 'BSA', 'BFA', 'BSIS', 'BSCE', 'BSEE', 'BSP', 'BSEd', 'BSME', 'BSHM', 'BSPs', 'BSIE', 'BSEC', 'BEEd', 'BSPH'];

const firstNames = {
    male: ['Juan', 'Jose', 'Pedro', 'Antonio', 'Francisco', 'Luis', 'Carlos', 'Miguel', 'Roberto', 'Fernando', 'Manuel', 'Rafael', 'Gabriel', 'Daniel', 'Andres', 'Diego', 'Santiago', 'Javier', 'Victor', 'Eduardo', 'Ricardo', 'Alberto', 'Jorge', 'Martin', 'Adrian', 'David', 'Pablo', 'Emilio', 'Nicolas', 'Samuel', 'Alejandro', 'Mateo', 'Leonardo', 'Sebastian', 'Benjamin', 'Christopher', 'Alexander', 'Julian', 'Thiago', 'Ian', 'Lucas', 'Bruno', 'Omar', 'Isaac', 'Aaron', 'Marco', 'Ivan', 'Tomas', 'Hugo', 'Eric', 'Kevin', 'Oscar', 'Sergio', 'Walter', 'Gonzalo', 'Jaime', 'Felipe', 'Esteban', 'Nicolas', 'Ramon', 'Angel', 'Ruben', 'Salvador', 'Hector', 'Luis', 'Mario', 'Eugenio', 'Alfonso', 'Vicente', 'Julio', 'Agustin', 'Francisco', 'Javier'],
    female: ['Maria', 'Ana', 'Carmen', 'Rosa', 'Patricia', 'Laura', 'Sofia', 'Isabella', 'Valentina', 'Daniela', 'Camila', 'Lucia', 'Mariana', 'Victoria', 'Paula', 'Sara', 'Andrea', 'Natalia', 'Rebecca', 'Monica', 'Claudia', 'Veronica', 'Gabriela', 'Elizabeth', 'Cecilia', 'Adriana', 'Beatriz', 'Teresa', 'Elena', 'Silvia', 'Alicia', 'Eva', 'Cristina', 'Irene', 'Lourdes', 'Rocio', 'Miriam', 'Nuria', 'Laura', 'Sonia', 'Raquel', 'Marta', 'Susana', 'Lidia', 'Elsa', 'Pilar', 'Teresa', 'Angela', 'Yolanda', 'Esther', 'Mercedes', 'Carolina', 'Gemma', 'Olivia', 'Clara', 'Jimena', 'Luna', 'Alba', 'Helena', 'Candela', 'Valeria', 'Diana', 'Abril', 'Cayetana', 'Paula', 'Jimena', 'Sofia', 'Lucia', 'Martina', 'Julia']
};

const middleNames = ['Antonio', 'Jose', 'Manuel', 'Francisco', 'Juan', 'Luis', 'Carlos', 'Miguel', 'Angel', 'Javier', 'Victor', 'Roberto', 'Fernando', 'Gabriel', 'Daniel', 'Andres', 'Diego', 'Santiago', 'Adrian', 'David', 'Pablo', 'Emilio', 'Nicolas', 'Samuel', 'Alejandro', 'Mateo', 'Leonardo', 'Sebastian', 'Benjamin', 'Christopher', 'Alexander', 'Julian', 'Thiago', 'Ian', 'Lucas', 'Bruno', 'Omar', 'Isaac', 'Aaron', 'Marco', 'Ivan', 'Tomas', 'Hugo', 'Eric', 'Kevin', 'Oscar', 'Sergio', 'Walter', 'Gonzalo', 'Jaime', 'Felipe', 'Esteban', 'Ramon', 'Angel', 'Ruben', 'Salvador', 'Hector', 'Mario', 'Eugenio', 'Alfonso', 'Vicente', 'Julio', 'Agustin', 'Maria', 'Ana', 'Carmen', 'Rosa', 'Patricia', 'Laura', 'Sofia', 'Isabella', 'Valentina', 'Daniela', 'Camila', 'Lucia', 'Mariana', 'Victoria', 'Paula', 'Sara', 'Andrea', 'Natalia', 'Rebecca', 'Monica', 'Claudia', 'Veronica', 'Gabriela', 'Elizabeth', 'Cecilia', 'Adriana', 'Beatriz', 'Teresa', 'Elena', 'Silvia', 'Alicia', 'Eva', 'Cristina', 'Irene', 'Lourdes', 'Rocio', 'Miriam', 'Nuria', 'Sonia', 'Raquel', 'Marta', 'Susana', 'Lidia', 'Elsa', 'Pilar', 'Angela', 'Yolanda', 'Esther', 'Mercedes', 'Carolina', 'Gemma', 'Olivia', 'Clara', 'Jimena', 'Luna', 'Alba', 'Helena', 'Candela', 'Valeria', 'Diana', 'Abril', 'Cayetana', 'Paula', 'Jimena', 'Sofia', 'Lucia', 'Martina', 'Julia'];

const lastNames = ['Garcia', 'Rodriguez', 'Gonzalez', 'Lopez', 'Martinez', 'Sanchez', 'Perez', 'Martin', 'Gomez', 'Sanz', 'Jimenez', 'Muñoz', 'Alvarez', 'Diaz', 'Moreno', 'Muñoz', 'Alvarez', 'Diaz', 'Moreno', 'Gimenez', 'Marin', 'Serrano', 'Blanco', 'Castro', 'Ortiz', 'Rubio', 'Torres', 'Vargas', 'Delgado', 'Molina', 'Suarez', 'Ramos', 'Fernandez', 'Cruz', 'Flores', 'Reyes', 'Morales', 'Leon', 'Castillo', 'Mendoza', 'Herrera', 'Guzman', 'Paredes', 'Vega', 'Cortes', 'Salazar', 'Rojas', 'Chavez', 'Valdez', 'Medina', 'Aguilar', 'Mora', 'Guerrero', 'Espinosa', 'Tovar', 'Cervantes', 'Velasquez', 'Mendez', 'Pacheco', 'Lara', 'Villanueva', 'Rivera', 'Cabrera', 'Pino', 'Campos', 'Gallardo', 'Nava', 'Rios', 'Luna', 'Villalobos', 'Soto', 'Cortez', 'Aguirre', 'Ochoa', 'Rojas', 'Paredes', 'Vargas', 'Delgado', 'Mendoza', 'Herrera', 'Guzman', 'Paredes', 'Vega', 'Cortes', 'Salazar', 'Rojas', 'Chavez', 'Valdez', 'Medina', 'Aguilar', 'Mora', 'Guerrero', 'Espinosa', 'Tovar', 'Cervantes', 'Velasquez', 'Mendez', 'Pacheco', 'Lara', 'Villanueva', 'Rivera', 'Cabrera', 'Pino', 'Campos', 'Gallardo', 'Nava', 'Rios', 'Luna', 'Villalobos', 'Soto'];

const yearLevels = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const sections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const statuses = ['Regular', 'Irregular', 'Drop Out'];
const organizations = ['N/A', 'President', 'Vice President', 'Member', 'Treasurer', 'Secretary'];

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

function generatePhoneNumber() {
    return `+639${getRandomNumber(10, 99)}${getRandomNumber(1000000, 9999999)}`;
}

function generateAddress() {
    const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Dr', 'Maple Ln', 'Cedar Ct', 'Birch Way', 'Walnut Blvd'];
    const cities = ['Manila', 'Quezon City', 'Caloocan', 'Davao City', 'Cebu City', 'Zamboanga City'];
    const streetNum = getRandomNumber(1, 999);
    const street = getRandomElement(streets);
    const city = getRandomElement(cities);
    return `${streetNum} ${street}, ${city}, Metro Manila`;
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
    const month = getRandomNumber(1, 12);
    const day = getRandomNumber(1, 28);
    return `${birthYear}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

async function addAdditionalStudents() {
    const connection = await mysql.createConnection(dbConfig);
    
    try {
        console.log('Adding students with additional programs...');
        
        // Get current max IDs
        const [maxStudentIdResult] = await connection.execute('SELECT MAX(id) as max_id FROM students');
        const [maxUserIdResult] = await connection.execute('SELECT MAX(id) as max_id FROM users');
        const currentMaxStudentId = maxStudentIdResult[0].max_id || 0;
        const currentMaxUserId = maxUserIdResult[0].max_id || 0;
        const startId = Math.max(currentMaxStudentId, currentMaxUserId) + 1;
        
        console.log(`Starting from student ID: ${startId}`);
        
        // Get existing usernames to avoid conflicts
        const [existingUsers] = await connection.execute('SELECT username FROM users');
        const existingUsernames = new Set(existingUsers.map(u => u.username));
        
        const students = [];
        const users = [];
        const usedEmails = new Set();
        
        // Get existing emails
        const [existingEmails] = await connection.execute('SELECT email FROM users WHERE email IS NOT NULL');
        existingEmails.forEach(e => usedEmails.add(e.email));
        
        // Generate 400 students with additional programs
        for (let i = 0; i < 400; i++) {
            const studentNum = startId + i;
            const gender = Math.random() > 0.5 ? 'Male' : 'Female';
            const firstName = getRandomElement(firstNames[gender === 'Male' ? 'male' : 'female']);
            const middleName = getRandomElement(middleNames);
            const lastName = getRandomElement(lastNames);
            const yearLevel = getRandomElement(yearLevels);
            const course = getRandomElement(additionalCourses);
            const section = `${course}-${getRandomNumber(1, 4)}${getRandomElement(sections)}`;
            const studentId = generateStudentId(2024 - getRandomNumber(0, 3), studentNum);
            
            // Generate unique username
            let username;
            let counter = 1;
            do {
                username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${counter > 1 ? counter : ''}`.replace(/[^a-z0-9]/g, '');
                counter++;
            } while (existingUsernames.has(username) && counter < 100);
            
            // Generate unique email
            let email;
            let emailCounter = 1;
            const domains = ['ccs.edu', 'student.ccs.edu', 'college.ccs.edu'];
            const domain = getRandomElement(domains);
            const cleanName = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/[^a-z0-9.]/g, '');
            
            do {
                email = `${cleanName}${emailCounter > 1 ? emailCounter : ''}@${domain}`;
                emailCounter++;
            } while (usedEmails.has(email) && emailCounter < 100);
            
            existingUsernames.add(username);
            usedEmails.add(email);
            
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
                work_type: Math.random() > 0.7 ? getRandomElement(['Retail Associate', 'Food Service Worker', 'Warehouse Worker']) : null,
                class_representative: Math.random() > 0.9 ? getRandomElement(['Class President', 'Secretary', 'Treasurer']) : null,
                last_school_attended: `${getRandomElement(['National High School', 'Science High School'])}`,
                medical_records: `Blood Type: ${getRandomElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])}, Allergies: ${Math.random() > 0.8 ? getRandomElement(['None', 'Penicillin', 'Dust']) : 'None'}`,
                created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            
            students.push(student);
            
            if ((i + 1) % 50 === 0) {
                console.log(`Generated ${i + 1} students...`);
            }
        }
        
        console.log('Inserting users and students into database...');
        
        // Insert users first
        const batchSize = 50;
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
            
            console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(students.length/batchSize)}`);
        }
        
        console.log(`Successfully added ${users.length} users and ${students.length} students with additional programs!`);
        
        // Verify final counts
        const [finalCounts] = await connection.execute('SELECT COUNT(*) as total_students FROM students; SELECT role, COUNT(*) as count FROM users GROUP BY role;');
        console.log('\n=== Final Database State ===');
        console.log(`Total Students: ${finalCounts[0][0].total_students}`);
        console.log('User Distribution:');
        finalCounts[1].forEach(row => {
            console.log(`  ${row.role}: ${row.count}`);
        });
        
        console.log('\n✅ Student restoration completed successfully!');
        console.log('✅ System now includes all programs, not just BSIT and BSCS!');
        
    } catch (error) {
        console.error('Error during restoration:', error);
    } finally {
        await connection.end();
    }
}

addAdditionalStudents();
