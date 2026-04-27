import React, { useState, useEffect } from 'react';
import { 
  Server, Database, Wifi, WifiOff, AlertTriangle, 
  CheckCircle, XCircle, Clock, Cpu, HardDrive,
  MemoryStick, Activity, RefreshCw, TrendingUp,
  TrendingDown, Info, Settings
} from 'lucide-react';

const SystemHealthMonitor = ({ refreshInterval = 30000 }) => {
  const [healthData, setHealthData] = useState({
    overall: 'healthy',
    services: {},
    metrics: {},
    lastUpdated: null
  });
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch health data
  const fetchHealthData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from actual health endpoints
      const mockHealthData = {
        overall: 'healthy',
        services: {
          api: {
            status: 'healthy',
            responseTime: 145,
            uptime: '15d 8h 32m',
            lastCheck: new Date().toISOString()
          },
          database: {
            status: 'healthy',
            connections: 12,
            maxConnections: 100,
            responseTime: 23,
            uptime: '15d 8h 32m'
          },
          authentication: {
            status: 'healthy',
            activeSessions: 45,
            maxSessions: 200,
            responseTime: 89
          },
          fileStorage: {
            status: 'warning',
            usedSpace: 75,
            totalSpace: 100,
            responseTime: 234
          },
          emailService: {
            status: 'healthy',
            lastEmailSent: new Date().toISOString(),
            responseTime: 567
          },
          backupService: {
            status: 'healthy',
            lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          }
        },
        metrics: {
          cpu: {
            current: 45,
            average: 38,
            max: 78,
            trend: 'stable'
          },
          memory: {
            used: 62,
            total: 100,
            available: 38,
            trend: 'increasing'
          },
          disk: {
            used: 75,
            total: 100,
            available: 25,
            trend: 'stable'
          },
          network: {
            inbound: 1024,
            outbound: 2048,
            errors: 2,
            trend: 'stable'
          },
          requests: {
            total: 15420,
            successful: 15380,
            errors: 40,
            averageResponseTime: 145,
            trend: 'decreasing'
          }
        },
        lastUpdated: new Date().toISOString()
      };

      setHealthData(mockHealthData);
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      setHealthData(prev => ({
        ...prev,
        overall: 'error',
        lastUpdated: new Date().toISOString()
      }));
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchHealthData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  // Initial fetch
  useEffect(() => {
    fetchHealthData();
  }, []);

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-amber-600 bg-amber-100';
      case 'error':
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'error':
      case 'unhealthy':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  // Get trend icon
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      case 'stable':
        return <Activity className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  // Service status card
  const ServiceStatusCard = ({ name, service, icon: Icon }) => {
    const statusColor = getStatusColor(service.status);
    const statusIcon = getStatusIcon(service.status);

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">{name}</h3>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {statusIcon}
            <span className="capitalize">{service.status}</span>
          </div>
        </div>

        <div className="space-y-2">
          {service.responseTime && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Response Time</span>
              <span className="font-medium">{service.responseTime}ms</span>
            </div>
          )}
          
          {service.uptime && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uptime</span>
              <span className="font-medium">{service.uptime}</span>
            </div>
          )}
          
          {service.connections && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Connections</span>
              <span className="font-medium">{service.connections}/{service.maxConnections}</span>
            </div>
          )}
          
          {service.activeSessions && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Sessions</span>
              <span className="font-medium">{service.activeSessions}/{service.maxSessions}</span>
            </div>
          )}
          
          {service.usedSpace !== undefined && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Storage</span>
              <span className="font-medium">{service.usedSpace}% used</span>
            </div>
          )}
          
          {service.lastBackup && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Backup</span>
              <span className="font-medium">
                {new Date(service.lastBackup).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Metric card
  const MetricCard = ({ name, metric, icon: Icon, unit = '%' }) => {
    const trendIcon = getTrendIcon(metric.trend);
    const getColor = (value, thresholds) => {
      if (value >= thresholds.critical) return 'text-red-600';
      if (value >= thresholds.warning) return 'text-amber-600';
      return 'text-green-600';
    };

    const thresholds = {
      cpu: { warning: 70, critical: 90 },
      memory: { warning: 80, critical: 95 },
      disk: { warning: 80, critical: 95 }
    };

    const color = getColor(metric.current, thresholds[name.toLowerCase()] || { warning: 70, critical: 90 });

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-gray-600" />
            <h3 className="font-medium text-gray-900 capitalize">{name}</h3>
          </div>
          {trendIcon}
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${color}`}>
              {metric.current}
            </span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>

          {metric.average && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average</span>
              <span className="font-medium">{metric.average}{unit}</span>
            </div>
          )}

          {metric.max && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Peak</span>
              <span className="font-medium">{metric.max}{unit}</span>
            </div>
          )}

          {(metric.used !== undefined && metric.total) && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Available</span>
              <span className="font-medium">{metric.available}{unit}</span>
            </div>
          )}

          {/* Progress bar for percentage metrics */}
          {(metric.used !== undefined || metric.current !== undefined) && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metric.current >= 90 ? 'bg-red-500' :
                    metric.current >= 70 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${metric.used || metric.current}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const overallStatusColor = getStatusColor(healthData.overall);
  const overallStatusIcon = getStatusIcon(healthData.overall);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Health Monitor</h2>
          <p className="text-gray-600 mt-1">
            Real-time system status and performance metrics
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              autoRefresh 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-gray-50 border-gray-200 text-gray-700'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">
              {autoRefresh ? 'Auto-refresh' : 'Manual'}
            </span>
          </button>
          
          <button
            onClick={fetchHealthData}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* Overall Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${overallStatusColor}`}>
              {overallStatusIcon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Overall System Status
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {healthData.overall} • Last updated: {healthData.lastUpdated ? 
                  new Date(healthData.lastUpdated).toLocaleString() : 'Never'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Auto-refresh every {refreshInterval / 1000}s</span>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ServiceStatusCard 
            name="API Server" 
            service={healthData.services.api} 
            icon={Server} 
          />
          <ServiceStatusCard 
            name="Database" 
            service={healthData.services.database} 
            icon={Database} 
          />
          <ServiceStatusCard 
            name="Authentication" 
            service={healthData.services.authentication} 
            icon={Settings} 
          />
          <ServiceStatusCard 
            name="File Storage" 
            service={healthData.services.fileStorage} 
            icon={HardDrive} 
          />
          <ServiceStatusCard 
            name="Email Service" 
            service={healthData.services.emailService} 
            icon={Wifi} 
          />
          <ServiceStatusCard 
            name="Backup Service" 
            service={healthData.services.backupService} 
            icon={Database} 
          />
        </div>
      </div>

      {/* System Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard 
            name="CPU" 
            metric={healthData.metrics.cpu} 
            icon={Cpu} 
          />
          <MetricCard 
            name="Memory" 
            metric={healthData.metrics.memory} 
            icon={MemoryStick} 
          />
          <MetricCard 
            name="Disk" 
            metric={healthData.metrics.disk} 
            icon={HardDrive} 
          />
          <MetricCard 
            name="Network" 
            metric={healthData.metrics.network} 
            icon={Wifi} 
            unit="MB/s"
          />
        </div>
      </div>

      {/* Request Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Metrics</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {healthData.metrics.requests.total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {healthData.metrics.requests.successful.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {healthData.metrics.requests.errors}
              </div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {healthData.metrics.requests.averageResponseTime}ms
              </div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">System Health Summary</h4>
            <p className="text-sm text-blue-800 mt-1">
              All critical services are operational. File storage is at 75% capacity - consider cleanup soon.
              System performance is stable with average response times under 150ms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthMonitor;
