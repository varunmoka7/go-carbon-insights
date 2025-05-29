
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { FrameworkStatus } from '@/data/enhancedMockData';

interface FrameworksStatusProps {
  frameworks: FrameworkStatus;
}

const FrameworksStatus: React.FC<FrameworksStatusProps> = ({ frameworks }) => {
  const frameworkLabels = {
    SBTI: 'Science Based Targets',
    CSRD: 'Corporate Sustainability Reporting Directive',
    CDP: 'Carbon Disclosure Project',
    UNGC: 'UN Global Compact',
    SDG: 'UN Sustainable Development Goals'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Frameworks & Standards</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(frameworks).map(([key, status]) => (
          <div key={key} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              {status ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{key}</div>
              <div className="text-xs text-gray-500 truncate">
                {frameworkLabels[key as keyof FrameworkStatus]}
              </div>
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              status 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {status ? 'Yes' : 'No'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrameworksStatus;
