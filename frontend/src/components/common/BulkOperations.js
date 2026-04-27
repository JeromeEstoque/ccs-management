import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, Square, Trash2, Edit, Download, 
  Users, AlertTriangle, Award, Mail, Phone,
  ChevronDown, X, CheckCircle, AlertCircle
} from 'lucide-react';

const BulkOperations = ({
  data = [],
  selectedItems = [],
  onSelectionChange,
  onBulkAction,
  availableActions = [],
  className = ''
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [actionResults, setActionResults] = useState(null);

  // Handle select all
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll) {
      const allIds = data.map(item => item.id);
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  // Handle individual selection
  const handleItemSelect = (itemId) => {
    const newSelection = selectedItems.includes(itemId)
      ? selectedItems.filter(id => id !== itemId)
      : [...selectedItems, itemId];
    
    onSelectionChange(newSelection);
    setSelectAll(newSelection.length === data.length && data.length > 0);
  };

  // Execute bulk action
  const executeBulkAction = async (action) => {
    if (selectedItems.length === 0) return;

    setActionInProgress(true);
    setSelectedAction(action);
    setActionResults(null);

    try {
      const results = await onBulkAction(action, selectedItems);
      setActionResults({
        success: true,
        message: `${action.label} completed successfully`,
        details: results
      });
      
      // Clear selection after successful action
      onSelectionChange([]);
      setSelectAll(false);
    } catch (error) {
      setActionResults({
        success: false,
        message: `Failed to ${action.label.toLowerCase()}`,
        error: error.message
      });
    } finally {
      setActionInProgress(false);
      setSelectedAction(null);
      setActionMenuOpen(false);
    }
  };

  // Default actions
  const defaultActions = [
    {
      id: 'delete',
      label: 'Delete Selected',
      icon: Trash2,
      color: 'red',
      confirm: true,
      confirmMessage: 'Are you sure you want to delete the selected items? This action cannot be undone.',
      dangerous: true
    },
    {
      id: 'export',
      label: 'Export Selected',
      icon: Download,
      color: 'blue',
      confirm: false
    },
    {
      id: 'sendEmail',
      label: 'Send Email',
      icon: Mail,
      color: 'green',
      confirm: false
    },
    {
      id: 'markPresent',
      label: 'Mark Present',
      icon: CheckCircle,
      color: 'green',
      confirm: false
    },
    {
      id: 'markAbsent',
      label: 'Mark Absent',
      icon: AlertCircle,
      color: 'amber',
      confirm: false
    }
  ];

  const actions = availableActions.length > 0 ? availableActions : defaultActions;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selection Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          {/* Select All Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectAll}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Select All ({data.length})
            </span>
          </label>

          {/* Selection Status */}
          {selectedItems.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {selectedItems.length} selected
              </span>
            </div>
          )}
        </div>

        {/* Bulk Actions Menu */}
        {selectedItems.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setActionMenuOpen(!actionMenuOpen)}
              disabled={actionInProgress}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              Bulk Actions
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Action Dropdown */}
            {actionMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-2">
                  {actions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        if (action.confirm) {
                          if (window.confirm(action.confirmMessage)) {
                            executeBulkAction(action);
                          }
                        } else {
                          executeBulkAction(action);
                        }
                      }}
                      disabled={actionInProgress}
                      className={`
                        w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50
                        ${action.dangerous ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <action.icon className="w-4 h-4" />
                      <span className="text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Progress */}
      {actionInProgress && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm text-blue-700">
            {selectedAction?.label || 'Processing'}... ({selectedItems.length} items)
          </span>
        </div>
      )}

      {/* Action Results */}
      {actionResults && (
        <div className={`
          p-4 rounded-lg border
          ${actionResults.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
          }
        `}>
          <div className="flex items-start gap-3">
            {actionResults.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                actionResults.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {actionResults.message}
              </p>
              {actionResults.details && (
                <div className="mt-2 text-xs text-gray-600">
                  {typeof actionResults.details === 'string' 
                    ? actionResults.details
                    : JSON.stringify(actionResults.details, null, 2)
                  }
                </div>
              )}
            </div>
            <button
              onClick={() => setActionResults(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Selected Items Summary */}
      {selectedItems.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                {selectedItems.length} items selected
              </span>
            </div>
            <button
              onClick={() => {
                onSelectionChange([]);
                setSelectAll(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Bulk operations for specific data types
export const StudentBulkOperations = ({ selectedStudents, onAction }) => {
  const studentActions = [
    {
      id: 'updateSection',
      label: 'Update Section',
      icon: Users,
      color: 'blue',
      confirm: false,
      requiresInput: {
        type: 'select',
        label: 'Select Section',
        options: ['BSIT-1A', 'BSIT-1B', 'BSIT-2A', 'BSIT-2B', 'BSIT-3A', 'BSIT-3B', 'BSCS-4A', 'BSCS-4B']
      }
    },
    {
      id: 'sendNotification',
      label: 'Send Notification',
      icon: Mail,
      color: 'green',
      confirm: false,
      requiresInput: {
        type: 'textarea',
        label: 'Message',
        placeholder: 'Enter notification message'
      }
    },
    {
      id: 'exportData',
      label: 'Export Data',
      icon: Download,
      color: 'purple',
      confirm: false
    },
    {
      id: 'deleteStudents',
      label: 'Delete Students',
      icon: Trash2,
      color: 'red',
      confirm: true,
      confirmMessage: 'Are you sure you want to delete the selected students? This action cannot be undone.',
      dangerous: true
    }
  ];

  return (
    <BulkOperations
      data={selectedStudents}
      selectedItems={selectedStudents.map(s => s.id)}
      onSelectionChange={(ids) => {
        // This would typically update the selected students in parent component
      }}
      onBulkAction={onAction}
      availableActions={studentActions}
    />
  );
};

export const ViolationBulkOperations = ({ selectedViolations, onAction }) => {
  const violationActions = [
    {
      id: 'resolveViolations',
      label: 'Mark as Resolved',
      icon: CheckCircle,
      color: 'green',
      confirm: false
    },
    {
      id: 'assignToTeacher',
      label: 'Assign to Teacher',
      icon: Users,
      color: 'blue',
      confirm: false,
      requiresInput: {
        type: 'select',
        label: 'Select Teacher',
        options: ['Teacher 1', 'Teacher 2', 'Teacher 3'] // This would come from API
      }
    },
    {
      id: 'exportViolations',
      label: 'Export Violations',
      icon: Download,
      color: 'purple',
      confirm: false
    },
    {
      id: 'deleteViolations',
      label: 'Delete Violations',
      icon: Trash2,
      color: 'red',
      confirm: true,
      confirmMessage: 'Are you sure you want to delete the selected violations?',
      dangerous: true
    }
  ];

  return (
    <BulkOperations
      data={selectedViolations}
      selectedItems={selectedViolations.map(v => v.id)}
      onSelectionChange={(ids) => {
        // This would typically update the selected violations in parent component
      }}
      onBulkAction={onAction}
      availableActions={violationActions}
    />
  );
};

export const TeacherBulkOperations = ({ selectedTeachers, onAction }) => {
  const teacherActions = [
    {
      id: 'assignAdvisory',
      label: 'Assign Advisory',
      icon: Users,
      color: 'blue',
      confirm: false,
      requiresInput: {
        type: 'select',
        label: 'Select Section',
        options: ['BSIT-1A', 'BSIT-1B', 'BSIT-2A', 'BSIT-2B', 'BSIT-3A', 'BSIT-3B', 'BSCS-4A', 'BSCS-4B']
      }
    },
    {
      id: 'updateStatus',
      label: 'Update Status',
      icon: Award,
      color: 'green',
      confirm: false,
      requiresInput: {
        type: 'select',
        label: 'Select Status',
        options: ['Active', 'Inactive', 'On Leave']
      }
    },
    {
      id: 'sendEmail',
      label: 'Send Email',
      icon: Mail,
      color: 'purple',
      confirm: false,
      requiresInput: {
        type: 'textarea',
        label: 'Message',
        placeholder: 'Enter email message'
      }
    },
    {
      id: 'exportTeachers',
      label: 'Export Data',
      icon: Download,
      color: 'amber',
      confirm: false
    }
  ];

  return (
    <BulkOperations
      data={selectedTeachers}
      selectedItems={selectedTeachers.map(t => t.id)}
      onSelectionChange={(ids) => {
        // This would typically update the selected teachers in parent component
      }}
      onBulkAction={onAction}
      availableActions={teacherActions}
    />
  );
};

// Confirmation dialog for bulk actions
export const BulkActionConfirmation = ({ 
  action, 
  selectedCount, 
  onConfirm, 
  onCancel, 
  additionalData 
}) => {
  if (!action) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <action.icon className={`w-6 h-6 text-${action.color}-600`} />
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm {action.label}
          </h3>
        </div>

        <p className="text-gray-600 mb-4">
          {action.confirmMessage || 
           `Are you sure you want to ${action.label.toLowerCase()} ${selectedCount} item${selectedCount > 1 ? 's' : ''}?`
          }
        </p>

        {/* Additional input if required */}
        {action.requiresInput && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-2">
              {action.requiresInput.label}
            </label>
            {action.requiresInput.type === 'select' ? (
              <select className="input-search w-full p-2">
                <option value="">Select...</option>
                {action.requiresInput.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <textarea
                className="input-search w-full p-2"
                rows={3}
                placeholder={action.requiresInput.placeholder}
              />
            )}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg ${
              action.dangerous 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkOperations;
