import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', message = 'Loading...' }) => {
  const sizes = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-secondary-50">
      <Loader2 className={`${sizes[size]} text-primary-600 animate-spin`} />
      {message && (
        <p className="mt-4 text-secondary-600">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
