import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, Shield, ArrowRight, BookOpen, ClipboardList, Award, TrendingUp } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-violet-700 to-indigo-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-400 to-purple-400 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 -left-20 w-60 h-60 bg-gradient-to-r from-blue-400 to-violet-400 opacity-15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-15 rounded-full blur-xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-violet-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="px-6 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">CCS Management System</h1>
              <p className="text-primary-200 text-sm">College of Computer Studies</p>
            </div>
          </div>
          <Link
            to="/login"
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-12 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-lg leading-tight tracking-tight">
              CCS Management System
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-4xl mx-auto leading-relaxed">
              A centralized platform for managing student records, faculty profiles, 
              academic assignments, violations monitoring, and capstone adviser availability.
            </p>
          </div>

          {/* Login Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Student Login */}
            <Link
              to="/login/student"
              className="group bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden border border-violet-200 dark:border-violet-700"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/20 dark:to-green-800/20 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-3 leading-tight">Student Portal</h3>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-5 leading-relaxed">
                Access your profile, view violations, and manage certificates all in one place.
              </p>
              <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold group-hover:gap-3 gap-2 transition-all">
                Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Teacher Login */}
            <Link
              to="/login/teacher"
              className="group bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden border border-violet-200 dark:border-violet-700"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-blue-900/20 dark:to-indigo-800/20 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-3 leading-tight">Teacher Portal</h3>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-5 leading-relaxed">
                Manage advisory students, encode violations, and handle capstone requests.
              </p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:gap-3 gap-2 transition-all">
                Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Admin Login */}
            <Link
              to="/login/admin"
              className="group bg-white dark:bg-secondary-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden border border-violet-200 dark:border-violet-700"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/20 dark:to-pink-800/20 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-3 leading-tight">Admin Portal</h3>
              <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-5 leading-relaxed">
                Full system control, user management, and analytics dashboard.
              </p>
              <div className="flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:gap-3 gap-2 transition-all">
                Login <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Features */}
          <div className="mt-24">
            <h3 className="text-4xl font-bold text-white text-center mb-12 tracking-tight">System Features</h3>
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: BookOpen, title: 'Student Records', desc: 'Complete student profile management' },
                { icon: Users, title: 'Faculty Management', desc: 'Teacher profiles and assignments' },
                { icon: ClipboardList, title: 'Violation Tracking', desc: 'Monitor and record violations' },
                { icon: Award, title: 'Certificate System', desc: 'Generate and manage certificates' }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 border border-white/20"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-3 leading-tight">{feature.title}</h4>
                  <p className="text-purple-100 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 mt-12 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-primary-200">
            © 2024 CCS Management System. College of Computer Studies.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
