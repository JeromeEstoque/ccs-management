import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentsAPI, violationsAPI } from '../../services/api';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';
import { Search, AlertTriangle, Send, User, Loader2, X, CheckCircle } from 'lucide-react';

const EncodeViolation = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    violationType: '',
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });

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

  const searchStudents = async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    try {
      const response = await studentsAPI.getAll({ search: searchTerm });
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error('Error searching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }
    if (!formData.violationType || !formData.date) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    try {
      await violationsAPI.create({
        studentId: selectedStudent.id,
        violationType: formData.violationType,
        remarks: formData.remarks,
        date: formData.date
      });
      toast.success('Violation recorded successfully');
      setSelectedStudent(null);
      setFormData({
        violationType: '',
        remarks: '',
        date: new Date().toISOString().split('T')[0]
      });
      setSearchTerm('');
      setStudents([]);
    } catch (error) {
      toast.error('Failed to record violation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-orange-200 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Disciplinary Action</span>
          </div>
          <h1 className="text-2xl font-bold">Encode Violation</h1>
          <p className="text-orange-100 text-sm mt-1">Record student violations and disciplinary actions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Search */}
        <Card title="Search Student" icon={Search}>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchStudents()}
                  placeholder="Search by name or student ID..."
                  className="input-field pl-10"
                />
              </div>
              <button
                onClick={searchStudents}
                disabled={loading}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
              </button>
            </div>

            {/* Search Results */}
            {students.length > 0 && (
              <div className="border border-secondary-200 rounded-xl divide-y divide-secondary-100 max-h-64 overflow-y-auto">
                {students.map((student) => (
                  <button
                    key={student.id}
                    onClick={() => {
                      setSelectedStudent(student);
                      setStudents([]);
                      setSearchTerm('');
                    }}
                    className="w-full text-left p-4 hover:bg-primary-50 transition-colors"
                  >
                    <p className="font-medium text-secondary-800">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-sm text-secondary-500">
                      {student.student_id} | {student.year_level} - {student.section}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Student */}
            {selectedStudent && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4 relative">
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="absolute top-2 right-2 p-1 text-blue-400 hover:text-blue-600 hover:bg-blue-200 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      {selectedStudent.first_name} {selectedStudent.last_name}
                    </h4>
                    <p className="text-sm text-blue-600">
                      ID: {selectedStudent.student_id} | {selectedStudent.year_level} - {selectedStudent.section}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!selectedStudent && students.length === 0 && (
              <div className="empty-state py-8">
                <User className="w-8 h-8" />
                <p className="text-sm">Search for a student to record a violation</p>
              </div>
            )}
          </div>
        </Card>

        {/* Violation Form */}
        <Card title="Violation Details" icon={AlertTriangle}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Violation Type *</label>
              <select
                value={formData.violationType}
                onChange={(e) => setFormData(prev => ({ ...prev, violationType: e.target.value }))}
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
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Remarks</label>
              <textarea
                value={formData.remarks}
                onChange={(e) => setFormData(prev => ({ ...prev, remarks: e.target.value }))}
                rows={4}
                placeholder="Additional details about the violation..."
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedStudent}
              className="w-full btn-danger flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Record Violation
                </>
              )}
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default EncodeViolation;
