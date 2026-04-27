import React, { useEffect, useState } from 'react';
import { teachersAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { Search, Plus, Edit, Trash2, Eye, Key, ToggleLeft, ToggleRight, Users, Loader2, User, Briefcase } from 'lucide-react';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ position: '', employmentStatus: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '', password: '', firstName: '', middleName: '', lastName: '',
    gender: '', position: 'Instructor', employmentStatus: 'Full Time',
    sectionAdvisory: '', coursesHandled: '', degree: '', university: '',
    yearsOfService: 0, expertise: []
  });

  useEffect(() => {
    fetchTeachers();
  }, [filters]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await teachersAPI.getAll({ ...filters, search: searchTerm });
      if (response.data.success) {
        setTeachers(response.data.teachers);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTeachers();
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await teachersAPI.create(formData);
      toast.success('Teacher added successfully');
      setShowAddModal(false);
      resetForm();
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add teacher');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await teachersAPI.update(selectedTeacher.id, formData);
      toast.success('Teacher updated successfully');
      setShowEditModal(false);
      fetchTeachers();
    } catch (error) {
      toast.error('Failed to update teacher');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    try {
      await teachersAPI.delete(id);
      toast.success('Teacher deleted');
      fetchTeachers();
    } catch (error) {
      toast.error('Failed to delete teacher');
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt('Enter new password (min 6 characters):');
    if (!newPassword || newPassword.length < 6) return;
    try {
      await teachersAPI.resetPassword(id, newPassword);
      toast.success('Password reset successfully');
    } catch (error) {
      toast.error('Failed to reset password');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '', password: '', firstName: '', middleName: '', lastName: '',
      gender: '', position: 'Instructor', employmentStatus: 'Full Time',
      sectionAdvisory: '', coursesHandled: '', degree: '', university: '',
      yearsOfService: 0, expertise: []
    });
  };

  const openEditModal = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      firstName: teacher.first_name || '',
      middleName: teacher.middle_name || '',
      lastName: teacher.last_name || '',
      gender: teacher.gender || '',
      email: teacher.email || '',
      position: teacher.position || 'Instructor',
      employmentStatus: teacher.employment_status || 'Full Time',
      sectionAdvisory: teacher.section_advisory || '',
      coursesHandled: teacher.courses_handled || '',
      degree: teacher.degree || '',
      university: teacher.university || '',
      yearsOfService: teacher.years_of_service || 0,
      expertise: teacher.expertise || []
    });
    setShowEditModal(true);
  };

  const openViewModal = (teacher) => {
    setSelectedTeacher(teacher);
    setShowViewModal(true);
  };

  const expertiseOptions = ['Web Development', 'Mobile Development', 'Data Science', 'Networking', 'AI / Machine Learning', 'Cybersecurity'];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-orange-200 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Faculty Management</span>
            </div>
            <h1 className="text-2xl font-bold">Manage Teachers</h1>
            <p className="text-orange-100 text-sm mt-1">{teachers.length} teachers registered</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowAddModal(true); }}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm"
          >
            <Plus className="w-4 h-4" />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-xl p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] relative">
            <label className="label">Search Teachers</label>
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="input-search"
              />
            </div>
          </div>
          <div>
            <label className="label">Position</label>
            <select
              value={filters.position}
              onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
              className="input-field w-auto"
            >
              <option value="">All Positions</option>
              <option value="Instructor">Instructor</option>
              <option value="Adviser">Adviser</option>
              <option value="Chairman">Chairman</option>
              <option value="Dean">Dean</option>
            </select>
          </div>
          <div>
            <label className="label">Employment</label>
            <select
              value={filters.employmentStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, employmentStatus: e.target.value }))}
              className="input-field w-auto"
            >
              <option value="">All Status</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {/* Teachers Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : teachers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Position</th>
                  <th>Employment</th>
                  <th>Capstone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-800">{teacher.first_name} {teacher.last_name}</p>
                          <p className="text-xs text-secondary-500">{teacher.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary-600">{teacher.email}</td>
                    <td>
                      <span className="badge badge-primary">{teacher.position}</span>
                    </td>
                    <td>
                      <span className={`badge ${
                        teacher.employment_status === 'Full Time' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {teacher.employment_status}
                      </span>
                    </td>
                    <td>
                      {teacher.capstone_adviser_available ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600 font-medium text-sm">
                          <ToggleRight className="w-4 h-4" /> Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-secondary-400 text-sm">
                          <ToggleLeft className="w-4 h-4" /> Unavailable
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openViewModal(teacher)}
                          className="p-2 text-secondary-500 hover:text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(teacher)}
                          className="p-2 text-blue-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(teacher.id)}
                          className="p-2 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Reset Password"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="p-2 text-red-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors"
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
            <Users className="w-12 h-12" />
            <p className="text-base font-medium">No teachers found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </Card>

      {/* Add Teacher Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Teacher"
        size="large"
      >
        <form onSubmit={handleAddTeacher} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="input-search"
                required
              />
            </div>
            <div>
              <label className="label">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="input-search"
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
                className="input-search"
                required
              />
            </div>
            <div>
              <label className="label">Last Name *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="input-search"
                required
              />
            </div>
            <div>
              <label className="label">Position</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="input-search"
              >
                <option value="Instructor">Instructor</option>
                <option value="Adviser">Adviser</option>
                <option value="Chairman">Chairman</option>
                <option value="Dean">Dean</option>
              </select>
            </div>
            <div>
              <label className="label">Employment Status</label>
              <select
                value={formData.employmentStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, employmentStatus: e.target.value }))}
                className="input-search"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Adding...' : 'Add Teacher'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Teacher Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Teacher"
        size="large"
      >
        <form onSubmit={handleUpdateTeacher} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">First Name</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="input-search"
              />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="input-search"
              />
            </div>
            <div>
              <label className="label">Position</label>
              <select
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="input-search"
              >
                <option value="Instructor">Instructor</option>
                <option value="Adviser">Adviser</option>
                <option value="Chairman">Chairman</option>
                <option value="Dean">Dean</option>
              </select>
            </div>
            <div>
              <label className="label">Employment Status</label>
              <select
                value={formData.employmentStatus}
                onChange={(e) => setFormData(prev => ({ ...prev, employmentStatus: e.target.value }))}
                className="input-search"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
              </select>
            </div>
            <div>
              <label className="label">Section Advisory</label>
              <input
                type="text"
                value={formData.sectionAdvisory}
                onChange={(e) => setFormData(prev => ({ ...prev, sectionAdvisory: e.target.value }))}
                className="input-search"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Updating...' : 'Update Teacher'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Teacher Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Teacher Details"
        size="large"
      >
        {selectedTeacher && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-secondary-200">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-800">
                  {selectedTeacher.first_name} {selectedTeacher.middle_name} {selectedTeacher.last_name}
                </h3>
                <p className="text-secondary-500">{selectedTeacher.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-xs text-secondary-500 uppercase tracking-wide">Position</p>
                <p className="font-medium text-secondary-800">{selectedTeacher.position}</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-xs text-secondary-500 uppercase tracking-wide">Employment</p>
                <p className="font-medium text-secondary-800">{selectedTeacher.employment_status}</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-xs text-secondary-500 uppercase tracking-wide">Section Advisory</p>
                <p className="font-medium text-secondary-800">{selectedTeacher.section_advisory || 'N/A'}</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-xs text-secondary-500 uppercase tracking-wide">Years of Service</p>
                <p className="font-medium text-secondary-800">{selectedTeacher.years_of_service || 0}</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-xs text-secondary-500 uppercase tracking-wide">Degree</p>
                <p className="font-medium text-secondary-800">{selectedTeacher.degree || 'N/A'}</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg">
                <p className="text-xs text-secondary-500 uppercase tracking-wide">University</p>
                <p className="font-medium text-secondary-800">{selectedTeacher.university || 'N/A'}</p>
              </div>
              <div className="p-3 bg-secondary-50 rounded-lg col-span-2">
                <p className="text-xs text-secondary-500 uppercase tracking-wide">Capstone Adviser</p>
                <p className="font-medium text-secondary-800">
                  {selectedTeacher.capstone_adviser_available ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <ToggleRight className="w-4 h-4" /> Available
                    </span>
                  ) : (
                    <span className="text-secondary-500 flex items-center gap-1">
                      <ToggleLeft className="w-4 h-4" /> Unavailable
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageTeachers;
