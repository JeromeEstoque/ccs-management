import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Bell } from 'lucide-react';

// Notification types with corresponding icons and colors
const notificationTypes = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    titleColor: 'text-green-800',
    messageColor: 'text-green-700'
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-600',
    titleColor: 'text-red-800',
    messageColor: 'text-red-700'
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconColor: 'text-amber-600',
    titleColor: 'text-amber-800',
    messageColor: 'text-amber-700'
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-800',
    messageColor: 'text-blue-700'
  }
};

const NotificationItem = ({ notification, onRemove }) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const timeoutRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    // Auto remove after duration
    if (notification.duration !== 0) {
      timeoutRef.current = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => onRemove(notification.id), 300);
      }, notification.duration || 5000);
    }

    // Progress bar animation
    if (progressRef.current && notification.duration !== 0) {
      progressRef.current.style.transition = `width ${notification.duration || 5000}ms linear`;
      setTimeout(() => {
        if (progressRef.current) {
          progressRef.current.style.width = '0%';
        }
      }, 100);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [notification.id, notification.duration, onRemove]);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const type = notificationTypes[notification.type] || notificationTypes.info;
  const Icon = type.icon;

  return (
    <div
      className={`
        relative max-w-sm w-full bg-white rounded-lg shadow-lg border overflow-hidden
        transform transition-all duration-300 ease-in-out
        ${isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        ${type.borderColor}
      `}
    >
      {/* Progress Bar */}
      {notification.duration !== 0 && (
        <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full">
          <div
            ref={progressRef}
            className="h-full bg-blue-500 w-full"
            style={{ width: '100%' }}
          />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
            ${type.bgColor}
          `}>
            <Icon className={`w-5 h-5 ${type.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {notification.title && (
              <h4 className={`text-sm font-semibold mb-1 ${type.titleColor}`}>
                {notification.title}
              </h4>
            )}
            <p className={`text-sm ${type.messageColor} break-words`}>
              {notification.message}
            </p>

            {/* Action Buttons */}
            {notification.actions && notification.actions.length > 0 && (
              <div className="flex gap-2 mt-3">
                {notification.actions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      action.onClick?.();
                      handleRemove();
                    }}
                    className={`
                      text-xs px-3 py-1 rounded-full font-medium transition-colors
                      ${action.primary 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

const NotificationContainer = ({ position = 'top-right' }) => {
  const [notifications, setNotifications] = useState([]);

  // Position classes
  const positionClasses = {
    'top-right': 'fixed top-4 right-4 z-50 space-y-2',
    'top-left': 'fixed top-4 left-4 z-50 space-y-2',
    'bottom-right': 'fixed bottom-4 right-4 z-50 space-y-2',
    'bottom-left': 'fixed bottom-4 left-4 z-50 space-y-2',
    'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2',
    'bottom-center': 'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2'
  };

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Expose methods globally
  useEffect(() => {
    window.showNotification = addNotification;
    window.hideNotification = removeNotification;

    return () => {
      delete window.showNotification;
      delete window.hideNotification;
    };
  }, []);

  return (
    <div className={positionClasses[position]}>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

// Hook for using notifications
export const useNotification = () => {
  const showNotification = (options) => {
    if (window.showNotification) {
      return window.showNotification(options);
    }
    return null;
  };

  const hideNotification = (id) => {
    if (window.hideNotification) {
      window.hideNotification(id);
    }
  };

  // Convenience methods
  const success = (message, options = {}) => 
    showNotification({ type: 'success', message, ...options });

  const error = (message, options = {}) => 
    showNotification({ type: 'error', message, ...options });

  const warning = (message, options = {}) => 
    showNotification({ type: 'warning', message, ...options });

  const info = (message, options = {}) => 
    showNotification({ type: 'info', message, ...options });

  const confirm = (message, onConfirm, options = {}) => 
    showNotification({
      type: 'warning',
      message,
      duration: 0, // Don't auto-close
      actions: [
        {
          label: 'Confirm',
          primary: true,
          onClick: onConfirm
        },
        {
          label: 'Cancel',
          onClick: () => {}
        }
      ],
      ...options
    });

  return {
    showNotification,
    hideNotification,
    success,
    error,
    warning,
    info,
    confirm
  };
};

// Notification Bell Component
export const NotificationBell = ({ count = 0, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <Bell className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
};

export default NotificationContainer;
