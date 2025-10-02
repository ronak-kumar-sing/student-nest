import { useState, useCallback } from 'react';

/**
 * Custom hook for handling file uploads to Cloudinary
 */
export const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const uploadFile = useCallback(async (file, options = {}) => {
    const {
      endpoint = '/api/upload',
      type = 'image',
      folder = 'general',
      width,
      height,
      onProgress,
      token // JWT token for authentication
    } = options;

    if (!file) {
      throw new Error('No file provided');
    }

    if (!token) {
      throw new Error('Authentication token is required');
    }

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('folder', folder);

      if (width) formData.append('width', width.toString());
      if (height) formData.append('height', height.toString());

      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(percentComplete);
            onProgress?.(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          setUploading(false);

          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response.data);
            } else {
              const error = new Error(response.error || 'Upload failed');
              setError(error.message);
              reject(error);
            }
          } else {
            const error = new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
            setError(error.message);
            reject(error);
          }
        });

        xhr.addEventListener('error', () => {
          const error = new Error('Network error during upload');
          setUploading(false);
          setError(error.message);
          reject(error);
        });

        xhr.open('POST', endpoint);
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });

    } catch (err) {
      setUploading(false);
      setError(err.message);
      throw err;
    }
  }, []);



  const uploadPropertyImage = useCallback(async (file, propertyId, token) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('propertyId', propertyId);
    formData.append('mediaType', 'image');

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          setUploading(false);

          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response.data);
            } else {
              const error = new Error(response.error || 'Upload failed');
              setError(error.message);
              reject(error);
            }
          } else {
            const error = new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
            setError(error.message);
            reject(error);
          }
        });

        xhr.addEventListener('error', () => {
          const error = new Error('Network error during upload');
          setUploading(false);
          setError(error.message);
          reject(error);
        });

        xhr.open('POST', '/api/upload/property');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });

    } catch (err) {
      setUploading(false);
      setError(err.message);
      throw err;
    }
  }, []);

  const uploadPropertyVideo = useCallback(async (file, propertyId, token) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('propertyId', propertyId);
    formData.append('mediaType', 'video');

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = (event.loaded / event.total) * 100;
            setProgress(percentComplete);
          }
        });

        xhr.addEventListener('load', () => {
          setUploading(false);

          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response.data);
            } else {
              const error = new Error(response.error || 'Upload failed');
              setError(error.message);
              reject(error);
            }
          } else {
            const error = new Error(`HTTP ${xhr.status}: ${xhr.statusText}`);
            setError(error.message);
            reject(error);
          }
        });

        xhr.addEventListener('error', () => {
          const error = new Error('Network error during upload');
          setUploading(false);
          setError(error.message);
          reject(error);
        });

        xhr.open('POST', '/api/upload/property');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });

    } catch (err) {
      setUploading(false);
      setError(err.message);
      throw err;
    }
  }, []);

  const deleteFile = useCallback(async (publicId, resourceType = 'image', token, endpoint = '/api/upload') => {
    if (!token) {
      throw new Error('Authentication token is required');
    }

    try {
      const response = await fetch(`${endpoint}?publicId=${encodeURIComponent(publicId)}&resourceType=${resourceType}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Delete failed');
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    uploading,
    progress,
    error,
    uploadFile,

    uploadPropertyImage,
    uploadPropertyVideo,
    deleteFile,
    reset,
  };
};