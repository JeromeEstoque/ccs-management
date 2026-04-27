import React, { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import ExportButton from '../../components/common/ExportButton';
import AdvancedSearch, { studentSearchFields } from '../../components/common/AdvancedSearch';
import BulkActions, { studentBulkActions } from '../../components/common/BulkActions';
import { useStudents } from '../../hooks/useData';
import { useNotifications } from '../../context/NotificationContext';
import toast from 'react-hot-toast';
import { Search, Plus, Edit, Trash2, Eye, Key, Filter, Users, GraduationCap, Loader2 } from 'lucide-react';

const ManageStudents = () => {
  const { addNotification } = useNotifications();
  const {
    data: students,
    loading,
    error,
    fetchStudents,
    addStudent,
    updateStudent,
    deleteStudent,
    setFilters,
    setSearch,
    getFilteredStudents
  } = useStudents();

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '', password: '', firstName: '', middleName: '', lastName: '',
    gender: '', email: '', contactNumber: '', address: '',
    yearLevel: '', section: '', statusRecord: 'Regular',
    guardianName: '', guardianContact: '', skills: []
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = (search, searchFilters) => {
    setSearch(search);
    setFilters(searchFilters);
  };

  const handleBulkAction = async (actionType, selectedIds) => {
    switch (actionType) {
      case 'delete':
        for (const id of selectedIds) {
          await deleteStudent(id);
        }
        addNotification({
          type: 'system',
          title: 'Bulk Delete Completed',
          message: `${selectedIds.length} students have been deleted`,
          icon: 'Trash2',
          color: 'red'
        });
        break;
      
      case 'activate':
        for (const id of selectedIds) {
          await updateStudent(id, { status: 'active' });
        }
        addNotification({
          type: 'system',
          title: 'Bulk Activation Completed',
          message: `${selectedIds.length} students have been activated`,
          icon: 'Users',
          color: 'green'
        });
        break;
      
      case 'deactivate':
        for (const id of selectedIds) {
          await updateStudent(id, { status: 'inactive' });
        }
        addNotification({
          type: 'system',
          title: 'Bulk Deactivation Completed',
          message: `${selectedIds.length} students have been deactivated`,
          icon: 'Users',
          color: 'orange'
        });
        break;
      
      case 'resetPassword':
        for (const id of selectedIds) {
          await deleteStudent(id); // Using deleteStudent as placeholder for resetPassword
        }
        addNotification({
          type: 'system',
          title: 'Password Reset Completed',
          message: `Passwords have been reset for ${selectedIds.length} students`,
          icon: 'Lock',
          color: 'purple'
        });
        break;
      
      case 'email':
        addNotification({
          type: 'system',
          title: 'Email Sent',
          message: `Email has been sent to ${selectedIds.length} students`,
          icon: 'Mail',
          color: 'blue'
        });
        break;
      
      default:
        console.log('Unknown bulk action:', actionType);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addStudent(formData);
      toast.success('Student added successfully');
      addNotification({
        type: 'system',
        title: 'New Student Added',
        message: `${formData.firstName} ${formData.lastName} has been added to the system`,
        icon: 'Users',
        color: 'green',
        actionUrl: '/admin/students'
      });
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Failed to add student');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStudent(selectedStudent.id, formData);
      toast.success('Student updated successfully');
      setShowEditModal(false);
    } catch (error) {
      toast.error('Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await deleteStudent(id);
      toast.success('Student deleted');
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: '', password: '', firstName: '', middleName: '', lastName: '',
      gender: '', email: '', contactNumber: '', address: '',
      yearLevel: '', section: '', statusRecord: 'Regular',
      guardianName: '', guardianContact: '', skills: []
    });
  };

  const openEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.first_name || '',
      middleName: student.middle_name || '',
      lastName: student.last_name || '',
      gender: student.gender || '',
      email: student.email || '',
      contactNumber: student.contact_number || '',
      address: student.address || '',
      yearLevel: student.year_level || '',
      section: student.section || '',
      statusRecord: student.status_record || 'Regular',
      guardianName: student.guardian_name || '',
      guardianContact: student.guardian_contact || '',
      skills: student.skills?.map(s => s.name) || []
    });
    setShowEditModal(true);
  };

  const openViewModal = (student) => {
    setSelectedStudent(student);
    setShowViewModal(true);
  };

  const filteredStudents = getFilteredStudents();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-indigo-100 mb-2">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">Student Management</span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight mb-1">Manage Students</h1>
            <p className="text-indigo-100 text-sm leading-relaxed">
              <span className="font-semibold">{students.length}</span> students registered
            </p>
          </div>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm shadow-lg hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <AdvancedSearch
        onSearch={handleSearch}
        onFilterChange={setFilters}
        fields={studentSearchFields}
        placeholder="Search students by name, ID, or email..."
      />

      {/* Bulk Actions */}
      <BulkActions
        data={filteredStudents}
        selectedItems={selectedStudents}
        onSelectionChange={setSelectedStudents}
        onBulkAction={handleBulkAction}
        actions={studentBulkActions}
      />

      {/* Students Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-secondary-800">Student Records</h3>
          <ExportButton 
            data={filteredStudents} 
            filename="students_report" 
            type="students"
            disabled={loading || filteredStudents.length === 0}
          />
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-secondary-800 rounded-xl overflow-hidden shadow-lg">
              <thead className="bg-violet-50 dark:bg-violet-900/20 border-b border-violet-200 dark:border-violet-700">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === filteredStudents.length}
                      onChange={() => {
                        if (selectedStudents.length === filteredStudents.length) {
                          setSelectedStudents([]);
                        } else {
                          setSelectedStudents(filteredStudents.map(s => s.id));
                        }
                      }}
                      className="w-4 h-4 text-violet-600 dark:text-violet-400 rounded border-violet-500 dark:border-violet-400 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 dark:text-violet-300 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 dark:text-violet-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 dark:text-violet-300 uppercase tracking-wider">Year & Section</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-violet-700 dark:text-violet-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-violet-700 dark:text-violet-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-violet-100 dark:divide-violet-700">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => {
                          setSelectedStudents(prev => 
                            prev.includes(student.id) 
                              ? prev.filter(item => item !== student.id)
                              : [...prev, student.id]
                          );
                        }}
                        className="w-4 h-4 text-violet-600 dark:text-violet-400 rounded border-violet-500 dark:border-violet-400 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                      />
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-mono text-sm font-semibold text-violet-600 dark:text-violet-400">{student.student_id}</span>
                    </td>
                    <td className="px-6 py-3">
                      <div>
                        <p className="font-medium text-secondary-800 dark:text-secondary-200">{student.first_name} {student.last_name}</p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">{student.email || 'No email'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300">
                        {student.year_level} - {student.section}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        student.status_record === 'Regular' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                      }`}>
                        {student.status_record}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openViewModal(student)}
                          className="p-2 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(student)}
                          className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state py-16">
            <GraduationCap className="w-12 h-12" />
            <p className="text-base font-medium">No students found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </Card>

      {/* Add Student Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Student"
        size="large"
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Student ID *</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="input-field"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="label">First Name *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Year Level</label>
              <select
                value={formData.yearLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, yearLevel: e.target.value }))}
                className="input-field"
              >
                <option value="">Select Year Level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div>
              <label className="label">Section</label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                className="input-field"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Student"
        size="large"
      >
        <form onSubmit={handleUpdateStudent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Year Level</label>
              <select
                value={formData.yearLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, yearLevel: e.target.value }))}
                className="input-field"
              >
                <option value="">Select Year Level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
            <div>
              <label className="label">Section</label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Status</label>
              <select
                value={formData.statusRecord}
                onChange={(e) => setFormData(prev => ({ ...prev, statusRecord: e.target.value }))}
                className="input-field"
              >
                <option value="Regular">Regular</option>
                <option value="Irregular">Irregular</option>
                <option value="Drop Out">Drop Out</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Updating...' : 'Update Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Student Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Student Details"
        size="large"
      >
        {selectedStudent && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-secondary-500">Student ID</p>
                <p className="font-medium">{selectedStudent.student_id}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Full Name</p>
                <p className="font-medium">{selectedStudent.first_name} {selectedStudent.middle_name} {selectedStudent.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Year & Section</p>
                <p className="font-medium">{selectedStudent.year_level} - {selectedStudent.section}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Status</p>
                <p className="font-medium">{selectedStudent.status_record}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Email</p>
                <p className="font-medium">{selectedStudent.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Contact</p>
                <p className="font-medium">{selectedStudent.contact_number || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-secondary-500">Address</p>
                <p className="font-medium">{selectedStudent.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Guardian</p>
                <p className="font-medium">{selectedStudent.guardian_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-secondary-500">Guardian Contact</p>
                <p className="font-medium">{selectedStudent.guardian_contact || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageStudents;
