import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { studentsAPI } from '../../services/api';
import { Search, Users, GraduationCap, Mail, Phone, Eye, Loader2, Filter, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ViewStudents = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    yearLevel: searchParams.get('yearLevel') || '',
    section: searchParams.get('section') || '',
    status: searchParams.get('status') || '',
    sport: searchParams.get('sport') || '',
    technicalSkill: searchParams.get('technicalSkill') || ''
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  const fetchStudents = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const params = {
        search: searchTerm,
        yearLevel: filters.yearLevel,
        section: filters.section,
        status: filters.status,
        skill: filters.sport || filters.technicalSkill,
        skillType: filters.sport ? 'sport' : filters.technicalSkill ? 'technical' : undefined
      };
      const response = await studentsAPI.getAll(params);
      if (response.data.success) {
        setStudents(response.data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [searchTerm, filters.yearLevel, filters.section, filters.status, filters.sport, filters.technicalSkill]);

  useEffect(() => {
    // Only show loading on initial load, not on filter changes
    const isInitialLoad = students.length === 0 && loading;
    fetchStudents(isInitialLoad);
  }, [fetchStudents]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(false); // No loading for search
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    updateURLParams(newFilters, searchTerm);
  };
  
  const updateURLParams = (currentFilters, currentSearch) => {
    const params = new URLSearchParams();
    
    // Add search term if exists
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    
    // Add filters if they have values
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });
    
    setSearchParams(params);
  };

  const clearFilters = () => {
    const clearedFilters = {
      yearLevel: '',
      section: '',
      status: '',
      sport: '',
      technicalSkill: ''
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    setSearchParams({}); // Clear all URL params
  };

  const hasActiveFilters = searchTerm || filters.yearLevel || filters.section || filters.status || filters.sport || filters.technicalSkill;

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const navigateToStudentDetail = (studentId) => {
    console.log('Navigating to student detail:', studentId);
    // Navigate with return URL that includes current filters
    const currentPath = window.location.pathname + window.location.search;
    navigate(`/teacher/student/${studentId}?returnUrl=${encodeURIComponent(currentPath)}`);
  };

  const getYearLevelColor = (yearLevel) => {
    const colors = {
      '1st Year': 'bg-green-100 text-green-700',
      '2nd Year': 'bg-blue-100 text-blue-700',
      '3rd Year': 'bg-purple-100 text-purple-700',
      '4th Year': 'bg-orange-100 text-orange-700'
    };
    return colors[yearLevel] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Regular': 'bg-green-100 text-green-700',
      'Irregular': 'bg-yellow-100 text-yellow-700',
      'Probation': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative z-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-orange-200 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Student Management</span>
              </div>
              <h1 className="text-2xl font-bold">View Students</h1>
              <div className="flex gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                  <span className="text-orange-100 text-sm">{students.length} Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search and Filter Bar */}
        <div className="glass-panel rounded-xl p-6 mb-6">
          <div className="space-y-4">
            {/* Search Input */}
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, student ID, or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    const newSearch = e.target.value;
                    setSearchTerm(newSearch);
                    updateURLParams(filters, newSearch);
                  }}
                  className="input-search pr-4"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                )}
              </button>
            </form>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="border-t border-white/20 pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-white">Advanced Filters</h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-gray-400 hover:text-orange-400 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Clear All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Year Level</label>
                    <select
                      value={filters.yearLevel}
                      onChange={(e) => handleFilterChange('yearLevel', e.target.value)}
                      className="input-search px-3 py-2"
                    >
                      <option value="">All Year Levels</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Section</label>
                    <input
                      type="text"
                      value={filters.section}
                      onChange={(e) => handleFilterChange('section', e.target.value)}
                      placeholder="Enter section..."
                      className="input-search px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="input-search px-3 py-2"
                    >
                      <option value="">All Status</option>
                      <option value="Regular">Regular</option>
                      <option value="Irregular">Irregular</option>
                      <option value="Probation">Probation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Sports</label>
                    <select
                      value={filters.sport}
                      onChange={(e) => handleFilterChange('sport', e.target.value)}
                      className="input-search px-3 py-2"
                    >
                      <option value="">All Sports</option>
                      <option value="Basketball">Basketball</option>
                      <option value="Chess">Chess</option>
                      <option value="Esports">Esports</option>
                      <option value="Volleyball">Volleyball</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Technical Skills</label>
                    <select
                      value={filters.technicalSkill}
                      onChange={(e) => handleFilterChange('technicalSkill', e.target.value)}
                      className="input-search px-3 py-2"
                    >
                      <option value="">All Technical Skills</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Database">Database</option>
                      <option value="Networking">Networking</option>
                      <option value="Programming">Programming</option>
                      <option value="UI/UX">UI/UX</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Students Grid */}
        <div className="glass-panel rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/20 hover:border-orange-400/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <GraduationCap className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {student.first_name} {student.last_name}
                      </h3>
                      <p className="text-sm text-gray-500">{student.student_id}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateToStudentDetail(student.id)}
                    className="p-2 text-blue-600 hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-200 truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-200">{student.contact_number || 'N/A'}</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getYearLevelColor(student.year_level)}`}>
                      {student.year_level}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status_record)}`}>
                      {student.status_record}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {student.section}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {students.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No students found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'No students are currently registered'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Student Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <GraduationCap className="w-10 h-10 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedStudent.first_name} {selectedStudent.middle_name} {selectedStudent.last_name}
                  </h3>
                  <p className="text-gray-400">{selectedStudent.student_id}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Email</label>
                    <p className="text-white">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Contact Number</label>
                    <p className="text-white">{selectedStudent.contact_number || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Address</label>
                    <p className="text-white">{selectedStudent.address || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Year Level</label>
                    <p className="text-white">{selectedStudent.year_level}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Section</label>
                    <p className="text-white">{selectedStudent.section}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Status</label>
                    <p className="text-white">{selectedStudent.status_record}</p>
                  </div>
                </div>
              </div>

              {selectedStudent.skills && selectedStudent.skills.length > 0 && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-400 block mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-500/30 text-orange-300 rounded-full text-sm"
                      >
                        {skill.name || skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudents;
