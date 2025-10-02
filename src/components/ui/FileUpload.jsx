'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, Video, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useFileUpload } from '@/hooks/useFileUpload';

const FileUploadComponent = ({
  onUploadComplete,
  onUploadError,
  acceptedTypes = 'image/*',
  maxFileSize = 10, // MB
  uploadType = 'image',
  folder = 'general',
  className = '',
  showPreview = true,
  multiple = false,
  token, // JWT token
  endpoint = '/api/upload',
  disabled = false,
  children,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const fileInputRef = useRef(null);

  const { uploading, progress, error, uploadFile, reset } = useFileUpload();

  const validateFile = useCallback((file) => {
    // Check file size
    const maxSizeBytes = maxFileSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    // Check file type
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim());
    const isValidType = allowedTypes.some(type => {
      if (type === 'image/*') return file.type.startsWith('image/');
      if (type === 'video/*') return file.type.startsWith('video/');
      return file.type === type;
    });

    if (!isValidType) {
      return `File type not supported. Allowed types: ${acceptedTypes}`;
    }

    return null;
  }, [acceptedTypes, maxFileSize]);

  const createPreview = useCallback((file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve({ type: 'image', url: e.target.result });
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        video.addEventListener('loadeddata', () => {
          canvas.width = 200;
          canvas.height = 150;
          ctx.drawImage(video, 0, 0, 200, 150);
          resolve({ type: 'video', url: canvas.toDataURL() });
        });

        video.src = URL.createObjectURL(file);
      } else {
        resolve({ type: 'file', url: null });
      }
    });
  }, []);

  const handleFiles = useCallback(async (fileList) => {
    const fileArray = Array.from(fileList);
    const validFiles = [];
    const errors = [];

    for (const file of fileArray) {
      const error = validateFile(file);
      if (error) {
        errors.push({ file: file.name, error });
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      onUploadError?.(errors.map(e => `${e.file}: ${e.error}`).join(', '));
      return;
    }

    if (!multiple && validFiles.length > 1) {
      onUploadError?.('Only one file is allowed');
      return;
    }

    setFiles(validFiles);

    if (showPreview) {
      const previewPromises = validFiles.map(createPreview);
      const previewResults = await Promise.all(previewPromises);
      setPreviews(previewResults);
    }
  }, [validateFile, multiple, showPreview, createPreview, onUploadError]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  }, [handleFiles, disabled]);

  const handleFileSelect = useCallback((e) => {
    if (disabled) return;
    const selectedFiles = e.target.files;
    handleFiles(selectedFiles);
  }, [handleFiles, disabled]);

  const handleUpload = useCallback(async () => {
    if (!files.length || !token) return;

    try {
      reset();
      const uploadPromises = files.map(file =>
        uploadFile(file, {
          endpoint,
          type: uploadType,
          folder,
          token
        })
      );

      const results = await Promise.all(uploadPromises);
      onUploadComplete?.(multiple ? results : results[0]);

      // Clear files after successful upload
      setFiles([]);
      setPreviews([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      onUploadError?.(err.message);
    }
  }, [files, token, uploadFile, endpoint, uploadType, folder, onUploadComplete, onUploadError, multiple, reset]);

  const removeFile = useCallback((index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  }, [files, previews]);

  const openFileDialog = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept={acceptedTypes}
          multiple={multiple}
          className="hidden"
          disabled={disabled}
        />

        {children || (
          <>
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-1">
              Drag & drop files here, or click to select
            </p>
            <p className="text-xs text-gray-400">
              {acceptedTypes} • Max {maxFileSize}MB {multiple ? '• Multiple files allowed' : ''}
            </p>
          </>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              {showPreview && previews[index]?.url ? (
                <img
                  src={previews[index].url}
                  alt="Preview"
                  className="w-10 h-10 object-cover rounded"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                  {getFileIcon(file)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            Uploading... {progress.toFixed(0)}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {/* Upload Button */}
      {files.length > 0 && !uploading && (
        <button
          onClick={handleUpload}
          disabled={!token || uploading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
        </button>
      )}
    </div>
  );
};

export default FileUploadComponent;