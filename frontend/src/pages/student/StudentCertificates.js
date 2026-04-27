import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { certificatesAPI } from '../../services/api';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { Award, Upload, Trash2, FileText, X, Loader2, Download, ExternalLink, Eye, ZoomIn, File, Image } from 'lucide-react';

const StudentCertificates = () => {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({ certificateName: '', file: null });
  const [studentId, setStudentId] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await certificatesAPI.getByUserId(user.id);
      if (response.data && response.data.success) {
        setCertificates(response.data.certificates);
        // Get student ID from certificates if available, or fetch it
        if (response.data.certificates.length > 0) {
          setStudentId(response.data.certificates[0].student_id);
        }
      } else {
        // Set fallback data to prevent crashes
        const fallbackCertificates = [
          {
            id: 1,
            certificate_name: 'Academic Excellence Award',
            file_path: '/certificates/academic-excellence.pdf',
            uploaded_at: '2024-01-15',
            status: 'Approved'
          },
          {
            id: 2,
            certificate_name: 'Leadership Training Certificate',
            file_path: '/certificates/leadership-training.pdf',
            uploaded_at: '2024-01-20',
            status: 'Pending'
          }
        ];
        setCertificates(fallbackCertificates);
        setStudentId(1);
        toast.info('Using sample data. Certificates service unavailable.');
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
      // Set fallback data to prevent crashes
      const fallbackCertificates = [
        {
          id: 1,
          certificate_name: 'Sample Certificate',
          file_path: '/certificates/sample.pdf',
          uploaded_at: new Date().toISOString().split('T')[0],
          status: 'Pending'
        }
      ];
      setCertificates(fallbackCertificates);
      setStudentId(1);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, file: e.target.files[0] }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.certificateName || !formData.file) {
      toast.error('Please fill all fields');
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append('userId', user.id);
    data.append('certificateName', formData.certificateName);
    data.append('certificate', formData.file);

    try {
      const response = await certificatesAPI.upload(data);
      if (response.data.success) {
        toast.success('Certificate uploaded successfully');
        setUploadModalOpen(false);
        setFormData({ certificateName: '', file: null });
        fetchCertificates();
      }
    } catch (error) {
      toast.error('Failed to upload certificate');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      await certificatesAPI.delete(id);
      toast.success('Certificate deleted');
      fetchCertificates();
    } catch (error) {
      toast.error('Failed to delete certificate');
    }
  };

  const openPreview = (cert) => {
    setSelectedCertificate(cert);
    setPreviewModalOpen(true);
  };

  const isImageFile = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  const getFileExtension = (url) => {
    const parts = url.split('.');
    return parts.length > 1 ? parts.pop().toUpperCase() : 'FILE';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative z-10">
      <div className="space-y-6 animate-fade-in p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-orange-200 mb-2">
              <Award className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">Certificate Management</span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight mb-1">My Certificates</h1>
            <p className="text-orange-100 text-sm leading-relaxed">
              Upload and manage your achievement certificates and awards
            </p>
          </div>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors backdrop-blur-sm shadow-lg hover:scale-105"
          >
            <Upload className="w-4 h-4" />
            Upload Certificate
          </button>
        </div>
      </div>

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {certificates.map((cert) => (
            <div key={cert.id} className="card-hover group">
              <div className="glass-panel rounded-xl p-6 h-full overflow-hidden">
                {/* Image Preview Area */}
                <div className="relative h-40 bg-white/10 rounded-t-lg overflow-hidden mb-4">
                  {isImageFile(cert.file_url) ? (
                    <img
                      src={cert.file_url}
                      alt={cert.certificate_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm">
                      <File className="w-12 h-12 text-orange-400 mb-2" />
                      <span className="text-sm font-medium text-orange-300">{getFileExtension(cert.file_url)}</span>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <button
                      onClick={() => openPreview(cert)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-lg"
                    >
                      <ZoomIn className="w-4 h-4" />
                      Preview
                    </button>
                  </div>
                </div>
                
                {/* Certificate Info */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white mb-1 line-clamp-2">{cert.certificate_name}</h3>
                    <p className="text-sm text-gray-400">
                      {new Date(cert.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/50 rounded-lg transition-colors flex-shrink-0"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/20">
                  <button
                    onClick={() => openPreview(cert)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    <ZoomIn className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>
              
              {/* Certificate Info */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1 line-clamp-2">{cert.certificate_name}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(cert.uploaded_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/50 rounded-lg transition-colors flex-shrink-0"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/20">
                <button
                  onClick={() => openPreview(cert)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <a
                  href={cert.file_url}
                  target="_blank"
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium backdrop-blur-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <FileText className="w-10 h-10 text-orange-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Certificates Yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Upload your certificates to keep track of your achievements and accomplishments
          </p>
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors backdrop-blur-sm"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload First Certificate
          </button>
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload Certificate"
      >
        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <label className="label">Certificate Name</label>
            <input
              type="text"
              value={formData.certificateName}
              onChange={(e) => setFormData(prev => ({ ...prev, certificateName: e.target.value }))}
              className="input-search"
              placeholder="e.g., Programming Competition Certificate"
              required
            />
          </div>
          <div>
            <label className="label">Certificate File</label>
            <div className="border-2 border-dashed border-secondary-200 rounded-xl p-6 text-center hover:border-primary-400 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                required
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
                <p className="text-sm text-secondary-600">
                  {formData.file ? formData.file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-secondary-400 mt-1">
                  PDF, JPG, PNG, DOC, DOCX (max 5MB)
                </p>
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setUploadModalOpen(false)}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        title={selectedCertificate?.certificate_name || 'Certificate Preview'}
        size="large"
      >
        {selectedCertificate && (
          <div className="space-y-4">
            {/* Image Preview */}
            <div className="bg-secondary-100 rounded-xl overflow-hidden">
              {isImageFile(selectedCertificate.file_url) ? (
                <img
                  src={selectedCertificate.file_url}
                  alt={selectedCertificate.certificate_name}
                  className="w-full max-h-[60vh] object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-20">
                  <File className="w-20 h-20 text-secondary-400 mb-4" />
                  <p className="text-lg font-medium text-secondary-600 mb-2">
                    {getFileExtension(selectedCertificate.file_url)} File
                  </p>
                  <p className="text-sm text-secondary-500">
                    Preview not available for this file type
                  </p>
                </div>
              )}
            </div>
            
            {/* Certificate Details */}
            <div className="bg-secondary-50 rounded-lg p-4">
              <h4 className="font-semibold text-secondary-800 mb-2">{selectedCertificate.certificate_name}</h4>
              <p className="text-sm text-secondary-500">
                Uploaded on {new Date(selectedCertificate.uploaded_at).toLocaleDateString()}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="btn-secondary flex-1"
              >
                Close
              </button>
              <a
                href={selectedCertificate.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </a>
              <a
                href={selectedCertificate.file_url}
                download
                className="btn-primary flex items-center justify-center gap-2 px-4"
              >
                <Download className="w-4 h-4" />
                Download
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
    </div>
  );
};

export default StudentCertificates;
