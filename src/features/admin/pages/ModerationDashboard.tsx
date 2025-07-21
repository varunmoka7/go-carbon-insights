
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

export const ModerationDashboard = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Moderation Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Monitor and moderate community content
        </p>
      </div>

      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-amber-800 dark:text-amber-200">
            Community Platform Integration Required
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            The moderation dashboard requires the community platform to be fully integrated. 
            This feature will be available once the forum infrastructure is implemented.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
            <Shield className="w-4 h-4" />
            <span>Coming Soon - Content Moderation</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
