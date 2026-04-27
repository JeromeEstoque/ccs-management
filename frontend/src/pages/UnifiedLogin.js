import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const UnifiedLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { studentLogin, teacherLogin, adminLogin } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;

    setLoading(true);
    try {
      // Try admin login first for non-email, non-student-ID usernames
      // Admin usernames are typically simple (no @, not student ID format)
      if (!formData.username.includes('@') && !/^\d{4}-\d{3}$/.test(formData.username) && !/^\d{7}$/.test(formData.username)) {
        try {
          await adminLogin(formData.username, formData.password);
          return;
        } catch (adminError) {
          console.log('Admin login failed:', adminError.message);
          // If admin login fails, we'll try other methods below
        }
      }

      // Try student login (student ID pattern)
      if (/^\d{4}-\d{3}$/.test(formData.username) || /^\d{7}$/.test(formData.username)) {
        try {
          await studentLogin(formData.username, formData.password);
          return;
        } catch (studentError) {
          console.log('Student login failed:', studentError.message);
          // Don't continue to teacher for student IDs - it's a specific format
          throw new Error(studentError.message || 'Student login failed');
        }
      }

      // Try teacher login (email pattern)
      if (formData.username.includes('@')) {
        try {
          await teacherLogin(formData.username, formData.password);
          return;
        } catch (teacherError) {
          console.log('Teacher login failed:', teacherError.message);
          // Don't continue for emails - it's a specific format
          throw new Error(teacherError.message || 'Teacher login failed');
        }
      }

      // If we reach here, admin login was attempted but failed
      throw new Error('Invalid username or password. Please check your credentials and try again.');

    } catch (error) {
      console.error('Login failed:', error);
      // Show error message to user using toast
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-orange-400 to-orange-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-20 w-60 h-60 bg-gradient-to-r from-gray-600 to-gray-700 opacity-15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-gray-800 to-black opacity-15 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="px-6 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">CCS Management System</h1>
              <p className="text-gray-300 text-sm">College of Computer Studies</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-white mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg leading-tight tracking-tight">
              Sign In
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Enter your credentials to access the CCS Management System
            </p>
          </div>

          {/* Login Card */}
          <div className="max-w-md mx-auto">
            <div className="bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden border border-orange-200 dark:border-orange-700">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-100 to-red-200 dark:from-orange-900/20 dark:to-red-800/20 rounded-bl-full opacity-50"></div>
              
              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username / Student ID / Email
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-secondary-700 dark:text-white transition-colors"
                    placeholder="Enter your username, student ID, or email"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 dark:bg-secondary-700 dark:text-white transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Info */}
              <div className="mt-6 text-center relative z-10">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Forgot your password? <span className="text-orange-600 dark:text-orange-400 font-medium">Contact administrator</span>
                </p>
              </div>
            </div>
          </div>

          {/* Default Credentials */}
          <div className="mt-12 text-center">
            <p className="text-gray-300 text-sm mb-4">Default Credentials</p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 text-white">
                <span className="text-orange-300">Admin:</span> admin / admin123
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 text-white">
                <span className="text-gray-300">Student:</span> [Student ID] / password
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 text-white">
                <span className="text-gray-300">Teacher:</span> email / password
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center space-x-8 text-gray-300 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Secure Login</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Active System</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span>Auto-Detect</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 mt-12 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-300">
            © 2024 CCS Management System. College of Computer Studies.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default UnifiedLogin;
