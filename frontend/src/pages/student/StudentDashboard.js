import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI, studentsAPI } from '../../services/api';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import EnhancedLoadingSpinner, { CardSkeleton } from '../../components/common/EnhancedLoadingSpinner';
import { User, FileText, Award, AlertTriangle, GraduationCap, BookOpen, TrendingUp, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch real data first
      const [dashboardResponse, studentResponse] = await Promise.allSettled([
        dashboardAPI.getStats(),
        user?.id ? studentsAPI.getByUserId(user.id) : Promise.reject('No user ID')
      ]);

      let dashboardData = null;
      let studentData = null;

      // Handle dashboard data
      if (dashboardResponse.status === 'fulfilled' && dashboardResponse.value?.data?.success) {
        dashboardData = dashboardResponse.value.data.data || dashboardResponse.value.data.stats;
      }

      // Handle student data
      if (studentResponse.status === 'fulfilled' && studentResponse.value?.data?.success) {
        studentData = studentResponse.value.data.data || studentResponse.value.data.student;
      }

      // Combine data or use fallback
      if (dashboardData || studentData) {
        setStats({
          profile: studentData || {
            first_name: user?.firstName || 'Student',
            last_name: user?.lastName || 'User',
            student_id: user?.studentId || 'N/A',
            email: user?.email || 'N/A',
            year_level: 'N/A',
            section: 'N/A',
            gpa: 'N/A',
            status_record: 'N/A',
            organization_role: 'N/A',
            guardian_name: 'N/A',
            contact_number: 'N/A',
            address: 'N/A'
          },
          pendingViolations: dashboardData?.pendingViolations || 0,
          certificates: dashboardData?.certificates || 0,
          gpa: studentData?.gpa || dashboardData?.gpa || 'N/A',
          skills: studentData?.skills || dashboardData?.skills || [],
          recentViolations: dashboardData?.recentViolations || []
        });
      } else {
        // Use fallback data
        throw new Error('No data available');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Set comprehensive fallback data
      setStats({
        profile: {
          first_name: user?.firstName || 'Student',
          last_name: user?.lastName || 'User',
          student_id: user?.studentId || 'N/A',
          email: user?.email || 'N/A',
          year_level: 'N/A',
          section: 'N/A',
          gpa: 'N/A',
          status_record: 'N/A',
          organization_role: 'N/A',
          guardian_name: 'N/A',
          contact_number: 'N/A',
          address: 'N/A'
        },
        pendingViolations: 0,
        certificates: 0,
        gpa: 'N/A',
        skills: [],
        recentViolations: []
      });
      
      // Only show error toast if it's a network error, not missing data
      if (!error.message.includes('No data available')) {
        toast.error('Failed to load dashboard data. Using cached information.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <div className="p-6">
          <div className="mb-6">
            <div className="h-32 bg-gradient-to-r from-orange-600 via-orange-600 to-orange-700 rounded-2xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <CardSkeleton count={3} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CardSkeleton count={2} />
          </div>
          <CardSkeleton count={2} />
        </div>
      </div>
    );
  }

  const profile = stats?.profile;

  return (
    <div className="min-h-screen bg-black relative portal-student">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="h-full w-full" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(251, 146, 60, 0.15) 0%, transparent 50%), radial-gradient(circle at 40% 20%, rgba(251, 146, 60, 0.15) 0%, transparent 50%)`
        }}></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `linear-gradient(rgba(251, 146, 60, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 146, 60, 0.3) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 shadow-lg sticky top-0 z-50">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>

        <div className="p-6">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl mb-6">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full -translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Enhanced Profile Picture */}
              <div className="relative group">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-3 border-white/30 shadow-lg">
                  {profile?.profile_picture ? (
                    <img
                      src={profile.profile_picture}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <User className="w-8 h-8 text-white" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-white mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-md"></div>
                  <span className="text-xs font-semibold uppercase tracking-wide">Student Portal</span>
                  <GraduationCap className="w-3 h-3" />
                </div>
                <h1 className="text-3xl font-black text-white leading-tight mb-1 drop-shadow-lg">
                  {profile?.first_name} {profile?.last_name}
                </h1>
                <p className="text-white text-sm font-medium drop-shadow mb-1">
                  <span className="font-bold">{profile?.student_id}</span> • {profile?.year_level} - {profile?.section}
                </p>
                <div className="flex items-center gap-3 text-white">
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span className="text-xs font-medium">GPA: {profile?.gpa}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span className="text-xs font-medium">{profile?.status_record}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/25 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/30 shadow-lg">
                <p className="text-white text-xs font-medium mb-1">Welcome back!</p>
                <p className="text-white font-bold text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Pending Violations"
            value={stats?.pendingViolations || 0}
            icon={AlertTriangle}
            color="amber"
            trend={stats?.violationTrend}
            trendValue={stats?.violationTrendValue}
          />
          <StatCard
            title="Certificates"
            value={stats?.certificates || 0}
            icon={Award}
            color="emerald"
            trend={stats?.certificateTrend}
            trendValue={stats?.certificateTrendValue}
          />
          <StatCard
            title="GPA"
            value={stats?.gpa || 'N/A'}
            icon={TrendingUp}
            color="blue"
            subtitle="Current Semester"
          />
        </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Personal Information" icon={User}>
          <div className="space-y-4">
            {[
              { label: 'Student ID', value: profile?.student_id, icon: '🎓' },
              { label: 'Full Name', value: `${profile?.first_name || ''} ${profile?.middle_name || ''} ${profile?.last_name || ''}`.trim(), icon: '👤' },
              { label: 'Email', value: profile?.email || 'N/A', icon: '📧' },
              { label: 'Contact Number', value: profile?.contact_number || 'N/A', icon: '📱' },
              { label: 'Address', value: profile?.address || 'N/A', icon: '📍' },
              { label: 'Year Level', value: profile?.year_level || 'N/A', icon: '📚' },
              { label: 'Section', value: profile?.section || 'N/A', icon: '🏫' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 px-4 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-orange-700">{item.label}</span>
                </div>
                <span className="font-semibold text-orange-800">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Academic Information" icon={GraduationCap}>
          <div className="space-y-4">
            {[
              { label: 'GPA', value: profile?.gpa || 'N/A', icon: '📊' },
              { label: 'Status', value: profile?.status_record || 'N/A', icon: '✅' },
              { label: 'Organization Role', value: profile?.organization_role || 'N/A', icon: '🏢' },
              { label: 'Guardian', value: profile?.guardian_name || 'N/A', icon: '👨‍👩‍👧‍👦' }
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 px-4 bg-orange-50 rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm font-medium text-orange-700">{item.label}</span>
                </div>
                <span className="font-semibold text-orange-800">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Skills */}
      <Card title="Skills & Sports" icon={Award}>
        <div className="flex flex-wrap gap-2">
          {stats?.skills?.map((skill, index) => (
            <span
              key={index}
              className={`px-4 py-2 rounded-lg text-sm font-medium transform transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                skill.type === 'technical'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-2 border-orange-200 shadow-orange-200/50'
                  : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white border-2 border-orange-200 shadow-orange-200/50'
              }`}
            >
              <span className="flex items-center gap-1">
                {skill.type === 'technical' ? '💻' : '⚽'}
                {skill.name}
              </span>
            </span>
          ))}
          {(!stats?.skills || stats.skills.length === 0) && (
            <div className="w-full py-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <Award className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">No skills added yet</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Violations */}
      <Card title="Recent Violations" icon={AlertTriangle}>
        {stats?.recentViolations?.length > 0 ? (
          <div className="space-y-3">
            {stats.recentViolations.map((violation) => (
              <div
                key={violation.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    violation.severity === 'Major' 
                      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white' 
                      : 'bg-gradient-to-br from-amber-500 to-orange-600 text-white'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {violation.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      {violation.date} • {violation.status}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  violation.status === 'Pending' 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {violation.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-green-700">Clean Record!</h3>
                <p className="text-sm text-green-600">No violations recorded</p>
              </div>
            </div>
          </div>
        )}
      </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
