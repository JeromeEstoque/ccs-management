import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const FileUpload = ({
  accept = '*/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 5,
  onUpload,
  onFileSelect,
  onFileRemove,
  className = '',
  disabled = false,
  showPreview = true,
  dragAndDrop = true
}) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // File type icons
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.startsWith('text/') || file.type === 'application/pdf') return FileText;
    return File;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Validate file
  const validateFile = (file) => {
    const errors = [];

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size exceeds ${formatFileSize(maxSize)} limit`);
    }

    // Check file type (if accept is specified)
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        }
        if (type.includes('*')) {
          const [mainType] = type.split('/');
          return file.type.startsWith(mainType);
        }
        return file.type === type;
      });

      if (!isAccepted) {
        errors.push(`File type not accepted. Allowed types: ${accept}`);
      }
    }

    return errors;
  };

  // Handle file selection
  const handleFileSelect = useCallback((selectedFiles) => {
    const newFiles = [];
    const newErrors = {};

    Array.from(selectedFiles).forEach((file, index) => {
      const fileId = Date.now() + index;
      const validationErrors = validateFile(file);

      if (validationErrors.length > 0) {
        newErrors[fileId] = validationErrors;
      } else {
        const fileWithId = {
          id: fileId,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: null,
          status: 'pending'
        };

        // Generate preview for images
        if (file.type.startsWith('image/') && showPreview) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFiles(prev => prev.map(f => 
              f.id === fileId ? { ...f, preview: e.target.result } : f
            ));
          };
          reader.readAsDataURL(file);
        }

        newFiles.push(fileWithId);
      }
    });

    // Check max files limit
    if (files.length + newFiles.length > maxFiles) {
      newErrors['limit'] = `Maximum ${maxFiles} files allowed`;
    } else {
      setFiles(prev => [...prev, ...newFiles]);
      setErrors(prev => ({ ...prev, ...newErrors }));
      onFileSelect?.(newFiles.map(f => f.file));
    }
  }, [files.length, maxFiles, accept, maxSize, showPreview, onFileSelect]);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles[0]) {
      handleFileSelect(droppedFiles);
    }
  };

  // Handle file input change
  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files);
    }
  };

  // Remove file
  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fileId];
      return newErrors;
    });
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[fileId];
      return newProgress;
    });
    
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove) {
      onFileRemove?.(fileToRemove.file);
    }
  };

  // Upload files
  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadPromises = files.map(async (fileObj) => {
      try {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'uploading' } : f
        ));

        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            const currentProgress = prev[fileObj.id] || 0;
            if (currentProgress < 90) {
              return { ...prev, [fileObj.id]: currentProgress + 10 };
            }
            return prev;
          });
        }, 200);

        // Call upload callback
        const result = await onUpload?.(fileObj.file, (progress) => {
          setUploadProgress(prev => ({ ...prev, [fileObj.id]: progress }));
        });

        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [fileObj.id]: 100 }));
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'completed' } : f
        ));

        return result;
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileObj.id ? { ...f, status: 'error' } : f
        ));
        setErrors(prev => ({ 
          ...prev, 
          [fileObj.id]: ['Upload failed: ' + error.message] 
        }));
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-colors
          ${dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragEnter={dragAndDrop ? handleDrag : undefined}
        onDragLeave={dragAndDrop ? handleDrag : undefined}
        onDragOver={dragAndDrop ? handleDrag : undefined}
        onDrop={dragAndDrop ? handleDrop : undefined}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-3">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${dragActive ? 'bg-blue-100' : 'bg-gray-100'}
          `}>
            <Upload className={`w-6 h-6 ${dragActive ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-900">
              {dragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept !== '*/*' && `Accepted files: ${accept}`}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
              {maxFiles > 1 && ` • Max files: ${maxFiles}`}
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900">
              Selected Files ({files.length})
            </h4>
            {!uploading && (
              <button
                onClick={uploadFiles}
                className="btn-primary btn-sm"
              >
                Upload Files
              </button>
            )}
          </div>

          {files.map((fileObj) => {
            const Icon = getFileIcon(fileObj.file);
            const progress = uploadProgress[fileObj.id] || 0;
            const fileErrors = errors[fileObj.id] || [];

            return (
              <div
                key={fileObj.id}
                className={`
                  flex items-center gap-3 p-3 bg-gray-50 rounded-lg border
                  ${fileErrors.length > 0 ? 'border-red-200' : 'border-gray-200'}
                `}
              >
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {fileObj.preview ? (
                    <img
                      src={fileObj.preview}
                      alt={fileObj.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {fileObj.name}
                    </p>
                    {fileObj.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {fileObj.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    {fileObj.status === 'uploading' && (
                      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(fileObj.size)}
                  </p>

                  {/* Progress Bar */}
                  {fileObj.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{progress}% uploaded</p>
                    </div>
                  )}

                  {/* Errors */}
                  {fileErrors.length > 0 && (
                    <div className="mt-2">
                      {fileErrors.map((error, index) => (
                        <p key={index} className="text-xs text-red-600">
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(fileObj.id)}
                  disabled={uploading}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Global Errors */}
      {errors.limit && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{errors.limit}</p>
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <p className="text-sm text-blue-600">Uploading files...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
