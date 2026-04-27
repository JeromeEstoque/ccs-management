/**
 * Comprehensive Testing Utilities
 * Student and Teacher Management System
 */

// Mock data generator for testing
export const generateMockData = {
  // Generate mock student data
  student: (overrides = {}) => ({
    id: Math.floor(Math.random() * 1000),
    student_id: `2023-${Math.floor(Math.random() * 9000) + 1000}`,
    first_name: ['John', 'Jane', 'Carlos', 'Maria', 'Roberto', 'Sarah', 'Michael'][Math.floor(Math.random() * 7)],
    middle_name: ['Michael', 'Elizabeth', 'Reyes', 'Luisa', 'Chan', 'Michelle', 'David'][Math.floor(Math.random() * 7)],
    last_name: ['Doe', 'Smith', 'Santos', 'Garcia', 'Lim', 'Johnson', 'Chen'][Math.floor(Math.random() * 7)],
    email: '',
    phone: `+639${Math.floor(Math.random() * 900000000) + 100000000}`,
    birth_date: new Date(2000 + Math.floor(Math.random() * 5), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
    address: ['123 Main St, Quezon City', '456 Oak Ave, Makati', '789 Pine St, Pasig'][Math.floor(Math.random() * 3)],
    year_level: ['1st Year', '2nd Year', '3rd Year', '4th Year'][Math.floor(Math.random() * 4)],
    section: ['BSIT-1A', 'BSIT-2B', 'BSCS-3A', 'BSIS-4B'][Math.floor(Math.random() * 4)],
    gpa: (Math.random() * 2 + 2).toFixed(2),
    status_record: ['Regular', 'Irregular', 'Probation'][Math.floor(Math.random() * 3)],
    organization_role: ['Student Council Member', 'Class President', 'Programming Club Member'][Math.floor(Math.random() * 3)],
    guardian_name: ['Jane Doe', 'Robert Smith', 'Maria Santos'][Math.floor(Math.random() * 3)],
    guardian_contact: `+639${Math.floor(Math.random() * 900000000) + 100000000}`,
    profile_picture: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  }),

  // Generate mock teacher data
  teacher: (overrides = {}) => ({
    id: Math.floor(Math.random() * 100),
    employee_id: `T-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
    first_name: ['Sarah', 'Michael', 'Elena', 'James', 'Jennifer', 'Robert'][Math.floor(Math.random() * 6)],
    middle_name: ['Michelle', 'David', 'Maria', 'Robert', 'Ann', 'William'][Math.floor(Math.random() * 6)],
    last_name: ['Johnson', 'Chen', 'Rodriguez', 'Wilson', 'Taylor', 'Brown'][Math.floor(Math.random() * 6)],
    email: '',
    phone: `+639${Math.floor(Math.random() * 900000000) + 100000000}`,
    birth_date: new Date(1975 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    gender: ['Male', 'Female'][Math.floor(Math.random() * 2)],
    address: ['123 University Ave, Quezon City', '456 Faculty St, Makati', '789 Campus Rd, Pasig'][Math.floor(Math.random() * 3)],
    position: ['Instructor', 'Assistant Professor', 'Associate Professor', 'Professor'][Math.floor(Math.random() * 4)],
    department: 'College of Computer Studies',
    specialization: ['Web Development', 'AI/ML', 'Cybersecurity', 'Mobile Development'][Math.floor(Math.random() * 4)],
    hire_date: new Date(2015 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: 'Active',
    profile_picture: null,
    advisory_section: ['BSIT-3A', 'BSCS-4A', 'BSIS-2A'][Math.floor(Math.random() * 3)],
    teaching_load: Math.floor(Math.random() * 15) + 10,
    capstone_adviser_available: Math.random() > 0.5,
    capstone_schedule: Math.random() > 0.5 ? ['MW 10:00 AM - 12:00 PM', 'TTH 2:00 PM - 4:00 PM'][Math.floor(Math.random() * 2)] : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  }),

  // Generate mock course data
  course: (overrides = {}) => ({
    id: Math.floor(Math.random() * 100),
    course_code: ['CS101', 'CS201', 'CS301', 'CS302', 'CS401', 'IS201'][Math.floor(Math.random() * 6)],
    course_name: ['Introduction to Computer Science', 'Data Structures', 'Web Development', 'Database Systems', 'Machine Learning', 'Information Systems'][Math.floor(Math.random() * 6)],
    description: 'Course description here',
    credits: Math.floor(Math.random() * 3) + 2,
    year_level: ['1st Year', '2nd Year', '3rd Year', '4th Year'][Math.floor(Math.random() * 4)],
    semester: ['First', 'Second'][Math.floor(Math.random() * 2)],
    department: 'Computer Studies',
    prerequisite: Math.random() > 0.5 ? Math.floor(Math.random() * 5) + 1 : null,
    instructor_id: Math.floor(Math.random() * 10) + 1,
    schedule: ['MWF 8:00 AM - 9:00 AM', 'TTH 10:00 AM - 11:30 AM', 'MW 1:00 PM - 2:30 PM'][Math.floor(Math.random() * 3)],
    room: ['Lab 101', 'Lab 102', 'Lab 201', 'Room 201'][Math.floor(Math.random() * 4)],
    max_students: Math.floor(Math.random() * 20) + 20,
    current_enrollment: Math.floor(Math.random() * 25),
    status: 'Active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  }),

  // Generate mock violation data
  violation: (overrides = {}) => ({
    id: Math.floor(Math.random() * 1000),
    student_id: Math.floor(Math.random() * 100) + 1,
    teacher_id: Math.floor(Math.random() * 20) + 1,
    violation_type: ['Tardiness', 'Improper Uniform', 'Cutting Classes', 'Disrespectful Behavior', 'Academic Dishonesty'][Math.floor(Math.random() * 5)],
    description: 'Violation description here',
    severity: ['Minor', 'Moderate', 'Major'][Math.floor(Math.random() * 3)],
    date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    status: ['Pending', 'Resolved'][Math.floor(Math.random() * 2)],
    action_taken: Math.random() > 0.5 ? 'Warning issued' : null,
    points_deducted: Math.floor(Math.random() * 20),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides
  })
};

// Generate multiple records
export const generateMockDataset = (type, count = 10, overrides = {}) => {
  return Array.from({ length: count }, (_, index) => 
    generateMockData[type]({ ...overrides, id: index + 1 })
  );
};

// Test utilities
export const testUtils = {
  // Wait for a specified time
  wait: (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms)),

  // Wait for element to appear
  waitForElement: (selector, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  },

  // Simulate user input
  simulateInput: (selector, value) => {
    const element = document.querySelector(selector);
    if (element) {
      element.value = value;
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }
  },

  // Simulate click
  simulateClick: (selector) => {
    const element = document.querySelector(selector);
    if (element) {
      element.click();
    }
  },

  // Check if element exists
  elementExists: (selector) => {
    return document.querySelector(selector) !== null;
  },

  // Get element text
  getElementText: (selector) => {
    const element = document.querySelector(selector);
    return element ? element.textContent.trim() : '';
  },

  // Check if element is visible
  isElementVisible: (selector) => {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }
};

// API testing utilities
export const apiTestUtils = {
  // Mock API responses
  mockApiResponse: (data, success = true, delay = 100) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            success,
            data: success ? data : null,
            message: success ? 'Success' : 'Error'
          }
        });
      }, delay);
    });
  },

  // Mock API error
  mockApiError: (message = 'API Error', delay = 100) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({
          response: {
            data: {
              success: false,
              message
            }
          }
        });
      }, delay);
    });
  },

  // Test API endpoint
  testApiEndpoint: async (apiFunction, testData, expectedStatus = 'success') => {
    try {
      const response = await apiFunction(testData);
      return {
        passed: response.data?.success === (expectedStatus === 'success'),
        response,
        error: null
      };
    } catch (error) {
      return {
        passed: expectedStatus === 'error',
        response: null,
        error
      };
    }
  }
};

// Form testing utilities
export const formTestUtils = {
  // Fill form with test data
  fillForm: (formData) => {
    Object.entries(formData).forEach(([fieldName, value]) => {
      const selector = `[name="${fieldName}"], #${fieldName}, .${fieldName}`;
      testUtils.simulateInput(selector, value);
    });
  },

  // Submit form
  submitForm: (formSelector = 'form') => {
    const form = document.querySelector(formSelector);
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    }
  },

  // Check form validation
  checkValidation: (fieldName, shouldHaveError = false) => {
    const selector = `[name="${fieldName}"], #${fieldName}, .${fieldName}`;
    const element = document.querySelector(selector);
    
    if (!element) return false;
    
    const hasErrorClass = element.classList.contains('error') || 
                         element.classList.contains('border-red-500');
    
    return shouldHaveError ? hasErrorClass : !hasErrorClass;
  },

  // Get form data
  getFormData: (formSelector = 'form') => {
    const form = document.querySelector(formSelector);
    if (!form) return {};
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  }
};

// Performance testing utilities
export const performanceTestUtils = {
  // Measure render time
  measureRenderTime: (componentName, renderFunction) => {
    const start = performance.now();
    renderFunction();
    const end = performance.now();
    
    return {
      componentName,
      renderTime: end - start,
      timestamp: new Date().toISOString()
    };
  },

  // Measure API response time
  measureApiResponseTime: async (apiFunction, ...args) => {
    const start = performance.now();
    try {
      const response = await apiFunction(...args);
      const end = performance.now();
      
      return {
        responseTime: end - start,
        success: true,
        response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      const end = performance.now();
      
      return {
        responseTime: end - start,
        success: false,
        error,
        timestamp: new Date().toISOString()
      };
    }
  },

  // Memory usage check
  checkMemoryUsage: () => {
    if (performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: new Date().toISOString()
      };
    }
    return null;
  }
};

// Accessibility testing utilities
export const accessibilityTestUtils = {
  // Check for alt text on images
  checkImageAltText: () => {
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);
    
    return {
      total: images.length,
      withoutAlt: imagesWithoutAlt.length,
      passed: imagesWithoutAlt.length === 0,
      issues: imagesWithoutAlt.map(img => ({
        src: img.src,
        element: img
      }))
    };
  },

  // Check for proper heading hierarchy
  checkHeadingHierarchy: () => {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const issues = [];
    
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const prevLevel = index > 0 ? parseInt(headings[index - 1].tagName.charAt(1)) : 1;
      
      if (level > prevLevel + 1) {
        issues.push({
          element: heading,
          issue: `Heading level ${level} follows level ${prevLevel}`,
          text: heading.textContent.trim()
        });
      }
    });
    
    return {
      total: headings.length,
      issues: issues.length,
      passed: issues.length === 0,
      details: issues
    };
  },

  // Check for ARIA labels
  checkAriaLabels: () => {
    const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
    const elementsWithoutAria = Array.from(interactiveElements).filter(element => {
      return !element.getAttribute('aria-label') && 
             !element.getAttribute('aria-labelledby') && 
             !element.textContent.trim() &&
             element.tagName !== 'INPUT' && 
             !element.getAttribute('placeholder');
    });
    
    return {
      total: interactiveElements.length,
      withoutAria: elementsWithoutAria.length,
      passed: elementsWithoutAria.length === 0,
      issues: elementsWithoutAria.map(element => ({
        tag: element.tagName,
        type: element.type,
        element
      }))
    };
  },

  // Check color contrast (simplified)
  checkColorContrast: () => {
    const elements = document.querySelectorAll('*');
    const issues = [];
    
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // This is a simplified check - real contrast calculation is more complex
      if (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)') {
        issues.push({
          element,
          issue: 'Low contrast between gray text and white background',
          color,
          backgroundColor
        });
      }
    });
    
    return {
      checked: elements.length,
      issues: issues.length,
      passed: issues.length === 0,
      details: issues
    };
  }
};

// Test runner
export const runTests = {
  // Run component tests
  component: async (componentName, tests) => {
    const results = [];
    
    for (const test of tests) {
      try {
        const result = await test();
        results.push({
          name: test.name,
          passed: result.passed !== false,
          result,
          error: null
        });
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          result: null,
          error: error.message
        });
      }
    }
    
    return {
      component: componentName,
      total: tests.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      results
    };
  },

  // Run API tests
  api: async (apiTests) => {
    const results = [];
    
    for (const test of apiTests) {
      try {
        const result = await apiTestUtils.testApiEndpoint(test.apiFunction, test.data, test.expectedStatus);
        results.push({
          name: test.name,
          passed: result.passed,
          result,
          error: null
        });
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          result: null,
          error: error.message
        });
      }
    }
    
    return {
      type: 'API Tests',
      total: apiTests.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      results
    };
  },

  // Run accessibility tests
  accessibility: async () => {
    const tests = [
      { name: 'Image Alt Text', test: accessibilityTestUtils.checkImageAltText },
      { name: 'Heading Hierarchy', test: accessibilityTestUtils.checkHeadingHierarchy },
      { name: 'ARIA Labels', test: accessibilityTestUtils.checkAriaLabels },
      { name: 'Color Contrast', test: accessibilityTestUtils.checkColorContrast }
    ];
    
    const results = [];
    
    for (const test of tests) {
      try {
        const result = await test.test();
        results.push({
          name: test.name,
          passed: result.passed,
          result,
          error: null
        });
      } catch (error) {
        results.push({
          name: test.name,
          passed: false,
          result: null,
          error: error.message
        });
      }
    }
    
    return {
      type: 'Accessibility Tests',
      total: tests.length,
      passed: results.filter(r => r.passed).length,
      failed: results.filter(r => !r.passed).length,
      results
    };
  }
};

export default {
  generateMockData,
  generateMockDataset,
  testUtils,
  apiTestUtils,
  formTestUtils,
  performanceTestUtils,
  accessibilityTestUtils,
  runTests
};
