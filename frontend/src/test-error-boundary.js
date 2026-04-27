import React, { useState } from 'react';
import ErrorBoundary from './components/common/ErrorBoundary';

// Test component that can throw an error
const TestComponent = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error for ErrorBoundary testing');
  }
  return <div>Component is working correctly!</div>;
};

// Test wrapper component
const ErrorBoundaryTest = () => {
  const [shouldThrow, setShouldThrow] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  return (
    <div style={{ padding: '20px' }}>
      <h2>ErrorBoundary Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setShouldThrow(true)}>
          Trigger Error
        </button>
        <button onClick={() => {
          setShouldThrow(false);
          setResetKey(prev => prev + 1);
        }}>
          Reset Test
        </button>
      </div>

      <ErrorBoundary key={resetKey}>
        <TestComponent shouldThrow={shouldThrow} />
      </ErrorBoundary>
    </div>
  );
};

export default ErrorBoundaryTest;
