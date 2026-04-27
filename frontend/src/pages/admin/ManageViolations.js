import React, { useEffect, useState } from 'react';
import { violationsAPI, studentsAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { Search, CheckCircle, Eye, Filter, AlertTriangle, Loader2, User, Calendar, Clock, Plus, X, Trash2 } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const ManageViolations = () => {
  const violationTypes = [
    'Minor Offense - Tardiness',
    'Minor Offense - Improper Uniform',
    'Minor Offense - Cutting Classes',
    'Major Offense - Disrespectful Behavior',
    'Major Offense - Academic Dishonesty',
    'Major Offense - Vandalism',
    'Major Offense - Fighting',
    'Major Offense - Theft',
    'Other'
  ];
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '' });
  const [showViewModal, setShowViewModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [resolveRemarks, setResolveRemarks] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchingStudents, setSearchingStudents] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addFormData, setAddFormData] = useState({
    violationType: '',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchViolations();
  }, [filters]);

  const fetchViolations = async () => {
    setLoading(true);
    try {
      const response = await violationsAPI.getAll({ ...filters, search: searchTerm });
      if (response.data.success) {
        setViolations(response.data.violations);
      }
    } catch (error) {
      console.error('Error fetching violations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchViolations();
  };

  const handleResolve = async () => {
    if (!selectedViolation) return;
    setSaving(true);
    try {
      await violationsAPI.resolve(selectedViolation.id, resolveRemarks);
      toast.success('Violation resolved');
      setShowResolveModal(false);
      setResolveRemarks('');
      fetchViolations();
    } catch (error) {
      toast.error('Failed to resolve violation');
    } finally {
      setSaving(false);
    }
  };

  const openViewModal = (violation) => {
    setSelectedViolation(violation);
    setShowViewModal(true);
  };

  const openResolveModal = (violation) => {
    setSelectedViolation(violation);
    setResolveRemarks('');
    setShowResolveModal(true);
  };

  const searchStudents = async () => {
    if (!studentSearchTerm) return;
    
    setSearchingStudents(true);
    try {
      const response = await studentsAPI.getAll({ search: studentSearchTerm });
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error('Error searching students:', error);
      toast.error('Failed to search students');
    } finally {
      setSearchingStudents(false);
    }
  };

  const handleAddViolation = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }
    if (!addFormData.violationType || !addFormData.date) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await violationsAPI.create({
        studentId: selectedStudent.id,
        violationType: addFormData.violationType,
        remarks: addFormData.remarks,
        date: addFormData.date
      });
      toast.success('Violation recorded successfully');
      setShowAddModal(false);
      setSelectedStudent(null);
      setAddFormData({
        violationType: '',
        remarks: '',
        date: new Date().toISOString().split('T')[0]
      });
      setStudentSearchTerm('');
      setStudents([]);
      fetchViolations();
    } catch (error) {
      toast.error('Failed to record violation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedViolation) return;
    setDeleting(true);
    try {
      await violationsAPI.delete(selectedViolation.id);
      toast.success('Violation deleted successfully');
      setShowDeleteModal(false);
      setSelectedViolation(null);
      fetchViolations();
    } catch (error) {
      toast.error('Failed to delete violation');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (violation) => {
    setSelectedViolation(violation);
    setShowDeleteModal(true);
  };

  const openAddModal = () => {
    setShowAddModal(true);
    setSelectedStudent(null);
    setAddFormData({
      violationType: '',
      remarks: '',
      date: new Date().toISOString().split('T')[0]
    });
    setStudentSearchTerm('');
    setStudents([]);
  };

  const pendingCount = violations.filter(v => v.status === 'Pending').length;
  const resolvedCount = violations.filter(v => v.status === 'Resolved').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-orange-200 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Disciplinary Records</span>
              </div>
              <h1 className="text-2xl font-bold">Manage Violations</h1>
              <div className="flex gap-6 mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-300 rounded-full"></div>
                  <span className="text-orange-100 text-sm">{pendingCount} Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-300 rounded-full"></div>
                  <span className="text-orange-100 text-sm">{resolvedCount} Resolved</span>
                </div>
              </div>
            </div>
            <button
              onClick={openAddModal}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Violation
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel rounded-xl p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px] relative">
            <label className="label">Search Violations</label>
            <div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name or ID..."
                className="input-search"
              />
            </div>
          </div>
          <div>
            <label className="label">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="input-field w-auto"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Search</button>
        </form>
      </div>

      {/* Violations Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : violations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Violation</th>
                  <th>Date</th>
                  <th>Encoded By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {violations.map((violation) => (
                  <tr key={violation.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-800">{violation.student_first_name} {violation.student_last_name}</p>
                          <p className="text-xs text-secondary-500">{violation.student_id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex items-center gap-1.5 ${
                        violation.violation_type.includes('Major') ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                        {violation.violation_type}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-secondary-600">
                        <Calendar className="w-4 h-4 text-secondary-400" />
                        {violation.date}
                      </div>
                    </td>
                    <td className="text-secondary-600">{violation.encoded_by_name || 'Admin'}</td>
                    <td>
                      <span className={`badge ${
                        violation.status === 'Pending' ? 'badge-warning' : 'badge-success'
                      }`}>
                        {violation.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openViewModal(violation)}
                          className="p-2 text-secondary-500 hover:text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {violation.status === 'Pending' && (
                          <button
                            onClick={() => openResolveModal(violation)}
                            className="p-2 text-green-500 hover:text-green-700 hover:bg-orange-50 rounded-lg transition-colors"
                            title="Resolve"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => openDeleteModal(violation)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
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
            <AlertTriangle className="w-12 h-12" />
            <p className="text-base font-medium">No violations found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </Card>

      {/* View Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Violation Details"
        icon={Eye}
      >
        {selectedViolation && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-orange-500/30">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {selectedViolation.student_first_name} {selectedViolation.student_last_name}
                </h3>
                <p className="text-sm text-gray-400">{selectedViolation.student_id}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-800/50 border border-orange-500/30 rounded-lg">
                <p className="text-xs text-orange-400 uppercase tracking-wide">Violation Type</p>
                <p className="font-medium text-white">{selectedViolation.violation_type}</p>
              </div>
              <div className="p-3 bg-gray-800/50 border border-orange-500/30 rounded-lg">
                <p className="text-xs text-orange-400 uppercase tracking-wide">Date</p>
                <p className="font-medium text-white">{formatDate(selectedViolation.date)}</p>
              </div>
              <div className="p-3 bg-gray-800/50 border border-orange-500/30 rounded-lg">
                <p className="text-xs text-orange-400 uppercase tracking-wide">Status</p>
                <p className="font-medium">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedViolation.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                  }`}>
                    {selectedViolation.status}
                  </span>
                </p>
              </div>
              <div className="p-3 bg-gray-800/50 border border-orange-500/30 rounded-lg">
                <p className="text-xs text-orange-400 uppercase tracking-wide">Encoded By</p>
                <p className="font-medium text-white">{selectedViolation.encoded_by_name || 'Admin'}</p>
              </div>
              <div className="p-3 bg-gray-800/50 border border-orange-500/30 rounded-lg col-span-2">
                <p className="text-xs text-orange-400 uppercase tracking-wide">Remarks</p>
                <p className="font-medium text-white">{selectedViolation.remarks || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Resolve Modal */}
      <Modal
        isOpen={showResolveModal}
        onClose={() => setShowResolveModal(false)}
        title="Resolve Violation"
        icon={CheckCircle}
      >
        <div className="space-y-4">
          <div className="p-4 bg-orange-900/30 border border-orange-500/50 rounded-xl">
            <p className="text-orange-200 font-medium">Mark this violation as resolved?</p>
            <p className="text-orange-300 text-sm mt-1">This action will update the violation status.</p>
          </div>
          <div>
            <label className="label">Resolution Remarks</label>
            <textarea
              value={resolveRemarks}
              onChange={(e) => setResolveRemarks(e.target.value)}
              rows={3}
              className="bg-gray-800 border border-orange-500/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
              placeholder="Add remarks about the resolution..."
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowResolveModal(false)} className="bg-gray-700 hover:bg-gray-600 text-white flex-1 px-4 py-3 rounded-xl transition-colors">
              Cancel
            </button>
            <button onClick={handleResolve} disabled={saving} className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Resolving...' : 'Resolve'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Add Violation Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Violation"
        icon={AlertTriangle}
        size="large"
      >
        <div className="space-y-8">
          {/* Student Search Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-orange-500/20">
              <User className="w-5 h-5 text-orange-400" />
              <h4 className="text-lg font-semibold text-white">Student Information</h4>
            </div>
            
            <div>
              <label className="label">Search Student *</label>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                    <input
                      type="text"
                      value={studentSearchTerm}
                      onChange={(e) => setStudentSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchStudents()}
                      placeholder="Search by name or student ID..."
                      className="input-field pl-10 pr-4 py-3 rounded-xl"
                    />
                  </div>
                  <button
                    onClick={searchStudents}
                    disabled={searchingStudents}
                    className="btn-primary px-6 py-3 rounded-xl flex items-center gap-2"
                  >
                    {searchingStudents ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                  </button>
                </div>

                {/* Search Results */}
                {students.length > 0 && (
                  <div className="border border-orange-500/20 rounded-xl divide-y divide-orange-500/10 max-h-48 overflow-y-auto custom-scrollbar bg-gray-800/30">
                    {students.map((student) => (
                      <button
                        key={student.id}
                        onClick={() => {
                          setSelectedStudent(student);
                          setStudents([]);
                          setStudentSearchTerm('');
                        }}
                        className="w-full text-left p-4 hover:bg-orange-900/30 transition-colors text-gray-100"
                      >
                        <p className="font-medium text-white">
                          {student.first_name} {student.last_name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {student.student_id} | {student.year_level} - {student.section}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Selected Student */}
                {selectedStudent && (
                  <div className="bg-gradient-to-r from-orange-900/40 to-orange-800/20 border border-orange-500/30 rounded-xl p-4 relative">
                    <button
                      onClick={() => setSelectedStudent(null)}
                      className="absolute top-3 right-3 p-2 text-orange-400 hover:text-white hover:bg-orange-700/50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg">
                          {selectedStudent.first_name} {selectedStudent.last_name}
                        </h4>
                        <p className="text-sm text-orange-200">
                          ID: {selectedStudent.student_id} | {selectedStudent.year_level} - {selectedStudent.section}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!selectedStudent && students.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Search for a student to record a violation</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Violation Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-orange-500/20">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              <h4 className="text-lg font-semibold text-white">Violation Details</h4>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="label">Violation Type *</label>
                <select
                  value={addFormData.violationType}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, violationType: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Select Violation Type</option>
                  {violationTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Date of Incident *</label>
                <input
                  type="date"
                  value={addFormData.date}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="label">Remarks</label>
                <textarea
                  value={addFormData.remarks}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, remarks: e.target.value }))}
                  rows={4}
                  placeholder="Additional details about the violation..."
                  className="input-field resize-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-orange-500/20">
            <button 
              onClick={() => setShowAddModal(false)} 
              className="btn-secondary flex-1 px-6 py-3 rounded-xl"
            >
              Cancel
            </button>
            <button 
              onClick={handleAddViolation} 
              disabled={submitting || !selectedStudent} 
              className="btn-primary flex-1 px-6 py-3 rounded-xl flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  Record Violation
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
      {/* Delete Violation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Violation"
        icon={Trash2}
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-xl">
            <p className="text-red-200 font-medium">Are you sure you want to delete this violation?</p>
            <p className="text-red-300 text-sm mt-1">This action cannot be undone and will permanently remove this violation record.</p>
          </div>
          {selectedViolation && (
            <div className="bg-gray-800/50 border border-orange-500/30 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-white">
                    {selectedViolation.student_first_name} {selectedViolation.student_last_name}
                  </h4>
                  <p className="text-sm text-orange-200">{selectedViolation.student_id}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-medium">{selectedViolation.violation_type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span className="text-gray-300">{formatDate(selectedViolation.date)}</span>
                </div>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <button 
              onClick={() => setShowDeleteModal(false)} 
              className="bg-gray-700 hover:bg-gray-600 text-white flex-1 px-4 py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete} 
              disabled={deleting} 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Violation
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageViolations;
