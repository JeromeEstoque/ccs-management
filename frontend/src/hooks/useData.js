import { useData } from '../context/DataContext';
import { studentsAPI, teachersAPI, violationsAPI } from '../services/api';
import { useCallback, useEffect } from 'react';

// Custom hook for students data
export const useStudents = () => {
  const { state, dispatch, ActionTypes } = useData();
  const studentsState = state.students;

  // Fetch students
  const fetchStudents = useCallback(async (options = {}) => {
    const { forceRefresh = false, search, filters } = options;
    
    // Check if we have recent data and don't need to refresh
    if (!forceRefresh && studentsState.data.length > 0 && studentsState.lastFetched) {
      const now = new Date();
      const lastFetched = new Date(studentsState.lastFetched);
      const diffMinutes = (now - lastFetched) / (1000 * 60);
      if (diffMinutes < 5) {
        return studentsState.data;
      }
    }

    dispatch({ type: ActionTypes.FETCH_STUDENTS_START });
    
    try {
      const response = await studentsAPI.getAll({ search, ...filters });
      if (response.data.success) {
        dispatch({
          type: ActionTypes.FETCH_STUDENTS_SUCCESS,
          payload: response.data.students
        });
        return response.data.students;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_STUDENTS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [studentsState.data.length, studentsState.lastFetched, dispatch, ActionTypes]);

  // Add student
  const addStudent = useCallback(async (studentData) => {
    try {
      const response = await studentsAPI.create(studentData);
      if (response.data.success) {
        dispatch({
          type: ActionTypes.ADD_STUDENT,
          payload: response.data.student || response.data
        });
        return response.data;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_STUDENTS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [dispatch, ActionTypes]);

  // Update student
  const updateStudent = useCallback(async (id, studentData) => {
    try {
      const response = await studentsAPI.update(id, studentData);
      if (response.data.success) {
        dispatch({
          type: ActionTypes.UPDATE_STUDENT,
          payload: { id, ...response.data.student || response.data }
        });
        return response.data;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_STUDENTS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [dispatch, ActionTypes]);

  // Delete student
  const deleteStudent = useCallback(async (id) => {
    try {
      const response = await studentsAPI.delete(id);
      if (response.data.success) {
        dispatch({
          type: ActionTypes.DELETE_STUDENT,
          payload: id
        });
        return response.data;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_STUDENTS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [dispatch, ActionTypes]);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({
      type: ActionTypes.SET_STUDENT_FILTERS,
      payload: filters
    });
  }, [dispatch, ActionTypes]);

  // Set search term
  const setSearch = useCallback((searchTerm) => {
    dispatch({
      type: ActionTypes.SET_STUDENT_SEARCH,
      payload: searchTerm
    });
  }, [dispatch, ActionTypes]);

  // Get filtered students
  const getFilteredStudents = useCallback(() => {
    let filtered = [...studentsState.data];
    
    // Apply search term
    if (studentsState.searchTerm) {
      const searchLower = studentsState.searchTerm.toLowerCase();
      filtered = filtered.filter(student =>
        student.first_name?.toLowerCase().includes(searchLower) ||
        student.last_name?.toLowerCase().includes(searchLower) ||
        student.student_id?.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply filters
    Object.entries(studentsState.filters).forEach(([key, value]) => {
      if (value && value !== '') {
        filtered = filtered.filter(student => {
          switch (key) {
            case 'yearLevel':
              return student.year_level === value;
            case 'section':
              return student.section?.toLowerCase().includes(value.toLowerCase());
            case 'statusRecord':
              return student.status_record === value;
            case 'gender':
              return student.gender === value;
            default:
              return student[key] === value;
          }
        });
      }
    });
    
    return filtered;
  }, [studentsState.data, studentsState.searchTerm, studentsState.filters]);

  return {
    ...studentsState,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    setFilters,
    setSearch,
    getFilteredStudents
  };
};

// Custom hook for teachers data
export const useTeachers = () => {
  const { state, dispatch, ActionTypes } = useData();
  const teachersState = state.teachers;

  // Fetch teachers
  const fetchTeachers = useCallback(async (options = {}) => {
    const { forceRefresh = false, search, filters } = options;
    
    if (!forceRefresh && teachersState.data.length > 0 && teachersState.lastFetched) {
      const now = new Date();
      const lastFetched = new Date(teachersState.lastFetched);
      const diffMinutes = (now - lastFetched) / (1000 * 60);
      if (diffMinutes < 5) {
        return teachersState.data;
      }
    }

    dispatch({ type: ActionTypes.FETCH_TEACHERS_START });
    
    try {
      const response = await teachersAPI.getAll({ search, ...filters });
      if (response.data.success) {
        dispatch({
          type: ActionTypes.FETCH_TEACHERS_SUCCESS,
          payload: response.data.teachers
        });
        return response.data.teachers;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_TEACHERS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [teachersState.data.length, teachersState.lastFetched, dispatch, ActionTypes]);

  // Add teacher
  const addTeacher = useCallback(async (teacherData) => {
    try {
      const response = await teachersAPI.create(teacherData);
      if (response.data.success) {
        dispatch({
          type: ActionTypes.ADD_TEACHER,
          payload: response.data.teacher || response.data
        });
        return response.data;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_TEACHERS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [dispatch, ActionTypes]);

  // Update teacher
  const updateTeacher = useCallback(async (id, teacherData) => {
    try {
      const response = await teachersAPI.update(id, teacherData);
      if (response.data.success) {
        dispatch({
          type: ActionTypes.UPDATE_TEACHER,
          payload: { id, ...response.data.teacher || response.data }
        });
        return response.data;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_TEACHERS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [dispatch, ActionTypes]);

  // Delete teacher
  const deleteTeacher = useCallback(async (id) => {
    try {
      const response = await teachersAPI.delete(id);
      if (response.data.success) {
        dispatch({
          type: ActionTypes.DELETE_TEACHER,
          payload: id
        });
        return response.data;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_TEACHERS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [dispatch, ActionTypes]);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({
      type: ActionTypes.SET_TEACHER_FILTERS,
      payload: filters
    });
  }, [dispatch, ActionTypes]);

  // Set search term
  const setSearch = useCallback((searchTerm) => {
    dispatch({
      type: ActionTypes.SET_TEACHER_SEARCH,
      payload: searchTerm
    });
  }, [dispatch, ActionTypes]);

  // Get filtered teachers
  const getFilteredTeachers = useCallback(() => {
    let filtered = [...teachersState.data];
    
    if (teachersState.searchTerm) {
      const searchLower = teachersState.searchTerm.toLowerCase();
      filtered = filtered.filter(teacher =>
        teacher.first_name?.toLowerCase().includes(searchLower) ||
        teacher.last_name?.toLowerCase().includes(searchLower) ||
        teacher.email?.toLowerCase().includes(searchLower)
      );
    }
    
    Object.entries(teachersState.filters).forEach(([key, value]) => {
      if (value && value !== '') {
        filtered = filtered.filter(teacher => {
          switch (key) {
            case 'position':
              return teacher.position === value;
            case 'employmentStatus':
              return teacher.employment_status === value;
            case 'sectionAdvisory':
              return teacher.section_advisory?.toLowerCase().includes(value.toLowerCase());
            default:
              return teacher[key] === value;
          }
        });
      }
    });
    
    return filtered;
  }, [teachersState.data, teachersState.searchTerm, teachersState.filters]);

  return {
    ...teachersState,
    fetchTeachers,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    setFilters,
    setSearch,
    getFilteredTeachers
  };
};

// Custom hook for violations data
export const useViolations = () => {
  const { state, dispatch, ActionTypes } = useData();
  const violationsState = state.violations;

  // Fetch violations
  const fetchViolations = useCallback(async (options = {}) => {
    const { forceRefresh = false, search, filters } = options;
    
    if (!forceRefresh && violationsState.data.length > 0 && violationsState.lastFetched) {
      const now = new Date();
      const lastFetched = new Date(violationsState.lastFetched);
      const diffMinutes = (now - lastFetched) / (1000 * 60);
      if (diffMinutes < 5) {
        return violationsState.data;
      }
    }

    dispatch({ type: ActionTypes.FETCH_VIOLATIONS_START });
    
    try {
      const response = await violationsAPI.getAll({ search, ...filters });
      if (response.data.success) {
        dispatch({
          type: ActionTypes.FETCH_VIOLATIONS_SUCCESS,
          payload: response.data.violations
        });
        return response.data.violations;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_VIOLATIONS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [violationsState.data.length, violationsState.lastFetched, dispatch, ActionTypes]);

  // Add violation
  const addViolation = useCallback(async (violationData) => {
    try {
      const response = await violationsAPI.create(violationData);
      if (response.data.success) {
        dispatch({
          type: ActionTypes.ADD_VIOLATION,
          payload: response.data.violation || response.data
        });
        return response.data;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_VIOLATIONS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [dispatch, ActionTypes]);

  // Update violation
  const updateViolation = useCallback(async (id, violationData) => {
    try {
      const response = await violationsAPI.update(id, violationData);
      if (response.data.success) {
        dispatch({
          type: ActionTypes.UPDATE_VIOLATION,
          payload: { id, ...response.data.violation || response.data }
        });
        return response.data;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_VIOLATIONS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [dispatch, ActionTypes]);

  // Delete violation
  const deleteViolation = useCallback(async (id) => {
    try {
      const response = await violationsAPI.delete(id);
      if (response.data.success) {
        dispatch({
          type: ActionTypes.DELETE_VIOLATION,
          payload: id
        });
        return response.data;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_VIOLATIONS_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [dispatch, ActionTypes]);

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({
      type: ActionTypes.SET_VIOLATION_FILTERS,
      payload: filters
    });
  }, [dispatch, ActionTypes]);

  // Set search term
  const setSearch = useCallback((searchTerm) => {
    dispatch({
      type: ActionTypes.SET_VIOLATION_SEARCH,
      payload: searchTerm
    });
  }, [dispatch, ActionTypes]);

  // Get filtered violations
  const getFilteredViolations = useCallback(() => {
    let filtered = [...violationsState.data];
    
    if (violationsState.searchTerm) {
      const searchLower = violationsState.searchTerm.toLowerCase();
      filtered = filtered.filter(violation =>
        violation.violation_type?.toLowerCase().includes(searchLower) ||
        violation.description?.toLowerCase().includes(searchLower) ||
        violation.student_name?.toLowerCase().includes(searchLower)
      );
    }
    
    Object.entries(violationsState.filters).forEach(([key, value]) => {
      if (value && value !== '') {
        filtered = filtered.filter(violation => {
          switch (key) {
            case 'status':
              return violation.status === value;
            case 'violationType':
              return violation.violation_type === value;
            case 'dateRange':
              if (value.from && value.to) {
                const violationDate = new Date(violation.date);
                return violationDate >= new Date(value.from) && violationDate <= new Date(value.to);
              }
              return true;
            default:
              return violation[key] === value;
          }
        });
      }
    });
    
    return filtered;
  }, [violationsState.data, violationsState.searchTerm, violationsState.filters]);

  return {
    ...violationsState,
    fetchViolations,
    addViolation,
    updateViolation,
    deleteViolation,
    setFilters,
    setSearch,
    getFilteredViolations
  };
};

// Custom hook for current user data
export const useCurrentUser = () => {
  const { state, dispatch, ActionTypes } = useData();
  const currentUserState = state.currentUser;

  // Fetch current user
  const fetchCurrentUser = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && currentUserState.data) {
      return currentUserState.data;
    }

    dispatch({ type: ActionTypes.FETCH_CURRENT_USER_START });
    
    try {
      const response = await studentsAPI.getCurrentUser(); // or appropriate API call
      if (response.data.success) {
        dispatch({
          type: ActionTypes.FETCH_CURRENT_USER_SUCCESS,
          payload: response.data.user
        });
        return response.data.user;
      }
    } catch (error) {
      dispatch({
        type: ActionTypes.FETCH_CURRENT_USER_ERROR,
        payload: error.message
      });
      throw error;
    }
  }, [currentUserState.data, dispatch, ActionTypes]);

  // Update current user
  const updateCurrentUser = useCallback((userData) => {
    dispatch({
      type: ActionTypes.UPDATE_CURRENT_USER,
      payload: userData
    });
  }, [dispatch, ActionTypes]);

  return {
    ...currentUserState,
    fetchCurrentUser,
    updateCurrentUser
  };
};

// Hook to clear all errors
export const useClearErrors = () => {
  const { dispatch, ActionTypes } = useData();

  const clearErrors = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_ERRORS });
  }, [dispatch, ActionTypes]);

  return clearErrors;
};

// Hook to invalidate cache
export const useInvalidateCache = () => {
  const { dispatch, ActionTypes } = useData();

  const invalidateCache = useCallback((dataType) => {
    dispatch({
      type: ActionTypes.INVALIDATE_CACHE,
      payload: dataType
    });
  }, [dispatch, ActionTypes]);

  return invalidateCache;
};
