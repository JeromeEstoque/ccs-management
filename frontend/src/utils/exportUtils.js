// Utility functions for data export

// Export data to CSV
export const exportToCSV = (data, filename, headers = null) => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create headers if not provided
  if (!headers) {
    headers = Object.keys(data[0]);
  }

  // Convert data to CSV format
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle different data types
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`; // Escape quotes and wrap in quotes
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data to Excel (XLSX) - requires xlsx library
export const exportToExcel = async (data, filename, sheetName = 'Sheet1') => {
  try {
    // Dynamically import xlsx
    const XLSX = await import('xlsx');
    
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Write file
    XLSX.writeFile(wb, `${filename}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    // Fallback to CSV if xlsx library fails
    exportToCSV(data, filename);
  }
};

// Export data to PDF - requires jspdf and autotable libraries
export const exportToPDF = async (data, filename, title = 'Report', headers = null) => {
  try {
    // Dynamically import libraries
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import('jspdf'),
      import('jspdf-autotable')
    ]);
    
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Create PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text(title, 14, 15);
    
    // Prepare table data
    const tableHeaders = headers || Object.keys(data[0]);
    const tableData = data.map(row => 
      tableHeaders.map(header => row[header] || '')
    );
    
    // Add table
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: 25,
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [59, 130, 246], // Blue color
        textColor: 255
      }
    });
    
    // Save PDF
    doc.save(`${filename}.pdf`);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    // Fallback to CSV if PDF libraries fail
    exportToCSV(data, filename);
  }
};

// Export violations data
export const exportViolations = (violations, format = 'csv') => {
  const exportData = violations.map(v => ({
    'Student ID': v.student_id || 'N/A',
    'Student Name': v.first_name && v.last_name ? `${v.first_name} ${v.last_name}` : 'N/A',
    'Violation Type': v.violation_type || 'N/A',
    'Date': v.date || 'N/A',
    'Status': v.status || 'N/A',
    'Remarks': v.remarks || 'N/A',
    'Recorded By': v.recorded_by || 'N/A'
  }));

  switch (format.toLowerCase()) {
    case 'excel':
    case 'xlsx':
      exportToExcel(exportData, 'violations_report', 'Violations');
      break;
    case 'pdf':
      exportToPDF(exportData, 'violations_report', 'Violations Report');
      break;
    default:
      exportToCSV(exportData, 'violations_report');
  }
};

// Export students data
export const exportStudents = (students, format = 'csv') => {
  const exportData = students.map(s => ({
    'Student ID': s.student_id || 'N/A',
    'First Name': s.first_name || 'N/A',
    'Middle Name': s.middle_name || 'N/A',
    'Last Name': s.last_name || 'N/A',
    'Gender': s.gender || 'N/A',
    'Email': s.email || 'N/A',
    'Contact Number': s.contact_number || 'N/A',
    'Address': s.address || 'N/A',
    'Year Level': s.year_level || 'N/A',
    'Section': s.section || 'N/A',
    'Status Record': s.status_record || 'N/A',
    'Guardian Name': s.guardian_name || 'N/A',
    'Guardian Contact': s.guardian_contact || 'N/A',
    'Working Student': s.working_student || 'No',
    'Work Type': s.work_type || 'N/A'
  }));

  switch (format.toLowerCase()) {
    case 'excel':
    case 'xlsx':
      exportToExcel(exportData, 'students_report', 'Students');
      break;
    case 'pdf':
      exportToPDF(exportData, 'students_report', 'Students Report');
      break;
    default:
      exportToCSV(exportData, 'students_report');
  }
};

// Export teachers data
export const exportTeachers = (teachers, format = 'csv') => {
  const exportData = teachers.map(t => ({
    'First Name': t.first_name || 'N/A',
    'Middle Name': t.middle_name || 'N/A',
    'Last Name': t.last_name || 'N/A',
    'Gender': t.gender || 'N/A',
    'Email': t.email || 'N/A',
    'Position': t.position || 'N/A',
    'Section Advisory': t.section_advisory || 'N/A',
    'Courses Handled': t.courses_handled || 'N/A',
    'Years of Service': t.years_of_service || 'N/A',
    'Employment Status': t.employment_status || 'N/A',
    'Degree': t.degree || 'N/A',
    'University': t.university || 'N/A',
    'Year Graduated': t.year_graduated || 'N/A',
    'Expertise': t.expertise ? t.expertise.join(', ') : 'N/A',
    'Capstone Available': t.capstone_adviser_available ? 'Yes' : 'No',
    'Capstone Schedule': t.capstone_schedule || 'N/A'
  }));

  switch (format.toLowerCase()) {
    case 'excel':
    case 'xlsx':
      exportToExcel(exportData, 'teachers_report', 'Teachers');
      break;
    case 'pdf':
      exportToPDF(exportData, 'teachers_report', 'Teachers Report');
      break;
    default:
      exportToCSV(exportData, 'teachers_report');
  }
};

// Export system logs
export const exportSystemLogs = (logs, format = 'csv') => {
  const exportData = logs.map(l => ({
    'Timestamp': l.created_at || 'N/A',
    'User': l.username || 'System',
    'Role': l.role || 'N/A',
    'Action': l.action || 'N/A',
    'Details': l.details ? JSON.stringify(l.details) : 'N/A',
    'IP Address': l.ip_address || 'N/A'
  }));

  switch (format.toLowerCase()) {
    case 'excel':
    case 'xlsx':
      exportToExcel(exportData, 'system_logs_report', 'System Logs');
      break;
    case 'pdf':
      exportToPDF(exportData, 'system_logs_report', 'System Logs Report');
      break;
    default:
      exportToCSV(exportData, 'system_logs_report');
  }
};

// Generate report summary
export const generateReportSummary = (data, type) => {
  const summary = {
    totalRecords: data.length,
    generatedAt: new Date().toLocaleString(),
    reportType: type
  };

  switch (type) {
    case 'violations':
      summary.pending = data.filter(v => v.status === 'Pending').length;
      summary.resolved = data.filter(v => v.status === 'Resolved').length;
      summary.majorOffenses = data.filter(v => v.violation_type?.includes('Major')).length;
      summary.minorOffenses = data.filter(v => v.violation_type?.includes('Minor')).length;
      break;
    case 'students':
      summary.regular = data.filter(s => s.status_record === 'Regular').length;
      summary.irregular = data.filter(s => s.status_record === 'Irregular').length;
      summary.workingStudents = data.filter(s => s.working_student === 'Yes').length;
      summary.byYearLevel = data.reduce((acc, s) => {
        acc[s.year_level] = (acc[s.year_level] || 0) + 1;
        return acc;
      }, {});
      break;
    case 'teachers':
      summary.fullTime = data.filter(t => t.employment_status === 'Full Time').length;
      summary.partTime = data.filter(t => t.employment_status === 'Part Time').length;
      summary.capstoneAdvisers = data.filter(t => t.capstone_adviser_available).length;
      summary.byPosition = data.reduce((acc, t) => {
        acc[t.position] = (acc[t.position] || 0) + 1;
        return acc;
      }, {});
      break;
  }

  return summary;
};

export default {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  exportViolations,
  exportStudents,
  exportTeachers,
  exportSystemLogs,
  generateReportSummary
};
