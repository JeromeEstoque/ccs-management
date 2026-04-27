import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  FileText,
  AlertTriangle,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Award,
  UserCheck,
  Clock
} from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getStatistics();
      
      if (response.data.success) {
        const data = response.data.statistics;
        
        // Transform backend data to match frontend expectations
        const transformedStats = {
          totalStudents: data.totalStudents || 0,
          totalTeachers: data.totalTeachers || 0,
          totalSystemUsers: data.totalSystemUsers || 0,
          activeCourses: data.activeCourses || 0,
          pendingEnrollments: data.pendingEnrollments || 0,
          upcomingClasses: data.upcomingClasses || 0,
          recentGrades: 0, // This needs to be added to backend
          attendanceRate: data.attendanceRate || 0,
          averageGPA: data.averageGPA || 0,
          
          // Additional stats from backend
          studentsPerYear: data.studentsPerYear || [],
          facultyEmployment: data.facultyEmployment || [],
          violationsSummary: data.violationsSummary || [],
          capstoneAdvisersAvailable: data.capstoneAdvisersAvailable || 0,
          recentActivity: data.recentActivity || []
        };
        
        setStats(transformedStats);
      } else {
        setError('Failed to load statistics');
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Failed to load statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'enrollments', label: 'Enrollments', icon: FileText },
    { id: 'grades', label: 'Grades', icon: Award },
    { id: 'attendance', label: 'Attendance', icon: UserCheck },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  const Sidebar = ({ isOpen, onClose }) => (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white/90 backdrop-blur-sm border-r border-white/20 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl`}>
      {/* Background decoration for sidebar */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-amber-50/50 to-yellow-50/50"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Edu Admin</h1>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 hover:shadow-md'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    activeTab === item.id
                      ? 'bg-white/20'
                      : 'bg-gradient-to-br from-orange-100 to-orange-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      activeTab === item.id ? 'text-white' : 'text-orange-600'
                    }`} />
                  </div>
                  <span className={`font-medium ${
                    activeTab === item.id ? 'text-white' : 'text-gray-700'
                  }`}>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-8 border-t border-white/20">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-red-100 to-rose-100 group-hover:from-red-200 group-hover:to-rose-200">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              <span className="font-medium text-gray-700 group-hover:text-red-600">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-6">
      {/* Enhanced Page Header */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-white rounded-full -translate-y-1/2"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-100 mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-md"></div>
              <span className="text-xs font-semibold uppercase tracking-wide">Education Management</span>
            </div>
            <h1 className="text-3xl font-black text-white drop-shadow-lg mb-2">Admin Dashboard</h1>
            <p className="text-blue-100 text-base font-medium drop-shadow">Complete student and teacher management system overview</p>
          </div>
          <div className="hidden lg:block">
            <button className="px-4 py-2 bg-white/25 backdrop-blur-sm hover:bg-white/35 text-white rounded-xl transition-all flex items-center gap-2 border border-white/30 shadow-lg font-medium text-sm">
              <TrendingUp className="w-4 h-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards - Related to Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents?.toLocaleString() || '0'}
          icon={Users}
          color="blue"
          subtitle="Enrolled students"
          linkTo="/admin/students"
        />
        <StatCard
          title="Total Teachers"
          value={stats?.totalTeachers?.toLocaleString() || '0'}
          icon={GraduationCap}
          color="emerald"
          subtitle="Active faculty"
          linkTo="/admin/teachers"
        />
        <StatCard
          title="Total Violations"
          value={stats?.violationsSummary?.length?.toLocaleString() || '0'}
          icon={AlertTriangle}
          color="red"
          subtitle="Recorded violations"
          linkTo="/admin/violations"
        />
        <StatCard
          title="System Users"
          value={stats?.totalSystemUsers?.toLocaleString() || '0'}
          icon={Users}
          color="purple"
          subtitle="Registered accounts"
          linkTo="/admin/users"
        />
      </div>

      {/* Recent Activity */}
      <Card title="Recent Activity" icon={Activity}>
        <div className="space-y-4">
          {stats?.recentActivity?.length > 0 ? (
            stats.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-100 text-blue-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 capitalize">
                    {activity.action?.replace(/_/g, ' ') || 'System Activity'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.username || 'Unknown user'} • {activity.email || ''}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(activity.created_at).toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent activity found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchStatistics}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-orange-50 to-amber-100 relative portal-admin">
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

      {/* Main Content - Full Width */}
      <div className="relative z-10">
        {/* Top Navigation Bar */}
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 shadow-lg sticky top-0 z-50">
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab !== 'dashboard' && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h3>
                <p className="text-gray-600">
                  This section is under development. Dashboard content is displayed above.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
