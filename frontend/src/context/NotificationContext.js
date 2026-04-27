import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  // Mock notification data - in real app, this would come from WebSocket or API polling
  const mockNotifications = [
    {
      id: 1,
      type: 'violation',
      title: 'New Violation Recorded',
      message: 'A violation has been recorded for student John Doe',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      read: false,
      icon: 'AlertTriangle',
      color: 'orange',
      actionUrl: '/admin/violations'
    },
    {
      id: 2,
      type: 'capstone',
      title: 'Capstone Request',
      message: 'New capstone group request from Team Alpha',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      icon: 'BookOpen',
      color: 'purple',
      actionUrl: '/teacher/capstone'
    },
    {
      id: 3,
      type: 'system',
      title: 'System Update',
      message: 'System maintenance scheduled for tonight',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: true,
      icon: 'Settings',
      color: 'blue',
      actionUrl: '/admin/logs'
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // Removed automatic notification generation to prevent spamming
    // In production, this would be replaced with actual WebSocket or API polling
  }, []);

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: Date.now(),
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Show toast notification
    toast.success(notification.title, {
      description: notification.message,
      duration: 5000
    });
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = (id) => {
    const notification = notifications.find(n => n.id === id);
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (!notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (iconName, color) => {
    const icons = {
      AlertTriangle: '⚠️',
      BookOpen: '📚',
      Settings: '⚙️',
      Activity: '📊',
      Users: '👥',
      Award: '🏆',
      FileText: '📄',
      Shield: '🛡️'
    };
    return icons[iconName] || '📢';
  };

  const getColorClass = (color) => {
    const colors = {
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      red: 'bg-red-100 text-red-700 border-red-200'
    };
    return colors[color] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const value = {
    notifications,
    unreadCount,
    showDropdown,
    setShowDropdown,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    formatTimestamp,
    getNotificationIcon,
    getColorClass
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
