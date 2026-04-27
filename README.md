# CCS Management System

A centralized academic management platform for the College of Computer Studies designed to manage student records, faculty profiles, academic assignments, violations monitoring, and capstone adviser availability.

## 🚀 Features

### Multi-Role Authentication System
- **Student Login** - Student ID + Password authentication
- **Teacher Login** - Email + Password authentication
- **Admin Login** - Username/Email + Password authentication
- JWT-based authentication with token expiration
- Account lockout after failed attempts
- Password hashing with bcrypt

### Student Module
- Profile management (personal, academic, guardian info)
- Skills tracking (Programming, Networking, Database, UI/UX, Cybersecurity)
- Sports participation tracking
- Certificate uploads and management
- Violations view (read-only)
- Achievement records

### Teacher Module
- Profile management with expertise areas
- Section advisory management
- Violation encoding for students
- Capstone adviser availability toggle
- Capstone group request management (approve/reject)

### Admin Module
- Full CRUD operations for students and teachers
- User management (activate/deactivate accounts)
- Password reset functionality
- Dashboard analytics with charts
- System audit logs
- Bulk student import

### Security Features
- Password hashing (bcrypt)
- JWT Authentication
- Protected routes
- Role-based middleware
- Account lockout after failed attempts
- Audit logging

## 🛠 Tech Stack

### Frontend
- React.js 18
- React Router v6
- Context API for state management
- Axios for API calls
- Tailwind CSS for styling
- Recharts for data visualization
- Lucide React for icons

### Backend
- Node.js
- Express.js
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads

### Database
- MySQL

## 📁 Project Structure

```
ccs-management-system/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── initDatabase.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── teachers.js
│   │   ├── admin.js
│   │   ├── violations.js
│   │   ├── certificates.js
│   │   └── dashboard.js
│   ├── uploads/
│   │   ├── certificates/
│   │   └── profiles/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Card.js
│   │   │   │   ├── LoadingSpinner.js
│   │   │   │   ├── Modal.js
│   │   │   │   └── StatCard.js
│   │   │   └── Layout.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── StudentLogin.js
│   │   │   │   ├── TeacherLogin.js
│   │   │   │   └── AdminLogin.js
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.js
│   │   │   │   ├── StudentProfile.js
│   │   │   │   ├── StudentViolations.js
│   │   │   │   └── StudentCertificates.js
│   │   │   ├── teacher/
│   │   │   │   ├── TeacherDashboard.js
│   │   │   │   ├── TeacherProfile.js
│   │   │   │   ├── EncodeViolation.js
│   │   │   │   ├── CapstoneManagement.js
│   │   │   │   └── AdvisoryStudents.js
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   ├── ManageStudents.js
│   │   │   │   ├── ManageTeachers.js
│   │   │   │   ├── ManageViolations.js
│   │   │   │   ├── SystemLogs.js
│   │   │   │   └── UserManagement.js
│   │   │   └── LandingPage.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ccs-management-system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your database credentials
```

Update `.env` file:
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ccs_management

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=24h
```

```bash
# Initialize database (creates tables and default admin)
npm run init-db

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 🔐 Default Credentials

### Admin Account
- **Username:** admin
- **Password:** admin123

> ⚠️ **Important:** Change the default admin password immediately after first login!

## 📊 Database Schema

### Core Tables
- `users` - Authentication and user accounts
- `students` - Student profiles and information
- `teachers` - Teacher profiles and information
- `violations` - Student violation records
- `certificates` - Student certificate uploads
- `achievements` - Student achievements
- `skills` - Available skills/sports
- `student_skills` - Student-skill relationships
- `teacher_expertise` - Teacher expertise areas
- `capstone_groups` - Capstone group records
- `audit_logs` - System activity logs

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/teacher/login` - Teacher login
- `POST /api/auth/admin/login` - Admin login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout

### Students
- `GET /api/students` - Get all students (Admin/Teacher)
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create student (Admin)
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student (Admin)
- `POST /api/students/:id/reset-password` - Reset password (Admin)

### Teachers
- `GET /api/teachers` - Get all teachers (Admin)
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create teacher (Admin)
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher (Admin)
- `PUT /api/teachers/:id/capstone-availability` - Toggle capstone availability

### Violations
- `GET /api/violations` - Get all violations
- `POST /api/violations` - Create violation (Admin/Teacher)
- `PUT /api/violations/:id` - Update violation
- `PUT /api/violations/:id/resolve` - Resolve violation
- `DELETE /api/violations/:id` - Delete violation (Admin)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/charts/*` - Get chart data

## 📝 License

This project is created for educational purposes for the College of Computer Studies.

## 👥 Authors

CCS Management System Development Team
