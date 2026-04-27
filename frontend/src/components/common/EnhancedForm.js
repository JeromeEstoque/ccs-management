import React, { useState, useEffect, useCallback } from 'react';
import { schemas, validateForm, useValidation } from '../../utils/validation';
import { AlertTriangle, CheckCircle, Eye, EyeOff, Save, X } from 'lucide-react';

const EnhancedForm = ({
  schema = {},
  initialData = {},
  onSubmit,
  onCancel,
  loading = false,
  submitText = 'Save',
  cancelText = 'Cancel',
  className = '',
  showReset = false,
  resetText = 'Reset',
  disabled = false,
  autoComplete = 'on'
}) => {
  const {
    data,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm
  } = useValidation(initialData, schema);

  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const isValid = validateAll();
    if (isValid && onSubmit) {
      await onSubmit(data);
    }
  };

  // Handle reset
  const handleReset = () => {
    resetForm();
    setSubmitAttempted(false);
  };

  // Toggle password visibility
  const togglePasswordVisibility = (fieldName) => {
    setShowPasswords(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  // Render form field
  const renderField = (fieldName, fieldSchema) => {
    const value = data[fieldName] || '';
    const error = errors[fieldName];
    const isTouched = touched[fieldName];
    const showError = submitAttempted || isTouched;

    // Determine field type
    let fieldType = 'text';
    if (fieldName.toLowerCase().includes('password')) {
      fieldType = 'password';
    } else if (fieldName.toLowerCase().includes('email')) {
      fieldType = 'email';
    } else if (fieldName.toLowerCase().includes('phone') || fieldName.toLowerCase().includes('mobile')) {
      fieldType = 'tel';
    } else if (fieldName.toLowerCase().includes('date')) {
      fieldType = 'date';
    } else if (fieldName.toLowerCase().includes('time')) {
      fieldType = 'time';
    } else if (fieldName.toLowerCase().includes('number') || fieldName.toLowerCase().includes('age') || fieldName.toLowerCase().includes('gpa')) {
      fieldType = 'number';
    }

    // Special handling for select fields
    if (fieldSchema.options) {
      return (
        <div key={fieldName} className="form-group">
          <label className="form-label">
            {formatLabel(fieldName)}
            {fieldSchema.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            value={value}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            onBlur={() => handleBlur(fieldName)}
            disabled={disabled}
            className={`input-field ${showError && error ? 'border-red-500' : ''}`}
          >
            <option value="">Select {formatLabel(fieldName)}</option>
            {fieldSchema.options.map((option) => (
              <option key={option.value || option} value={option.value || option}>
                {option.label || option}
              </option>
            ))}
          </select>
          {showError && error && (
            <p className="form-error">{error}</p>
          )}
        </div>
      );
    }

    // Special handling for textarea
    if (fieldName.toLowerCase().includes('address') || fieldName.toLowerCase().includes('description') || fieldName.toLowerCase().includes('remarks')) {
      return (
        <div key={fieldName} className="form-group">
          <label className="form-label">
            {formatLabel(fieldName)}
            {fieldSchema.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <textarea
            value={value}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            onBlur={() => handleBlur(fieldName)}
            disabled={disabled}
            rows={3}
            className={`input-field ${showError && error ? 'border-red-500' : ''}`}
            placeholder={`Enter ${formatLabel(fieldName).toLowerCase()}`}
          />
          {showError && error && (
            <p className="form-error">{error}</p>
          )}
        </div>
      );
    }

    // Regular input field
    return (
      <div key={fieldName} className="form-group">
        <label className="form-label">
          {formatLabel(fieldName)}
          {fieldSchema.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <div className="relative">
          <input
            type={fieldType === 'password' && showPasswords[fieldName] ? 'text' : fieldType}
            value={value}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            onBlur={() => handleBlur(fieldName)}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`form-input pr-10 ${showError && error ? 'border-red-500' : ''}`}
            placeholder={`Enter ${formatLabel(fieldName).toLowerCase()}`}
            step={fieldType === 'number' ? '0.01' : undefined}
            min={fieldType === 'number' && fieldName.toLowerCase().includes('gpa') ? '1.0' : undefined}
            max={fieldType === 'number' && fieldName.toLowerCase().includes('gpa') ? '4.0' : undefined}
          />
          
          {/* Password visibility toggle */}
          {fieldType === 'password' && (
            <button
              type="button"
              onClick={() => togglePasswordVisibility(fieldName)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords[fieldName] ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          )}

          {/* Field status indicator */}
          {showError && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {error ? (
                <AlertTriangle className="w-4 h-4 text-red-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          )}
        </div>
        
        {showError && error && (
          <p className="form-error">{error}</p>
        )}
        
        {/* Field hint */}
        {fieldSchema.hint && !error && (
          <p className="form-hint">{fieldSchema.hint}</p>
        )}
      </div>
    );
  };

  // Format label from field name
  const formatLabel = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .replace(/_/g, ' ')
      .trim();
  };

  // Group fields by section
  const groupFieldsBySection = () => {
    const sections = {};
    
    Object.entries(schema).forEach(([fieldName, fieldSchema]) => {
      const section = fieldSchema.section || 'General';
      if (!sections[section]) {
        sections[section] = [];
      }
      sections[section].push([fieldName, fieldSchema]);
    });
    
    return sections;
  };

  const fieldSections = groupFieldsBySection();

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {Object.entries(fieldSections).map(([sectionName, fields]) => (
        <div key={sectionName} className="space-y-4">
          {sectionName !== 'General' && (
            <div className="border-b border-gray-200 pb-2">
              <h3 className="text-lg font-medium text-gray-900">{sectionName}</h3>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map(([fieldName, fieldSchema]) => renderField(fieldName, fieldSchema))}
          </div>
        </div>
      ))}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
        {showReset && (
          <button
            type="button"
            onClick={handleReset}
            disabled={disabled || loading}
            className="btn-secondary"
          >
            {resetText}
          </button>
        )}
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary"
          >
            {cancelText}
          </button>
        )}
        
        <button
          type="submit"
          disabled={disabled || loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          <Save className="w-4 h-4" />
          {submitText}
        </button>
      </div>

      {/* Form Status Summary */}
      {submitAttempted && Object.keys(errors).length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Please fix the following errors:</h4>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {Object.entries(errors).map(([fieldName, error]) => (
                  <li key={fieldName}>{formatLabel(fieldName)}: {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

// Pre-configured form schemas
export const formSchemas = {
  student: {
    firstName: { ...schemas.student.firstName, section: 'Personal Information' },
    middleName: { ...schemas.student.middleName, section: 'Personal Information' },
    lastName: { ...schemas.student.lastName, section: 'Personal Information' },
    email: { ...schemas.student.email, section: 'Contact Information' },
    phone: { ...schemas.student.phone, section: 'Contact Information' },
    address: { ...schemas.student.address, section: 'Contact Information' },
    birthDate: { ...schemas.student.birthDate, section: 'Academic Information' },
    gender: { 
      ...schemas.student.gender, 
      section: 'Academic Information',
      options: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
      ]
    },
    yearLevel: {
      ...schemas.student.yearLevel,
      section: 'Academic Information',
      options: [
        { value: '1st Year', label: '1st Year' },
        { value: '2nd Year', label: '2nd Year' },
        { value: '3rd Year', label: '3rd Year' },
        { value: '4th Year', label: '4th Year' }
      ]
    },
    section: { ...schemas.student.section, section: 'Academic Information' },
    gpa: { 
      ...schemas.student.gpa, 
      section: 'Academic Information',
      hint: 'GPA should be between 1.0 and 4.0'
    },
    statusRecord: {
      ...schemas.student.statusRecord,
      section: 'Academic Information',
      options: [
        { value: 'Regular', label: 'Regular' },
        { value: 'Irregular', label: 'Irregular' },
        { value: 'Probation', label: 'Probation' }
      ]
    },
    guardianName: { ...schemas.student.guardianName, section: 'Guardian Information' },
    guardianContact: { ...schemas.student.guardianContact, section: 'Guardian Information' }
  },

  teacher: {
    firstName: { ...schemas.teacher.firstName, section: 'Personal Information' },
    middleName: { ...schemas.teacher.middleName, section: 'Personal Information' },
    lastName: { ...schemas.teacher.lastName, section: 'Personal Information' },
    email: { ...schemas.teacher.email, section: 'Contact Information' },
    phone: { ...schemas.teacher.phone, section: 'Contact Information' },
    address: { ...schemas.teacher.address, section: 'Contact Information' },
    birthDate: { ...schemas.teacher.birthDate, section: 'Professional Information' },
    gender: {
      ...schemas.teacher.gender,
      section: 'Professional Information',
      options: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' }
      ]
    },
    position: {
      ...schemas.teacher.position,
      section: 'Professional Information',
      options: [
        { value: 'Instructor', label: 'Instructor' },
        { value: 'Assistant Professor', label: 'Assistant Professor' },
        { value: 'Associate Professor', label: 'Associate Professor' },
        { value: 'Professor', label: 'Professor' }
      ]
    },
    department: { ...schemas.teacher.department, section: 'Professional Information' },
    specialization: { ...schemas.teacher.specialization, section: 'Professional Information' },
    hireDate: { ...schemas.teacher.hireDate, section: 'Professional Information' },
    status: {
      ...schemas.teacher.status,
      section: 'Professional Information',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'On Leave', label: 'On Leave' }
      ]
    },
    advisorySection: { ...schemas.teacher.advisorySection, section: 'Teaching Assignment' },
    teachingLoad: { 
      ...schemas.teacher.teachingLoad, 
      section: 'Teaching Assignment',
      hint: 'Number of units currently teaching'
    }
  },

  violation: {
    studentId: { ...schemas.violation.studentId, section: 'Violation Details' },
    teacherId: { ...schemas.violation.teacherId, section: 'Violation Details' },
    violationType: {
      ...schemas.violation.violationType,
      section: 'Violation Details',
      options: [
        { value: 'Tardiness', label: 'Tardiness' },
        { value: 'Improper Uniform', label: 'Improper Uniform' },
        { value: 'Cutting Classes', label: 'Cutting Classes' },
        { value: 'Disrespectful Behavior', label: 'Disrespectful Behavior' },
        { value: 'Academic Dishonesty', label: 'Academic Dishonesty' },
        { value: 'Vandalism', label: 'Vandalism' },
        { value: 'Fighting', label: 'Fighting' },
        { value: 'Theft', label: 'Theft' }
      ]
    },
    description: { ...schemas.violation.description, section: 'Violation Details' },
    severity: {
      ...schemas.violation.severity,
      section: 'Violation Details',
      options: [
        { value: 'Minor', label: 'Minor' },
        { value: 'Moderate', label: 'Moderate' },
        { value: 'Major', label: 'Major' }
      ]
    },
    date: { ...schemas.violation.date, section: 'Violation Details' },
    actionTaken: { ...schemas.violation.actionTaken, section: 'Resolution' },
    pointsDeducted: { ...schemas.violation.pointsDeducted, section: 'Resolution' }
  },

  changePassword: {
    currentPassword: { ...schemas.changePassword.currentPassword, section: 'Security' },
    newPassword: { ...schemas.changePassword.newPassword, section: 'Security' },
    confirmPassword: { 
      ...schemas.changePassword.confirmPassword, 
      section: 'Security',
      hint: 'Must match the new password exactly'
    }
  }
};

export default EnhancedForm;
