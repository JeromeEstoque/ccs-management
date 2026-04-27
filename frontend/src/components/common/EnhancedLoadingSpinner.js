import React from 'react';
import { Loader2 } from 'lucide-react';

const EnhancedLoadingSpinner = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        {/* Spinning Icon */}
        <div className="relative">
          <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600`} />
          {/* Optional glow effect */}
          <div className={`absolute inset-0 ${sizeClasses[size]} bg-blue-400/20 rounded-full animate-ping`} />
        </div>
        
        {/* Loading Text */}
        {text && (
          <div className="text-center">
            <p className="text-gray-600 font-medium text-sm">{text}</p>
            {/* Optional loading dots animation */}
            <div className="flex justify-center gap-1 mt-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Skeleton loader for cards
export const CardSkeleton = ({ count = 1 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-3 bg-gray-200 rounded w-16 mt-1 animate-pulse" />
              </div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
          </div>
          
          {/* Content skeleton */}
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Table skeleton loader
export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="h-3 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Form skeleton loader
export const FormSkeleton = ({ fieldCount = 5 }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="space-y-6">
        {Array.from({ length: fieldCount }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-10 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ))}
        
        {/* Button skeleton */}
        <div className="flex gap-3 pt-4">
          <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse" />
          <div className="h-10 bg-gray-100 rounded-lg w-20 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default EnhancedLoadingSpinner;
