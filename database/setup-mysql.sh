#!/bin/bash

# Student and Teacher Management System
# MySQL Database Setup Script for Linux/Mac

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

echo "========================================"
echo "Student and Teacher Management System"
echo "MySQL Database Setup Script"
echo "========================================"
echo

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    print_error "MySQL is not installed"
    echo "Please install MySQL 8.0+:"
    echo "  Ubuntu/Debian: sudo apt-get install mysql-server"
    echo "  CentOS/RHEL: sudo yum install mysql-server"
    echo "  macOS: brew install mysql"
    exit 1
fi

print_status "MySQL found. Starting database setup..."

# Get MySQL credentials
read -p "Enter MySQL username (default: root): " mysql_user
mysql_user=${mysql_user:-root}

read -s -p "Enter MySQL password: " mysql_password
echo

# Test connection
print_status "Testing MySQL connection..."
if ! mysql -u "$mysql_user" -p"$mysql_password" -e "SELECT 1;" &> /dev/null; then
    print_error "Cannot connect to MySQL with provided credentials"
    echo "Please verify your username and password"
    exit 1
fi

print_success "Connected to MySQL successfully!"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCHEMA_FILE="$SCRIPT_DIR/schema.sql"
SEEDS_DIR="$SCRIPT_DIR/sql-seeds/"

# Check if files exist
if [[ ! -f "$SCHEMA_FILE" ]]; then
    print_error "schema.sql not found in $SCRIPT_DIR"
    exit 1
fi

if [[ ! -f "$SEEDS_DIR/01-students.sql" ]]; then
    print_error "Seed files not found in $SEEDS_DIR"
    exit 1
fi

# Create database and schema
print_status "Creating database schema..."
if mysql -u "$mysql_user" -p"$mysql_password" < "$SCHEMA_FILE"; then
    print_success "Database schema created!"
else
    print_error "Failed to create database schema"
    exit 1
fi

# Insert seed data
print_status "Inserting sample data..."

print_status "[1/4] Inserting students..."
if mysql -u "$mysql_user" -p"$mysql_password" ccs_management_system < "$SEEDS_DIR/01-students.sql"; then
    print_success "Students data inserted!"
else
    print_error "Failed to insert students data"
    exit 1
fi

print_status "[2/4] Inserting teachers..."
if mysql -u "$mysql_user" -p"$mysql_password" ccs_management_system < "$SEEDS_DIR/02-teachers.sql"; then
    print_success "Teachers data inserted!"
else
    print_error "Failed to insert teachers data"
    exit 1
fi

print_status "[3/4] Inserting courses..."
if mysql -u "$mysql_user" -p"$mysql_password" ccs_management_system < "$SEEDS_DIR/03-courses.sql"; then
    print_success "Courses data inserted!"
else
    print_error "Failed to insert courses data"
    exit 1
fi

print_status "[4/4] Inserting relationships..."
if mysql -u "$mysql_user" -p"$mysql_password" ccs_management_system < "$SEEDS_DIR/04-relationships.sql"; then
    print_success "Relationships data inserted!"
else
    print_error "Failed to insert relationships data"
    exit 1
fi

print_success "All sample data inserted!"

# Verification
print_status "Verifying installation..."
if mysql -u "$mysql_user" -p"$mysql_password" -e "
USE ccs_management_system;
SELECT 'Database Setup Verification' as status;
SELECT 'Students' as table_name, COUNT(*) as record_count FROM students
UNION ALL
SELECT 'Teachers', COUNT(*) FROM teachers
UNION ALL
SELECT 'Courses', COUNT(*) FROM courses
UNION ALL
SELECT 'Enrollments', COUNT(*) FROM enrollments
UNION ALL
SELECT 'Attendance Records', COUNT(*) FROM attendance
UNION ALL
SELECT 'Grade Records', COUNT(*) FROM grades
UNION ALL
SELECT 'Violations', COUNT(*) FROM violations
UNION ALL
SELECT 'Certificates', COUNT(*) FROM certificates;
" 2>/dev/null; then
    print_success "Database verification completed!"
else
    print_warning "Verification query failed, but setup may still be successful"
fi

echo
echo "========================================"
echo "SETUP COMPLETED SUCCESSFULLY!"
echo "========================================"
echo
echo "Database: ccs_management_system"
echo "Tables: 13"
echo "Sample Data: Loaded"
echo
echo "Next Steps:"
echo "1. Update your application database configuration"
echo "2. Connect using:"
echo "   Host: localhost"
echo "   Database: ccs_management_system"
echo "   User: $mysql_user"
echo "3. Test with sample queries in mysql-setup-guide.md"
echo
echo "For help, check: mysql-setup-guide.md"
echo

# Ask if user wants to create application user
read -p "Create application user? (y/n): " create_app_user
if [[ $create_app_user =~ ^[Yy]$ ]]; then
    echo
    print_status "Creating application user..."
    
    read -p "Enter application username (default: ccs_app): " app_user
    app_user=${app_user:-ccs_app}
    
    read -s -p "Enter application password: " app_password
    echo
    
    if [[ -z "$app_password" ]]; then
        print_error "Application password cannot be empty"
        exit 1
    fi
    
    if mysql -u "$mysql_user" -p"$mysql_password" -e "
    USE ccs_management_system;
    CREATE USER '$app_user'@'localhost' IDENTIFIED BY '$app_password';
    GRANT SELECT, INSERT, UPDATE, DELETE ON ccs_management_system.* TO '$app_user'@'localhost';
    GRANT EXECUTE ON ccs_management_system.* TO '$app_user'@'localhost';
    FLUSH PRIVILEGES;
    " 2>/dev/null; then
        print_success "Application user created successfully!"
        echo "Username: $app_user"
        echo "Password: [hidden]"
    else
        print_error "Failed to create application user"
    fi
fi

echo
print_success "MySQL database setup is complete!"
