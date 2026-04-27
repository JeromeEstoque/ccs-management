import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, size = 'large', icon: Icon }) => {
  if (!isOpen) return null;

  const sizes = {
    small: 'max-w-md',
    default: 'max-w-lg',
    large: 'max-w-2xl',
    xlarge: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-black/80 to-orange-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-2xl border border-orange-500/30 ${sizes[size]} w-full max-h-[90vh] overflow-hidden animate-fade-in`}>
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-700 border-b border-orange-500/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <Icon className="w-5 h-5 text-white" />
              </div>
            )}
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-800 rounded-xl transition-colors group"
          >
            <X className="w-5 h-5 text-orange-200 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] text-gray-100 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
