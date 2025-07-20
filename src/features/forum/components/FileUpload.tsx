import React, { useState, useCallback, useRef } from 'react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Progress } from '../../../components/ui/progress';
import { Upload, X, Image, FileText, AlertCircle, RotateCcw } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';

export interface UploadMeta {
  id: string;
  originalFilename: string;
  contentType: string;
  sizeBytes: number;
  cdnUrl: string;
  status: 'pending' | 'uploaded' | 'failed';
  createdAt: string;
}

export interface UploadError {
  code: string;
  message: string;
}

export interface FileUploadProps {
  uploadUrl: string;
  allowedTypes?: string[];
  maxSizeBytes?: number;
  multiple?: boolean;
  onProgress?(percent: number): void;
  onSuccess?(upload: UploadMeta): void;
  onError?(error: UploadError): void;
  className?: string;
}

interface FileWithPreview {
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  uploadId?: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'uploaded' | 'failed';
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  uploadUrl,
  allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'],
  maxSizeBytes = 10000000, // 10MB
  multiple = false,
  onProgress,
  onSuccess,
  onError,
  className = '',
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = useCallback((file: File): UploadError | null => {
    if (!allowedTypes.includes(file.type)) {
      return {
        code: 'INVALID_FILE',
        message: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
      };
    }

    if (file.size > maxSizeBytes) {
      return {
        code: 'INVALID_FILE',
        message: `File size exceeds maximum limit of ${Math.round(maxSizeBytes / (1024 * 1024))}MB`,
      };
    }

    return null;
  }, [allowedTypes, maxSizeBytes]);

  const createPreview = useCallback((file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, []);

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileWithPreview[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const validationError = validateFile(file);
      
      if (validationError) {
        toast({
          title: 'Upload Error',
          description: validationError.message,
          variant: 'destructive',
        });
        continue;
      }

      const fileWithPreview: FileWithPreview = {
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: createPreview(file),
        status: 'pending' as const,
        progress: 0,
      };

      newFiles.push(fileWithPreview);
    }

    if (multiple) {
      setFiles(prev => [...prev, ...newFiles]);
    } else {
      // Clean up old previews
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      setFiles(newFiles);
    }
  }, [files, multiple, validateFile, createPreview, toast]);

  const uploadFile = async (fileWrapper: FileWithPreview): Promise<void> => {
    try {
      // Update file status
      setFiles(prev => prev.map(f => 
        f === fileWrapper ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      // Get presigned URL
      const presignResponse = await fetch(`${uploadUrl}/presign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          filename: fileWrapper.name,
          contentType: fileWrapper.type,
          sizeBytes: fileWrapper.size,
        }),
      });

      if (!presignResponse.ok) {
        const errorData = await presignResponse.json();
        throw new Error(errorData.message || 'Failed to get upload URL');
      }

      const { uploadId, url } = await presignResponse.json();

      // Upload to S3
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: fileWrapper.file,
        headers: {
          'Content-Type': fileWrapper.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      // Update progress
      setFiles(prev => prev.map(f => 
        f === fileWrapper ? { ...f, progress: 50 } : f
      ));

      // Confirm upload
      const confirmResponse = await fetch(`${uploadUrl}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ uploadId }),
      });

      if (!confirmResponse.ok) {
        throw new Error('Failed to confirm upload');
      }

      // Get upload metadata
      const metadataResponse = await fetch(`${uploadUrl}/${uploadId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!metadataResponse.ok) {
        throw new Error('Failed to get upload metadata');
      }

      const uploadMeta: UploadMeta = await metadataResponse.json();

      // Update file status
      setFiles(prev => prev.map(f => 
        f === fileWrapper ? { ...f, status: 'uploaded', progress: 100, uploadId } : f
      ));

      onSuccess?.(uploadMeta);
      onProgress?.(100);

      toast({
        title: 'Upload Successful',
        description: `${fileWrapper.name} has been uploaded successfully.`,
      });

    } catch (error: any) {
      const uploadError: UploadError = {
        code: 'UPLOAD_FAILED',
        message: error.message || 'Upload failed',
      };

      setFiles(prev => prev.map(f => 
        f === fileWrapper ? { ...f, status: 'failed', error: uploadError.message } : f
      ));

      onError?.(uploadError);

      toast({
        title: 'Upload Failed',
        description: uploadError.message,
        variant: 'destructive',
      });
    }
  };

  const removeFile = useCallback((fileToRemove: FileWithPreview) => {
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(prev => prev.filter(f => f !== fileToRemove));
  }, []);

  const retryUpload = useCallback((fileWrapper: FileWithPreview) => {
    uploadFile(fileWrapper);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getFileIcon = (fileWrapper: FileWithPreview) => {
    if (fileWrapper.type.startsWith('image/')) {
      return <Image className="w-8 h-8 text-blue-500" />;
    }
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <Card
        role="button"
        tabIndex={0}
        className={`
          p-8 border-2 border-dashed cursor-pointer transition-colors
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to select
          </p>
          <p className="text-sm text-gray-500">
            Supports: {allowedTypes.join(', ')} (Max {Math.round(maxSizeBytes / (1024 * 1024))}MB)
          </p>
        </div>
      </Card>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={allowedTypes.join(',')}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((fileWrapper, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center space-x-4">
                {/* File Icon/Preview */}
                <div className="flex-shrink-0">
                  {fileWrapper.preview ? (
                    <img
                      src={fileWrapper.preview}
                      alt={fileWrapper.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    getFileIcon(fileWrapper)
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {fileWrapper.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {!isNaN(fileWrapper.size) ? (fileWrapper.size / 1024 / 1024).toFixed(2) : '0.00'} MB
                  </p>
                  
                  {/* Progress Bar */}
                  {fileWrapper.status === 'uploading' && (
                    <Progress value={fileWrapper.progress || 0} className="mt-2" />
                  )}
                  
                  {/* Status Messages */}
                  {fileWrapper.status === 'uploaded' && (
                    <p className="text-sm text-green-600 mt-1">✓ Uploaded successfully</p>
                  )}
                  
                  {fileWrapper.status === 'failed' && (
                    <p className="text-sm text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {fileWrapper.error}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {fileWrapper.status === 'pending' && (
                    <Button
                      onClick={() => uploadFile(fileWrapper)}
                      size="sm"
                      variant="outline"
                    >
                      Upload
                    </Button>
                  )}
                  
                  {fileWrapper.status === 'failed' && (
                    <Button
                      onClick={() => retryUpload(fileWrapper)}
                      size="sm"
                      variant="outline"
                      aria-label="Retry upload"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => removeFile(fileWrapper)}
                    size="sm"
                    variant="ghost"
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};