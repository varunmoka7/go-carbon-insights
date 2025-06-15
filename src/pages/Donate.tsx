
import React, { useState } from 'react';
import { Heart, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const Donate = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly' | 'annually'>('one-time');
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [designations, setDesignations] = useState<string[]>([]);
  const { toast } = useToast();

  const presetAmounts = [25, 100, 200, 500];

  const designationOptions = [
    'Support carbon reduction initiatives',
    'Research and development',
    'Educational programs',
    'General fund'
  ];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleDesignationChange = (designation: string, checked: boolean) => {
    if (checked) {
      setDesignations([...designations, designation]);
    } else {
      setDesignations(designations.filter(d => d !== designation));
    }
  };

  const getCurrentAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount);
    return 0;
  };

  const handleDonate = () => {
    const amount = getCurrentAmount();
    if (amount <= 0) {
      toast({
        title: "Please select an amount",
        description: "Please choose a donation amount to continue.",
        variant: "destructive"
      });
      return;
    }

    // Mock success for now
    toast({
      title: "Thank you for your support!",
      description: `Your ${frequency} donation of $${amount} will help accelerate global decarbonization efforts.`,
    });
  };

  const getFrequencyLabel = () => {
    switch (frequency) {
      case 'monthly': return '/month';
      case 'annually': return '/year';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Heart className="h-8 w-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Support Our Mission
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Help us accelerate global supply chain decarbonization and make climate transparency accessible to everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Donation Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Choose Your Contribution
              </CardTitle>
              <CardDescription>
                Every contribution helps companies reduce their carbon footprint
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preset Amounts */}
              <div>
                <Label className="text-base font-medium">Select Amount</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                  {presetAmounts.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? "default" : "outline"}
                      className={`h-16 text-lg font-semibold ${
                        selectedAmount === amount 
                          ? 'bg-teal-600 hover:bg-teal-700 text-white' 
                          : 'hover:bg-teal-50 hover:border-teal-300'
                      }`}
                      onClick={() => handleAmountSelect(amount)}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <Label htmlFor="custom-amount" className="text-base font-medium">
                  Custom Amount
                </Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="pl-8"
                    min="1"
                  />
                </div>
              </div>

              {/* Frequency Toggle */}
              <div>
                <Label className="text-base font-medium">Donation Frequency</Label>
                <div className="flex gap-2 mt-2">
                  {[
                    { key: 'one-time', label: 'One Time' },
                    { key: 'monthly', label: 'Monthly' },
                    { key: 'annually', label: 'Annually' }
                  ].map(({ key, label }) => (
                    <Button
                      key={key}
                      variant={frequency === key ? "default" : "outline"}
                      size="sm"
                      className={frequency === key ? 'bg-teal-600 hover:bg-teal-700' : ''}
                      onClick={() => setFrequency(key as typeof frequency)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Designation Options */}
          <Card>
            <CardHeader>
              <CardTitle>Designate Your Donation</CardTitle>
              <CardDescription>
                Choose how you'd like your contribution to be used (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {designationOptions.map((option) => (
                <div key={option} className="flex items-center space-x-3">
                  <Checkbox
                    id={option}
                    checked={designations.includes(option)}
                    onCheckedChange={(checked) => 
                      handleDesignationChange(option, checked === true)
                    }
                  />
                  <Label htmlFor={option} className="text-sm font-medium leading-none">
                    {option}
                  </Label>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Comment Section */}
          <Card>
            <CardHeader>
              <CardTitle>Leave a Message</CardTitle>
              <CardDescription>
                Share why you're supporting our mission (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Your message of support..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>

          {/* Anonymous Option */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked === true)}
                />
                <Label htmlFor="anonymous" className="text-sm font-medium">
                  Make this an anonymous donation
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Donation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-semibold">
                    ${getCurrentAmount() || '0'}{getFrequencyLabel()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Frequency:</span>
                  <span className="font-semibold capitalize">{frequency.replace('-', ' ')}</span>
                </div>
                {designations.length > 0 && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Designation:</span>
                    <ul className="text-sm mt-1 space-y-1">
                      {designations.map((designation) => (
                        <li key={designation} className="text-gray-800 dark:text-gray-200">
                          • {designation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="border-t pt-4">
                <Button 
                  onClick={handleDonate}
                  className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-semibold py-3"
                  size="lg"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Donate Now
                </Button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Your contribution supports carbon reduction initiatives and climate transparency efforts worldwide.
              </div>
            </CardContent>
          </Card>

          {/* Impact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Impact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-teal-600">$25</strong> helps track 10 companies' emissions
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-teal-600">$100</strong> supports educational program development
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong className="text-teal-600">$500</strong> funds research for new reduction strategies
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Donate;
