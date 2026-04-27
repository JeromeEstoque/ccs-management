import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';
import { Search, Activity, User, Clock, Loader2, FileText, Filter } from 'lucide-react';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ action: '', limit: 100 });

  useEffect(() => {
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAuditLogs(filters);
      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to fetch system logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionColor = (action) => {
    if (action.includes('CREATE')) return 'badge-success';
    if (action.includes('UPDATE')) return 'badge-info';
    if (action.includes('DELETE')) return 'badge-danger';
    if (action.includes('LOGIN') || action.includes('LOGOUT')) return 'badge-warning';
    return 'badge-secondary';
  };

  if (loading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-orange-200 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">System Monitoring</span>
          </div>
          <h1 className="text-2xl font-bold">System Logs</h1>
          <p className="text-orange-100 text-sm mt-1">{logs.length} audit entries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-xl p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="label">Filter by Action</label>
            <div>
              <input
                type="text"
                value={filters.action}
                onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                placeholder="Search actions..."
                className="input-search"
              />
            </div>
          </div>
          <div>
            <label className="label">Show Entries</label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters(prev => ({ ...prev, limit: parseInt(e.target.value) }))}
              className="input-field w-auto"
            >
              <option value={50}>Last 50 entries</option>
              <option value={100}>Last 100 entries</option>
              <option value={200}>Last 200 entries</option>
              <option value={500}>Last 500 entries</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <Card title="Audit Trail" icon={FileText}>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div className="flex items-center gap-2 text-secondary-600">
                        <Clock className="w-4 h-4 text-secondary-400" />
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-secondary-500" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-800">{log.username || 'System'}</p>
                          <p className="text-xs text-secondary-500">{log.role || ''}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="text-secondary-600 text-sm max-w-xs truncate">
                      {log.details ? JSON.stringify(log.details).substring(0, 50) + '...' : '-'}
                    </td>
                    <td className="text-secondary-500 text-sm">
                      {log.ip_address || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state py-16">
            <Activity className="w-12 h-12" />
            <p className="text-base font-medium">No logs found</p>
            <p className="text-sm">System activity will appear here</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SystemLogs;
