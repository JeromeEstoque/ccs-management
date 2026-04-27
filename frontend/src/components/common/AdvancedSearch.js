import React, { useState, useEffect } from 'react';
import { Search, Filter, X, ChevronDown, Calendar, Users, BookOpen, Shield } from 'lucide-react';

const AdvancedSearch = ({ 
  onSearch, 
  onFilterChange, 
  fields = [], 
  initialFilters = {},
  placeholder = "Search...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  useEffect(() => {
    const count = Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
    setActiveFilters(count);
  }, [filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch?.(searchTerm, filters);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearchTerm('');
    onFilterChange?.(initialFilters);
    onSearch?.('', initialFilters);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch?.('', filters);
  };

  const renderField = (field) => {
    const { key, label, type, options, placeholder: fieldPlaceholder, icon: Icon } = field;
    const value = filters[key] || '';

    switch (type) {
      case 'select':
        return (
          <div key={key} className="flex-1 min-w-[150px]">
            <label className="label">{label}</label>
            <div>
              <select
                value={value}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="input-field"
              >
                <option value="">All {label}</option>
                {options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label || option.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={key} className="flex-1 min-w-[150px]">
            <label className="label">{label}</label>
            <div>
              <input
                type="date"
                value={value}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="input-field"
              />
            </div>
          </div>
        );

      case 'dateRange':
        return (
          <div key={key} className="flex-1 min-w-[200px]">
            <label className="label">{label}</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="date"
                  value={value.from || ''}
                  onChange={(e) => handleFilterChange(key, { ...value, from: e.target.value })}
                  placeholder="From"
                  className="input-field"
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="date"
                  value={value.to || ''}
                  onChange={(e) => handleFilterChange(key, { ...value, to: e.target.value })}
                  placeholder="To"
                  className="input-field"
                />
              </div>
            </div>
          </div>
        );

      case 'text':
      default:
        return (
          <div key={key} className="flex-1 min-w-[150px]">
            <label className="label">{label}</label>
            <div>
              <input
                type="text"
                value={value}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                placeholder={fieldPlaceholder || `Search ${label}`}
                className="input-field"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
            placeholder={placeholder}
            className="input-search pr-10"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-orange-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <button
          onClick={handleSearch}
          className="btn-primary flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Search
        </button>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`btn-secondary flex items-center gap-2 relative ${
            activeFilters > 0 ? 'ring-2 ring-primary-500 ring-offset-2' : ''
          }`}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>

        {(activeFilters > 0 || searchTerm) && (
          <button
            onClick={clearFilters}
            className="btn-secondary flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-secondary-50 dark:bg-secondary-800 rounded-xl p-4 border border-secondary-200 dark:border-secondary-600 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-secondary-800 dark:text-secondary-200">Advanced Filters</h3>
            <button
              onClick={() => setShowAdvanced(false)}
              className="text-secondary-400 hover:text-orange-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {fields.map(renderField)}
          </div>

          {activeFilters > 0 && (
            <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-600">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || value === '' || (typeof value === 'object' && !value.from && !value.to)) {
                    return null;
                  }
                  
                  const field = fields.find(f => f.key === key);
                  const label = field?.label || key;
                  
                  let displayValue = value;
                  if (typeof value === 'object') {
                    const parts = [];
                    if (value.from) parts.push(`From: ${value.from}`);
                    if (value.to) parts.push(`To: ${value.to}`);
                    displayValue = parts.join(' ');
                  } else if (field?.options) {
                    const option = field.options.find(opt => opt.value === value);
                    displayValue = option?.label || value;
                  }

                  return (
                    <span
                      key={key}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                    >
                      <span>{label}: {displayValue}</span>
                      <button
                        onClick={() => handleFilterChange(key, initialFilters[key] || '')}
                        className="ml-1 hover:text-orange-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Predefined field configurations for different data types
export const studentSearchFields = [
  {
    key: 'yearLevel',
    label: 'Year Level',
    type: 'select',
    options: [
      { value: '1st Year', label: '1st Year' },
      { value: '2nd Year', label: '2nd Year' },
      { value: '3rd Year', label: '3rd Year' },
      { value: '4th Year', label: '4th Year' }
    ],
    icon: BookOpen
  },
  {
    key: 'section',
    label: 'Section',
    type: 'text',
    placeholder: 'Enter section',
    icon: Users
  },
  {
    key: 'statusRecord',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Regular', label: 'Regular' },
      { value: 'Irregular', label: 'Irregular' },
      { value: 'Drop Out', label: 'Drop Out' }
    ],
    icon: Shield
  },
  {
    key: 'gender',
    label: 'Gender',
    type: 'select',
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Other', label: 'Other' }
    ]
  }
];

export const violationSearchFields = [
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'Pending', label: 'Pending' },
      { value: 'Resolved', label: 'Resolved' }
    ],
    icon: Shield
  },
  {
    key: 'violationType',
    label: 'Violation Type',
    type: 'select',
    options: [
      { value: 'Minor Offense - Tardiness', label: 'Tardiness' },
      { value: 'Minor Offense - Improper Uniform', label: 'Improper Uniform' },
      { value: 'Minor Offense - Cutting Classes', label: 'Cutting Classes' },
      { value: 'Major Offense - Disrespectful Behavior', label: 'Disrespectful Behavior' },
      { value: 'Major Offense - Academic Dishonesty', label: 'Academic Dishonesty' },
      { value: 'Major Offense - Vandalism', label: 'Vandalism' },
      { value: 'Major Offense - Fighting', label: 'Fighting' },
      { value: 'Major Offense - Theft', label: 'Theft' }
    ]
  },
  {
    key: 'dateRange',
    label: 'Date Range',
    type: 'dateRange',
    icon: Calendar
  }
];

export const teacherSearchFields = [
  {
    key: 'position',
    label: 'Position',
    type: 'select',
    options: [
      { value: 'Instructor', label: 'Instructor' },
      { value: 'Adviser', label: 'Adviser' },
      { value: 'Chairman', label: 'Chairman' },
      { value: 'Dean', label: 'Dean' }
    ],
    icon: Shield
  },
  {
    key: 'employmentStatus',
    label: 'Employment Status',
    type: 'select',
    options: [
      { value: 'Full Time', label: 'Full Time' },
      { value: 'Part Time', label: 'Part Time' }
    ]
  },
  {
    key: 'sectionAdvisory',
    label: 'Advisory Section',
    type: 'text',
    placeholder: 'Enter section',
    icon: Users
  }
];

export default AdvancedSearch;
