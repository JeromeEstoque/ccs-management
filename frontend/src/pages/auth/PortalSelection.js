import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, User, Building2, ArrowRight } from 'lucide-react';

const PortalSelection = () => {
  const portals = [
    {
      id: 'admin',
      title: 'Admin Portal',
      description: 'Full system administration and management',
      icon: Shield,
      color: 'blue',
      path: '/admin/login',
      features: [
        'User Management',
        'System Settings',
        'Financial Reports',
        'Loan Products'
      ]
    },
    {
      id: 'staff',
      title: 'Staff Portal',
      description: 'Loan processing and customer service',
      icon: Users,
      color: 'emerald',
      path: '/staff/login',
      features: [
        'Loan Applications',
        'Payment Processing',
        'Customer Support',
        'Reports'
      ]
    },
    {
      id: 'borrower',
      title: 'Borrower Portal',
      description: 'Access your loan account and payments',
      icon: User,
      color: 'indigo',
      path: '/borrower/login',
      features: [
        'Loan Information',
        'Payment History',
        'Make Payments',
        'Loan Applications'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Loan Management System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your portal to access the loan management system
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {portals.map((portal) => {
            const Icon = portal.icon;
            const colorClasses = {
              blue: {
                card: 'hover:shadow-blue-200/50 border-blue-200',
                iconBg: 'bg-blue-50',
                icon: 'text-blue-600',
                button: 'bg-blue-600 hover:bg-blue-700'
              },
              emerald: {
                card: 'hover:shadow-emerald-200/50 border-emerald-200',
                iconBg: 'bg-emerald-50',
                icon: 'text-emerald-600',
                button: 'bg-emerald-600 hover:bg-emerald-700'
              },
              indigo: {
                card: 'hover:shadow-indigo-200/50 border-indigo-200',
                iconBg: 'bg-indigo-50',
                icon: 'text-indigo-600',
                button: 'bg-indigo-600 hover:bg-indigo-700'
              }
            };

            return (
              <div
                key={portal.id}
                className={`bg-white rounded-2xl shadow-lg border-2 ${colorClasses[portal.color].card} overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                <div className="p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${colorClasses[portal.color].iconBg} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-8 h-8 ${colorClasses[portal.color].icon}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {portal.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {portal.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-8">
                    {portal.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Button */}
                  <Link
                    to={portal.path}
                    className={`w-full ${colorClasses[portal.color].button} text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 group`}
                  >
                    Access Portal
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-6">
              If you're not sure which portal to access or need assistance, please contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/support"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Contact Support
              </Link>
              <Link
                to="/help"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalSelection;
