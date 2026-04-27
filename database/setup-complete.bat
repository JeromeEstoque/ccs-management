@echo off
echo ========================================
echo Student and Teacher Management System
echo Complete Database Setup (Single File)
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

echo [INFO] MySQL found. Starting complete database setup...
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
set "complete_file=%script_dir%ccs-management.sql"

REM Check if complete file exists
if not exist "%complete_file%" (
    echo [ERROR] ccs-management.sql not found in %script_dir%
    pause
    exit /b 1
)

REM Run complete database setup
echo [INFO] Running complete database setup (schema + seed data)...
echo This may take a few minutes...
echo.

mysql -u %mysql_user% -p%mysql_password% < "%complete_file"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to setup database
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Complete database setup finished!
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
echo COMPLETE SETUP FINISHED!
echo ========================================
echo.
echo Database: ccs_management_system
echo Schema: 13 tables created
echo Data: Sample data loaded
echo.
echo Features included:
echo - Students, Teachers, Courses management
echo - Enrollments, Attendance, Grades tracking
echo - Violations, Certificates management
echo - Audit logging, Views, Stored procedures
echo - Performance indexes and constraints
echo.
echo Connection details:
echo   Host: localhost
echo   Database: ccs_management_system
echo   User: %mysql_user%
echo.
echo Next steps:
echo 1. Update your application configuration
echo 2. Test with provided sample data
echo 3. Start building your application features
echo.
echo For documentation, check: mysql-setup-guide.md
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
        echo.
        echo You can now connect using these credentials in your application.
    )
)

echo.
echo Press any key to exit...
pause >nul
