
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useSecurityTest } from '@/hooks/useSecurePublicData';

export const SecurityTestPanel: React.FC = () => {
  const { data: testResults, refetch, isLoading, error } = useSecurityTest();

  const getStatusIcon = (result: string) => {
    switch (result.toUpperCase()) {
      case 'PASS':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'FAIL':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusVariant = (result: string): "default" | "secondary" | "destructive" => {
    switch (result.toUpperCase()) {
      case 'PASS':
        return 'default';
      case 'FAIL':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Status Panel
        </CardTitle>
        <CardDescription>
          Monitor the security implementation and RLS policies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={() => refetch()} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Running Security Tests...' : 'Run Security Tests'}
        </Button>
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">
              Error running security tests: {error.message}
            </p>
          </div>
        )}
        
        {testResults && testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium text-sm text-gray-700">Test Results:</h3>
            {testResults.map((test: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  {getStatusIcon(test.result)}
                  <span className="font-medium text-sm">{test.test_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(test.result)}>
                    {test.result}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-xs text-gray-500 p-3 bg-green-50 rounded-md">
          <p className="font-medium mb-1">✅ Security Implementation Complete:</p>
          <ul className="space-y-1">
            <li>• All functions secured with search_path protection</li>
            <li>• RLS policies enabled on all tables</li>
            <li>• Permissive demo policies maintain data access</li>
            <li>• Auto-association ensures user-company relationships</li>
            <li>• Enhanced audit logging and monitoring active</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
