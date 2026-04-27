import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

const ThemeToggle = ({ variant = 'toggle', className = '' }) => {
  const { theme, isDark, toggleTheme, setThemeMode } = useTheme();

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <div className="flex flex-col bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-600 overflow-hidden">
          <button
            onClick={() => setThemeMode('light')}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors ${
              theme === 'light' ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span className="text-sm font-medium">Light</span>
          </button>
          <button
            onClick={() => setThemeMode('dark')}
            className={`flex items-center gap-3 px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors ${
              theme === 'dark' ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span className="text-sm font-medium">Dark</span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('theme');
              const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              setThemeMode(systemTheme);
            }}
            className="flex items-center gap-3 px-4 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors text-secondary-700 dark:text-secondary-300 border-t border-secondary-200 dark:border-secondary-600"
          >
            <Monitor className="w-4 h-4" />
            <span className="text-sm font-medium">System</span>
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'switch') {
    return (
      <button
        onClick={toggleTheme}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
          isDark ? 'bg-primary-600' : 'bg-secondary-200'
        } ${className}`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <span className="sr-only">Toggle theme</span>
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isDark ? 'translate-x-6' : 'translate-x-1'
          }`}
        >
          <span className="flex h-full w-full items-center justify-center">
            {isDark ? (
              <Moon className="h-2 w-2 text-primary-600" />
            ) : (
              <Sun className="h-2 w-2 text-yellow-500" />
            )}
          </span>
        </span>
      </button>
    );
  }

  // Default toggle button
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg transition-colors ${
        isDark 
          ? 'bg-secondary-800 text-yellow-400 hover:bg-secondary-700' 
          : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
      } ${className}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
