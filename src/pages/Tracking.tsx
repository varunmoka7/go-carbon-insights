
import React, { useState } from 'react';
import { Plus, BarChart3, Calculator, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Tracking = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('manual');
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    amount: '',
    unit: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Emission Entry Added",
      description: "Your emission data has been successfully recorded.",
    });
    setFormData({ date: '', category: '', amount: '', unit: '', description: '' });
  };

  const quickActions = [
    {
      title: 'Calculate Electricity',
      description: 'Enter your electricity consumption',
      icon: BarChart3,
      action: () => setActiveTab('electricity')
    },
    {
      title: 'Vehicle Emissions',
      description: 'Track fuel consumption and travel',
      icon: Calculator,
      action: () => setActiveTab('vehicle')
    },
    {
      title: 'Import Data',
      description: 'Upload CSV or Excel files',
      icon: Upload,
      action: () => setActiveTab('import')
    }
  ];

  const categories = [
    { value: 'electricity', label: 'Electricity Consumption' },
    { value: 'fuel', label: 'Fuel Combustion' },
    { value: 'vehicle', label: 'Vehicle Transport' },
    { value: 'waste', label: 'Waste Management' },
    { value: 'travel', label: 'Business Travel' },
    { value: 'other', label: 'Other' }
  ];

  const units = [
    { value: 'kwh', label: 'kWh' },
    { value: 'liters', label: 'Liters' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'km', label: 'Kilometers' },
    { value: 'miles', label: 'Miles' },
    { value: 'tons', label: 'Tons' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Emissions Tracking</h1>
        <p className="text-lg text-gray-600">Record and monitor your carbon emissions across all sources</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={action.action}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <action.icon className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Data Entry Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add Emission Entry</span>
              </CardTitle>
              <CardDescription>Record new emission data for tracking and analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                    <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>{unit.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Add additional details..."
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700">
                  Add Entry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Entries</span>
                <span className="font-semibold">24</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated CO2e</span>
                <span className="font-semibold text-red-600">1,245 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">vs Last Month</span>
                <span className="font-semibold text-green-600">-12%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { date: '2024-01-15', category: 'Electricity', amount: '1,250 kWh' },
                { date: '2024-01-14', category: 'Vehicle', amount: '45 L' },
                { date: '2024-01-13', category: 'Travel', amount: '350 km' }
              ].map((entry, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="font-medium text-sm">{entry.category}</div>
                    <div className="text-xs text-gray-500">{entry.date}</div>
                  </div>
                  <div className="text-sm font-medium">{entry.amount}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Record data regularly for accurate tracking</p>
                <p>• Use consistent units for better analysis</p>
                <p>• Include detailed descriptions for complex entries</p>
                <p>• Set up monthly goals to track progress</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tracking;
