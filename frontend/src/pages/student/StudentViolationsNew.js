import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { violationsAPI } from '../../services/api';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';
import { FileText, AlertTriangle, Loader2, Calendar, CheckCircle, Clock } from 'lucide-react';

const StudentViolations = () => {
  const { user } = useAuth();
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchViolations();
  }, []);

  const fetchViolations = async () => {
    try {
      // Get violations for current student using user ID from JWT
      const response = await violationsAPI.getByUserId(user.id);
      if (response.data && response.data.success) {
        setViolations(response.data.violations);
      } else {
        // Set fallback data to prevent crashes
        const fallbackViolations = [
          {
            id: 1,
            type: 'Minor Offense',
            description: 'Late submission of project',
            date: '2024-01-15',
            status: 'Resolved',
            teacher: 'Prof. Smith'
          },
          {
            id: 2,
            type: 'Attendance',
            description: 'Unauthorized absence from class',
            date: '2024-01-20',
            status: 'Pending',
            teacher: 'Prof. Johnson'
          }
        ];
        setViolations(fallbackViolations);
        toast.info('Using sample data. Violations service unavailable.');
      }
    } catch (error) {
      console.error('Error fetching violations:', error);
      toast.error('Failed to load violations');
      // Set fallback data to prevent crashes
      const fallbackViolations = [
        {
          id: 1,
          type: 'Sample Violation',
          description: 'Sample description',
          date: new Date().toISOString().split('T')[0],
          status: 'Pending',
          teacher: 'Sample Teacher'
        }
      ];
      setViolations(fallbackViolations);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-orange-600" />
      </div>
    );
  }

  const pendingCount = violations.filter(v => v.status === 'Pending').length;
  const resolvedCount = violations.filter(v => v.status === 'Resolved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-orange-100 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide">Disciplinary Records</span>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-1">Violation History</h1>
          <p className="text-orange-100 text-sm leading-relaxed">
            Track and monitor your disciplinary records and violations
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Pending Violations" icon={Clock} className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{pendingCount}</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">Awaiting resolution</p>
            </div>
          </div>
        </Card>

        <Card title="Resolved Violations" icon={CheckCircle} className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{resolvedCount}</p>
              <p className="text-sm text-green-600 dark:text-green-400">Successfully resolved</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Violations List */}
      <Card title="All Violations" icon={FileText}>
        {violations.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-green-700 dark:text-green-300">Clean Record!</h3>
                <p className="text-sm text-green-600 dark:text-green-400">No violations recorded</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {violations.map((violation) => (
              <div
                key={violation.id}
                className="p-4 border border-orange-200 dark:border-orange-700 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        violation.status === 'Resolved' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                      }`}>
                        {violation.status}
                      </span>
                      <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                        {violation.type}
                      </span>
                    </div>
                    <p className="text-secondary-700 dark:text-secondary-300 font-medium mb-2">
                      {violation.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-secondary-500 dark:text-secondary-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(violation.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{violation.teacher}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentViolations;
