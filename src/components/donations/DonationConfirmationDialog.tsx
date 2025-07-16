
import React from 'react';
import { CheckCircle, Download, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DonationRecord } from '@/types/donation';

interface DonationConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  donation: DonationRecord | null;
  onViewHistory: () => void;
}

const DonationConfirmationDialog = ({
  open,
  onOpenChange,
  donation,
  onViewHistory,
}: DonationConfirmationDialogProps) => {
  if (!donation) return null;

  const getFrequencyLabel = () => {
    switch (donation.frequency) {
      case 'monthly': return 'Monthly';
      case 'annually': return 'Annual';
      default: return 'One-time';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Thank You for Your Support!
          </DialogTitle>
          <DialogDescription className="text-center">
            Your donation will help accelerate global decarbonization efforts.
          </DialogDescription>
        </DialogHeader>

        <Card className="mt-4">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
              <span className="font-semibold">${donation.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
              <span className="font-semibold">{getFrequencyLabel()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Donation ID:</span>
              <span className="font-mono text-xs">{donation.id.slice(-8)}</span>
            </div>
            {donation.designations.length > 0 && (
              <div className="pt-2 border-t">
                <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                  Designations:
                </span>
                <div className="space-y-1">
                  {donation.designations.map((designation) => (
                    <div key={designation} className="text-sm">
                      • {designation}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onViewHistory}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View History
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              // Mock download receipt functionality
              const receiptData = `
Donation Receipt - GoCarbonTracker
Donation ID: ${donation.id}
Amount: $${donation.amount}
Type: ${getFrequencyLabel()}
Date: ${new Date(donation.timestamp).toLocaleDateString()}
Thank you for supporting climate action!
              `.trim();
              
              const blob = new Blob([receiptData], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `receipt-${donation.id.slice(-8)}.txt`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="h-4 w-4 mr-2" />
            Receipt
          </Button>
        </div>

        <Button
          onClick={() => onOpenChange(false)}
          className="w-full mt-4 bg-teal-600 hover:bg-teal-700"
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DonationConfirmationDialog;
