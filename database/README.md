# Database Mock Data for Student and Teacher Management System

This directory contains comprehensive mock data for the Student and Teacher Management System. The data is designed to provide realistic test scenarios for development, testing, and demonstration purposes.

## Files Overview

### 1. `mock-data.js`
- **Format**: JavaScript ES6 modules
- **Usage**: Import directly in your React components
- **Contains**: Full dataset with utility functions
- **Size**: Complete dataset (5 students, 4 teachers, 12 courses, etc.)

### 2. `mock-data.json`
- **Format**: JSON
- **Usage**: API responses, database seeding, testing
- **Contains**: Sample data (smaller subset)
- **Size**: Sample dataset for quick testing

## Data Structure

### 🎓 Students
```javascript
{
  id: number,
  student_id: string,      // Format: YYYY-XXXX
  first_name: string,
  last_name: string,
  middle_name: string,
  email: string,
  phone: string,
  birth_date: string,      // YYYY-MM-DD
  gender: "Male" | "Female",
  address: string,
  year_level: string,       // "1st Year", "2nd Year", etc.
  section: string,          // "BSIT-3A", "BSCS-4A", etc.
  gpa: string,             // "3.75"
  status_record: "Regular" | "Irregular",
  organization_role: string,
  guardian_name: string,
  guardian_contact: string,
  profile_picture: string | null,
  skills: Array<{name: string, type: string, level: string}>,
  enrolled_courses: Array<number>,
  created_at: string,      // ISO timestamp
  updated_at: string       // ISO timestamp
}
```

### 👨‍🏫 Teachers
```javascript
{
  id: number,
  first_name: string,
  last_name: string,
  middle_name: string,
  email: string,
  phone: string,
  birth_date: string,
  gender: "Male" | "Female",
  address: string,
  position: string,        // "Professor", "Associate Professor", etc.
  department: string,
  specialization: string,
  employee_id: string,     // Format: T-XXX
  hire_date: string,       // YYYY-MM-DD
  status: "Active" | "Inactive",
  profile_picture: string | null,
  expertise: Array<string>,
  advisory_section: string,
  teaching_load: number,   // Units per semester
  capstone_adviser_available: boolean,
  capstone_schedule: string | null,
  courses_taught: Array<number>,
  created_at: string,
  updated_at: string
}
```

### 📚 Courses
```javascript
{
  id: number,
  course_code: string,     // "CS101", "IS201", etc.
  course_name: string,
  description: string,
  credits: number,
  year_level: string,
  semester: "First" | "Second",
  department: string,
  prerequisite: number | null,
  instructor_id: number,
  schedule: string,        // "MWF 8:00 AM - 9:00 AM"
  room: string,
  max_students: number,
  current_enrollment: number,
  status: "Active" | "Inactive",
  created_at: string,
  updated_at: string
}
```

### 📝 Enrollments
```javascript
{
  id: number,
  student_id: number,
  course_id: number,
  enrollment_date: string, // YYYY-MM-DD
  status: "Enrolled" | "Completed" | "Dropped",
  grade: string | null,    // "1.75", "1.0", etc.
  instructor_id: number,
  semester: string,
  academic_year: string,   // "2023-2024"
  created_at: string,
  updated_at: string
}
```

### 📊 Attendance
```javascript
{
  id: number,
  student_id: number,
  course_id: number,
  date: string,           // YYYY-MM-DD
  status: "Present" | "Absent" | "Late" | "Excused",
  time_in: string | null, // "8:00 AM"
  time_out: string | null, // "9:00 AM"
  instructor_id: number,
  remarks: string | null,
  created_at: string,
  updated_at: string
}
```

### ⚠️ Violations
```javascript
{
  id: number,
  student_id: number,
  teacher_id: number,
  violation_type: string,
  description: string,
  severity: "Minor" | "Moderate" | "Major",
  date: string,
  status: "Pending" | "Resolved" | "Under Review",
  action_taken: string | null,
  points_deducted: number | null,
  created_at: string,
  updated_at: string
}
```

### 🏆 Certificates
```javascript
{
  id: number,
  student_id: number,
  certificate_name: string,
  description: string,
  issuing_organization: string,
  issue_date: string,
  expiry_date: string | null,
  certificate_type: "Academic" | "Sports" | "Professional",
  file_url: string,
  status: "Verified" | "Pending" | "Rejected",
  created_at: string,
  updated_at: string
}
```

### 📈 Grades
```javascript
{
  id: number,
  student_id: number,
  course_id: number,
  instructor_id: number,
  grade: string,          // "1.75"
  grade_points: number,    // 3.0
  letter_grade: string,    // "B+", "A-", etc.
  semester: string,
  academic_year: string,
  grading_period: "Midterm" | "Final",
  date_posted: string,
  remarks: string | null,
  created_at: string,
  updated_at: string
}
```

## Usage Examples

### In React Components (JavaScript)
```javascript
import { students, teachers, courses, getStudentById } from '../database/mock-data.js';

// Get all students
const allStudents = students;

// Get specific student
const student = getStudentById(1);

// Get courses for a student
const studentCourses = courses.filter(course => 
  student.enrolled_courses.includes(course.id)
);
```

### For API Mocking (JSON)
```javascript
// mock-api.js
import mockData from '../database/mock-data.json';

export const getStudents = () => {
  return Promise.resolve({
    data: { success: true, students: mockData.students }
  });
};

export const getStudentById = (id) => {
  const student = mockData.students.find(s => s.id === parseInt(id));
  return Promise.resolve({
    data: { success: true, student }
  });
};
```

### Database Seeding (SQL)
```sql
-- Students
INSERT INTO students (student_id, first_name, last_name, email, year_level, section, gpa)
VALUES 
  ('2023-1001', 'John', 'Doe', 'john.doe@ccs.edu', '3rd Year', 'BSIT-3A', '3.75'),
  ('2023-1002', 'Jane', 'Smith', 'jane.smith@ccs.edu', '3rd Year', 'BSIT-3B', '3.92');

-- Teachers
INSERT INTO teachers (employee_id, first_name, last_name, email, position, department)
VALUES 
  ('T-001', 'Sarah', 'Johnson', 'sarah.johnson@ccs.edu', 'Associate Professor', 'College of Computer Studies'),
  ('T-002', 'Michael', 'Chen', 'michael.chen@ccs.edu', 'Assistant Professor', 'College of Computer Studies');
```

## System Statistics

The mock data includes realistic system statistics:

```javascript
{
  totalStudents: 1247,      // Total enrolled students
  totalTeachers: 89,        // Total active teachers
  activeCourses: 45,         // Courses this semester
  pendingEnrollments: 156,   // Students waiting approval
  upcomingClasses: 23,       // Classes in next 7 days
  recentGrades: 78,          // Grades posted this week
  attendanceRate: 92.5,      // Percentage attendance
  averageGPA: 3.4,          // Institutional average
  totalViolations: 45,       // Total disciplinary records
  resolvedViolations: 32,    // Resolved cases
  pendingViolations: 13,     // Pending cases
  totalCertificates: 234,    // Total certificates issued
  verifiedCertificates: 198, // Verified certificates
  pendingCertificates: 36    // Pending verification
}
```

## Data Relationships

### Primary Relationships
- **Students → Enrollments → Courses** (Many-to-Many)
- **Teachers → Courses** (One-to-Many)
- **Students → Attendance** (One-to-Many)
- **Students → Violations** (One-to-Many)
- **Students → Certificates** (One-to-Many)
- **Students → Grades** (One-to-Many)

### Advisory Relationships
- **Teachers → Advisory Sections** (One-to-One)
- **Teachers → Capstone Students** (One-to-Many)

## Grade Scale (Philippine System)

| Grade | Grade Points | Letter Grade | Description |
|-------|-------------|--------------|-------------|
| 1.0   | 4.0         | A+           | Excellent |
| 1.25  | 3.75        | A            | Outstanding |
| 1.5   | 3.5         | A-           | Very Good |
| 1.75  | 3.0         | B+           | Good |
| 2.0   | 2.75        | B            | Satisfactory |
| 2.25  | 2.5         | B-           | Fair |
| 2.5   | 2.25        | C+           | Acceptable |
| 2.75  | 2.0         | C            | Passing |
| 3.0   | 1.75        | C-           | Conditional |
| 4.0   | 1.0         | D            | Failed |
| 5.0   | 0.0         | F            | Failed |

## Integration Tips

### 1. API Integration
```javascript
// services/api.js
import mockData from '../database/mock-data.json';

export const studentsAPI = {
  getAll: () => Promise.resolve({ data: { success: true, students: mockData.students } }),
  getById: (id) => {
    const student = mockData.students.find(s => s.id === parseInt(id));
    return Promise.resolve({ data: { success: true, student } });
  },
  create: (data) => {
    const newStudent = { id: mockData.students.length + 1, ...data };
    mockData.students.push(newStudent);
    return Promise.resolve({ data: { success: true, student: newStudent } });
  }
};
```

### 2. React Query Integration
```javascript
// hooks/useStudents.js
import { useQuery } from 'react-query';
import { studentsAPI } from '../services/api';

export const useStudents = () => {
  return useQuery('students', studentsAPI.getAll);
};

export const useStudent = (id) => {
  return useQuery(['student', id], () => studentsAPI.getById(id));
};
```

### 3. Form Validation
```javascript
// validation/studentSchema.js
export const studentValidation = {
  first_name: { required: true, minLength: 2 },
  last_name: { required: true, minLength: 2 },
  email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  student_id: { required: true, pattern: /^\d{4}-\d{4}$/ },
  gpa: { required: true, min: 1.0, max: 4.0 }
};
```

## Customization

### Adding More Data
1. **Students**: Copy existing student structure and modify details
2. **Teachers**: Follow the same pattern with different specializations
3. **Courses**: Add new course codes and descriptions
4. **Relationships**: Update IDs to maintain referential integrity

### Local Development
```javascript
// For development, you can override mock data
const devOverrides = {
  students: [
    ...mockData.students,
    {
      id: 999,
      student_id: "DEV-001",
      first_name: "Dev",
      last_name: "User",
      // ... other fields
    }
  ]
};
```

## Testing Scenarios

The mock data supports various testing scenarios:

### 1. Dashboard Testing
- Multiple student records for statistics
- Different GPA ranges for performance metrics
- Various violation types for disciplinary tracking

### 2. Enrollment Testing
- Course capacity limits
- Prerequisite validation
- Schedule conflicts

### 3. Grade Management
- Different grade scales
- Multiple grading periods
- Grade posting workflows

### 4. Attendance Tracking
- Various attendance statuses
- Time-in/time-out records
- Attendance rate calculations

### 5. Certificate Management
- Different certificate types
- Verification workflows
- File upload scenarios

## File Structure

```
database/
├── mock-data.js          # Full JavaScript dataset
├── mock-data.json        # JSON sample dataset
├── README.md             # This documentation
└── sql-seeds/            # SQL seed files (optional)
    ├── students.sql
    ├── teachers.sql
    ├── courses.sql
    └── relationships.sql
```

## Best Practices

1. **Data Consistency**: Always maintain referential integrity
2. **Realistic Values**: Use plausible names, emails, and dates
3. **Edge Cases**: Include various scenarios (high/low GPA, violations, etc.)
4. **Performance**: Keep JSON files manageable for loading speed
5. **Version Control**: Track changes to mock data structure

## Support

For questions or issues with the mock data:
1. Check the data structure documentation above
2. Verify relationships between entities
3. Ensure data types match your schema requirements
4. Test with the provided utility functions

This mock data is designed to be comprehensive yet flexible, allowing you to develop and test your Student and Teacher Management System effectively.
