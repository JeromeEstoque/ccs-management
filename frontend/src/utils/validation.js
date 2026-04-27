/**
 * Comprehensive Form Validation Utilities
 * Student and Teacher Management System
 */

import { useState } from 'react';

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]+$/,
  studentId: /^\d{4}-\d{4}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  name: /^[a-zA-Z\s\-'\.]+$/,
  alphanumeric: /^[a-zA-Z0-9\s\-_]+$/,
  numeric: /^\d+$/,
  decimal: /^\d+(\.\d{1,2})?$/,
  year: /^\d{4}$/,
  url: /^https?:\/\/.+/
};

// Validation messages
export const messages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  studentId: 'Student ID must be in format YYYY-XXXX (e.g., 2023-1001)',
  password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
  name: 'Name can only contain letters, spaces, hyphens, and apostrophes',
  minLength: (min) => `Must be at least ${min} characters`,
  maxLength: (max) => `Must not exceed ${max} characters`,
  min: (min) => `Must be at least ${min}`,
  max: (max) => `Must not exceed ${max}`,
  range: (min, max) => `Must be between ${min} and ${max}`,
  gpa: 'GPA must be between 1.0 and 4.0',
  positive: 'Must be a positive number',
  integer: 'Must be a whole number'
};

// Core validation functions
export const validators = {
  required: (value) => {
    if (value === null || value === undefined || value === '') {
      return messages.required;
    }
    return null;
  },

  email: (value) => {
    if (value && !patterns.email.test(value)) {
      return messages.email;
    }
    return null;
  },

  phone: (value) => {
    if (value && !patterns.phone.test(value)) {
      return messages.phone;
    }
    return null;
  },

  studentId: (value) => {
    if (value && !patterns.studentId.test(value)) {
      return messages.studentId;
    }
    return null;
  },

  password: (value) => {
    if (value && !patterns.password.test(value)) {
      return messages.password;
    }
    return null;
  },

  name: (value) => {
    if (value && !patterns.name.test(value)) {
      return messages.name;
    }
    return null;
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) {
      return messages.minLength(min);
    }
    return null;
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) {
      return messages.maxLength(max);
    }
    return null;
  },

  min: (min) => (value) => {
    const num = Number(value);
    if (value !== '' && (!isNaN(num) && num < min)) {
      return messages.min(min);
    }
    return null;
  },

  max: (max) => (value) => {
    const num = Number(value);
    if (value !== '' && (!isNaN(num) && num > max)) {
      return messages.max(max);
    }
    return null;
  },

  gpa: (value) => {
    const num = Number(value);
    if (value !== '' && (isNaN(num) || num < 1.0 || num > 4.0)) {
      return messages.gpa;
    }
    return null;
  },

  positive: (value) => {
    const num = Number(value);
    if (value !== '' && (!isNaN(num) && num <= 0)) {
      return messages.positive;
    }
    return null;
  },

  integer: (value) => {
    if (value !== '' && (!patterns.numeric.test(value) && !patterns.decimal.test(value))) {
      return messages.integer;
    }
    return null;
  },

  year: (value) => {
    if (value && !patterns.year.test(value)) {
      return 'Please enter a valid year (e.g., 2024)';
    }
    return null;
  },

  url: (value) => {
    if (value && !patterns.url.test(value)) {
      return 'Please enter a valid URL starting with http:// or https://';
    }
    return null;
  }
};

// Composite validator (runs multiple validations)
export const createValidator = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value);
    if (error) return error;
  }
  return null;
};

// Pre-defined validation schemas
export const schemas = {
  // Student validation
  student: {
    firstName: createValidator(validators.required, validators.name, validators.maxLength(50)),
    lastName: createValidator(validators.required, validators.name, validators.maxLength(50)),
    middleName: validators.maxLength(50),
    studentId: createValidator(validators.required, validators.studentId),
    email: createValidator(validators.required, validators.email),
    phone: validators.phone,
    birthDate: validators.required,
    gender: validators.required,
    address: createValidator(validators.required, validators.maxLength(200)),
    yearLevel: validators.required,
    section: createValidator(validators.required, validators.maxLength(20)),
    gpa: validators.gpa,
    statusRecord: validators.required,
    organizationRole: validators.maxLength(100),
    guardianName: validators.maxLength(100),
    guardianContact: validators.phone
  },

  // Teacher validation
  teacher: {
    firstName: createValidator(validators.required, validators.name, validators.maxLength(50)),
    lastName: createValidator(validators.required, validators.name, validators.maxLength(50)),
    middleName: validators.maxLength(50),
    employeeId: createValidator(validators.required, validators.maxLength(20)),
    email: createValidator(validators.required, validators.email),
    phone: validators.phone,
    birthDate: validators.required,
    gender: validators.required,
    address: createValidator(validators.required, validators.maxLength(200)),
    position: createValidator(validators.required, validators.maxLength(100)),
    department: createValidator(validators.required, validators.maxLength(100)),
    specialization: validators.maxLength(500),
    hireDate: validators.required,
    status: validators.required,
    advisorySection: validators.maxLength(20),
    teachingLoad: createValidator(validators.positive, validators.integer, validators.max(30))
  },

  // Course validation
  course: {
    courseCode: createValidator(validators.required, validators.maxLength(20)),
    courseName: createValidator(validators.required, validators.maxLength(200)),
    description: validators.maxLength(1000),
    credits: createValidator(validators.required, validators.positive, validators.integer, validators.max(6)),
    yearLevel: validators.required,
    semester: validators.required,
    department: createValidator(validators.required, validators.maxLength(100)),
    schedule: validators.maxLength(100),
    room: validators.maxLength(50),
    maxStudents: createValidator(validators.required, validators.positive, validators.integer, validators.max(100))
  },

  // Violation validation
  violation: {
    studentId: validators.required,
    teacherId: validators.required,
    violationType: createValidator(validators.required, validators.maxLength(100)),
    description: createValidator(validators.required, validators.maxLength(500)),
    severity: validators.required,
    date: validators.required,
    actionTaken: validators.maxLength(500),
    pointsDeducted: createValidator(validators.min(0), validators.integer, validators.max(100))
  },

  // Certificate validation
  certificate: {
    studentId: validators.required,
    certificateName: createValidator(validators.required, validators.maxLength(200)),
    description: validators.maxLength(1000),
    issuingOrganization: createValidator(validators.required, validators.maxLength(150)),
    issueDate: validators.required,
    expiryDate: validators.maxLength(100),
    certificateType: validators.required,
    fileUrl: validators.url
  },

  // Grade validation
  grade: {
    studentId: validators.required,
    courseId: validators.required,
    instructorId: validators.required,
    grade: createValidator(validators.required, validators.gpa),
    gradingPeriod: validators.required,
    semester: validators.required,
    academicYear: createValidator(validators.required, validators.maxLength(20)),
    datePosted: validators.required,
    remarks: validators.maxLength(500)
  },

  // Login validation
  login: {
    studentId: validators.studentId,
    email: validators.email,
    username: createValidator(validators.required, validators.maxLength(50)),
    password: validators.required
  },

  // Password change validation
  changePassword: {
    currentPassword: validators.required,
    newPassword: createValidator(validators.required, validators.password),
    confirmPassword: (value, formData) => {
      if (value !== formData.newPassword) {
        return 'Passwords do not match';
      }
      return null;
    }
  }
};

// Form validation helper function
export const validateForm = (formData, schema) => {
  const errors = {};
  
  for (const [field, validator] of Object.entries(schema)) {
    const value = formData[field];
    const error = typeof validator === 'function' ? validator(value, formData) : null;
    
    if (error) {
      errors[field] = error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Real-time validation for forms
export const useValidation = (initialData, schema) => {
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const fieldValidator = schema[name];
    if (fieldValidator) {
      const error = typeof fieldValidator === 'function' 
        ? fieldValidator(value, data) 
        : null;
      setErrors(prev => ({ ...prev, [name]: error }));
      return error;
    }
    return null;
  };

  const handleChange = (name, value) => {
    setData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, data[name]);
  };

  const validateAll = () => {
    const newErrors = {};
    let hasErrors = false;

    for (const [field, validator] of Object.entries(schema)) {
      const error = typeof validator === 'function' 
        ? validator(data[field], data) 
        : null;
      if (error) {
        newErrors[field] = error;
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    setTouched(Object.keys(schema).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return !hasErrors;
  };

  const resetForm = () => {
    setData(initialData);
    setErrors({});
    setTouched({});
  };

  return {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    isValid: Object.keys(errors).length === 0
  };
};

export default {
  patterns,
  messages,
  validators,
  createValidator,
  schemas,
  validateForm,
  useValidation
};
