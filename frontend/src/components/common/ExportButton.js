import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, File } from 'lucide-react';
import toast from 'react-hot-toast';

const ExportButton = ({ 
  data, 
  filename, 
  type = 'general', 
  disabled = false,
  className = '',
  showLabel = true 
}) => {
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Dynamic import of export utilities to avoid bundling issues
  const handleExport = async (format) => {
    setLoading(true);
    setShowDropdown(false);
    
    try {
      const exportUtils = await import('../../utils/exportUtils');
      
      switch (type) {
        case 'violations':
          exportUtils.default.exportViolations(data, format);
          break;
        case 'students':
          exportUtils.default.exportStudents(data, format);
          break;
        case 'teachers':
          exportUtils.default.exportTeachers(data, format);
          break;
        case 'logs':
          exportUtils.default.exportSystemLogs(data, format);
          break;
        default:
          // General export
          switch (format) {
            case 'excel':
            case 'xlsx':
              exportUtils.default.exportToExcel(data, filename);
              break;
            case 'pdf':
              exportUtils.default.exportToPDF(data, filename);
              break;
            default:
              exportUtils.default.exportToCSV(data, filename);
          }
      }
      
      toast.success(`Data exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'excel':
      case 'xlsx':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'pdf':
        return <FileText className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getFormatLabel = (format) => {
    switch (format) {
      case 'excel':
      case 'xlsx':
        return 'Excel';
      case 'pdf':
        return 'PDF';
      default:
        return 'CSV';
    }
  };

  const formats = ['csv', 'excel', 'pdf'];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={disabled || loading || !data || data.length === 0}
        className={`btn-secondary flex items-center gap-2 ${className}`}
        title="Export data"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {showLabel && <span>Export</span>}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-secondary-200 overflow-hidden z-10">
          <div className="py-1">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => handleExport(format)}
                disabled={loading}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-secondary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {getFormatIcon(format)}
                <div>
                  <div className="font-medium text-secondary-800 text-sm">
                    Export as {getFormatLabel(format)}
                  </div>
                  <div className="text-xs text-secondary-500">
                    {format === 'csv' && 'Comma-separated values'}
                    {format === 'excel' && 'Microsoft Excel format'}
                    {format === 'pdf' && 'Portable Document Format'}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {data && data.length > 0 && (
            <div className="px-4 py-2 bg-secondary-50 border-t border-secondary-100">
              <p className="text-xs text-secondary-600">
                {data.length} records will be exported
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Quick export buttons for common formats
export const QuickExportButtons = ({ data, filename, type = 'general', className = '' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ExportButton
        data={data}
        filename={filename}
        type={type}
        showLabel={false}
        className="btn-secondary px-3 py-2"
      />
      <div className="flex gap-1">
        <button
          onClick={() => import('../../utils/exportUtils').then(utils => utils.default.exportToCSV(data, filename))}
          disabled={!data || data.length === 0}
          className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors disabled:opacity-50"
          title="Export as CSV"
        >
          <File className="w-4 h-4" />
        </button>
        <button
          onClick={() => import('../../utils/exportUtils').then(utils => utils.default.exportToExcel(data, filename))}
          disabled={!data || data.length === 0}
          className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors disabled:opacity-50"
          title="Export as Excel"
        >
          <FileSpreadsheet className="w-4 h-4" />
        </button>
        <button
          onClick={() => import('../../utils/exportUtils').then(utils => utils.default.exportToPDF(data, filename))}
          disabled={!data || data.length === 0}
          className="p-2 text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors disabled:opacity-50"
          title="Export as PDF"
        >
          <FileText className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ExportButton;
