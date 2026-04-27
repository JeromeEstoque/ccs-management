@echo off
echo ========================================
echo Student and Teacher Management System
echo MySQL Database Setup Script
echo ========================================
echo.

REM Check if MySQL is installed
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MySQL is not installed or not in PATH
    echo Please install MySQL 8.0+ and add it to your PATH
    echo Download from: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
)

echo [INFO] MySQL found. Starting database setup...
echo.

REM Get MySQL credentials
set /p mysql_user="Enter MySQL username (default: root): "
if "%mysql_user%"=="" set mysql_user=root

set /p mysql_password="Enter MySQL password: "

REM Test connection
echo [INFO] Testing MySQL connection...
mysql -u %mysql_user% -p%mysql_password% -e "SELECT 1;" >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Cannot connect to MySQL with provided credentials
    echo Please verify your username and password
    pause
    exit /b 1
)

echo [SUCCESS] Connected to MySQL successfully!
echo.

REM Get current directory
set "script_dir=%~dp0"
set "schema_file=%script_dir%schema.sql"
set "seeds_dir=%script_dir%sql-seeds\"

REM Check if files exist
if not exist "%schema_file%" (
    echo [ERROR] schema.sql not found in %script_dir%
    pause
    exit /b 1
)

if not exist "%seeds_dir%01-students.sql" (
    echo [ERROR] Seed files not found in %seeds_dir%
    pause
    exit /b 1
)

REM Create database and schema
echo [INFO] Creating database schema...
mysql -u %mysql_user% -p%mysql_password% < "%schema_file%"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create database schema
    pause
    exit /b 1
)

echo [SUCCESS] Database schema created!
echo.

REM Insert seed data
echo [INFO] Inserting sample data...

echo [1/4] Inserting students...
mysql -u %mysql_user% -p%mysql_password% ccs_management_system < "%seeds_dir%01-students.sql"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to insert students data
    pause
    exit /b 1
)

echo [2/4] Inserting teachers...
mysql -u %mysql_user% -p%mysql_password% ccs_management_system < "%seeds_dir%02-teachers.sql"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to insert teachers data
    pause
    exit /b 1
)

echo [3/4] Inserting courses...
mysql -u %mysql_user% -p%mysql_password% ccs_management_system < "%seeds_dir%03-courses.sql"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to insert courses data
    pause
    exit /b 1
)

echo [4/4] Inserting relationships...
mysql -u %mysql_user% -p%mysql_password% ccs_management_system < "%seeds_dir%04-relationships.sql"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to insert relationships data
    pause
    exit /b 1
)

echo [SUCCESS] All sample data inserted!
echo.

REM Verification
echo [INFO] Verifying installation...
mysql -u %mysql_user% -p%mysql_password% -e "
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
"

if %errorlevel% neq 0 (
    echo [WARNING] Verification query failed, but setup may still be successful
) else (
    echo [SUCCESS] Database verification completed!
)

echo.
echo ========================================
echo SETUP COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Database: ccs_management_system
echo Tables: 13
echo Sample Data: Loaded
echo.
echo Next Steps:
echo 1. Update your application database configuration
echo 2. Connect using: 
echo    Host: localhost
echo    Database: ccs_management_system
echo    User: %mysql_user%
echo 3. Test with sample queries in mysql-setup-guide.md
echo.
echo For help, check: mysql-setup-guide.md
echo.

REM Ask if user wants to create application user
set /p create_app_user="Create application user? (y/n): "
if /i "%create_app_user%"=="y" (
    echo.
    echo [INFO] Creating application user...
    
    set /p app_user="Enter application username (default: ccs_app): "
    if "%app_user%"=="" set app_user=ccs_app
    
    set /p app_password="Enter application password: "
    if "%app_password%"=="" (
        echo [ERROR] Application password cannot be empty
        pause
        exit /b 1
    )
    
    mysql -u %mysql_user% -p%mysql_password% -e "
    USE ccs_management_system;
    CREATE USER '%app_user%'@'localhost' IDENTIFIED BY '%app_password%';
    GRANT SELECT, INSERT, UPDATE, DELETE ON ccs_management_system.* TO '%app_user%'@'localhost';
    GRANT EXECUTE ON ccs_management_system.* TO '%app_user%'@'localhost';
    FLUSH PRIVILEGES;
    "
    
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create application user
    ) else (
        echo [SUCCESS] Application user created successfully!
        echo Username: %app_user%
        echo Password: [hidden]
    )
)

echo.
echo Press any key to exit...
pause >nul
