import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, Users, Shield, Eye, EyeOff, Loader2, ArrowLeft,
  User, Mail, Lock, ArrowRight
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { portal: urlPortal } = useParams();
  const { studentLogin, teacherLogin, adminLogin } = useAuth();
  
  const [selectedPortal, setSelectedPortal] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });

  // Set portal from URL parameter
  useEffect(() => {
    if (urlPortal && ['student', 'teacher', 'admin'].includes(urlPortal)) {
      setSelectedPortal(urlPortal);
    }
  }, [urlPortal]);

  const portals = [
    {
      id: 'student',
      title: 'Student Portal',
      description: 'Access your profile, violations, and certificates',
      icon: GraduationCap,
      color: 'green',
      gradient: 'from-green-400 to-green-600',
      bgLight: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-600',
      label: 'Student ID',
      placeholder: 'Enter your Student ID'
    },
    {
      id: 'teacher',
      title: 'Teacher Portal',
      description: 'Manage advisory, encode violations, capstone',
      icon: Users,
      color: 'blue',
      gradient: 'from-blue-400 to-blue-600',
      bgLight: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-600',
      label: 'Email Address',
      placeholder: 'Enter your email'
    },
    {
      id: 'admin',
      title: 'Admin Portal',
      description: 'Full system control and user management',
      icon: Shield,
      color: 'purple',
      gradient: 'from-purple-400 to-purple-600',
      bgLight: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-600',
      label: 'Username or Email',
      placeholder: 'Enter your username or email'
    }
  ];

  const selectedPortalData = portals.find(p => p.id === selectedPortal);

  const getGradientClass = (portal) => {
    const gradients = {
      student: 'from-green-600 via-green-700 to-green-900',
      teacher: 'from-blue-600 via-blue-700 to-blue-900',
      admin: 'from-purple-600 via-purple-700 to-purple-900'
    };
    return gradients[portal] || 'from-primary-600 via-primary-700 to-primary-900';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password || !selectedPortal) return;

    setLoading(true);
    try {
      let success = false;
      switch (selectedPortal) {
        case 'student':
          success = await studentLogin(formData.identifier, formData.password);
          break;
        case 'teacher':
          success = await teacherLogin(formData.identifier, formData.password);
          break;
        case 'admin':
          success = await adminLogin(formData.identifier, formData.password);
          break;
      }
      if (success) {
        navigate(`/${selectedPortal}/dashboard`);
      }
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePortalSelect = (portalId) => {
    setSelectedPortal(portalId);
    setFormData({ identifier: '', password: '' });
  };

  const handleBack = () => {
    setSelectedPortal(null);
    setFormData({ identifier: '', password: '' });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getGradientClass(selectedPortal)} flex items-center justify-center p-6 relative overflow-hidden transition-all duration-500`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Link */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          {selectedPortal && (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Change Portal
            </button>
          )}
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Portal Selector */}
          {!selectedPortal ? (
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-secondary-800">Welcome Back</h1>
                <p className="text-secondary-500 mt-2">Select your portal to sign in</p>
              </div>

              {/* Portal Cards */}
              <div className="space-y-4">
                {portals.map((portal) => {
                  const Icon = portal.icon;
                  return (
                    <button
                      key={portal.id}
                      onClick={() => handlePortalSelect(portal.id)}
                      className={`w-full group relative overflow-hidden rounded-xl p-5 border-2 ${portal.border} ${portal.bgLight} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${portal.gradient} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className="font-semibold text-secondary-800">{portal.title}</h3>
                          <p className="text-sm text-secondary-500">{portal.description}</p>
                        </div>
                        <ArrowRight className={`w-5 h-5 ${portal.text} group-hover:translate-x-1 transition-transform`} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-secondary-500 text-sm">
                  Forgot your password? <span className="text-primary-600 font-medium">Contact administrator</span>
                </p>
              </div>
            </div>
          ) : (
            /* Login Form */
            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className={`w-20 h-20 bg-gradient-to-br ${selectedPortalData.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                  <selectedPortalData.icon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-secondary-800">{selectedPortalData.title}</h1>
                <p className="text-secondary-500 mt-2">Enter your credentials to continue</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">{selectedPortalData.label}</label>
                  <div className="relative">
                    {selectedPortal === 'student' ? (
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    ) : (
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    )}
                    <input
                      type={selectedPortal === 'teacher' ? 'email' : 'text'}
                      value={formData.identifier}
                      onChange={(e) => setFormData(prev => ({ ...prev, identifier: e.target.value }))}
                      className="input-field pl-10"
                      placeholder={selectedPortalData.placeholder}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="label">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="input-field pl-10 pr-12"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                    selectedPortal === 'student' 
                      ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white'
                      : selectedPortal === 'teacher'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
                      : 'bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-secondary-500 text-sm">
                  Forgot your password? <span className={`font-medium ${selectedPortalData.text}`}>Contact administrator</span>
                </p>
              </div>

              {/* Default credentials hint for admin */}
              {selectedPortal === 'admin' && (
                <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-purple-700 text-sm text-center">
                    Default credentials: <strong>admin</strong> / <strong>admin123</strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            © 2024 CCS Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
