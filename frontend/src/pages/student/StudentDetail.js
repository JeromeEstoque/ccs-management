import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { studentsAPI } from '../../services/api';
import Card from '../../components/common/Card';
import { User, Mail, Phone, Calendar, BookOpen, Award, MapPin, Users, ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const StudentDetail = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Get return URL from query params
  const returnUrl = searchParams.get('returnUrl');

  // Determine the correct back navigation based on user role and current path
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
      return '/admin/students';
    } else if (currentPath.includes('/teacher/')) {
      return '/teacher/students';
    } else if (currentPath.includes('/student/')) {
      return '/student/teachers';
    }
    
    // Fallback based on user role
    switch (user?.role) {
      case 'admin':
        return '/admin/students';
      case 'teacher':
        return '/teacher/students';
      case 'student':
        return '/student/teachers';
      default:
        return '/';
    }
  };

  useEffect(() => {
    console.log('StudentDetail - studentId:', studentId);
    if (!studentId) {
      console.error('No studentId provided in URL');
      navigate(getBackNavigation());
      return;
    }
    fetchStudentDetails();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getById(studentId);
      if (response.data.success) {
        setStudent(response.data.student);
      } else {
        toast.error('Student not found');
        navigate(getBackNavigation());
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast.error('Failed to load student details');
      navigate(getBackNavigation());
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Student Not Found</h2>
          <p className="text-gray-500 mb-4">The student you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(getBackNavigation())}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 relative z-10">
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
            <h1 className="text-xl font-bold text-gray-900">Student Details</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`px-3 py-1 rounded-full font-medium ${getYearLevelColor(student.year_level)}`}>
              {student.year_level}
            </span>
            <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(student.status_record)}`}>
              {student.status_record}
            </span>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Student Profile Card */}
        <Card className="mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-12 h-12 text-indigo-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {student.first_name} {student.middle_name} {student.last_name}
              </h2>
              <p className="text-lg text-gray-600 mb-4">{student.student_id}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Contact Number</p>
                      <p className="text-gray-900">{student.contact_number || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-900">{student.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Year Level</p>
                      <p className="text-gray-900">{student.year_level}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Section</p>
                      <p className="text-gray-900">{student.section}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">GPA</p>
                      <p className="text-gray-900">{student.gpa || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Academic Information */}
        <Card title="Academic Information" icon={BookOpen} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status Record</label>
                <p className="text-gray-900 font-medium">{student.status_record}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Organization Role</label>
                <p className="text-gray-900 font-medium">{student.organization_role || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Guardian Name</label>
                <p className="text-gray-900 font-medium">{student.guardian_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Guardian Contact</label>
                <p className="text-gray-900 font-medium">{student.guardian_contact || 'N/A'}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Skills */}
        {student.skills && student.skills.length > 0 && (
          <Card title="Skills & Expertise" icon={Award}>
            <div className="flex flex-wrap gap-2">
              {student.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    skill.type === 'technical'
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {skill.type === 'technical' ? '💻' : '⚽'}
                    {skill.name}
                  </span>
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDetail;
