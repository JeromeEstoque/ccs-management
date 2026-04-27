import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useViolations } from '../../hooks/useData';
import Card from '../../components/common/Card';
import { AlertTriangle, Calendar, User, FileText, ArrowLeft, CheckCircle, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ViolationDetail = () => {
  const { violationId } = useParams();
  const navigate = useNavigate();
  const { data: violations, loading, fetchViolations, updateViolation } = useViolations();
  const [violation, setViolation] = useState(null);

  useEffect(() => {
    fetchViolationDetails();
  }, [violationId]);

  const fetchViolationDetails = async () => {
    try {
      const violationsData = await fetchViolations();
      const foundViolation = violationsData.find(v => v.id === parseInt(violationId));
      if (foundViolation) {
        setViolation(foundViolation);
      } else {
        toast.error('Violation not found');
        navigate('/violations');
      }
    } catch (error) {
      console.error('Error fetching violation details:', error);
      toast.error('Failed to load violation details');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateViolation(violation.id, { status: newStatus });
      setViolation(prev => ({ ...prev, status: newStatus }));
      toast.success(`Violation marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update violation status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!violation) {
    return (
      <div className="empty-state py-16">
        <AlertTriangle className="w-12 h-12" />
        <p className="text-base font-medium">Violation not found</p>
        <p className="text-sm">The violation you're looking for doesn't exist</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">Violation Details</h1>
          <p className="text-secondary-500 dark:text-secondary-400">View and manage violation information</p>
        </div>
      </div>

      {/* Violation Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
                  {violation.violation_type}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  {violation.description}
                </p>
                
                {/* Status Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                    violation.status === 'Resolved' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {violation.status === 'Resolved' ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {violation.status}
                  </span>
                  <span className="text-xs text-secondary-500">
                    Severity: {violation.severity || 'Medium'}
                  </span>
                </div>

                {/* Action Buttons */}
                {violation.status !== 'Resolved' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate('Resolved')}
                      className="btn-primary text-sm"
                    >
                      Mark as Resolved
                    </button>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card title="Additional Information">
            <div className="space-y-4">
              {violation.location && (
                <div>
                  <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Location</p>
                  <p className="text-secondary-600 dark:text-secondary-400">{violation.location}</p>
                </div>
              )}
              
              {violation.reported_by && (
                <div>
                  <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Reported By</p>
                  <p className="text-secondary-600 dark:text-secondary-400">{violation.reported_by}</p>
                </div>
              )}
              
              {violation.witnesses && violation.witnesses.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Witnesses</p>
                  <ul className="list-disc list-inside text-secondary-600 dark:text-secondary-400">
                    {violation.witnesses.map((witness, index) => (
                      <li key={index}>{witness}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {violation.sanctions && violation.sanctions.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Sanctions</p>
                  <ul className="list-disc list-inside text-secondary-600 dark:text-secondary-400">
                    {violation.sanctions.map((sanction, index) => (
                      <li key={index}>{sanction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Date & Time */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-secondary-500" />
              <h4 className="font-medium text-secondary-800 dark:text-secondary-200">Date & Time</h4>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {new Date(violation.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {new Date(violation.date).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </Card>

          {/* Student Information */}
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-secondary-500" />
              <h4 className="font-medium text-secondary-800 dark:text-secondary-200">Student Information</h4>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Name</p>
                <p className="text-secondary-600 dark:text-secondary-400">{violation.student_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Student ID</p>
                <p className="text-secondary-600 dark:text-secondary-400">{violation.student_id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Year & Section</p>
                <p className="text-secondary-600 dark:text-secondary-400">{violation.year_level} - {violation.section}</p>
              </div>
            </div>
          </Card>

          {/* Documents */}
          {violation.documents && violation.documents.length > 0 && (
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-5 h-5 text-secondary-500" />
                <h4 className="font-medium text-secondary-800 dark:text-secondary-200">Documents</h4>
              </div>
              <div className="space-y-2">
                {violation.documents.map((doc, index) => (
                  <a
                    key={index}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                  >
                    <FileText className="w-4 h-4 text-secondary-500" />
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">{doc.name}</span>
                  </a>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViolationDetail;
