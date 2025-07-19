import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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

export interface PresignRequest {
  filename: string;
  contentType: string;
  sizeBytes: number;
}

export interface PresignResponse {
  uploadId: string;
  url: string;
  fields?: Record<string, string>;
  expiresIn: number;
}

export interface UploadProgress {
  uploadId: string;
  progress: number;
  status: 'uploading' | 'uploaded' | 'failed';
  error?: string;
}

const API_BASE = process.env.REACT_APP_FORUM_API_URL || 'http://localhost:3001/api';

class UploadAPIError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = 'UploadAPIError';
  }
}

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { code: 'NETWORK_ERROR', message: 'Network error occurred' };
    }
    
    throw new UploadAPIError(errorData.code || 'API_ERROR', errorData.message || 'An error occurred');
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const useUploadAPI = () => {
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<Map<string, UploadProgress>>(new Map());

  // Get presigned URL
  const presignMutation = useMutation({
    mutationFn: async (request: PresignRequest): Promise<PresignResponse> => {
      return fetchWithAuth(`${API_BASE}/uploads/presign`, {
        method: 'POST',
        body: JSON.stringify(request),
      });
    },
  });

  // Confirm upload
  const confirmMutation = useMutation({
    mutationFn: async (uploadId: string): Promise<void> => {
      return fetchWithAuth(`${API_BASE}/uploads/confirm`, {
        method: 'POST',
        body: JSON.stringify({ uploadId }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
    },
  });

  // Get upload metadata
  const getUpload = (uploadId: string) => {
    return useQuery({
      queryKey: ['uploads', uploadId],
      queryFn: async (): Promise<UploadMeta> => {
        return fetchWithAuth(`${API_BASE}/uploads/${uploadId}`);
      },
      enabled: !!uploadId,
    });
  };

  // Get user uploads
  const getUserUploads = (limit = 50, offset = 0) => {
    return useQuery({
      queryKey: ['uploads', 'user', { limit, offset }],
      queryFn: async (): Promise<{ uploads: UploadMeta[]; total: number; limit: number; offset: number }> => {
        return fetchWithAuth(`${API_BASE}/uploads/user/me?limit=${limit}&offset=${offset}`);
      },
    });
  };

  // Delete upload
  const deleteMutation = useMutation({
    mutationFn: async (uploadId: string): Promise<void> => {
      return fetchWithAuth(`${API_BASE}/uploads/${uploadId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
    },
  });

  // Complete upload flow
  const uploadFile = useCallback(async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<UploadMeta> => {
    try {
      const uploadId = `upload_${Date.now()}_${Math.random()}`;
      
      // Update progress
      const updateProgress = (progress: number, status: UploadProgress['status'], error?: string) => {
        setUploadProgress(prev => new Map(prev.set(uploadId, {
          uploadId,
          progress,
          status,
          error,
        })));
        onProgress?.(progress);
      };

      updateProgress(0, 'uploading');

      // Step 1: Get presigned URL
      const presignResponse = await presignMutation.mutateAsync({
        filename: file.name,
        contentType: file.type,
        sizeBytes: file.size,
      });

      updateProgress(10, 'uploading');

      // Step 2: Upload to S3
      const uploadResponse = await fetch(presignResponse.url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file to S3');
      }

      updateProgress(70, 'uploading');

      // Step 3: Confirm upload
      await confirmMutation.mutateAsync(presignResponse.uploadId);

      updateProgress(90, 'uploading');

      // Step 4: Get metadata
      const metadata = await fetchWithAuth(`${API_BASE}/uploads/${presignResponse.uploadId}`);

      updateProgress(100, 'uploaded');

      // Clean up progress after a delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const newMap = new Map(prev);
          newMap.delete(uploadId);
          return newMap;
        });
      }, 3000);

      return metadata;
    } catch (error: any) {
      const uploadId = `upload_${Date.now()}_${Math.random()}`;
      setUploadProgress(prev => new Map(prev.set(uploadId, {
        uploadId,
        progress: 0,
        status: 'failed',
        error: error.message,
      })));
      
      throw error;
    }
  }, [presignMutation, confirmMutation]);

  // Upload multiple files
  const uploadFiles = useCallback(async (
    files: File[],
    onProgress?: (overall: number, fileProgress: Record<string, number>) => void
  ): Promise<UploadMeta[]> => {
    const fileProgress: Record<string, number> = {};
    const results: UploadMeta[] = [];

    const uploadPromises = files.map(async (file, index) => {
      try {
        const result = await uploadFile(file, (progress) => {
          fileProgress[file.name] = progress;
          const overall = Object.values(fileProgress).reduce((sum, p) => sum + p, 0) / files.length;
          onProgress?.(overall, { ...fileProgress });
        });
        results[index] = result;
        return result;
      } catch (error) {
        fileProgress[file.name] = 0;
        throw error;
      }
    });

    await Promise.all(uploadPromises);
    return results;
  }, [uploadFile]);

  return {
    // Mutations
    presignUpload: presignMutation.mutateAsync,
    confirmUpload: confirmMutation.mutateAsync,
    deleteUpload: deleteMutation.mutateAsync,
    uploadFile,
    uploadFiles,
    
    // Queries
    getUpload,
    getUserUploads,
    
    // State
    uploadProgress,
    
    // Loading states
    isPresigning: presignMutation.isPending,
    isConfirming: confirmMutation.isPending,
    isDeleting: deleteMutation.isPending,
    
    // Errors
    presignError: presignMutation.error as UploadAPIError | null,
    confirmError: confirmMutation.error as UploadAPIError | null,
    deleteError: deleteMutation.error as UploadAPIError | null,
  };
};

export default useUploadAPI;