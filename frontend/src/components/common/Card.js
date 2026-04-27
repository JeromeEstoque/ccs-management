import React from 'react';

const Card = ({ children, className, title, action, subtitle, icon: Icon, hover = true }) => {
  return (
    <div className={`group relative bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 ${
      hover ? 'hover:-translate-y-1' : ''
    } ${className || ''}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 via-blue-50/50 to-indigo-50/50 rounded-2xl"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity"
        style={{
          transform: 'translate(30%, -30%)'
        }}
      />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-400/10 to-blue-400/10 rounded-full blur-xl group-hover:opacity-20 transition-opacity"
        style={{
          transform: 'translate(-20%, 20%)'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        {(title || Icon || action) && (
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              )}
              <div>
                {title && (
                  <h3 className="text-lg font-bold text-black mb-1">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm font-semibold text-black">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            
            {action && (
              <div className="transform transition-transform duration-200 group-hover:scale-105">
                {action}
              </div>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className={`${title || Icon || action ? 'px-6 pb-6' : 'p-6'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
