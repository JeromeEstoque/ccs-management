import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend, trendValue, subtitle, linkTo }) => {
  const navigate = useNavigate();
  const getColorClasses = (color) => {
    const colors = {
      primary: {
        bg: 'from-blue-500 to-indigo-600',
        light: 'from-blue-100 to-indigo-100',
        text: 'text-blue-700 dark:text-blue-300'
      },
      secondary: {
        bg: 'from-gray-500 to-slate-600',
        light: 'from-gray-100 to-slate-100',
        text: 'text-gray-700 dark:text-gray-300'
      },
      success: {
        bg: 'from-green-500 to-emerald-600',
        light: 'from-green-100 to-emerald-100',
        text: 'text-green-700 dark:text-green-300'
      },
      warning: {
        bg: 'from-amber-500 to-orange-600',
        light: 'from-amber-100 to-orange-100',
        text: 'text-amber-700 dark:text-amber-300'
      },
      danger: {
        bg: 'from-red-500 to-rose-600',
        light: 'from-red-100 to-rose-100',
        text: 'text-red-700 dark:text-red-300'
      },
      emerald: {
        bg: 'from-emerald-500 to-teal-600',
        light: 'from-emerald-100 to-teal-100',
        text: 'text-emerald-700 dark:text-emerald-300'
      },
      violet: {
        bg: 'from-violet-500 to-purple-600',
        light: 'from-violet-100 to-purple-100',
        text: 'text-violet-700 dark:text-violet-300'
      },
      amber: {
        bg: 'from-amber-500 to-yellow-600',
        light: 'from-amber-100 to-yellow-100',
        text: 'text-amber-700 dark:text-amber-300'
      },
      blue: {
        bg: 'from-blue-500 to-cyan-600',
        light: 'from-blue-100 to-cyan-100',
        text: 'text-blue-700 dark:text-blue-300'
      }
    };
    return colors[color] || colors.primary;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const colorClasses = getColorClasses(color);

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        linkTo ? 'cursor-pointer' : ''
      }`}
      onClick={() => linkTo && navigate(linkTo)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-blue-50/50 to-indigo-50/50 rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-15 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"
        style={{
          background: `linear-gradient(135deg, ${colorClasses.bg.replace('from-', '').replace(' to-', ', ')})`,
          transform: 'translate(30%, -30%)'
        }}
      />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr opacity-10 rounded-full blur-xl group-hover:opacity-15 transition-opacity"
        style={{
          background: `linear-gradient(45deg, ${colorClasses.bg.replace('from-', '').replace(' to-', ', ')})`,
          transform: 'translate(-20%, 20%)'
        }}
      />
      
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses.bg} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-black mb-1">{title}</p>
              {subtitle && (
                <p className="text-xs font-semibold text-black">{subtitle}</p>
              )}
            </div>
          </div>
          
          {trend && (
            <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-full">
              {getTrendIcon()}
              <span className="text-xs font-medium text-black">{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className="text-2xl font-black text-black mb-2">
          {value}
        </div>
        
        {trend && (
          <div className="flex items-center gap-2 text-xs">
            <span className={`font-medium ${
              trend === 'up' ? 'text-green-600' : 
              trend === 'down' ? 'text-red-600' : 'text-black'
            }`}>
              {trendValue}
            </span>
            <span className="text-black">vs last period</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
