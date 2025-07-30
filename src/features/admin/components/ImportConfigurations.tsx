import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../../components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { 
  Settings, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { ImportConfiguration, useDataImportAPI } from '../hooks/useDataImportAPI';

interface ImportConfigurationsProps {
  configurations: ImportConfiguration[];
  onRefresh: () => void;
}

export const ImportConfigurations: React.FC<ImportConfigurationsProps> = ({
  configurations,
  onRefresh
}) => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<ImportConfiguration | null>(null);
  const [formData, setFormData] = useState({
    configName: '',
    importType: 'csv' as 'csv' | 'api' | 'manual' | 'scheduled',
    importCategory: '' as 'emissions' | 'financial' | 'operational' | 'compliance' | 'company_profiles',
    description: '',
    schemaDefinition: '{}',
    fieldMappings: '{}',
    validationRules: '{}',
    transformationRules: '{}',
    defaultSettings: '{}'
  });
  const [error, setError] = useState<string | null>(null);

  const { createConfiguration, isLoading } = useDataImportAPI();

  const handleCreateConfiguration = async () => {
    try {
      setError(null);

      // Validate required fields
      if (!formData.configName.trim()) {
        setError('Configuration name is required');
        return;
      }
      if (!formData.importCategory) {
        setError('Import category is required');
        return;
      }

      // Validate JSON fields
      try {
        JSON.parse(formData.schemaDefinition);
        JSON.parse(formData.fieldMappings || '{}');
        JSON.parse(formData.validationRules || '{}');
        JSON.parse(formData.transformationRules || '{}');
        JSON.parse(formData.defaultSettings || '{}');
      } catch (err) {
        setError('Invalid JSON in configuration fields');
        return;
      }

      await createConfiguration({
        configName: formData.configName,
        importType: formData.importType,
        importCategory: formData.importCategory,
        schemaDefinition: JSON.parse(formData.schemaDefinition),
        fieldMappings: formData.fieldMappings ? JSON.parse(formData.fieldMappings) : undefined,
        validationRules: formData.validationRules ? JSON.parse(formData.validationRules) : undefined,
        transformationRules: formData.transformationRules ? JSON.parse(formData.transformationRules) : undefined,
        defaultSettings: formData.defaultSettings ? JSON.parse(formData.defaultSettings) : undefined,
        isActive: true
      });

      // Reset form and close dialog
      setFormData({
        configName: '',
        importType: 'csv',
        importCategory: '' as any,
        description: '',
        schemaDefinition: '{}',
        fieldMappings: '{}',
        validationRules: '{}',
        transformationRules: '{}',
        defaultSettings: '{}'
      });
      setShowCreateDialog(false);
      onRefresh();
    } catch (err: any) {
      setError(err.message || 'Failed to create configuration');
    }
  };

  const getDefaultSchemaForCategory = (category: string) => {
    const schemas = {
      emissions: {
        company_name: { type: 'string', required: true },
        reporting_year: { type: 'number', required: true, min: 1990, max: new Date().getFullYear() },
        scope_1_emissions: { type: 'number', min: 0 },
        scope_2_emissions: { type: 'number', min: 0 },
        scope_3_emissions: { type: 'number', min: 0 },
        data_source: { type: 'string' },
        verification_status: { type: 'enum', enum: ['unverified', 'self_verified', 'third_party_verified'] }
      },
      company_profiles: {
        company_name: { type: 'string', required: true },
        industry: { type: 'string', required: true },
        sector: { type: 'string' },
        headquarters_location: { type: 'string' },
        market_cap_usd: { type: 'number', min: 0 },
        employees_count: { type: 'number', min: 0 },
        has_science_based_targets: { type: 'boolean' }
      },
      financial: {
        company_name: { type: 'string', required: true },
        revenue_usd: { type: 'number', min: 0 },
        reporting_year: { type: 'number', required: true },
        profit_margin: { type: 'number' },
        ebitda: { type: 'number' }
      },
      operational: {
        company_name: { type: 'string', required: true },
        energy_consumption: { type: 'number', min: 0 },
        renewable_energy_percentage: { type: 'number', min: 0, max: 100 },
        water_usage: { type: 'number', min: 0 },
        waste_generated: { type: 'number', min: 0 }
      },
      compliance: {
        company_name: { type: 'string', required: true },
        framework: { type: 'string', required: true },
        compliance_status: { type: 'string', required: true },
        reporting_date: { type: 'date' },
        compliance_score: { type: 'number', min: 0, max: 100 }
      }
    };

    return JSON.stringify(schemas[category as keyof typeof schemas] || {}, null, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Import Configurations
          </CardTitle>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Configuration
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Import Configuration</DialogTitle>
              </DialogHeader>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="configName">Configuration Name</Label>
                    <Input
                      id="configName"
                      placeholder="e.g., Standard Emissions Import"
                      value={formData.configName}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        configName: e.target.value 
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
                        <SelectItem value="api">API Import</SelectItem>
                        <SelectItem value="manual">Manual Entry</SelectItem>
                        <SelectItem value="scheduled">Scheduled Import</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="importCategory">Data Category</Label>
                    <Select 
                      value={formData.importCategory} 
                      onValueChange={(value: any) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          importCategory: value,
                          schemaDefinition: getDefaultSchemaForCategory(value)
                        }));
                      }}
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this configuration..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      description: e.target.value 
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schemaDefinition">Schema Definition (JSON)</Label>
                  <Textarea
                    id="schemaDefinition"
                    placeholder='{"field_name": {"type": "string", "required": true}}'
                    value={formData.schemaDefinition}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      schemaDefinition: e.target.value 
                    }))}
                    className="font-mono text-sm"
                    rows={8}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="validationRules">Validation Rules (JSON)</Label>
                    <Textarea
                      id="validationRules"
                      placeholder='{"business_rules": {}}'
                      value={formData.validationRules}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        validationRules: e.target.value 
                      }))}
                      className="font-mono text-sm"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transformationRules">Transformation Rules (JSON)</Label>
                    <Textarea
                      id="transformationRules"
                      placeholder='{"field_transforms": {}}'
                      value={formData.transformationRules}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        transformationRules: e.target.value 
                      }))}
                      className="font-mono text-sm"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-6">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateConfiguration} disabled={isLoading}>
                  Create Configuration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {configurations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium">No configurations found</p>
            <p className="text-sm">Create your first import configuration to get started</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configurations.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{config.configName}</div>
                        <div className="text-sm text-muted-foreground">
                          {Object.keys(config.schemaDefinition).length} fields defined
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {config.importType}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {config.importCategory.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant={config.isActive ? 'default' : 'secondary'}
                        className="flex items-center gap-1 w-fit"
                      >
                        {config.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(config.createdAt)}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="flex items-center gap-2"
                            onClick={() => setSelectedConfig(config)}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Copy className="h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="flex items-center gap-2 text-red-600"
                            onClick={() => {
                              // Handle delete configuration
                              console.log('Delete configuration:', config.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Configuration Details Dialog */}
        <Dialog open={!!selectedConfig} onOpenChange={() => setSelectedConfig(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configuration Details</DialogTitle>
            </DialogHeader>
            
            {selectedConfig && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <p>{selectedConfig.configName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Type</Label>
                    <p className="capitalize">{selectedConfig.importType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <p className="capitalize">{selectedConfig.importCategory.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge variant={selectedConfig.isActive ? 'default' : 'secondary'}>
                      {selectedConfig.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Schema Definition</Label>
                  <pre className="mt-2 p-4 bg-muted rounded text-sm overflow-x-auto">
                    {JSON.stringify(selectedConfig.schemaDefinition, null, 2)}
                  </pre>
                </div>

                {selectedConfig.validationRules && Object.keys(selectedConfig.validationRules).length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Validation Rules</Label>
                    <pre className="mt-2 p-4 bg-muted rounded text-sm overflow-x-auto">
                      {JSON.stringify(selectedConfig.validationRules, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedConfig.transformationRules && Object.keys(selectedConfig.transformationRules).length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">Transformation Rules</Label>
                    <pre className="mt-2 p-4 bg-muted rounded text-sm overflow-x-auto">
                      {JSON.stringify(selectedConfig.transformationRules, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelectedConfig(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};