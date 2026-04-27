import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI, teachersAPI } from '../../services/api';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import EnhancedLoadingSpinner, { CardSkeleton } from '../../components/common/EnhancedLoadingSpinner';
import { Users, ClipboardList, BookOpen, CheckCircle, User, TrendingUp, Calendar, Award } from 'lucide-react';
import toast from 'react-hot-toast';

const TeacherDashboard = () => {
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
      const [dashboardResponse, teacherResponse] = await Promise.allSettled([
        dashboardAPI.getStats(),
        user?.id ? teachersAPI.getByUserId(user.id) : Promise.reject('No user ID')
      ]);

      let dashboardData = null;
      let teacherData = null;

      // Handle dashboard data
      if (dashboardResponse.status === 'fulfilled' && dashboardResponse.value?.data?.success) {
        dashboardData = dashboardResponse.value.data.data || dashboardResponse.value.data.stats;
      }

      // Handle teacher data
      if (teacherResponse.status === 'fulfilled' && teacherResponse.value?.data?.success) {
        teacherData = teacherResponse.value.data.data || teacherResponse.value.data.teacher;
      }

      // Combine data or use fallback
      if (dashboardData || teacherData) {
        setStats({
          advisoryCount: dashboardData?.advisoryCount || teacherData?.advisoryStudents?.length || 0,
          capstoneRequests: dashboardData?.capstoneRequests || teacherData?.capstoneRequests?.length || 0,
          teachingLoad: teacherData?.teachingLoad || 0,
          isCapstoneAdviser: teacherData?.capstoneAdviserAvailable || false,
          advisorySection: teacherData?.advisorySection || 'N/A',
          department: teacherData?.department || 'College of Computer Studies',
          position: teacherData?.position || 'Faculty Member'
        });
      } else {
        // Use fallback data
        throw new Error('No data available');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      
      // Set comprehensive fallback data
      setStats({
        advisoryCount: 0,
        capstoneRequests: 0,
        teachingLoad: 0,
        isCapstoneAdviser: false,
        advisorySection: 'N/A',
        department: 'College of Computer Studies',
        position: 'Faculty Member'
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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50 to-amber-100">
        <div className="p-6">
          <div className="mb-6">
            <div className="h-32 bg-gradient-to-r from-orange-600 via-orange-600 to-orange-700 rounded-2xl animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <CardSkeleton count={4} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CardSkeleton count={2} />
          </div>
          <CardSkeleton count={1} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50 to-amber-100 relative portal-teacher">
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
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-white mb-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-md"></div>
                  <span className="text-xs font-semibold uppercase tracking-wide">Teacher Portal</span>
                  <BookOpen className="w-3 h-3" />
                </div>
                <h1 className="text-3xl font-black text-white leading-tight mb-1 drop-shadow-lg">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-white text-sm font-medium drop-shadow mb-1">
                  Faculty Member • Department of Computer Studies
                </p>
                <div className="flex items-center gap-3 text-white">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span className="text-xs font-medium">Advisory: {stats?.advisorySection || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    <span className="text-xs font-medium">{stats?.isCapstoneAdviser ? 'Capstone Adviser' : 'Faculty'}</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Advisory Students"
            value={stats?.advisoryCount || 0}
            icon={Users}
            color="emerald"
            subtitle="Under supervision"
          />
          <StatCard
            title="Capstone Requests"
            value={stats?.capstoneRequests || 0}
            icon={ClipboardList}
            color="blue"
            subtitle="Pending approval"
          />
          <StatCard
            title="Teaching Load"
            value={`${stats?.teachingLoad || 0} units`}
            icon={BookOpen}
            color="purple"
            subtitle="Current semester"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Teacher Information" icon={User}>
            <div className="space-y-4">
              {[
                { label: 'Name', value: `${user?.firstName || user?.first_name || 'N/A'} ${user?.lastName || user?.last_name || ''}`.trim(), icon: '👨‍🏫' },
                { label: 'Email', value: user?.email || 'N/A', icon: '📧' },
                { label: 'Department', value: 'College of Computer Studies', icon: '🏢' },
                { label: 'Advisory Section', value: stats?.advisorySection || 'N/A', icon: '👥' }
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

          <Card title="Teaching Statistics" icon={TrendingUp}>
            <div className="space-y-4">
              {[
                { label: 'Total Students', value: stats?.advisoryCount || 0, icon: '👥' },
                { label: 'Capstone Advisees', value: stats?.capstoneRequests || 0, icon: '🎓' },
                { label: 'Adviser Status', value: stats?.isCapstoneAdviser ? 'Available' : 'Unavailable', icon: '✅' }
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

        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
