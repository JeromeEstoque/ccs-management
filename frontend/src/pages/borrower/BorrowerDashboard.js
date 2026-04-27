import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CreditCard,
  DollarSign,
  Calendar,
  User,
  FileText,
  TrendingUp,
  AlertTriangle,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  Clock,
  CheckCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';

const BorrowerDashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API calls
  const mockLoanData = {
    loanAmount: 50000,
    remainingBalance: 32000,
    monthlyPayment: 2500,
    nextDueDate: '2024-03-15',
    interestRate: 12,
    term: 24,
    status: 'active',
    totalPaid: 18000
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoanData(mockLoanData);
      setLoading(false);
    }, 1000);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'loans', label: 'My Loans', icon: CreditCard },
    { id: 'payments', label: 'Payment History', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const Sidebar = ({ isOpen, onClose }) => (
    <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Borrower Portal</h1>
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
                    ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600'
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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.firstName || 'Borrower'}!</h1>
            <p className="text-indigo-100">Here's an overview of your loan account</p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Loan Amount"
          value={`₱${loanData?.loanAmount?.toLocaleString() || '0'}`}
          icon={CreditCard}
          color="indigo"
          subtitle="Total borrowed"
        />
        <StatCard
          title="Remaining Balance"
          value={`₱${loanData?.remainingBalance?.toLocaleString() || '0'}`}
          icon={DollarSign}
          color="blue"
          subtitle="Amount left to pay"
        />
        <StatCard
          title="Monthly Payment"
          value={`₱${loanData?.monthlyPayment?.toLocaleString() || '0'}`}
          icon={Calendar}
          color="green"
          subtitle="Due monthly"
        />
        <StatCard
          title="Next Due Date"
          value={new Date(loanData?.nextDueDate || Date.now()).toLocaleDateString()}
          icon={Clock}
          color="orange"
          subtitle="Payment deadline"
        />
      </div>

      {/* Loan Summary Card */}
      <Card title="Loan Summary" icon={CreditCard}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600 mb-1">
              {loanData?.term || 0} months
            </div>
            <p className="text-sm text-gray-600">Loan Term</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {loanData?.interestRate || 0}%
            </div>
            <p className="text-sm text-gray-600">Interest Rate</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">
              ₱{loanData?.totalPaid?.toLocaleString() || '0'}
            </div>
            <p className="text-sm text-gray-600">Total Paid</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {loanData?.status === 'active' ? 'Active' : 'Inactive'}
            </div>
            <p className="text-sm text-gray-600">Loan Status</p>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card title="Quick Actions" icon={TrendingUp}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="p-6 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <DollarSign className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Make Payment</p>
                <p className="text-sm text-gray-600">Pay your monthly installment</p>
              </div>
            </div>
          </button>

          <button className="p-6 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">View Schedule</p>
                <p className="text-sm text-gray-600">Check payment schedule</p>
              </div>
            </div>
          </button>

          <button className="p-6 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Contact Support</p>
                <p className="text-sm text-gray-600">Get help from staff</p>
              </div>
            </div>
          </button>
        </div>
      </Card>

      {/* Recent Payments */}
      <Card title="Recent Payments" icon={DollarSign}>
        <div className="space-y-4">
          {[
            { date: '2024-03-01', amount: '₱2,500', status: 'paid', method: 'Bank Transfer' },
            { date: '2024-02-01', amount: '₱2,500', status: 'paid', method: 'Cash' },
            { date: '2024-01-01', amount: '₱2,500', status: 'paid', method: 'Bank Transfer' },
            { date: '2024-03-15', amount: '₱2,500', status: 'upcoming', method: 'Due' },
          ].map((payment, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  payment.status === 'paid' ? 'bg-green-100 text-green-600' :
                  payment.status === 'upcoming' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {payment.status === 'paid' ? <CheckCircle className="w-5 h-5" /> :
                   payment.status === 'upcoming' ? <Clock className="w-5 h-5" /> :
                   <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {new Date(payment.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-600">{payment.method}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{payment.amount}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                  payment.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {payment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Payment Progress */}
      <Card title="Payment Progress" icon={TrendingUp}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress to Loan Completion</span>
            <span className="text-sm text-gray-600">
              {Math.round(((loanData?.loanAmount - loanData?.remainingBalance) / loanData?.loanAmount) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((loanData?.loanAmount - loanData?.remainingBalance) / loanData?.loanAmount) * 100}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                ₱{loanData?.totalPaid?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-600">Paid</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                ₱{loanData?.remainingBalance?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-gray-600">Remaining</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
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
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.firstName?.[0] || 'B'}
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.firstName || 'Borrower'}
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
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
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

export default BorrowerDashboard;
