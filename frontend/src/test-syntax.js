// Simple syntax test to verify fixes
import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';

// Test that imports work correctly
const TestComponent = () => {
  const auth = useAuth();
  return <div>Test</div>;
};

// Test that ErrorBoundary works
const TestErrorBoundary = () => {
  return (
    <ErrorBoundary>
      <TestComponent />
    </ErrorBoundary>
  );
};

export default TestErrorBoundary;
