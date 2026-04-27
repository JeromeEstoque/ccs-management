import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { teachersAPI } from '../../services/api';
import Card from '../../components/common/Card';
import { User, Mail, Briefcase, Building, Award, Calendar, ArrowLeft, Loader2, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const TeacherDetail = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get return URL from query params
  const returnUrl = searchParams.get('returnUrl');

  // Determine correct back navigation based on user role and current path
  const getBackNavigation = () => {
    // If there's a return URL, use it (preserves filters)
    if (returnUrl) {
      try {
        return decodeURIComponent(returnUrl);
      } catch (error) {
        console.warn('Invalid return URL:', returnUrl);
      }
    }
    
    // Fallback to role-based navigation
    const currentPath = location.pathname;
    
    if (currentPath.includes('/admin/')) {
      return '/admin/teachers';
    } else if (currentPath.includes('/teacher/')) {
      return '/teacher/advisory';
    } else if (currentPath.includes('/student/')) {
      return '/student/teachers';
    }
    
    // Fallback based on user role
    switch (user?.role) {
      case 'admin':
        return '/admin/teachers';
      case 'teacher':
        return '/teacher/advisory';
      case 'student':
        return '/student/teachers';
      default:
        return '/';
    }
  };

  useEffect(() => {
    console.log('TeacherDetail - teacherId:', teacherId);
    if (!teacherId) {
      console.error('No teacherId provided in URL');
      navigate(getBackNavigation());
      return;
    }
    fetchTeacherDetails();
  }, [teacherId]);

  const fetchTeacherDetails = async () => {
    try {
      setLoading(true);
      const response = await teachersAPI.getById(teacherId);
      if (response.data.success) {
        setTeacher(response.data.teacher);
      } else {
        toast.error('Teacher not found');
        navigate(getBackNavigation());
      }
    } catch (error) {
      console.error('Error fetching teacher details:', error);
      toast.error('Failed to load teacher details');
      navigate(getBackNavigation());
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading teacher details...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Teacher Not Found</h2>
          <p className="text-gray-500 mb-4">The teacher you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(getBackNavigation())}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-emerald-50 to-teal-100 relative z-10">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 shadow-lg sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(getBackNavigation())}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Teacher Details</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`px-3 py-1 rounded-full font-medium ${getEmploymentStatusColor(teacher.employment_status)}`}>
              {teacher.employment_status}
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
              {teacher.years_of_service || 0} years
            </span>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Teacher Profile Card */}
        <Card className="mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-emerald-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {teacher.first_name} {teacher.middle_name} {teacher.last_name}
              </h2>
              <p className="text-lg text-gray-600 mb-4">{teacher.position}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{teacher.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Position</p>
                      <p className="text-gray-900">{teacher.position}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-gray-900">College of Computer Studies</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Years of Service</p>
                      <p className="text-gray-900">{teacher.years_of_service || 0} years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Employment Status</p>
                      <p className="text-gray-900">{teacher.employment_status}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Professional Information */}
        <Card title="Professional Information" icon={Briefcase} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Advisory Section</label>
                <p className="text-gray-900 font-medium">{teacher.section_advisory || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Courses Handled</label>
                <p className="text-gray-900 font-medium">{teacher.courses_handled || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Degree</label>
                <p className="text-gray-900 font-medium">{teacher.degree || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">University</label>
                <p className="text-gray-900 font-medium">{teacher.university || 'N/A'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Capstone Advising */}
        <Card title="Capstone Advising" icon={Award} className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${teacher.capstone_adviser_available ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="font-medium">
                {teacher.capstone_adviser_available ? 'Available for Capstone Advising' : 'Not Available for Capstone Advising'}
              </span>
            </div>
            
            {teacher.capstone_adviser_available && teacher.capstone_schedule && (
              <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-medium text-emerald-900">Available Schedule</h4>
                </div>
                <p className="text-emerald-800">{teacher.capstone_schedule}</p>
              </div>
            )}
            
            {teacher.capstone_adviser_available && !teacher.capstone_schedule && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-yellow-800 text-sm">
                  Available for capstone advising but schedule not specified. Please contact the teacher directly for scheduling.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Expertise */}
        {teacher.expertise && teacher.expertise.length > 0 && (
          <Card title="Areas of Expertise" icon={Award}>
            <div className="flex flex-wrap gap-2">
              {teacher.expertise.map((expertise, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-sm font-medium"
                >
                  {expertise.name || expertise}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeacherDetail;
