import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { TrendingUp, TrendingDown, Users, BookOpen, AlertTriangle, Award } from 'lucide-react';

const AnalyticsChart = ({ 
  type = 'bar', 
  data = [], 
  title, 
  subtitle, 
  height = 300,
  colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  className = ''
}) => {
  const [chartData, setChartData] = useState(data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render chart based on type
  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {data.map((entry, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={entry.dataKey || 'value'}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length], r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {data.map((entry, index) => (
              <Area
                key={index}
                type="monotone"
                dataKey={entry.dataKey || 'value'}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
          </PieChart>
        );

      case 'bar':
      default:
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />}
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend />}
            {data.map((entry, index) => (
              <Bar
                key={index}
                dataKey={entry.dataKey || 'value'}
                fill={colors[index % colors.length]}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        );
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Chart */}
      <div style={{ height }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm">No data available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Pre-configured chart components
export const StudentEnrollmentChart = ({ data }) => (
  <AnalyticsChart
    type="bar"
    title="Student Enrollment by Year Level"
    subtitle="Distribution of students across different year levels"
    data={[
      { name: '1st Year', dataKey: 'count', count: data?.firstYear || 0 },
      { name: '2nd Year', dataKey: 'count', count: data?.secondYear || 0 },
      { name: '3rd Year', dataKey: 'count', count: data?.thirdYear || 0 },
      { name: '4th Year', dataKey: 'count', count: data?.fourthYear || 0 }
    ]}
    colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
    height={250}
  />
);

export const ViolationTrendsChart = ({ data }) => (
  <AnalyticsChart
    type="line"
    title="Violation Trends"
    subtitle="Monthly violation records over time"
    data={data || []}
    colors={['#ef4444', '#f59e0b']}
    height={250}
  />
);

export const GradeDistributionChart = ({ data }) => (
  <AnalyticsChart
    type="pie"
    title="Grade Distribution"
    subtitle="Distribution of student grades"
    data={[
      { name: 'A (4.0)', value: data?.A || 0 },
      { name: 'B+ (3.5)', value: data?.Bplus || 0 },
      { name: 'B (3.0)', value: data?.B || 0 },
      { name: 'C+ (2.5)', value: data?.Cplus || 0 },
      { name: 'C (2.0)', value: data?.C || 0 },
      { name: 'D (1.0)', value: data?.D || 0 }
    ]}
    colors={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']}
    height={250}
  />
);

export const AttendanceRateChart = ({ data }) => (
  <AnalyticsChart
    type="area"
    title="Attendance Rate Trends"
    subtitle="Monthly attendance percentage"
    data={data || []}
    colors={['#10b981']}
    height={250}
  />
);

export const DepartmentStatisticsChart = ({ data }) => (
  <AnalyticsChart
    type="bar"
    title="Department Statistics"
    subtitle="Students and teachers by department"
    data={[
      { name: 'Students', dataKey: 'students', students: data?.students || 0 },
      { name: 'Teachers', dataKey: 'teachers', teachers: data?.teachers || 0 }
    ]}
    colors={['#3b82f6', '#8b5cf6']}
    height={250}
  />
);

// Dashboard analytics overview component
export const DashboardAnalytics = ({ stats }) => {
  const [analyticsData, setAnalyticsData] = useState({
    enrollment: {},
    violations: [],
    grades: {},
    attendance: [],
    departments: {}
  });

  useEffect(() => {
    // Mock data generation - replace with actual API calls
    setAnalyticsData({
      enrollment: {
        firstYear: stats?.firstYearStudents || 120,
        secondYear: stats?.secondYearStudents || 95,
        thirdYear: stats?.thirdYearStudents || 88,
        fourthYear: stats?.fourthYearStudents || 76
      },
      violations: [
        { name: 'Jan', minor: 12, major: 3 },
        { name: 'Feb', minor: 15, major: 5 },
        { name: 'Mar', minor: 8, major: 2 },
        { name: 'Apr', minor: 10, major: 4 },
        { name: 'May', minor: 6, major: 1 },
        { name: 'Jun', minor: 9, major: 3 }
      ],
      grades: {
        A: 45,
        Bplus: 38,
        B: 52,
        Cplus: 28,
        C: 15,
        D: 8
      },
      attendance: [
        { name: 'Jan', rate: 92 },
        { name: 'Feb', rate: 88 },
        { name: 'Mar', rate: 91 },
        { name: 'Apr', rate: 94 },
        { name: 'May', rate: 89 },
        { name: 'Jun', rate: 93 }
      ],
      departments: {
        students: stats?.totalStudents || 379,
        teachers: stats?.totalTeachers || 24
      }
    });
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentEnrollmentChart data={analyticsData.enrollment} />
        <ViolationTrendsChart data={analyticsData.violations} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GradeDistributionChart data={analyticsData.grades} />
        <AttendanceRateChart data={analyticsData.attendance} />
      </div>

      <DepartmentStatisticsChart data={analyticsData.departments} />
    </div>
  );
};

// Quick stats cards with trend indicators
export const AnalyticsStatCard = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon, 
  color = 'blue',
  className = ''
}) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    amber: 'from-amber-500 to-amber-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600'
  };

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center mt-4 text-sm">
          {trend === 'up' ? (
            <TrendingUp className={`w-4 h-4 mr-1 ${trendClasses[trend]}`} />
          ) : trend === 'down' ? (
            <TrendingDown className={`w-4 h-4 mr-1 ${trendClasses[trend]}`} />
          ) : null}
          <span className={trendClasses[trend]}>
            {trendValue} vs last month
          </span>
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;
