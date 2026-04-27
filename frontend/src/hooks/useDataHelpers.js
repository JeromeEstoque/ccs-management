import React from 'react';
import { useData } from '../hooks/useData';

// Higher-order component for automatic data prefetching
export const withDataPrefetch = (WrappedComponent, dataTypes = []) => {
  return (props) => {
    const hooks = {};
    
    // Get hooks for each data type
    if (dataTypes.includes('students')) {
      hooks.students = useStudents();
    }
    if (dataTypes.includes('teachers')) {
      hooks.teachers = useTeachers();
    }
    if (dataTypes.includes('violations')) {
      hooks.violations = useViolations();
    }

    // Prefetch data on component mount
    React.useEffect(() => {
      Object.entries(hooks).forEach(([key, hook]) => {
        if (hook.fetchData) {
          hook.fetchData();
        }
      });
    }, []);

    return <WrappedComponent {...props} {...hooks} />;
  };
};

// Data synchronization hook for real-time updates
export const useDataSync = (dataType, interval = 30000) => {
  const { fetchData } = useData();
  
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      fetchData({ forceRefresh: true });
    }, interval);

    return () => clearInterval(intervalId);
  }, [fetchData, interval, dataType]);
};

// Optimistic update hook
export const useOptimisticUpdate = (dataType) => {
  const { dispatch, ActionTypes } = useData();
  
  const optimisticUpdate = React.useCallback((updateFn) => {
    // Apply optimistic update immediately
    const optimisticData = updateFn();
    
    dispatch({
      type: `UPDATE_${dataType.toUpperCase()}_OPTIMISTIC`,
      payload: optimisticData
    });
    
    // Return a function to rollback if needed
    return () => {
      dispatch({
        type: `ROLLBACK_${dataType.toUpperCase()}`,
        payload: optimisticData.id
      });
    };
  }, [dispatch, dataType]);
  
  return optimisticUpdate;
};

// Data validation hook
export const useDataValidation = (dataType) => {
  const { state } = useData();
  const data = state[dataType];
  
  const validateData = React.useCallback((item) => {
    const errors = [];
    
    switch (dataType) {
      case 'students':
        if (!item.first_name) errors.push('First name is required');
        if (!item.last_name) errors.push('Last name is required');
        if (!item.student_id) errors.push('Student ID is required');
        break;
        
      case 'teachers':
        if (!item.first_name) errors.push('First name is required');
        if (!item.last_name) errors.push('Last name is required');
        if (!item.email) errors.push('Email is required');
        break;
        
      case 'violations':
        if (!item.violation_type) errors.push('Violation type is required');
        if (!item.student_id) errors.push('Student ID is required');
        if (!item.date) errors.push('Date is required');
        break;
        
      default:
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [dataType]);
  
  return { validateData };
};

// Performance monitoring hook
export const useDataPerformance = () => {
  const { state } = useData();
  
  const getPerformanceMetrics = React.useCallback(() => {
    const metrics = {};
    
    Object.entries(state).forEach(([key, value]) => {
      if (value.lastFetched) {
        const now = new Date();
        const lastFetched = new Date(value.lastFetched);
        const age = (now - lastFetched) / 1000; // in seconds
        
        metrics[key] = {
          dataCount: value.data?.length || 0,
          cacheAge: age,
          isLoading: value.loading,
          hasError: !!value.error
        };
      }
    });
    
    return metrics;
  }, [state]);
  
  return { getPerformanceMetrics };
};

// Data export hook
export const useDataExport = (dataType) => {
  const { state } = useData();
  const data = state[dataType];
  
  const exportToCSV = React.useCallback((filename = `${dataType}_export`) => {
    if (!data.data || data.data.length === 0) {
      throw new Error('No data to export');
    }
    
    const headers = Object.keys(data.data[0]);
    const csvContent = [
      headers.join(','),
      ...data.data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [data.data]);
  
  const exportToJSON = React.useCallback((filename = `${dataType}_export`) => {
    if (!data.data || data.data.length === 0) {
      throw new Error('No data to export');
    }
    
    const jsonContent = JSON.stringify(data.data, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [data.data]);
  
  return {
    exportToCSV,
    exportToJSON,
    canExport: data.data && data.data.length > 0
  };
};

// Data analytics hook
export const useDataAnalytics = (dataType) => {
  const { state } = useData();
  const data = state[dataType];
  
  const getAnalytics = React.useCallback(() => {
    if (!data.data || data.data.length === 0) {
      return null;
    }
    
    const analytics = {
      total: data.data.length,
      lastUpdated: data.lastFetched,
      filters: data.filters,
      searchTerm: data.searchTerm
    };
    
    switch (dataType) {
      case 'students':
        analytics.byYearLevel = {};
        analytics.byStatus = {};
        analytics.byGender = {};
        
        data.data.forEach(student => {
          // Year level distribution
          const year = student.year_level || 'Unknown';
          analytics.byYearLevel[year] = (analytics.byYearLevel[year] || 0) + 1;
          
          // Status distribution
          const status = student.status_record || 'Unknown';
          analytics.byStatus[status] = (analytics.byStatus[status] || 0) + 1;
          
          // Gender distribution
          const gender = student.gender || 'Unknown';
          analytics.byGender[gender] = (analytics.byGender[gender] || 0) + 1;
        });
        break;
        
      case 'teachers':
        analytics.byPosition = {};
        analytics.byEmploymentStatus = {};
        
        data.data.forEach(teacher => {
          // Position distribution
          const position = teacher.position || 'Unknown';
          analytics.byPosition[position] = (analytics.byPosition[position] || 0) + 1;
          
          // Employment status distribution
          const status = teacher.employment_status || 'Unknown';
          analytics.byEmploymentStatus[status] = (analytics.byEmploymentStatus[status] || 0) + 1;
        });
        break;
        
      case 'violations':
        analytics.byType = {};
        analytics.byStatus = {};
        analytics.byMonth = {};
        
        data.data.forEach(violation => {
          // Type distribution
          const type = violation.violation_type || 'Unknown';
          analytics.byType[type] = (analytics.byType[type] || 0) + 1;
          
          // Status distribution
          const status = violation.status || 'Unknown';
          analytics.byStatus[status] = (analytics.byStatus[status] || 0) + 1;
          
          // Monthly distribution
          const date = new Date(violation.date);
          const month = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          analytics.byMonth[month] = (analytics.byMonth[month] || 0) + 1;
        });
        break;
        
      default:
        break;
    }
    
    return analytics;
  }, [data.data, dataType, data.lastFetched, data.filters, data.searchTerm]);
  
  return { getAnalytics };
};

// Error boundary for data operations
export class DataErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Data Error Boundary caught an error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">
            {this.state.error?.message || 'An unexpected error occurred while loading data.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default {
  withDataPrefetch,
  useDataSync,
  useOptimisticUpdate,
  useDataValidation,
  useDataPerformance,
  useDataExport,
  useDataAnalytics,
  DataErrorBoundary
};
