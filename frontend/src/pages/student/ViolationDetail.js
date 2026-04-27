import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { violationsAPI } from '../../services/api';
import Card from '../../components/common/Card';
import { AlertTriangle, Calendar, User, FileText, ArrowLeft, CheckCircle, Clock, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const ViolationDetail = () => {
  const { violationId } = useParams();
  const navigate = useNavigate();
  const [violation, setViolation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchViolationDetails();
  }, [violationId]);

  const fetchViolationDetails = async () => {
    try {
      setLoading(true);
      const response = await violationsAPI.getById(violationId);
      if (response.data.success) {
        setViolation(response.data.violation);
      } else {
        toast.error('Violation not found');
        navigate('/student/violations');
      }
    } catch (error) {
      console.error('Error fetching violation details:', error);
      toast.error('Failed to load violation details');
      navigate('/student/violations');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!violation) return;
    setDeleting(true);
    try {
      await violationsAPI.delete(violation.id);
      toast.success('Violation deleted successfully');
      navigate('/student/violations');
    } catch (error) {
      console.error('Error deleting violation:', error);
      toast.error('Failed to delete violation');
    } finally {
      setDeleting(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Major': 'bg-red-500 text-white border-red-600',
      'Minor': 'bg-yellow-500 text-white border-yellow-600'
    };
    return colors[severity] || 'bg-gray-500 text-white border-gray-600';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-amber-500 text-white',
      'Resolved': 'bg-green-500 text-white',
      'Under Investigation': 'bg-blue-500 text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading violation details...</p>
        </div>
      </div>
    );
  }

  if (!violation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Violation Not Found</h2>
          <p className="text-gray-500 mb-4">The violation you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/student/violations')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Violations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 relative z-10">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 px-4 py-3 shadow-lg sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/student/violations')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Violation Details</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className={`px-3 py-1 rounded-full font-medium border ${getSeverityColor(violation.severity)}`}>
              {violation.severity}
            </span>
            <span className={`px-3 py-1 rounded-full font-medium ${getStatusColor(violation.status)}`}>
              {violation.status}
            </span>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Violation Summary */}
        <Card className="mb-6">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(violation.severity)}`}>
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{violation.violation_type || violation.type}</h2>
              <p className="text-gray-600 mb-4">{violation.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-gray-900 font-medium">
                      {formatDate(violation.date_created || violation.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Reported By</p>
                    <p className="text-gray-900 font-medium">
                      {violation.reported_by || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="text-gray-900 font-medium">{violation.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title="Violation Details" icon={FileText}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Violation Type</label>
                <p className="text-gray-900 font-medium">{violation.violation_type || violation.type}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Severity</label>
                <p className="text-gray-900 font-medium">{violation.severity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900">{violation.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900">{violation.location || 'N/A'}</p>
              </div>
            </div>
          </Card>

          <Card title="Resolution Information" icon={CheckCircle}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(violation.status)}`}>
                  {violation.status}
                </span>
              </div>
              {violation.resolved_date && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Resolved Date</label>
                  <p className="text-gray-900 font-medium">
                    {formatDate(violation.resolved_date)}
                  </p>
                </div>
              )}
              {violation.resolution_remarks && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Resolution Remarks</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{violation.resolution_remarks}</p>
                </div>
              )}
              {violation.status === 'Pending' && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <p className="text-amber-700 text-sm">
                    <strong>Note:</strong> This violation is currently pending resolution.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Actions */}
        {violation.status === 'Pending' && (
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Need Assistance?</h3>
                <p className="text-gray-600 text-sm">
                  If you believe this violation was recorded in error, please contact the guidance office.
                </p>
              </div>
              <button
                onClick={() => navigate('/student/profile')}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Contact Guidance
              </button>
            </div>
          </Card>
        )}
        
        {/* Delete Action - Only for Admin users */}
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
              <p className="text-gray-600 text-sm">
                Permanently delete this violation record. This action cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Violation
            </button>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Violation</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-medium mb-2">Are you sure you want to delete this violation?</p>
              <div className="space-y-1 text-sm text-red-700">
                <p><strong>Student:</strong> {violation.student_first_name} {violation.student_last_name}</p>
                <p><strong>Violation:</strong> {violation.violation_type || violation.type}</p>
                <p><strong>Date:</strong> {formatDate(violation.date_created || violation.date)}</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViolationDetail;
