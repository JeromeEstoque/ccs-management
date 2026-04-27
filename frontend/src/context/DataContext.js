import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { studentsAPI, teachersAPI, violationsAPI } from '../services/api';

// Global State Initial state
const initialState = {
  students: {
    data: [],
    loading: false,
    error: null,
    lastFetched: null,
    filters: {},
    searchTerm: ''
  },
  teachers: {
    data: [],
    loading: false,
    error: null,
    lastFetched: null,
    filters: {},
    searchTerm: ''
  },
  violations: {
    data: [],
    loading: false,
    error: null,
    lastFetched: null,
    filters: {},
    searchTerm: ''
  },
  currentUser: {
    data: null,
    loading: false,
    error: null
  }
};

// Action types
const ActionTypes = {
  // Students
  FETCH_STUDENTS_START: 'FETCH_STUDENTS_START',
  FETCH_STUDENTS_SUCCESS: 'FETCH_STUDENTS_SUCCESS',
  FETCH_STUDENTS_ERROR: 'FETCH_STUDENTS_ERROR',
  ADD_STUDENT: 'ADD_STUDENT',
  UPDATE_STUDENT: 'UPDATE_STUDENT',
  DELETE_STUDENT: 'DELETE_STUDENT',
  SET_STUDENT_FILTERS: 'SET_STUDENT_FILTERS',
  SET_STUDENT_SEARCH: 'SET_STUDENT_SEARCH',
  
  // Teachers
  FETCH_TEACHERS_START: 'FETCH_TEACHERS_START',
  FETCH_TEACHERS_SUCCESS: 'FETCH_TEACHERS_SUCCESS',
  FETCH_TEACHERS_ERROR: 'FETCH_TEACHERS_ERROR',
  ADD_TEACHER: 'ADD_TEACHER',
  UPDATE_TEACHER: 'UPDATE_TEACHER',
  DELETE_TEACHER: 'DELETE_TEACHER',
  SET_TEACHER_FILTERS: 'SET_TEACHER_FILTERS',
  SET_TEACHER_SEARCH: 'SET_TEACHER_SEARCH',
  
  // Violations
  FETCH_VIOLATIONS_START: 'FETCH_VIOLATIONS_START',
  FETCH_VIOLATIONS_SUCCESS: 'FETCH_VIOLATIONS_SUCCESS',
  FETCH_VIOLATIONS_ERROR: 'FETCH_VIOLATIONS_ERROR',
  ADD_VIOLATION: 'ADD_VIOLATION',
  UPDATE_VIOLATION: 'UPDATE_VIOLATION',
  DELETE_VIOLATION: 'DELETE_VIOLATION',
  SET_VIOLATION_FILTERS: 'SET_VIOLATION_FILTERS',
  SET_VIOLATION_SEARCH: 'SET_VIOLATION_SEARCH',
  
  // Current User
  FETCH_CURRENT_USER_START: 'FETCH_CURRENT_USER_START',
  FETCH_CURRENT_USER_SUCCESS: 'FETCH_CURRENT_USER_SUCCESS',
  FETCH_CURRENT_USER_ERROR: 'FETCH_CURRENT_USER_ERROR',
  UPDATE_CURRENT_USER: 'UPDATE_CURRENT_USER',
  
  // Cache
  INVALIDATE_CACHE: 'INVALIDATE_CACHE',
  CLEAR_ERRORS: 'CLEAR_ERRORS'
};

// Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    // Students
    case ActionTypes.FETCH_STUDENTS_START:
      return {
        ...state,
        students: {
          ...state.students,
          loading: true,
          error: null
        }
      };
    
    case ActionTypes.FETCH_STUDENTS_SUCCESS:
      return {
        ...state,
        students: {
          ...state.students,
          data: action.payload,
          loading: false,
          error: null,
          lastFetched: new Date().toISOString()
        }
      };
    
    case ActionTypes.FETCH_STUDENTS_ERROR:
      return {
        ...state,
        students: {
          ...state.students,
          loading: false,
          error: action.payload
        }
      };
    
    case ActionTypes.ADD_STUDENT:
      return {
        ...state,
        students: {
          ...state.students,
          data: [...state.students.data, action.payload]
        }
      };
    
    case ActionTypes.UPDATE_STUDENT:
      return {
        ...state,
        students: {
          ...state.students,
          data: state.students.data.map(student =>
            student.id === action.payload.id ? action.payload : student
          )
        }
      };
    
    case ActionTypes.DELETE_STUDENT:
      return {
        ...state,
        students: {
          ...state.students,
          data: state.students.data.filter(student => student.id !== action.payload)
        }
      };
    
    case ActionTypes.SET_STUDENT_FILTERS:
      return {
        ...state,
        students: {
          ...state.students,
          filters: action.payload
        }
      };
    
    case ActionTypes.SET_STUDENT_SEARCH:
      return {
        ...state,
        students: {
          ...state.students,
          searchTerm: action.payload
        }
      };
    
    // Teachers
    case ActionTypes.FETCH_TEACHERS_START:
      return {
        ...state,
        teachers: {
          ...state.teachers,
          loading: true,
          error: null
        }
      };
    
    case ActionTypes.FETCH_TEACHERS_SUCCESS:
      return {
        ...state,
        teachers: {
          ...state.teachers,
          data: action.payload,
          loading: false,
          error: null,
          lastFetched: new Date().toISOString()
        }
      };
    
    case ActionTypes.FETCH_TEACHERS_ERROR:
      return {
        ...state,
        teachers: {
          ...state.teachers,
          loading: false,
          error: action.payload
        }
      };
    
    case ActionTypes.ADD_TEACHER:
      return {
        ...state,
        teachers: {
          ...state.teachers,
          data: [...state.teachers.data, action.payload]
        }
      };
    
    case ActionTypes.UPDATE_TEACHER:
      return {
        ...state,
        teachers: {
          ...state.teachers,
          data: state.teachers.data.map(teacher =>
            teacher.id === action.payload.id ? action.payload : teacher
          )
        }
      };
    
    case ActionTypes.DELETE_TEACHER:
      return {
        ...state,
        teachers: {
          ...state.teachers,
          data: state.teachers.data.filter(teacher => teacher.id !== action.payload)
        }
      };
    
    case ActionTypes.SET_TEACHER_FILTERS:
      return {
        ...state,
        teachers: {
          ...state.teachers,
          filters: action.payload
        }
      };
    
    case ActionTypes.SET_TEACHER_SEARCH:
      return {
        ...state,
        teachers: {
          ...state.teachers,
          searchTerm: action.payload
        }
      };
    
    // Violations
    case ActionTypes.FETCH_VIOLATIONS_START:
      return {
        ...state,
        violations: {
          ...state.violations,
          loading: true,
          error: null
        }
      };
    
    case ActionTypes.FETCH_VIOLATIONS_SUCCESS:
      return {
        ...state,
        violations: {
          ...state.violations,
          data: action.payload,
          loading: false,
          error: null,
          lastFetched: new Date().toISOString()
        }
      };
    
    case ActionTypes.FETCH_VIOLATIONS_ERROR:
      return {
        ...state,
        violations: {
          ...state.violations,
          loading: false,
          error: action.payload
        }
      };
    
    case ActionTypes.ADD_VIOLATION:
      return {
        ...state,
        violations: {
          ...state.violations,
          data: [...state.violations.data, action.payload]
        }
      };
    
    case ActionTypes.UPDATE_VIOLATION:
      return {
        ...state,
        violations: {
          ...state.violations,
          data: state.violations.data.map(violation =>
            violation.id === action.payload.id ? action.payload : violation
          )
        }
      };
    
    case ActionTypes.DELETE_VIOLATION:
      return {
        ...state,
        violations: {
          ...state.violations,
          data: state.violations.data.filter(violation => violation.id !== action.payload)
        }
      };
    
    case ActionTypes.SET_VIOLATION_FILTERS:
      return {
        ...state,
        violations: {
          ...state.violations,
          filters: action.payload
        }
      };
    
    case ActionTypes.SET_VIOLATION_SEARCH:
      return {
        ...state,
        violations: {
          ...state.violations,
          searchTerm: action.payload
        }
      };
    
    // Current User
    case ActionTypes.FETCH_CURRENT_USER_START:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          loading: true,
          error: null
        }
      };
    
    case ActionTypes.FETCH_CURRENT_USER_SUCCESS:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          data: action.payload,
          loading: false,
          error: null
        }
      };
    
    case ActionTypes.FETCH_CURRENT_USER_ERROR:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          loading: false,
          error: action.payload
        }
      };
    
    case ActionTypes.UPDATE_CURRENT_USER:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          data: action.payload
        }
      };
    
    // Cache
    case ActionTypes.INVALIDATE_CACHE:
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          data: [],
          lastFetched: null
        }
      };
    
    case ActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        students: { ...state.students, error: null },
        teachers: { ...state.teachers, error: null },
        violations: { ...state.violations, error: null },
        currentUser: { ...state.currentUser, error: null }
      };
    
    default:
      return state;
  }
};

// Context
const DataContext = createContext(null);

// Provider
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load cached data on mount
  useEffect(() => {
    const cachedState = localStorage.getItem('ccs-data-cache');
    if (cachedState) {
      try {
        const parsed = JSON.parse(cachedState);
        // Only restore if cache is less than 5 minutes old
        const now = new Date();
        Object.keys(parsed).forEach(key => {
          if (parsed[key].lastFetched) {
            const lastFetched = new Date(parsed[key].lastFetched);
            const diffMinutes = (now - lastFetched) / (1000 * 60);
            if (diffMinutes < 5) {
              dispatch({
                type: `FETCH_${key.toUpperCase()}_SUCCESS`,
                payload: parsed[key].data
              });
            }
          }
        });
      } catch (error) {
        console.warn('Failed to parse cached data:', error);
      }
    }
  }, []);

  // Save to cache when data changes
  useEffect(() => {
    const cacheData = {
      students: {
        data: state.students.data,
        lastFetched: state.students.lastFetched
      },
      teachers: {
        data: state.teachers.data,
        lastFetched: state.teachers.lastFetched
      },
      violations: {
        data: state.violations.data,
        lastFetched: state.violations.lastFetched
      }
    };
    localStorage.setItem('ccs-data-cache', JSON.stringify(cacheData));
  }, [state.students.data, state.teachers.data, state.violations.data]);

  const value = {
    state,
    dispatch,
    ActionTypes
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Hook to use context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
