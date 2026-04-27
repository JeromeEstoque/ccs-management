import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { teachersAPI } from '../../services/api';
import Card from '../../components/common/Card';
import { Search, Users, User, Mail, Briefcase, Eye, Loader2, Building, Filter, X, Calendar, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const ViewTeachers = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  
  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    employmentStatus: searchParams.get('employmentStatus') || '',
    position: searchParams.get('position') || '',
    department: searchParams.get('department') || '',
    capstoneAdvising: searchParams.get('capstoneAdvising') || ''
  });
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params = {
        search: searchTerm,
        employmentStatus: filters.employmentStatus,
        position: filters.position,
        department: filters.department,
        capstoneAdvising: filters.capstoneAdvising
      };
      const response = await teachersAPI.getAll(params);
      if (response.data.success) {
        setTeachers(response.data.teachers || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to fetch teachers');
    } finally {
      setLoading(false);
    }
  };

  const searchTeachers = async () => {
    try {
      const params = {
        search: searchTerm,
        employmentStatus: filters.employmentStatus,
        position: filters.position,
        department: filters.department,
        capstoneAdvising: filters.capstoneAdvising
      };
      const response = await teachersAPI.getAll(params);
      if (response.data.success) {
        setTeachers(response.data.teachers || []);
      }
    } catch (error) {
      console.error('Error searching teachers:', error);
      toast.error('Failed to search teachers');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchTeachers();
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
      employmentStatus: '',
      position: '',
      department: '',
      capstoneAdvising: ''
    };
    setFilters(clearedFilters);
    setSearchTerm('');
    setSearchParams({}); // Clear all URL params
  };

  const hasActiveFilters = searchTerm || filters.employmentStatus || filters.position || filters.department || filters.capstoneAdvising;

  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const navigateToTeacherDetail = (teacherId) => {
    console.log('Navigating to teacher detail:', teacherId);
    // Navigate with return URL that includes current filters
    const currentPath = window.location.pathname + window.location.search;
    navigate(`/student/teacher/${teacherId}?returnUrl=${encodeURIComponent(currentPath)}`);
  };

  const getEmploymentStatusColor = (status) => {
    const colors = {
      'Full Time': 'bg-green-100 text-green-700',
      'Part Time': 'bg-blue-100 text-blue-700',
      'Contractual': 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative z-10">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading teachers...</p>
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
                <span className="text-sm font-medium">Teacher Management</span>
              </div>
              <h1 className="text-2xl font-bold">View Teachers</h1>
              <div className="flex gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                  <span className="text-orange-100 text-sm">{teachers.length} Total</span>
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
                  placeholder="Search by name, email, or department..."
                  value={searchTerm}
                  onChange={(e) => {
                    const newSearch = e.target.value;
                    setSearchTerm(newSearch);
                    updateURLParams(filters, newSearch);
                  }}
                  className="input-search pr-4 py-2"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Employment Status</label>
                    <select
                      value={filters.employmentStatus}
                      onChange={(e) => handleFilterChange('employmentStatus', e.target.value)}
                      className="input-search px-3 py-2"
                    >
                      <option value="">All Status</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Contractual">Contractual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Position</label>
                    <select
                      value={filters.position}
                      onChange={(e) => handleFilterChange('position', e.target.value)}
                      className="input-search px-3 py-2"
                    >
                      <option value="">All Positions</option>
                      <option value="Dean">Dean</option>
                      <option value="Chairman">Chairman</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Adviser">Adviser</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Department</label>
                    <input
                      type="text"
                      value={filters.department}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
                      placeholder="Enter department..."
                      className="input-search px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Capstone Advising</label>
                    <select
                      value={filters.capstoneAdvising}
                      onChange={(e) => handleFilterChange('capstoneAdvising', e.target.value)}
                      className="input-search px-3 py-2"
                    >
                      <option value="">All Teachers</option>
                      <option value="available">Available for Capstone</option>
                      <option value="unavailable">Not Available</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="glass-panel rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/20 hover:border-orange-400/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <User className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {teacher.first_name} {teacher.last_name}
                      </h3>
                      <p className="text-sm text-gray-400">{teacher.position}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateToTeacherDetail(teacher.id)}
                    className="p-2 text-orange-400 hover:bg-orange-900/50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-200 truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-200">{teacher.position}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-200">{teacher.section_advisory || 'No advisory'}</span>
                  </div>
                  {teacher.capstone_adviser_available && (
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 font-medium">Capstone Adviser Available</span>
                    </div>
                  )}
                  {teacher.capstone_adviser_available && teacher.capstone_schedule && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400">{teacher.capstone_schedule}</span>
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEmploymentStatusColor(teacher.employment_status)}`}>
                      {teacher.employment_status}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {teacher.years_of_service || 0} years
                    </span>
                    {teacher.capstone_adviser_available && (
                      <span className="px-2 py-1 bg-orange-500/30 text-orange-300 rounded-full text-xs font-medium">
                        Capstone Adviser
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {teachers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">No teachers found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search terms' : 'No teachers are currently registered'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* View Teacher Modal */}
      {showViewModal && selectedTeacher && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Teacher Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-orange-900/50 text-gray-400 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="w-10 h-10 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    {selectedTeacher.first_name} {selectedTeacher.middle_name} {selectedTeacher.last_name}
                  </h3>
                  <p className="text-gray-400">{selectedTeacher.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedTeacher.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Position</label>
                    <p className="text-gray-900">{selectedTeacher.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Employment Status</label>
                    <p className="text-gray-900">{selectedTeacher.employment_status}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Capstone Advising</label>
                    <p className="text-gray-900">
                      {selectedTeacher.capstone_adviser_available ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Advisory Section</label>
                    <p className="text-gray-900">{selectedTeacher.section_advisory || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Years of Service</label>
                    <p className="text-gray-900">{selectedTeacher.years_of_service || 0} years</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Courses Handled</label>
                    <p className="text-gray-900">{selectedTeacher.courses_handled || 'N/A'}</p>
                  </div>
                  {selectedTeacher.capstone_adviser_available && selectedTeacher.capstone_schedule && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Capstone Schedule</label>
                      <p className="text-gray-900">{selectedTeacher.capstone_schedule}</p>
                    </div>
                  )}
                </div>
              </div>

              {(selectedTeacher.degree || selectedTeacher.university) && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">Education</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedTeacher.degree && (
                      <p className="text-gray-900">{selectedTeacher.degree}</p>
                    )}
                    {selectedTeacher.university && (
                      <p className="text-gray-600 text-sm">{selectedTeacher.university}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedTeacher.expertise && selectedTeacher.expertise.length > 0 && (
                <div className="mt-6">
                  <label className="text-sm font-medium text-gray-500 block mb-2">Expertise</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedTeacher.expertise.map((expertise, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                      >
                        {expertise.name || expertise}
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

export default ViewTeachers;
