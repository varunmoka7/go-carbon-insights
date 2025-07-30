import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Textarea } from '../../../components/ui/textarea';
import { Progress } from '../../../components/ui/progress';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { 
  Upload, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Download,
  Eye 
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useDataImportAPI } from '../hooks/useDataImportAPI';

interface ImportUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface ValidationSummary {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  totalErrors: number;
  totalWarnings: number;
  errorsByType: Record<string, number>;
  sampleErrors: Array<{
    field: string;
    message: string;
    severity: string;
    rowNumber?: number;
    suggestedFix?: string;
  }>;
}

export const ImportUploadDialog: React.FC<ImportUploadDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const [step, setStep] = useState<'upload' | 'validate' | 'confirm' | 'processing'>('upload');
  const [formData, setFormData] = useState({
    importName: '',
    importType: 'csv' as 'csv' | 'api' | 'manual' | 'scheduled',
    importCategory: '' as 'emissions' | 'financial' | 'operational' | 'compliance' | 'company_profiles',
    configurationId: '',
    notes: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<ValidationSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importId, setImportId] = useState<string | null>(null);

  const { 
    initiateImport, 
    validateData, 
    configurations, 
    downloadTemplate,
    isLoading 
  } = useDataImportAPI();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  const handleNext = async () => {
    try {
      setError(null);

      if (step === 'upload') {
        // Validate form data
        if (!formData.importName.trim()) {
          setError('Import name is required');
          return;
        }
        if (!formData.importCategory) {
          setError('Import category is required');
          return;
        }
        if (formData.importType === 'csv' && !selectedFile) {
          setError('Please select a file to upload');
          return;
        }

        // Move to validation step
        setStep('validate');
        
        // For CSV files, perform validation
        if (selectedFile && formData.importType === 'csv') {
          await performValidation();
        }
      } else if (step === 'validate') {
        setStep('confirm');
      } else if (step === 'confirm') {
        await performImport();
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
  };

  const performValidation = async () => {
    if (!selectedFile) return;

    try {
      // Parse CSV file for validation (simplified - in real implementation would be more robust)
      const text = await selectedFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0]?.split(',') || [];
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        const record: any = {};
        headers.forEach((header, index) => {
          record[header.trim()] = values[index]?.trim() || '';
        });
        return record;
      });

      // Get validation rules for category
      const validationRules = getValidationRulesForCategory(formData.importCategory);
      
      // Validate with backend
      const results = await validateData(data.slice(0, 100), validationRules, formData.importCategory);
      setValidationResults(results.summary);
    } catch (err: any) {
      setError(`Validation failed: ${err.message}`);
    }
  };

  const performImport = async () => {
    if (!selectedFile) return;

    try {
      setStep('processing');
      setUploadProgress(0);

      const result = await initiateImport({
        importName: formData.importName,
        importType: formData.importType,
        importCategory: formData.importCategory,
        configurationId: formData.configurationId || undefined,
        file: selectedFile,
        notes: formData.notes
      });

      setImportId(result.importId);
      
      // Simulate progress (in real implementation, would poll for actual progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            setTimeout(() => {
              onSuccess();
              handleClose();
            }, 1000);
            return 100;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

    } catch (err: any) {
      setError(`Import failed: ${err.message}`);
    }
  };

  const getValidationRulesForCategory = (category: string) => {
    const rules: Record<string, any> = {
      emissions: {
        company_name: { type: 'string', required: true },
        reporting_year: { type: 'number', required: true, min: 1990, max: new Date().getFullYear() },
        scope_1_emissions: { type: 'number', min: 0 },
        scope_2_emissions: { type: 'number', min: 0 },
        scope_3_emissions: { type: 'number', min: 0 }
      },
      company_profiles: {
        company_name: { type: 'string', required: true },
        industry: { type: 'string', required: true },
        sector: { type: 'string' },
        headquarters_location: { type: 'string' },
        market_cap_usd: { type: 'number', min: 0 }
      },
      financial: {
        company_name: { type: 'string', required: true },
        revenue_usd: { type: 'number', min: 0 },
        reporting_year: { type: 'number', required: true }
      },
      operational: {
        company_name: { type: 'string', required: true },
        energy_consumption: { type: 'number', min: 0 },
        renewable_energy_percentage: { type: 'number', min: 0, max: 100 }
      },
      compliance: {
        company_name: { type: 'string', required: true },
        framework: { type: 'string', required: true },
        compliance_status: { type: 'string', required: true }
      }
    };

    return rules[category] || {};
  };

  const handleClose = () => {
    setStep('upload');
    setFormData({
      importName: '',
      importType: 'csv',
      importCategory: '' as any,
      configurationId: '',
      notes: ''
    });
    setSelectedFile(null);
    setUploadProgress(0);
    setValidationResults(null);
    setError(null);
    setImportId(null);
    onOpenChange(false);
  };

  const handleDownloadTemplate = async () => {
    try {
      await downloadTemplate(formData.importCategory);
    } catch (err: any) {
      setError(`Failed to download template: ${err.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'upload' && 'New Data Import'}
            {step === 'validate' && 'Validate Import Data'}
            {step === 'confirm' && 'Confirm Import'}
            {step === 'processing' && 'Processing Import'}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'upload' && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="importName">Import Name</Label>
                <Input
                  id="importName"
                  placeholder="e.g., Q4 2024 Emissions Data"
                  value={formData.importName}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    importName: e.target.value 
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="importType">Import Type</Label>
                <Select 
                  value={formData.importType} 
                  onValueChange={(value: any) => setFormData(prev => ({ 
                    ...prev, 
                    importType: value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV File</SelectItem>
                    <SelectItem value="manual">Manual Entry</SelectItem>
                    <SelectItem value="api">API Import</SelectItem>
                    <SelectItem value="scheduled">Scheduled Import</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="importCategory">Data Category</Label>
                <Select 
                  value={formData.importCategory} 
                  onValueChange={(value: any) => setFormData(prev => ({ 
                    ...prev, 
                    importCategory: value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emissions">Emissions Data</SelectItem>
                    <SelectItem value="company_profiles">Company Profiles</SelectItem>
                    <SelectItem value="financial">Financial Data</SelectItem>
                    <SelectItem value="operational">Operational Data</SelectItem>
                    <SelectItem value="compliance">Compliance Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="configurationId">Configuration Template</Label>
                <Select 
                  value={formData.configurationId} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    configurationId: value 
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Optional - Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {configurations?.map((config: any) => (
                      <SelectItem key={config.id} value={config.id}>
                        {config.configName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.importType === 'csv' && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Upload File</Label>
                    {formData.importCategory && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleDownloadTemplate}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Template
                      </Button>
                    )}
                  </div>
                  
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      isDragActive 
                        ? 'border-primary bg-primary/10' 
                        : 'border-muted-foreground/25 hover:border-primary/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    {selectedFile ? (
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Drop your CSV file here, or click to browse</p>
                        <p className="text-sm text-muted-foreground">
                          Supports CSV, Excel files up to 100MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this import..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  notes: e.target.value 
                }))}
              />
            </div>
          </div>
        )}

        {step === 'validate' && validationResults && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Validation Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{validationResults.totalRecords}</div>
                    <div className="text-sm text-muted-foreground">Total Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{validationResults.validRecords}</div>
                    <div className="text-sm text-muted-foreground">Valid Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{validationResults.invalidRecords}</div>
                    <div className="text-sm text-muted-foreground">Invalid Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{validationResults.totalWarnings}</div>
                    <div className="text-sm text-muted-foreground">Warnings</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {validationResults.sampleErrors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    Sample Issues ({validationResults.sampleErrors.length} of {validationResults.totalErrors})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {validationResults.sampleErrors.map((error, index) => (
                      <div key={index} className="border rounded p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant={error.severity === 'error' ? 'destructive' : 'secondary'}>
                                {error.severity}
                              </Badge>
                              <span className="font-medium">{error.field}</span>
                              {error.rowNumber && (
                                <span className="text-sm text-muted-foreground">
                                  Row {error.rowNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-sm">{error.message}</p>
                            {error.suggestedFix && (
                              <p className="text-sm text-blue-600 mt-1">
                                💡 {error.suggestedFix}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {step === 'confirm' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Confirm Import Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Import Name</Label>
                    <p>{formData.importName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="capitalize">{formData.importCategory.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">File</Label>
                    <p>{selectedFile?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">File Size</Label>
                    <p>{selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'N/A'}</p>
                  </div>
                </div>
                {validationResults && (
                  <div>
                    <Label className="text-sm font-medium">Expected Results</Label>
                    <p>{validationResults.validRecords} valid records will be imported</p>
                    {validationResults.invalidRecords > 0 && (
                      <p className="text-yellow-600">
                        {validationResults.invalidRecords} invalid records will be skipped
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'processing' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Processing Import
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {uploadProgress < 50 && 'Uploading file...'}
                  {uploadProgress >= 50 && uploadProgress < 80 && 'Validating data...'}
                  {uploadProgress >= 80 && uploadProgress < 100 && 'Processing records...'}
                  {uploadProgress >= 100 && 'Import completed successfully!'}
                </p>
                {importId && (
                  <p className="text-sm">
                    Import ID: <code className="bg-muted px-2 py-1 rounded">{importId}</code>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleClose}>
            {step === 'processing' && uploadProgress < 100 ? 'Cancel' : 'Close'}
          </Button>
          
          <div className="flex gap-2">
            {step !== 'upload' && step !== 'processing' && (
              <Button variant="outline" onClick={() => setStep('upload')}>
                Back
              </Button>
            )}
            {step !== 'processing' && (
              <Button 
                onClick={handleNext}
                disabled={isLoading}
              >
                {step === 'upload' && 'Next'}
                {step === 'validate' && 'Continue'}
                {step === 'confirm' && 'Start Import'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};