import React, { useState } from 'react';
import { CheckSquare, Square, Trash2, Download, Mail, Users, Lock, Unlock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import ExportButton from './ExportButton';

const BulkActions = ({ 
  data, 
  selectedItems, 
  onSelectionChange, 
  onBulkAction,
  actions = [],
  className = ""
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

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

  const handleItemSelect = (id) => {
    const newSelection = selectedItems.includes(id)
      ? selectedItems.filter(item => item !== id)
      : [...selectedItems, id];
    onSelectionChange(newSelection);
  };

  const handleBulkAction = async (actionType) => {
    if (selectedItems.length === 0) {
      toast.error('Please select items to perform bulk action');
      return;
    }

    try {
      await onBulkAction(actionType, selectedItems);
      toast.success(`Bulk ${actionType} completed successfully`);
      onSelectionChange([]);
      setSelectAll(false);
    } catch (error) {
      toast.error(`Bulk ${actionType} failed`);
    }
  };

  const getActionIcon = (action) => {
    switch (action.type) {
      case 'delete':
        return <Trash2 className="w-4 h-4" />;
      case 'export':
        return <Download className="w-4 h-4" />;
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'activate':
        return <Unlock className="w-4 h-4" />;
      case 'deactivate':
        return <Lock className="w-4 h-4" />;
      case 'resetPassword':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getActionColor = (action) => {
    switch (action.type) {
      case 'delete':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50';
      case 'export':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50';
      case 'email':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50';
      case 'activate':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50';
      case 'deactivate':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50';
      case 'resetPassword':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50';
      default:
        return 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 hover:bg-secondary-200 dark:hover:bg-secondary-900/50';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selection Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            {selectAll ? (
              <CheckSquare 
                className="w-5 h-5 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/20 rounded transition-colors" 
                onClick={handleSelectAll}
              />
            ) : (
              <Square 
                className="w-5 h-5 text-secondary-400 dark:text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded transition-colors" 
                onClick={handleSelectAll}
              />
            )}
            <span className="text-sm text-secondary-600 dark:text-secondary-300">
              Select All ({data.length})
            </span>
          </label>
          
          {selectedItems.length > 0 && (
            <span className="text-sm text-primary-600 font-medium">
              {selectedItems.length} selected
            </span>
          )}
        </div>

        {selectedItems.length > 0 && (
          <button
            onClick={() => setShowBulkActions(!showBulkActions)}
            className={`btn-secondary flex items-center gap-2 relative transition-all duration-200 hover:scale-105 ${
              selectedItems.length > 0 ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-primary-400 dark:ring-offset-secondary-800' : ''
            }`}
          >
            <Users className="w-4 h-4" />
            Bulk Actions ({selectedItems.length})
          </button>
        )}
      </div>

      {/* Bulk Actions Dropdown */}
      {showBulkActions && selectedItems.length > 0 && (
        <div className="bg-secondary-50 dark:bg-secondary-800 rounded-xl p-4 border border-secondary-200 dark:border-secondary-600 shadow-lg">
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.type}
                onClick={() => handleBulkAction(action.type)}
                disabled={action.disabled}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 ${getActionColor(action)}`}
                title={action.description}
              >
                {getActionIcon(action)}
                {action.label}
              </button>
            ))}
            
            {/* Export selected */}
            <ExportButton
              data={data.filter(item => selectedItems.includes(item.id))}
              filename={`selected_items_${new Date().toISOString().split('T')[0]}`}
              type="general"
              showLabel={false}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
            />
          </div>
        </div>
      )}

      {/* Selection Checkbox for Table Rows */}
      {data.length > 0 && (
        <div className="text-xs text-secondary-500 dark:text-secondary-400">
          Tip: Click checkboxes to select items for bulk operations
        </div>
      )}
    </div>
  );
};

// Predefined action configurations
export const studentBulkActions = [
  {
    type: 'export',
    label: 'Export Selected',
    description: 'Export selected students data',
    disabled: false
  },
  {
    type: 'email',
    label: 'Send Email',
    description: 'Send email to selected students',
    disabled: false
  },
  {
    type: 'deactivate',
    label: 'Deactivate',
    description: 'Deactivate selected student accounts',
    disabled: false
  },
  {
    type: 'activate',
    label: 'Activate',
    description: 'Activate selected student accounts',
    disabled: false
  },
  {
    type: 'resetPassword',
    label: 'Reset Password',
    description: 'Reset passwords for selected students',
    disabled: false
  },
  {
    type: 'delete',
    label: 'Delete',
    description: 'Delete selected student records',
    disabled: false
  }
];

export const teacherBulkActions = [
  {
    type: 'export',
    label: 'Export Selected',
    description: 'Export selected teachers data',
    disabled: false
  },
  {
    type: 'email',
    label: 'Send Email',
    description: 'Send email to selected teachers',
    disabled: false
  },
  {
    type: 'deactivate',
    label: 'Deactivate',
    description: 'Deactivate selected teacher accounts',
    disabled: false
  },
  {
    type: 'activate',
    label: 'Activate',
    description: 'Activate selected teacher accounts',
    disabled: false
  },
  {
    type: 'resetPassword',
    label: 'Reset Password',
    description: 'Reset passwords for selected teachers',
    disabled: false
  }
];

export const violationBulkActions = [
  {
    type: 'export',
    label: 'Export Selected',
    description: 'Export selected violations data',
    disabled: false
  },
  {
    type: 'resolve',
    label: 'Mark Resolved',
    description: 'Mark selected violations as resolved',
    disabled: false
  },
  {
    type: 'delete',
    label: 'Delete',
    description: 'Delete selected violation records',
    disabled: false
  }
];

const SelectionCheckbox = ({ itemId, selectedItems, onSelectionChange }) => {
  const isSelected = selectedItems.includes(itemId);
  
  return (
    <button
      onClick={() => onSelectionChange(itemId)}
      className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded transition-colors"
    >
      {isSelected ? (
        <CheckSquare className="w-4 h-4 text-primary-600 dark:text-primary-400" />
      ) : (
        <Square className="w-4 h-4 text-secondary-400 dark:text-secondary-500" />
      )}
    </button>
  );
};

export default BulkActions;
