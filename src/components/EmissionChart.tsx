
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface EmissionChartProps {
  data: any[];
  title: string;
  height?: number;
}

const EmissionChart = ({ data, title, height = 300 }: EmissionChartProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="year" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="scope1" 
            stroke="#dc2626" 
            strokeWidth={2}
            name="Scope 1"
            dot={{ fill: '#dc2626', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="scope2" 
            stroke="#ea580c" 
            strokeWidth={2}
            name="Scope 2"
            dot={{ fill: '#ea580c', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="scope3" 
            stroke="#0d9488" 
            strokeWidth={2}
            name="Scope 3"
            dot={{ fill: '#0d9488', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmissionChart;
