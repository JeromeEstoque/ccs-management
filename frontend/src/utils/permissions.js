/**
 * Role-Based Access Control (RBAC) System
 * Student and Teacher Management System
 */

// Role definitions with permissions
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student'
};

// Permission definitions
export const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Student Management
  STUDENT_CREATE: 'student:create',
  STUDENT_READ: 'student:read',
  STUDENT_UPDATE: 'student:update',
  STUDENT_DELETE: 'student:delete',
  STUDENT_EXPORT: 'student:export',
  
  // Teacher Management
  TEACHER_CREATE: 'teacher:create',
  TEACHER_READ: 'teacher:read',
  TEACHER_UPDATE: 'teacher:update',
  TEACHER_DELETE: 'teacher:delete',
  TEACHER_EXPORT: 'teacher:export',
  
  // Violation Management
  VIOLATION_CREATE: 'violation:create',
  VIOLATION_READ: 'violation:read',
  VIOLATION_UPDATE: 'violation:update',
  VIOLATION_DELETE: 'violation:delete',
  VIOLATION_EXPORT: 'violation:export',
  
  // Course Management
  COURSE_CREATE: 'course:create',
  COURSE_READ: 'course:read',
  COURSE_UPDATE: 'course:update',
  COURSE_DELETE: 'course:delete',
  
  // Grade Management
  GRADE_CREATE: 'grade:create',
  GRADE_READ: 'grade:read',
  GRADE_UPDATE: 'grade:update',
  GRADE_DELETE: 'grade:delete',
  GRADE_EXPORT: 'grade:export',
  
  // Certificate Management
  CERTIFICATE_CREATE: 'certificate:create',
  CERTIFICATE_READ: 'certificate:read',
  CERTIFICATE_UPDATE: 'certificate:update',
  CERTIFICATE_DELETE: 'certificate:delete',
  CERTIFICATE_EXPORT: 'certificate:export',
  
  // System Management
  SYSTEM_CONFIG: 'system:config',
  SYSTEM_BACKUP: 'system:backup',
  SYSTEM_RESTORE: 'system:restore',
  SYSTEM_LOGS: 'system:logs',
  SYSTEM_ANALYTICS: 'system:analytics',
  
  // Attendance Management
  ATTENDANCE_CREATE: 'attendance:create',
  ATTENDANCE_READ: 'attendance:read',
  ATTENDANCE_UPDATE: 'attendance:update',
  ATTENDANCE_EXPORT: 'attendance:export',
  
  // Capstone Management
  CAPSTONE_CREATE: 'capstone:create',
  CAPSTONE_READ: 'capstone:read',
  CAPSTONE_UPDATE: 'capstone:update',
  CAPSTONE_DELETE: 'capstone:delete',
  CAPSTONE_APPROVE: 'capstone:approve',
  
  // Advisory Management
  ADVISORY_READ: 'advisory:read',
  ADVISORY_UPDATE: 'advisory:update',
  
  // Profile Management
  PROFILE_READ: 'profile:read',
  PROFILE_UPDATE: 'profile:update',
  
  // Dashboard Access
  DASHBOARD_VIEW: 'dashboard:view',
  DASHBOARD_ADMIN: 'dashboard:admin',
  
  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_CREATE: 'reports:create',
  REPORTS_EXPORT: 'reports:export'
};

// Role permissions mapping
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // Super Admin has all permissions
    ...Object.values(PERMISSIONS)
  ],
  
  [ROLES.ADMIN]: [
    // User Management
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_READ,
    PERMISSIONS.USER_UPDATE,
    PERMISSIONS.USER_DELETE,
    
    // Student Management
    PERMISSIONS.STUDENT_CREATE,
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.STUDENT_UPDATE,
    PERMISSIONS.STUDENT_DELETE,
    PERMISSIONS.STUDENT_EXPORT,
    
    // Teacher Management
    PERMISSIONS.TEACHER_CREATE,
    PERMISSIONS.TEACHER_READ,
    PERMISSIONS.TEACHER_UPDATE,
    PERMISSIONS.TEACHER_DELETE,
    PERMISSIONS.TEACHER_EXPORT,
    
    // Violation Management
    PERMISSIONS.VIOLATION_CREATE,
    PERMISSIONS.VIOLATION_READ,
    PERMISSIONS.VIOLATION_UPDATE,
    PERMISSIONS.VIOLATION_DELETE,
    PERMISSIONS.VIOLATION_EXPORT,
    
    // Course Management
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_READ,
    PERMISSIONS.COURSE_UPDATE,
    PERMISSIONS.COURSE_DELETE,
    
    // Grade Management
    PERMISSIONS.GRADE_CREATE,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.GRADE_UPDATE,
    PERMISSIONS.GRADE_EXPORT,
    
    // Certificate Management
    PERMISSIONS.CERTIFICATE_CREATE,
    PERMISSIONS.CERTIFICATE_READ,
    PERMISSIONS.CERTIFICATE_UPDATE,
    PERMISSIONS.CERTIFICATE_DELETE,
    PERMISSIONS.CERTIFICATE_EXPORT,
    
    // System Management
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.SYSTEM_LOGS,
    PERMISSIONS.SYSTEM_ANALYTICS,
    
    // Attendance Management
    PERMISSIONS.ATTENDANCE_CREATE,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.ATTENDANCE_UPDATE,
    PERMISSIONS.ATTENDANCE_EXPORT,
    
    // Capstone Management
    PERMISSIONS.CAPSTONE_CREATE,
    PERMISSIONS.CAPSTONE_READ,
    PERMISSIONS.CAPSTONE_UPDATE,
    PERMISSIONS.CAPSTONE_DELETE,
    PERMISSIONS.CAPSTONE_APPROVE,
    
    // Dashboard and Reports
    PERMISSIONS.DASHBOARD_ADMIN,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,
    PERMISSIONS.REPORTS_EXPORT
  ],
  
  [ROLES.TEACHER]: [
    // Student Management (limited)
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.STUDENT_EXPORT,
    
    // Teacher Management (self only)
    PERMISSIONS.TEACHER_READ,
    PERMISSIONS.PROFILE_UPDATE,
    
    // Violation Management
    PERMISSIONS.VIOLATION_CREATE,
    PERMISSIONS.VIOLATION_READ,
    PERMISSIONS.VIOLATION_UPDATE,
    PERMISSIONS.VIOLATION_EXPORT,
    
    // Course Management (read only)
    PERMISSIONS.COURSE_READ,
    
    // Grade Management
    PERMISSIONS.GRADE_CREATE,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.GRADE_UPDATE,
    PERMISSIONS.GRADE_EXPORT,
    
    // Certificate Management
    PERMISSIONS.CERTIFICATE_CREATE,
    PERMISSIONS.CERTIFICATE_READ,
    PERMISSIONS.CERTIFICATE_UPDATE,
    PERMISSIONS.CERTIFICATE_EXPORT,
    
    // Attendance Management
    PERMISSIONS.ATTENDANCE_CREATE,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.ATTENDANCE_UPDATE,
    PERMISSIONS.ATTENDANCE_EXPORT,
    
    // Capstone Management
    PERMISSIONS.CAPSTONE_READ,
    PERMISSIONS.CAPSTONE_UPDATE,
    PERMISSIONS.CAPSTONE_APPROVE,
    
    // Advisory Management
    PERMISSIONS.ADVISORY_READ,
    PERMISSIONS.ADVISORY_UPDATE,
    
    // Profile Management
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    
    // Dashboard and Reports
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT
  ],
  
  [ROLES.STUDENT]: [
    // Student Management (self only)
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.PROFILE_UPDATE,
    
    // Course Management (read only)
    PERMISSIONS.COURSE_READ,
    
    // Grade Management (read only)
    PERMISSIONS.GRADE_READ,
    
    // Certificate Management (read only)
    PERMISSIONS.CERTIFICATE_READ,
    PERMISSIONS.CERTIFICATE_EXPORT,
    
    // Violation Management (read only, self only)
    PERMISSIONS.VIOLATION_READ,
    
    // Attendance Management (read only, self only)
    PERMISSIONS.ATTENDANCE_READ,
    
    // Capstone Management (read only)
    PERMISSIONS.CAPSTONE_READ,
    
    // Profile Management
    PERMISSIONS.PROFILE_READ,
    PERMISSIONS.PROFILE_UPDATE,
    
    // Dashboard
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.REPORTS_VIEW
  ]
};

// Permission checking utilities
export const hasPermission = (userRole, permission) => {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return rolePermissions ? rolePermissions.includes(permission) : false;
};

export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

// Resource-based permission checking
export const canAccessResource = (user, resource, action) => {
  const permission = `${resource}:${action}`;
  return hasPermission(user.role, permission);
};

// Ownership-based permission checking
export const canAccessOwnResource = (user, resource, action, resourceId) => {
  // Check basic permission first
  const permission = `${resource}:${action}`;
  if (!hasPermission(user.role, permission)) {
    return false;
  }
  
  // For students and teachers, they can only access their own resources
  if (user.role === ROLES.STUDENT || user.role === ROLES.TEACHER) {
    // This would depend on how resources are structured
    // For example, if resource is 'student' and action is 'read'
    // Students can only read their own student record
    if (resource === 'student' && user.role === ROLES.STUDENT) {
      return user.studentId === resourceId;
    }
    
    if (resource === 'teacher' && user.role === ROLES.TEACHER) {
      return user.teacherId === resourceId;
    }
  }
  
  // Admins and super admins can access all resources
  return true;
};

// Route protection utilities
export const canAccessRoute = (user, route) => {
  const routePermissions = {
    '/admin/dashboard': [PERMISSIONS.DASHBOARD_ADMIN],
    '/admin/students': [PERMISSIONS.STUDENT_READ],
    '/admin/teachers': [PERMISSIONS.TEACHER_READ],
    '/admin/violations': [PERMISSIONS.VIOLATION_READ],
    '/admin/courses': [PERMISSIONS.COURSE_READ],
    '/admin/grades': [PERMISSIONS.GRADE_READ],
    '/admin/certificates': [PERMISSIONS.CERTIFICATE_READ],
    '/admin/users': [PERMISSIONS.USER_READ],
    '/admin/system': [PERMISSIONS.SYSTEM_CONFIG],
    '/admin/logs': [PERMISSIONS.SYSTEM_LOGS],
    '/admin/reports': [PERMISSIONS.REPORTS_VIEW],
    
    '/teacher/dashboard': [PERMISSIONS.DASHBOARD_VIEW],
    '/teacher/students': [PERMISSIONS.STUDENT_READ],
    '/teacher/violations': [PERMISSIONS.VIOLATION_READ],
    '/teacher/grades': [PERMISSIONS.GRADE_READ],
    '/teacher/attendance': [PERMISSIONS.ATTENDANCE_READ],
    '/teacher/capstone': [PERMISSIONS.CAPSTONE_READ],
    '/teacher/advisory': [PERMISSIONS.ADVISORY_READ],
    
    '/student/dashboard': [PERMISSIONS.DASHBOARD_VIEW],
    '/student/profile': [PERMISSIONS.PROFILE_READ],
    '/student/grades': [PERMISSIONS.GRADE_READ],
    '/student/violations': [PERMISSIONS.VIOLATION_READ],
    '/student/certificates': [PERMISSIONS.CERTIFICATE_READ],
    '/student/attendance': [PERMISSIONS.ATTENDANCE_READ]
  };
  
  const requiredPermissions = routePermissions[route];
  if (!requiredPermissions) {
    return true; // Routes not listed are accessible to all
  }
  
  return hasAnyPermission(user.role, requiredPermissions);
};

// Component for conditional rendering based on permissions
export const PermissionGuard = ({ 
  user, 
  permission, 
  permissions, 
  requireAll = false, 
  children, 
  fallback = null 
}) => {
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(user.role, permission);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(user.role, permissions)
      : hasAnyPermission(user.role, permissions);
  }
  
  return hasAccess ? children : fallback;
};

// Hook for checking permissions
export const usePermissions = (user) => {
  const checkPermission = (permission) => hasPermission(user.role, permission);
  
  const checkPermissions = (permissions, requireAll = false) => {
    return requireAll 
      ? hasAllPermissions(user.role, permissions)
      : hasAnyPermission(user.role, permissions);
  };
  
  const canAccess = (resource, action) => canAccessResource(user, resource, action);
  
  const canAccessOwn = (resource, action, resourceId) => {
    return canAccessOwnResource(user, resource, action, resourceId);
  };
  
  const canNavigate = (route) => canAccessRoute(user, route);
  
  return {
    checkPermission,
    checkPermissions,
    canAccess,
    canAccessOwn,
    canNavigate,
    role: user.role,
    permissions: ROLE_PERMISSIONS[user.role] || []
  };
};

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  // Full access
  FULL_ACCESS: Object.values(PERMISSIONS),
  
  // Student management
  STUDENT_MANAGEMENT: [
    PERMISSIONS.STUDENT_CREATE,
    PERMISSIONS.STUDENT_READ,
    PERMISSIONS.STUDENT_UPDATE,
    PERMISSIONS.STUDENT_DELETE,
    PERMISSIONS.STUDENT_EXPORT
  ],
  
  // Teacher management
  TEACHER_MANAGEMENT: [
    PERMISSIONS.TEACHER_CREATE,
    PERMISSIONS.TEACHER_READ,
    PERMISSIONS.TEACHER_UPDATE,
    PERMISSIONS.TEACHER_DELETE,
    PERMISSIONS.TEACHER_EXPORT
  ],
  
  // Academic management
  ACADEMIC_MANAGEMENT: [
    PERMISSIONS.COURSE_CREATE,
    PERMISSIONS.COURSE_READ,
    PERMISSIONS.COURSE_UPDATE,
    PERMISSIONS.COURSE_DELETE,
    PERMISSIONS.GRADE_CREATE,
    PERMISSIONS.GRADE_READ,
    PERMISSIONS.GRADE_UPDATE,
    PERMISSIONS.GRADE_EXPORT
  ],
  
  // Discipline management
  DISCIPLINE_MANAGEMENT: [
    PERMISSIONS.VIOLATION_CREATE,
    PERMISSIONS.VIOLATION_READ,
    PERMISSIONS.VIOLATION_UPDATE,
    PERMISSIONS.VIOLATION_DELETE,
    PERMISSIONS.VIOLATION_EXPORT
  ],
  
  // Reporting
  REPORTING: [
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,
    PERMISSIONS.REPORTS_EXPORT
  ],
  
  // System administration
  SYSTEM_ADMINISTRATION: [
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.SYSTEM_BACKUP,
    PERMISSIONS.SYSTEM_RESTORE,
    PERMISSIONS.SYSTEM_LOGS,
    PERMISSIONS.SYSTEM_ANALYTICS
  ],
  
  // Read-only access
  READ_ONLY: Object.values(PERMISSIONS).filter(p => p.includes(':read')),
  
  // Create operations
  CREATE_OPERATIONS: Object.values(PERMISSIONS).filter(p => p.includes(':create')),
  
  // Update operations
  UPDATE_OPERATIONS: Object.values(PERMISSIONS).filter(p => p.includes(':update')),
  
  // Delete operations
  DELETE_OPERATIONS: Object.values(PERMISSIONS).filter(p => p.includes(':delete')),
  
  // Export operations
  EXPORT_OPERATIONS: Object.values(PERMISSIONS).filter(p => p.includes(':export'))
};

// Utility to check if user has any permission from a group
export const hasPermissionGroup = (userRole, permissionGroup) => {
  return hasAnyPermission(userRole, permissionGroup);
};

export default {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  PERMISSION_GROUPS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessResource,
  canAccessOwnResource,
  canAccessRoute,
  PermissionGuard,
  usePermissions,
  hasPermissionGroup
};
