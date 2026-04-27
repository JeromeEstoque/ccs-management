// API Integration Guide for Mock Data
// Student and Teacher Management System

import mockData from './mock-data.json';

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Generic API response wrapper
const createResponse = (success, data, message = '') => ({
  success,
  data,
  message,
  timestamp: new Date().toISOString()
});

// ==================== STUDENTS API ====================
export const studentsAPI = {
  // Get all students
  getAll: async () => {
    await delay();
    return createResponse(true, mockData.students, 'Students retrieved successfully');
  },

  // Get student by ID
  getById: async (id) => {
    await delay();
    const student = mockData.students.find(s => s.id === parseInt(id));
    if (!student) {
      return createResponse(false, null, 'Student not found');
    }
    return createResponse(true, student, 'Student retrieved successfully');
  },

  // Create new student
  create: async (studentData) => {
    await delay();
    const newStudent = {
      id: mockData.students.length + 1,
      student_id: `2023-${String(mockData.students.length + 1001).padStart(4, '0')}`,
      ...studentData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockData.students.push(newStudent);
    return createResponse(true, newStudent, 'Student created successfully');
  },

  // Update student
  update: async (id, studentData) => {
    await delay();
    const index = mockData.students.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      return createResponse(false, null, 'Student not found');
    }
    mockData.students[index] = {
      ...mockData.students[index],
      ...studentData,
      updated_at: new Date().toISOString()
    };
    return createResponse(true, mockData.students[index], 'Student updated successfully');
  },

  // Delete student
  delete: async (id) => {
    await delay();
    const index = mockData.students.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      return createResponse(false, null, 'Student not found');
    }
    const deletedStudent = mockData.students.splice(index, 1)[0];
    return createResponse(true, deletedStudent, 'Student deleted successfully');
  },

  // Get student statistics
  getStats: async () => {
    await delay();
    const stats = {
      total: mockData.students.length,
      byYearLevel: mockData.students.reduce((acc, student) => {
        acc[student.year_level] = (acc[student.year_level] || 0) + 1;
        return acc;
      }, {}),
      bySection: mockData.students.reduce((acc, student) => {
        acc[student.section] = (acc[student.section] || 0) + 1;
        return acc;
      }, {}),
      averageGPA: (mockData.students.reduce((sum, s) => sum + parseFloat(s.gpa), 0) / mockData.students.length).toFixed(2)
    };
    return createResponse(true, stats, 'Student statistics retrieved successfully');
  }
};

// ==================== TEACHERS API ====================
export const teachersAPI = {
  // Get all teachers
  getAll: async () => {
    await delay();
    return createResponse(true, mockData.teachers, 'Teachers retrieved successfully');
  },

  // Get teacher by ID
  getById: async (id) => {
    await delay();
    const teacher = mockData.teachers.find(t => t.id === parseInt(id));
    if (!teacher) {
      return createResponse(false, null, 'Teacher not found');
    }
    return createResponse(true, teacher, 'Teacher retrieved successfully');
  },

  // Create new teacher
  create: async (teacherData) => {
    await delay();
    const newTeacher = {
      id: mockData.teachers.length + 1,
      employee_id: `T-${String(mockData.teachers.length + 1).padStart(3, '0')}`,
      ...teacherData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockData.teachers.push(newTeacher);
    return createResponse(true, newTeacher, 'Teacher created successfully');
  },

  // Update teacher
  update: async (id, teacherData) => {
    await delay();
    const index = mockData.teachers.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
      return createResponse(false, null, 'Teacher not found');
    }
    mockData.teachers[index] = {
      ...mockData.teachers[index],
      ...teacherData,
      updated_at: new Date().toISOString()
    };
    return createResponse(true, mockData.teachers[index], 'Teacher updated successfully');
  },

  // Get teacher statistics
  getStats: async () => {
    await delay();
    const stats = {
      total: mockData.teachers.length,
      byPosition: mockData.teachers.reduce((acc, teacher) => {
        acc[teacher.position] = (acc[teacher.position] || 0) + 1;
        return acc;
      }, {}),
      byDepartment: mockData.teachers.reduce((acc, teacher) => {
        acc[teacher.department] = (acc[teacher.department] || 0) + 1;
        return acc;
      }, {}),
      averageTeachingLoad: (mockData.teachers.reduce((sum, t) => sum + t.teaching_load, 0) / mockData.teachers.length).toFixed(1)
    };
    return createResponse(true, stats, 'Teacher statistics retrieved successfully');
  }
};

// ==================== COURSES API ====================
export const coursesAPI = {
  // Get all courses
  getAll: async () => {
    await delay();
    return createResponse(true, mockData.courses, 'Courses retrieved successfully');
  },

  // Get course by ID
  getById: async (id) => {
    await delay();
    const course = mockData.courses.find(c => c.id === parseInt(id));
    if (!course) {
      return createResponse(false, null, 'Course not found');
    }
    return createResponse(true, course, 'Course retrieved successfully');
  },

  // Get courses by instructor
  getByInstructor: async (instructorId) => {
    await delay();
    const courses = mockData.courses.filter(c => c.instructor_id === parseInt(instructorId));
    return createResponse(true, courses, 'Instructor courses retrieved successfully');
  },

  // Enroll student in course
  enrollStudent: async (studentId, courseId) => {
    await delay();
    const enrollment = {
      id: mockData.enrollments.length + 1,
      student_id: parseInt(studentId),
      course_id: parseInt(courseId),
      enrollment_date: new Date().toISOString().split('T')[0],
      status: 'Enrolled',
      grade: null,
      instructor_id: mockData.courses.find(c => c.id === parseInt(courseId)).instructor_id,
      semester: 'First',
      academic_year: '2023-2024',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockData.enrollments.push(enrollment);
    return createResponse(true, enrollment, 'Student enrolled successfully');
  }
};

// ==================== ATTENDANCE API ====================
export const attendanceAPI = {
  // Get attendance by student
  getByStudent: async (studentId) => {
    await delay();
    const attendance = mockData.attendance.filter(a => a.student_id === parseInt(studentId));
    return createResponse(true, attendance, 'Student attendance retrieved successfully');
  },

  // Get attendance by course
  getByCourse: async (courseId) => {
    await delay();
    const attendance = mockData.attendance.filter(a => a.course_id === parseInt(courseId));
    return createResponse(true, attendance, 'Course attendance retrieved successfully');
  },

  // Mark attendance
  markAttendance: async (attendanceData) => {
    await delay();
    const newAttendance = {
      id: mockData.attendance.length + 1,
      ...attendanceData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockData.attendance.push(newAttendance);
    return createResponse(true, newAttendance, 'Attendance marked successfully');
  },

  // Get attendance statistics
  getStats: async () => {
    await delay();
    const totalRecords = mockData.attendance.length;
    const presentCount = mockData.attendance.filter(a => a.status === 'Present').length;
    const absentCount = mockData.attendance.filter(a => a.status === 'Absent').length;
    const lateCount = mockData.attendance.filter(a => a.status === 'Late').length;
    
    const stats = {
      total: totalRecords,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      attendanceRate: ((presentCount / totalRecords) * 100).toFixed(1)
    };
    return createResponse(true, stats, 'Attendance statistics retrieved successfully');
  }
};

// ==================== GRADES API ====================
export const gradesAPI = {
  // Get grades by student
  getByStudent: async (studentId) => {
    await delay();
    const grades = mockData.grades.filter(g => g.student_id === parseInt(studentId));
    return createResponse(true, grades, 'Student grades retrieved successfully');
  },

  // Get grades by course
  getByCourse: async (courseId) => {
    await delay();
    const grades = mockData.grades.filter(g => g.course_id === parseInt(courseId));
    return createResponse(true, grades, 'Course grades retrieved successfully');
  },

  // Post grade
  postGrade: async (gradeData) => {
    await delay();
    const newGrade = {
      id: mockData.grades.length + 1,
      ...gradeData,
      date_posted: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockData.grades.push(newGrade);
    return createResponse(true, newGrade, 'Grade posted successfully');
  }
};

// ==================== VIOLATIONS API ====================
export const violationsAPI = {
  // Get violations by student
  getByStudent: async (studentId) => {
    await delay();
    const violations = mockData.violations.filter(v => v.student_id === parseInt(studentId));
    return createResponse(true, violations, 'Student violations retrieved successfully');
  },

  // Get violations by teacher
  getByTeacher: async (teacherId) => {
    await delay();
    const violations = mockData.violations.filter(v => v.teacher_id === parseInt(teacherId));
    return createResponse(true, violations, 'Teacher violations retrieved successfully');
  },

  // Create violation
  create: async (violationData) => {
    await delay();
    const newViolation = {
      id: mockData.violations.length + 1,
      ...violationData,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockData.violations.push(newViolation);
    return createResponse(true, newViolation, 'Violation created successfully');
  }
};

// ==================== CERTIFICATES API ====================
export const certificatesAPI = {
  // Get certificates by student
  getByStudent: async (studentId) => {
    await delay();
    const certificates = mockData.certificates.filter(c => c.student_id === parseInt(studentId));
    return createResponse(true, certificates, 'Student certificates retrieved successfully');
  },

  // Upload certificate
  upload: async (certificateData) => {
    await delay();
    const newCertificate = {
      id: mockData.certificates.length + 1,
      ...certificateData,
      issue_date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockData.certificates.push(newCertificate);
    return createResponse(true, newCertificate, 'Certificate uploaded successfully');
  }
};

// ==================== DASHBOARD API ====================
export const dashboardAPI = {
  // Get system statistics
  getStats: async () => {
    await delay();
    return createResponse(true, mockData.systemStats, 'System statistics retrieved successfully');
  },

  // Get recent activity
  getRecentActivity: async () => {
    await delay();
    const activities = [
      {
        type: 'student_enrolled',
        student: 'John Doe',
        course: 'Computer Science 101',
        time: '2 hours ago'
      },
      {
        type: 'grade_posted',
        teacher: 'Prof. Smith',
        course: 'Mathematics 202',
        time: '4 hours ago'
      },
      {
        type: 'violation_recorded',
        student: 'Alice Brown',
        violation: 'Late Submission',
        time: '6 hours ago'
      }
    ];
    return createResponse(true, activities, 'Recent activity retrieved successfully');
  }
};

// ==================== EXPORT ALL APIS ====================
export default {
  students: studentsAPI,
  teachers: teachersAPI,
  courses: coursesAPI,
  attendance: attendanceAPI,
  grades: gradesAPI,
  violations: violationsAPI,
  certificates: certificatesAPI,
  dashboard: dashboardAPI
};
