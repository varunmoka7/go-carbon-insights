import { useState, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

export interface ImportRequest {
  importName: string;
  importType: 'csv' | 'api' | 'manual' | 'scheduled';
  importCategory: 'emissions' | 'financial' | 'operational' | 'compliance' | 'company_profiles';
  configurationId?: string;
  file?: File;
  data?: any[];
  validationRules?: Record<string, any>;
  transformationConfig?: Record<string, any>;
  notes?: string;
}

export interface ImportResult {
  importId: string;
  status: 'pending' | 'processing' | 'validating' | 'completed' | 'failed' | 'cancelled';
  totalRecords: number;
  processedRecords: number;
  validRecords: number;
  invalidRecords: number;
  duplicateRecords: number;
  errors: Array<{
    type: string;
    severity: string;
    message: string;
    rowNumber?: number;
    columnName?: string;
    fieldValue?: string;
    suggestedFix?: string;
  }>;
  createdAt?: string;
  completedAt?: string;
}

export interface ImportStatistics {
  totalImports: number;
  completedImports: number;
  failedImports: number;
  averageProcessingTime: string;
  totalRecordsProcessed: number;
  successRate: number;
  byCategory: Record<string, {
    total: number;
    success: number;
    failed: number;
  }>;
  recentActivity: Array<{
    importId: string;
    name: string;
    status: string;
    recordsProcessed: number;
    progressPercentage?: number;
    completedAt?: string;
  }>;
}

export interface ImportConfiguration {
  id: string;
  configName: string;
  importType: string;
  importCategory: string;
  schemaDefinition: Record<string, any>;
  fieldMappings?: Record<string, string>;
  validationRules?: Record<string, any>;
  transformationRules?: Record<string, any>;
  defaultSettings?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
}

export const useDataImportAPI = () => {
  const [imports, setImports] = useState<ImportResult[]>([]);
  const [statistics, setStatistics] = useState<ImportStatistics | null>(null);
  const [configurations, setConfigurations] = useState<ImportConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();

  const apiCall = useCallback(async (
    endpoint: string, 
    options: RequestInit = {}
  ) => {
    const token = localStorage.getItem('supabase.auth.token');
    
    const response = await fetch(`/api/admin/imports${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }, []);

  const initiateImport = useCallback(async (request: ImportRequest): Promise<ImportResult> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('importName', request.importName);
      formData.append('importType', request.importType);
      formData.append('importCategory', request.importCategory);
      
      if (request.configurationId) {
        formData.append('configurationId', request.configurationId);
      }
      
      if (request.file) {
        formData.append('file', request.file);
      }
      
      if (request.data) {
        formData.append('data', JSON.stringify(request.data));
      }
      
      if (request.validationRules) {
        formData.append('validationRules', JSON.stringify(request.validationRules));
      }
      
      if (request.transformationConfig) {
        formData.append('transformationConfig', JSON.stringify(request.transformationConfig));
      }

      if (request.notes) {
        formData.append('notes', request.notes);
      }

      const token = localStorage.getItem('supabase.auth.token');
      
      const response = await fetch('/api/admin/imports', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getImportStatus = useCallback(async (importId: string): Promise<ImportResult | null> => {
    try {
      const result = await apiCall(`/${importId}`);
      return result.data;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [apiCall]);

  const cancelImport = useCallback(async (importId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await apiCall(`/${importId}/cancel`, { method: 'POST' });
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const refreshImports = useCallback(async (limit = 50, offset = 0) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall(`/history?limit=${limit}&offset=${offset}`);
      setImports(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const validateData = useCallback(async (
    data: any[], 
    validationRules: Record<string, any>, 
    category: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall('/validate', {
        method: 'POST',
        body: JSON.stringify({
          data,
          validationRules,
          category
        }),
      });
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const refreshStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall('/statistics');
      setStatistics(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const getConfigurations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall('/configurations');
      setConfigurations(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const createConfiguration = useCallback(async (config: Omit<ImportConfiguration, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall('/configurations', {
        method: 'POST',
        body: JSON.stringify(config),
      });
      return result.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiCall]);

  const downloadTemplate = useCallback(async (category: string) => {
    try {
      const token = localStorage.getItem('supabase.auth.token');
      
      const response = await fetch(`/api/admin/imports/templates/${category}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${category}_template.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    imports,
    statistics,
    configurations,
    isLoading,
    error,
    initiateImport,
    getImportStatus,
    cancelImport,
    refreshImports,
    validateData,
    refreshStatistics,
    getConfigurations,
    createConfiguration,
    downloadTemplate,
  };
};