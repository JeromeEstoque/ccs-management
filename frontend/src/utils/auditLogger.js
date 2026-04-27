/**
 * Audit Logging System
 * Tracks all user activities and system events
 */

// Log levels
export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
};

// Log categories
export const LOG_CATEGORIES = {
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  USER_MANAGEMENT: 'user_management',
  STUDENT_MANAGEMENT: 'student_management',
  TEACHER_MANAGEMENT: 'teacher_management',
  VIOLATION_MANAGEMENT: 'violation_management',
  GRADE_MANAGEMENT: 'grade_management',
  COURSE_MANAGEMENT: 'course_management',
  CERTIFICATE_MANAGEMENT: 'certificate_management',
  ATTENDANCE_MANAGEMENT: 'attendance_management',
  CAPSTONE_MANAGEMENT: 'capstone_management',
  SYSTEM_ADMINISTRATION: 'system_administration',
  DATA_EXPORT: 'data_export',
  DATA_IMPORT: 'data_import',
  SYSTEM_ERROR: 'system_error',
  SECURITY: 'security'
};

// Action types
export const ACTIONS = {
  // Authentication
  LOGIN: 'login',
  LOGOUT: 'logout',
  LOGIN_FAILED: 'login_failed',
  PASSWORD_CHANGE: 'password_change',
  PASSWORD_RESET: 'password_reset',
  
  // User Management
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  USER_ACTIVATE: 'user_activate',
  USER_DEACTIVATE: 'user_deactivate',
  
  // Student Management
  STUDENT_CREATE: 'student_create',
  STUDENT_UPDATE: 'student_update',
  STUDENT_DELETE: 'student_delete',
  STUDENT_ENROLL: 'student_enroll',
  STUDENT_UNENROLL: 'student_unenroll',
  
  // Teacher Management
  TEACHER_CREATE: 'teacher_create',
  TEACHER_UPDATE: 'teacher_update',
  TEACHER_DELETE: 'teacher_delete',
  TEACHER_ASSIGN: 'teacher_assign',
  TEACHER_UNASSIGN: 'teacher_unassign',
  
  // Violation Management
  VIOLATION_CREATE: 'violation_create',
  VIOLATION_UPDATE: 'violation_update',
  VIOLATION_DELETE: 'violation_delete',
  VIOLATION_RESOLVE: 'violation_resolve',
  
  // Grade Management
  GRADE_CREATE: 'grade_create',
  GRADE_UPDATE: 'grade_update',
  GRADE_DELETE: 'grade_delete',
  GRADE_EXPORT: 'grade_export',
  
  // Course Management
  COURSE_CREATE: 'course_create',
  COURSE_UPDATE: 'course_update',
  COURSE_DELETE: 'course_delete',
  COURSE_ASSIGN: 'course_assign',
  
  // Certificate Management
  CERTIFICATE_CREATE: 'certificate_create',
  CERTIFICATE_UPDATE: 'certificate_update',
  CERTIFICATE_DELETE: 'certificate_delete',
  CERTIFICATE_ISSUE: 'certificate_issue',
  
  // Attendance Management
  ATTENDANCE_MARK: 'attendance_mark',
  ATTENDANCE_UPDATE: 'attendance_update',
  ATTENDANCE_EXPORT: 'attendance_export',
  
  // Capstone Management
  CAPSTONE_CREATE: 'capstone_create',
  CAPSTONE_UPDATE: 'capstone_update',
  CAPSTONE_DELETE: 'capstone_delete',
  CAPSTONE_APPROVE: 'capstone_approve',
  CAPSTONE_REJECT: 'capstone_reject',
  
  // System Administration
  SYSTEM_BACKUP: 'system_backup',
  SYSTEM_RESTORE: 'system_restore',
  SYSTEM_CONFIG_UPDATE: 'system_config_update',
  SYSTEM_MAINTENANCE: 'system_maintenance',
  
  // Data Operations
  DATA_EXPORT: 'data_export',
  DATA_IMPORT: 'data_import',
  DATA_DELETE: 'data_delete',
  
  // Security
  SECURITY_BREACH: 'security_breach',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  PRIVILEGE_ESCALATION: 'privilege_escalation',
  
  // System Events
  SYSTEM_ERROR: 'system_error',
  SYSTEM_WARNING: 'system_warning',
  API_CALL: 'api_call',
  BULK_OPERATION: 'bulk_operation'
};

// Audit logger class
class AuditLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Maximum logs to keep in memory
    this.apiEndpoint = '/api/audit-logs';
  }

  // Create log entry
  createLogEntry(level, category, action, user, details = {}, metadata = {}) {
    const logEntry = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      category,
      action,
      user: user ? {
        id: user.id,
        username: user.username || user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      } : null,
      details,
      metadata: {
        userAgent: navigator.userAgent,
        ip: this.getClientIP(),
        sessionId: this.getSessionId(),
        ...metadata
      },
      severity: this.getSeverity(level)
    };

    return logEntry;
  }

  // Log an event
  log(level, category, action, user, details = {}, metadata = {}) {
    const logEntry = this.createLogEntry(level, category, action, user, details, metadata);
    
    // Add to in-memory logs
    this.addLog(logEntry);
    
    // Send to server
    this.sendToServer(logEntry);
    
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUDIT] ${level.toUpperCase()}: ${category}:${action}`, logEntry);
    }
    
    return logEntry.id;
  }

  // Convenience methods
  debug(category, action, user, details, metadata) {
    return this.log(LOG_LEVELS.DEBUG, category, action, user, details, metadata);
  }

  info(category, action, user, details, metadata) {
    return this.log(LOG_LEVELS.INFO, category, action, user, details, metadata);
  }

  warning(category, action, user, details, metadata) {
    return this.log(LOG_LEVELS.WARNING, category, action, user, details, metadata);
  }

  error(category, action, user, details, metadata) {
    return this.log(LOG_LEVELS.ERROR, category, action, user, details, metadata);
  }

  critical(category, action, user, details, metadata) {
    return this.log(LOG_LEVELS.CRITICAL, category, action, user, details, metadata);
  }

  // Authentication logging
  logLogin(user, success = true, details = {}) {
    const action = success ? ACTIONS.LOGIN : ACTIONS.LOGIN_FAILED;
    const level = success ? LOG_LEVELS.INFO : LOG_LEVELS.WARNING;
    
    return this.log(level, LOG_CATEGORIES.AUTHENTICATION, action, user, {
      success,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  logLogout(user, details = {}) {
    return this.info(LOG_CATEGORIES.AUTHENTICATION, ACTIONS.LOGOUT, user, {
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  logPasswordChange(user, details = {}) {
    return this.info(LOG_CATEGORIES.AUTHENTICATION, ACTIONS.PASSWORD_CHANGE, user, {
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  // User management logging
  logUserCreate(user, targetUser, details = {}) {
    return this.info(LOG_CATEGORIES.USER_MANAGEMENT, ACTIONS.USER_CREATE, user, {
      targetUserId: targetUser.id,
      targetUsername: targetUser.username,
      targetRole: targetUser.role,
      ...details
    });
  }

  logUserUpdate(user, targetUser, changes, details = {}) {
    return this.info(LOG_CATEGORIES.USER_MANAGEMENT, ACTIONS.USER_UPDATE, user, {
      targetUserId: targetUser.id,
      targetUsername: targetUser.username,
      changes,
      ...details
    });
  }

  logUserDelete(user, targetUser, details = {}) {
    return this.warning(LOG_CATEGORIES.USER_MANAGEMENT, ACTIONS.USER_DELETE, user, {
      targetUserId: targetUser.id,
      targetUsername: targetUser.username,
      ...details
    });
  }

  // Student management logging
  logStudentCreate(user, student, details = {}) {
    return this.info(LOG_CATEGORIES.STUDENT_MANAGEMENT, ACTIONS.STUDENT_CREATE, user, {
      studentId: student.id,
      studentNumber: student.student_id,
      name: `${student.first_name} ${student.last_name}`,
      ...details
    });
  }

  logStudentUpdate(user, student, changes, details = {}) {
    return this.info(LOG_CATEGORIES.STUDENT_MANAGEMENT, ACTIONS.STUDENT_UPDATE, user, {
      studentId: student.id,
      studentNumber: student.student_id,
      name: `${student.first_name} ${student.last_name}`,
      changes,
      ...details
    });
  }

  logStudentDelete(user, student, details = {}) {
    return this.warning(LOG_CATEGORIES.STUDENT_MANAGEMENT, ACTIONS.STUDENT_DELETE, user, {
      studentId: student.id,
      studentNumber: student.student_id,
      name: `${student.first_name} ${student.last_name}`,
      ...details
    });
  }

  // Violation management logging
  logViolationCreate(user, violation, details = {}) {
    return this.info(LOG_CATEGORIES.VIOLATION_MANAGEMENT, ACTIONS.VIOLATION_CREATE, user, {
      violationId: violation.id,
      studentId: violation.student_id,
      violationType: violation.violation_type,
      severity: violation.severity,
      ...details
    });
  }

  logViolationResolve(user, violation, resolution, details = {}) {
    return this.info(LOG_CATEGORIES.VIOLATION_MANAGEMENT, ACTIONS.VIOLATION_RESOLVE, user, {
      violationId: violation.id,
      studentId: violation.student_id,
      resolution,
      ...details
    });
  }

  // Grade management logging
  logGradeCreate(user, grade, details = {}) {
    return this.info(LOG_CATEGORIES.GRADE_MANAGEMENT, ACTIONS.GRADE_CREATE, user, {
      gradeId: grade.id,
      studentId: grade.student_id,
      courseId: grade.course_id,
      value: grade.grade,
      ...details
    });
  }

  logGradeUpdate(user, grade, oldValue, newValue, details = {}) {
    return this.info(LOG_CATEGORIES.GRADE_MANAGEMENT, ACTIONS.GRADE_UPDATE, user, {
      gradeId: grade.id,
      studentId: grade.student_id,
      courseId: grade.course_id,
      oldValue,
      newValue,
      ...details
    });
  }

  // Data export logging
  logDataExport(user, dataType, recordCount, format, details = {}) {
    return this.info(LOG_CATEGORIES.DATA_EXPORT, ACTIONS.DATA_EXPORT, user, {
      dataType,
      recordCount,
      format,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  // Bulk operations logging
  logBulkOperation(user, operation, itemCount, details = {}) {
    return this.info(LOG_CATEGORIES.SYSTEM_ADMINISTRATION, ACTIONS.BULK_OPERATION, user, {
      operation,
      itemCount,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  // Security events logging
  logSecurityEvent(user, event, details = {}) {
    return this.warning(LOG_CATEGORIES.SECURITY, event, user, {
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  logUnauthorizedAccess(attemptedRoute, user = null, details = {}) {
    return this.warning(LOG_CATEGORIES.SECURITY, ACTIONS.UNAUTHORIZED_ACCESS, user, {
      attemptedRoute,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  // System error logging
  logSystemError(error, context = {}, user = null) {
    return this.error(LOG_CATEGORIES.SYSTEM_ERROR, ACTIONS.SYSTEM_ERROR, user, {
      error: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }

  // API call logging
  logApiCall(method, endpoint, user, statusCode, duration, details = {}) {
    const level = statusCode >= 400 ? LOG_LEVELS.WARNING : LOG_LEVELS.INFO;
    
    return this.log(level, LOG_CATEGORIES.SYSTEM_ADMINISTRATION, ACTIONS.API_CALL, user, {
      method,
      endpoint,
      statusCode,
      duration,
      timestamp: new Date().toISOString(),
      ...details
    });
  }

  // Add log to memory
  addLog(logEntry) {
    this.logs.unshift(logEntry);
    
    // Keep only the latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  // Get logs from memory
  getLogs(filters = {}) {
    let filteredLogs = [...this.logs];
    
    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level);
    }
    
    if (filters.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category);
    }
    
    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action);
    }
    
    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.user?.id === filters.userId);
    }
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startDate);
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= endDate);
    }
    
    return filteredLogs;
  }

  // Send log to server
  async sendToServer(logEntry) {
    try {
      // This would be an actual API call in production
      // await fetch(this.apiEndpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify(logEntry)
      // });
      
      // For now, just store in localStorage as fallback
      this.storeLogInStorage(logEntry);
    } catch (error) {
      console.error('Failed to send audit log to server:', error);
      // Store locally as fallback
      this.storeLogInStorage(logEntry);
    }
  }

  // Store log in localStorage
  storeLogInStorage(logEntry) {
    try {
      const storedLogs = localStorage.getItem('auditLogs');
      const logs = storedLogs ? JSON.parse(storedLogs) : [];
      
      logs.unshift(logEntry);
      
      // Keep only last 100 logs in localStorage
      if (logs.length > 100) {
        logs.splice(100);
      }
      
      localStorage.setItem('auditLogs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to store audit log in localStorage:', error);
    }
  }

  // Get logs from localStorage
  getStoredLogs() {
    try {
      const storedLogs = localStorage.getItem('auditLogs');
      return storedLogs ? JSON.parse(storedLogs) : [];
    } catch (error) {
      console.error('Failed to retrieve stored logs:', error);
      return [];
    }
  }

  // Clear stored logs
  clearStoredLogs() {
    localStorage.removeItem('auditLogs');
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getClientIP() {
    // In a real implementation, this would come from the server
    return localStorage.getItem('clientIP') || 'unknown';
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  getSeverity(level) {
    const severityMap = {
      [LOG_LEVELS.DEBUG]: 1,
      [LOG_LEVELS.INFO]: 2,
      [LOG_LEVELS.WARNING]: 3,
      [LOG_LEVELS.ERROR]: 4,
      [LOG_LEVELS.CRITICAL]: 5
    };
    return severityMap[level] || 2;
  }
}

// Create singleton instance
const auditLogger = new AuditLogger();

// React hook for audit logging
export const useAuditLogger = (user) => {
  const log = (level, category, action, details = {}, metadata = {}) => {
    return auditLogger.log(level, category, action, user, details, metadata);
  };

  return {
    log,
    debug: (category, action, details, metadata) => log(LOG_LEVELS.DEBUG, category, action, details, metadata),
    info: (category, action, details, metadata) => log(LOG_LEVELS.INFO, category, action, details, metadata),
    warning: (category, action, details, metadata) => log(LOG_LEVELS.WARNING, category, action, details, metadata),
    error: (category, action, details, metadata) => log(LOG_LEVELS.ERROR, category, action, details, metadata),
    critical: (category, action, details, metadata) => log(LOG_LEVELS.CRITICAL, category, action, details, metadata),
    
    // Convenience methods
    logLogin: (success, details) => auditLogger.logLogin(user, success, details),
    logLogout: (details) => auditLogger.logLogout(user, details),
    logPasswordChange: (details) => auditLogger.logPasswordChange(user, details),
    logUserCreate: (targetUser, details) => auditLogger.logUserCreate(user, targetUser, details),
    logUserUpdate: (targetUser, changes, details) => auditLogger.logUserUpdate(user, targetUser, changes, details),
    logUserDelete: (targetUser, details) => auditLogger.logUserDelete(user, targetUser, details),
    logStudentCreate: (student, details) => auditLogger.logStudentCreate(user, student, details),
    logStudentUpdate: (student, changes, details) => auditLogger.logStudentUpdate(user, student, changes, details),
    logStudentDelete: (student, details) => auditLogger.logStudentDelete(user, student, details),
    logViolationCreate: (violation, details) => auditLogger.logViolationCreate(user, violation, details),
    logViolationResolve: (violation, resolution, details) => auditLogger.logViolationResolve(user, violation, resolution, details),
    logGradeCreate: (grade, details) => auditLogger.logGradeCreate(user, grade, details),
    logGradeUpdate: (grade, oldValue, newValue, details) => auditLogger.logGradeUpdate(user, grade, oldValue, newValue, details),
    logDataExport: (dataType, recordCount, format, details) => auditLogger.logDataExport(user, dataType, recordCount, format, details),
    logBulkOperation: (operation, itemCount, details) => auditLogger.logBulkOperation(user, operation, itemCount, details),
    logSecurityEvent: (event, details) => auditLogger.logSecurityEvent(user, event, details),
    logSystemError: (error, context) => auditLogger.logSystemError(error, context, user),
    logApiCall: (method, endpoint, statusCode, duration, details) => auditLogger.logApiCall(method, endpoint, user, statusCode, duration, details)
  };
};

export default auditLogger;
