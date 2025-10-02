'use client';

import { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  Eye
} from 'lucide-react';

export default function DocumentUpload({ token, onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const fileInputRef = useRef(null);

  const documentTypes = [
    { value: 'aadhaar', label: 'Aadhaar Card', description: 'Government identity card', required: true },
    { value: 'pan', label: 'PAN Card', description: 'Permanent Account Number', required: true },
    { value: 'driving_license', label: 'Driving License', description: 'Motor vehicle license', required: false },
    { value: 'passport', label: 'Passport', description: 'International travel document', required: false },
    { value: 'voter_id', label: 'Voter ID', description: 'Election identity card', required: false }
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    // Check if document type is selected first
    if (!documentType) {
      toast.error('Please select a document type first');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP images and PDF files are allowed');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }

    toast.success(`${documentTypes.find(type => type.value === documentType)?.label} selected successfully`);
  };

  const handleUpload = async () => {
    if (!documentType) {
      toast.error('Please select a document type first');
      return;
    }

    if (!selectedFile) {
      toast.error('Please upload your document first');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('documentType', documentType);

      const response = await fetch('/api/verify/upload-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        setUploadResult(result.data);
        onSuccess(result.data);
        toast.success('Document uploaded and processed successfully!');
      } else {
        onError(result.error);
        toast.error(result.error);
      }
    } catch (error) {
      onError('Network error during document upload');
      toast.error('Network error during document upload');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!documentType) {
      toast.error('Please select a document type first');
      return;
    }
    fileInputRef.current?.click();
  };

  if (uploadResult) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <CardTitle>Document Processed Successfully!</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Uploaded Document */}
            <div>
              <h4 className="font-medium mb-3">Uploaded Document</h4>
              {preview ? (
                <img
                  src={preview}
                  alt="Uploaded document"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg border flex items-center justify-center">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>

            {/* Extracted Information */}
            <div>
              <h4 className="font-medium mb-3">Extracted Information</h4>
              <div className="space-y-3">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {uploadResult.document.type.toUpperCase()}
                  </Badge>
                  <div className="text-sm space-y-2">
                    {uploadResult.document.extractedData.name && (
                      <p><span className="font-medium">Name:</span> {uploadResult.document.extractedData.name}</p>
                    )}
                    {uploadResult.document.extractedData.documentNumber && (
                      <p><span className="font-medium">Document Number:</span> ****{uploadResult.document.extractedData.documentNumber.slice(-4)}</p>
                    )}
                    {uploadResult.document.extractedData.dateOfBirth && (
                      <p><span className="font-medium">Date of Birth:</span> {uploadResult.document.extractedData.dateOfBirth}</p>
                    )}
                    <p><span className="font-medium">Confidence:</span> {uploadResult.document.extractedData.confidence}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Validation Results */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Validation Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                {uploadResult.document.validation.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="text-sm">
                  {uploadResult.document.validation.isValid ? 'Valid Document' : 'Validation Issues'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">OCR Confidence</p>
                <p className="font-medium">{uploadResult.document.ocrConfidence}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Validation Score</p>
                <p className="font-medium">{uploadResult.document.validation.score}%</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={() => {
                setUploadResult(null);
                removeFile();
                setDocumentType('');
              }}
              variant="outline"
              className="flex-1"
            >
              Upload Different Document
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              Continue to Next Step
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <CardTitle>Upload Government Document</CardTitle>
        <p className="text-gray-600 mt-2">
          Upload your Aadhaar, PAN, Driving License, or other government-issued ID
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Document Type Selection */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-lg font-semibold">
              Step 1: Select Document Type
              {!documentType && <span className="text-red-500 ml-1">*</span>}
            </label>
            {documentType && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                {documentTypes.find(type => type.value === documentType)?.label} Selected
              </Badge>
            )}
          </div>

          {!documentType ? (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-blue-900 font-medium mb-2">Choose the document you want to upload:</p>
              <p className="text-blue-700 text-sm">You can upload only one document. Select the type that you have available.</p>
            </div>
          ) : (
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-green-900 font-medium">✅ Document type selected: {documentTypes.find(type => type.value === documentType)?.label}</p>
              <p className="text-green-700 text-sm">Now upload your {documentTypes.find(type => type.value === documentType)?.label.toLowerCase()} below.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documentTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setDocumentType(type.value)}
                disabled={documentType && documentType !== type.value}
                className={`p-4 text-left border-2 rounded-lg transition-all ${documentType === type.value
                    ? 'border-blue-500 bg-blue-50 text-blue-900 shadow-md'
                    : documentType && documentType !== type.value
                      ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">{type.label}</p>
                    <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                    {type.required && (
                      <Badge variant="outline" className="mt-2 text-xs">Most Common</Badge>
                    )}
                  </div>
                  {documentType === type.value && (
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {documentType && (
            <div className="text-center">
              <Button
                onClick={() => {
                  setDocumentType('');
                  setSelectedFile(null);
                  setPreview(null);
                }}
                variant="outline"
                size="sm"
              >
                Change Document Type
              </Button>
            </div>
          )}
        </div>

        {/* File Upload Area */}
        {documentType && (
          <div>
            <label className="block text-lg font-semibold mb-4">
              Step 2: Upload Your {documentTypes.find(type => type.value === documentType)?.label}
              {!selectedFile && <span className="text-red-500 ml-1">*</span>}
            </label>

            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
            />

            {selectedFile ? (
              <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ) : (
                      <FileText className="w-16 h-16 text-gray-400" />
                    )}
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-600">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {preview && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(preview, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={openFileDialog}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drop your document here or click to browse
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports JPEG, PNG, WebP images and PDF files (Max 10MB)
                </p>
                <Button variant="outline">
                  Select Document
                </Button>
              </div>
            )}

            {/* Guidelines */}
            <div className="bg-amber-50 p-4 rounded-lg mt-4">
              <h4 className="font-medium text-amber-900 mb-2">Document Guidelines for {documentTypes.find(type => type.value === documentType)?.label}</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Ensure the document is clearly visible and not blurred</li>
                <li>• All text should be readable with good lighting</li>
                <li>• Avoid shadows or reflections on the document</li>
                <li>• Take the photo straight on (not at an angle)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Instructions when no document type selected */}
        {!documentType && (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Select Document Type First</h3>
            <p className="text-gray-500">Choose the type of government document you want to upload from the options above.</p>
          </div>
        )}

        {/* Upload Button */}
        {documentType && selectedFile && (
          <Button
            onClick={handleUpload}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing {documentTypes.find(type => type.value === documentType)?.label}...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Process {documentTypes.find(type => type.value === documentType)?.label}
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}