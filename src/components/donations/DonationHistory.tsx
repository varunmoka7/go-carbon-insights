
import React, { useState, useEffect } from 'react';
import { History, Calendar, DollarSign, Target, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DonationService } from '@/services/donationService';
import { DonationRecord } from '@/types/donation';
import { useToast } from '@/hooks/use-toast';

const DonationHistory = () => {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonations: 0,
    recurringDonations: 0,
    lastDonationDate: null as string | null,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDonationData();
  }, []);

  const loadDonationData = () => {
    const history = DonationService.getDonationHistory();
    const donationStats = DonationService.getDonationStats();
    setDonations(history);
    setStats(donationStats);
  };

  const clearHistory = () => {
    DonationService.clearDonationHistory();
    setDonations([]);
    setStats({
      totalAmount: 0,
      totalDonations: 0,
      recurringDonations: 0,
      lastDonationDate: null,
    });
    toast({
      title: "History cleared",
      description: "All donation history has been removed.",
    });
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'monthly': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'annually': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  if (donations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No donations yet. Your donation history will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <DollarSign className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Donated</p>
                <p className="text-2xl font-bold">${stats.totalAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Donations</p>
                <p className="text-2xl font-bold">{stats.totalDonations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Recurring</p>
                <p className="text-2xl font-bold">{stats.recurringDonations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Donation List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Donation History
            </CardTitle>
            <CardDescription>
              Your contribution history (demo data stored locally)
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={clearHistory}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-lg">${donation.amount}</span>
                    <Badge className={getFrequencyColor(donation.frequency)}>
                      {donation.frequency.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {donation.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p>
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {new Date(donation.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    
                    {donation.designations.length > 0 && (
                      <p className="text-xs">
                        <strong>Designations:</strong> {donation.designations.join(', ')}
                      </p>
                    )}
                    
                    {donation.comment && (
                      <p className="text-xs italic">
                        <strong>Note:</strong> {donation.comment}
                      </p>
                    )}
                    
                    <p className="text-xs">
                      ID: <span className="font-mono">{donation.id.slice(-8)}</span>
                      {donation.isAnonymous && (
                        <span className="ml-2 text-gray-500">(Anonymous)</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationHistory;
