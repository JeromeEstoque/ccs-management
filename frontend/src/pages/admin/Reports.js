import React, { useState, useEffect } from 'react';
import { useStudents, useTeachers, useViolations } from '../../hooks/useData';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Users, GraduationCap, AlertTriangle, TrendingUp, Calendar,
  Filter, Download, RefreshCw, FileText, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const Reports = () => {
  const { data: students, loading: studentsLoading, fetchStudents } = useStudents();
  const { data: teachers, loading: teachersLoading, fetchTeachers } = useTeachers();
  const { data: violations, loading: violationsLoading, fetchViolations } = useViolations();
  
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setRefreshing(true);
      setError(null);
      try {
        console.log('Starting to fetch data...');
        const results = await Promise.allSettled([
          fetchStudents({ forceRefresh: true }),
          fetchTeachers({ forceRefresh: true }),
          fetchViolations({ forceRefresh: true })
        ]);
        
        results.forEach((result, index) => {
          if (result.status === 'rejected') {
            console.error(`Failed to fetch data ${index}:`, result.reason);
            setError(result.reason.message);
          }
        });
        
        console.log('Data fetched:', { students, teachers, violations });
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error.message);
      } finally {
        setRefreshing(false);
      }
    };
    loadData();
  }, []); // Remove dependencies to prevent infinite loops

  // Mock data for testing
  const mockStudents = [
    { year_level: '1st Year', gender: 'Male', status_record: 'Regular' },
    { year_level: '2nd Year', gender: 'Female', status_record: 'Regular' },
    { year_level: '3rd Year', gender: 'Male', status_record: 'Irregular' },
    { year_level: '4th Year', gender: 'Female', status_record: 'Regular' },
    { year_level: '1st Year', gender: 'Male', status_record: 'Regular' },
  ];

  const mockTeachers = [
    { position: 'Instructor' },
    { position: 'Assistant Professor' },
    { position: 'Associate Professor' },
    { position: 'Instructor' },
    { position: 'Assistant Professor' },
  ];

  const mockViolations = [
    { violation_type: 'Attendance', date: '2024-01-15', status: 'pending' },
    { violation_type: 'Academic', date: '2024-02-20', status: 'resolved' },
    { violation_type: 'Behavior', date: '2024-03-10', status: 'pending' },
    { violation_type: 'Attendance', date: '2024-04-05', status: 'resolved' },
    { violation_type: 'Academic', date: '2024-05-12', status: 'ongoing' },
  ];

  // Use real data if available, otherwise use mock data
  const studentsData = students.length > 0 ? students : mockStudents;
  const teachersData = teachers.length > 0 ? teachers : mockTeachers;
  const violationsData = violations.length > 0 ? violations : mockViolations;

  // Process data for charts
  const getStudentYearLevelData = () => {
    const yearLevels = {};
    studentsData.forEach(student => {
      const year = student.year_level || 'Unknown';
      yearLevels[year] = (yearLevels[year] || 0) + 1;
    });
    return Object.entries(yearLevels).map(([year, count]) => ({
      year,
      count
    }));
  };

  const getViolationTypeData = () => {
    const violationTypes = {};
    violationsData.forEach(violation => {
      const type = violation.violation_type || 'Unknown';
      violationTypes[type] = (violationTypes[type] || 0) + 1;
    });
    return Object.entries(violationTypes).map(([type, count]) => ({
      name: type,
      value: count
    }));
  };

  const getTeacherPositionData = () => {
    const positions = {};
    teachersData.forEach(teacher => {
      const position = teacher.position || 'Unknown';
      positions[position] = (positions[position] || 0) + 1;
    });
    return Object.entries(positions).map(([position, count]) => ({
      position,
      count
    }));
  };

  const getMonthlyViolationData = () => {
    const monthlyData = {};
    const currentYear = new Date().getFullYear();
    
    violationsData.forEach(violation => {
      const date = new Date(violation.date || violation.created_at);
      if (date.getFullYear() === currentYear) {
        const month = date.toLocaleString('default', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + 1;
      }
    });
    
    return Object.entries(monthlyData).map(([month, count]) => ({
      month,
      violations: count
    }));
  };

  const getStudentStatusData = () => {
    const statuses = {};
    studentsData.forEach(student => {
      const status = student.status_record || 'Unknown';
      statuses[status] = (statuses[status] || 0) + 1;
    });
    return Object.entries(statuses).map(([status, count]) => ({
      status,
      count
    }));
  };

  const getGenderDistribution = () => {
    const genders = {};
    studentsData.forEach(student => {
      const gender = student.gender || 'Unknown';
      genders[gender] = (genders[gender] || 0) + 1;
    });
    return Object.entries(genders).map(([gender, count]) => ({
      name: gender,
      value: count
    }));
  };

  const studentYearData = getStudentYearLevelData();
  const violationTypeData = getViolationTypeData();
  const teacherPositionData = getTeacherPositionData();
  const monthlyViolationData = getMonthlyViolationData();
  const studentStatusData = getStudentStatusData();
  const genderData = getGenderDistribution();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        fetchStudents({ forceRefresh: true }),
        fetchTeachers({ forceRefresh: true }),
        fetchViolations({ forceRefresh: true })
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (studentsLoading || teachersLoading || violationsLoading || refreshing) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports data...</p>
        {error && <p className="mt-2 text-red-500 text-sm">Error: {error}</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
          <p className="text-lg font-semibold">Error loading reports</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights and statistics for CCS Management System
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Students</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{studentsData.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Teachers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{teachersData.length}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Violations</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{violationsData.length}</p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {violationsData.filter(v => v.status === 'pending' || v.status === 'ongoing').length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Year Level */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Students by Year Level</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentYearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Number of Students" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Violations by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Violations by Type</h2>
            <PieChartIcon className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={violationTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {violationTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Teachers by Position */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Teachers by Position</h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teacherPositionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="position" type="category" width={100} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10b981" name="Number of Teachers" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Violations Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Violations Trend</h2>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyViolationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="violations" 
                stroke="#ef4444" 
                strokeWidth={2}
                name="Number of Violations"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Student Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Student Status Distribution</h2>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={studentStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6" 
                fill="#8b5cf6" 
                fillOpacity={0.6}
                name="Number of Students"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Gender Distribution</h2>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
