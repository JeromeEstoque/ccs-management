import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  DollarSign,
  CreditCard,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Calendar,
  TrendingUp
} from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  const mockStats = {
    assignedBorrowers: 45,
    todaysCollections: 125000,
    pendingApprovals: 12,
    overdueAccounts: 8
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'borrowers', label: 'Borrowers', icon: Users },
    { id: 'applications', label: 'Loan Applications', icon: FileText },
    { id: 'payments', label: 'Payments', icon: DollarSign },
  ];

  const Sidebar = ({ isOpen, onClose }) => (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Staff Portal</h1>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );

  const DashboardContent = () => (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
          <p className="text-gray-600 mt-1">Your assigned borrowers and daily tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
            View Schedule
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Assigned Borrowers"
          value={stats?.assignedBorrowers?.toString() || '0'}
          icon={Users}
          color="emerald"
          subtitle="Under your care"
        />
        <StatCard
          title="Today's Collections"
          value={`₱${stats?.todaysCollections?.toLocaleString() || '0'}`}
          icon={DollarSign}
          color="green"
          subtitle="Collected so far"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals?.toString() || '0'}
          icon={FileText}
          color="amber"
          subtitle="Awaiting review"
        />
        <StatCard
          title="Overdue Accounts"
          value={stats?.overdueAccounts?.toString() || '0'}
          icon={AlertTriangle}
          color="red"
          subtitle="Need attention"
        />
      </div>

      {/* Quick Actions */}
      <Card title="Quick Actions" icon={CheckCircle}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Review Applications</p>
                <p className="text-sm text-gray-600">Process new loan requests</p>
              </div>
            </div>
          </button>

          <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Record Payment</p>
                <p className="text-sm text-gray-600">Log borrower payments</p>
              </div>
            </div>
          </button>

          <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Contact Borrower</p>
                <p className="text-sm text-gray-600">Reach out to clients</p>
              </div>
            </div>
          </button>

          <button className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-900">Schedule Follow-up</p>
                <p className="text-sm text-gray-600">Plan client meetings</p>
              </div>
            </div>
          </button>
        </div>
      </Card>

      {/* Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Today's Tasks" icon={Clock}>
          <div className="space-y-4">
            {[
              { task: 'Review 3 pending loan applications', priority: 'high', time: '9:00 AM' },
              { task: 'Follow up with 5 overdue borrowers', priority: 'high', time: '10:30 AM' },
              { task: 'Process payments for 8 borrowers', priority: 'medium', time: '2:00 PM' },
              { task: 'Update borrower contact information', priority: 'low', time: '4:00 PM' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  item.priority === 'high' ? 'bg-red-500' :
                  item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.task}</p>
                  <p className="text-sm text-gray-600">{item.time}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.priority === 'high' ? 'bg-red-100 text-red-700' :
                  item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {item.priority}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Recent Payments" icon={DollarSign}>
          <div className="space-y-4">
            {[
              { borrower: 'Maria Santos', amount: '₱3,500', time: '2 hours ago', status: 'completed' },
              { borrower: 'Juan Dela Cruz', amount: '₱2,100', time: '4 hours ago', status: 'completed' },
              { borrower: 'Ana Garcia', amount: '₱5,000', time: '6 hours ago', status: 'pending' },
              { borrower: 'Pedro Reyes', amount: '₱1,800', time: '8 hours ago', status: 'completed' },
            ].map((payment, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  payment.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                }`}>
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{payment.borrower}</p>
                  <p className="text-sm text-gray-600">{payment.amount} • {payment.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {payment.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Assigned Borrowers Overview */}
      <Card title="Assigned Borrowers Overview" icon={Users}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">32</div>
            <p className="text-sm text-gray-600">Active Loans</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600 mb-2">₱485K</div>
            <p className="text-sm text-gray-600">Total Portfolio</p>
          </div>
          <div className="text-center p-6 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">89%</div>
            <p className="text-sm text-gray-600">Payment Rate</p>
          </div>
        </div>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-gray-600"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="hidden lg:block">
                <h2 className="text-lg font-semibold text-gray-900">
                  {menuItems.find(item => item.id === activeTab)?.label}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-gray-600">
                <Search className="w-5 h-5" />
              </button>
              <button className="text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.firstName?.[0] || 'S'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.firstName || 'Staff'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && <DashboardContent />}
          {activeTab !== 'dashboard' && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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

export default StaffDashboard;
