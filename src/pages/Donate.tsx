
import React, { useState } from 'react';
import { Heart, DollarSign, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { DonationProvider, useDonation } from '@/contexts/DonationContext';
import { DonationService } from '@/services/donationService';
import { donationSchema } from '@/schemas/donationSchema';
import DonationConfirmationDialog from '@/components/donations/DonationConfirmationDialog';
import DonationHistory from '@/components/donations/DonationHistory';
import { DonationRecord } from '@/types/donation';

const DonateContent = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly' | 'annually'>('one-time');
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [designations, setDesignations] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedDonation, setConfirmedDonation] = useState<DonationRecord | null>(null);

  const { isSubmitting, setIsSubmitting } = useDonation();
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
    setErrors(prev => ({ ...prev, amount: '' }));
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
    setErrors(prev => ({ ...prev, amount: '' }));
  };

  const handleDesignationChange = (designation: string, checked: boolean) => {
    if (checked) {
      setDesignations([...designations, designation]);
    } else {
      setDesignations(designations.filter(d => d !== designation));
    }
    setErrors(prev => ({ ...prev, designations: '' }));
  };

  const getCurrentAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseFloat(customAmount);
    return 0;
  };

  const validateForm = () => {
    const formData = {
      amount: getCurrentAmount(),
      frequency,
      designations,
      comment,
      isAnonymous,
      donorName: isAnonymous ? '' : donorName,
      donorEmail: isAnonymous ? '' : donorEmail,
    };

    try {
      donationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error: any) {
      const newErrors: Record<string, string> = {};
      
      if (error.errors) {
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message;
        });
      }
      
      setErrors(newErrors);
      return false;
    }
  };

  const handleDonate = async () => {
    if (!validateForm()) {
      toast({
        title: "Please fix the errors below",
        description: "Check the highlighted fields and try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = {
        amount: getCurrentAmount(),
        frequency,
        designations,
        comment,
        isAnonymous,
        donorName: isAnonymous ? '' : donorName,
        donorEmail: isAnonymous ? '' : donorEmail,
      };

      const result = await DonationService.submitDonation(formData);

      if (result.success && result.donationId) {
        // Get the donation record for confirmation
        const donations = DonationService.getDonationHistory();
        const donation = donations.find(d => d.id === result.donationId);
        
        if (donation) {
          setConfirmedDonation(donation);
          setShowConfirmation(true);
          
          // Reset form
          setSelectedAmount(null);
          setCustomAmount('');
          setFrequency('one-time');
          setDesignations([]);
          setComment('');
          setIsAnonymous(false);
          setDonorName('');
          setDonorEmail('');
          setErrors({});
        }

        toast({
          title: "Thank you for your donation!",
          description: `Your ${frequency} donation of $${getCurrentAmount()} will help accelerate decarbonization efforts.`,
        });
      } else {
        toast({
          title: "Donation failed",
          description: result.error || "Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected error",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFrequencyLabel = () => {
    switch (frequency) {
      case 'monthly': return '/month';
      case 'annually': return '/year';
      default: return '';
    }
  };

  if (showHistory) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistory(false)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Donate
          </Button>
          <h1 className="text-2xl font-bold">Donation History</h1>
        </div>
        <DonationHistory />
      </div>
    );
  }

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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowHistory(true)}
          className="mt-4"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Donation History
        </Button>
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
                    className={`pl-8 ${errors.amount ? 'border-red-500' : ''}`}
                    min="1"
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
                )}
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
                Choose how you'd like your contribution to be used
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
              {errors.designations && (
                <p className="text-sm text-red-600">{errors.designations}</p>
              )}
            </CardContent>
          </Card>

          {/* Donor Information */}
          {!isAnonymous && (
            <Card>
              <CardHeader>
                <CardTitle>Donor Information</CardTitle>
                <CardDescription>
                  Your information for donation acknowledgment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="donor-name">Full Name</Label>
                  <Input
                    id="donor-name"
                    placeholder="Enter your full name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className={errors.donorName ? 'border-red-500' : ''}
                  />
                  {errors.donorName && (
                    <p className="text-sm text-red-600 mt-1">{errors.donorName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="donor-email">Email Address</Label>
                  <Input
                    id="donor-email"
                    type="email"
                    placeholder="Enter your email"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    className={errors.donorEmail ? 'border-red-500' : ''}
                  />
                  {errors.donorEmail && (
                    <p className="text-sm text-red-600 mt-1">{errors.donorEmail}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

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
                className={`min-h-[100px] ${errors.comment ? 'border-red-500' : ''}`}
                maxLength={500}
              />
              <div className="flex justify-between mt-2">
                {errors.comment && (
                  <p className="text-sm text-red-600">{errors.comment}</p>
                )}
                <p className="text-sm text-gray-500 ml-auto">
                  {comment.length}/500 characters
                </p>
              </div>
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
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-semibold py-3"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Donate Now
                    </>
                  )}
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

      {/* Confirmation Dialog */}
      <DonationConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        donation={confirmedDonation}
        onViewHistory={() => {
          setShowConfirmation(false);
          setShowHistory(true);
        }}
      />
    </div>
  );
};

const Donate = () => {
  return (
    <DonationProvider>
      <DonateContent />
    </DonationProvider>
  );
};

export default Donate;
