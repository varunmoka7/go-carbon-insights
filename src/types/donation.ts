
export interface DonationRecord {
  id: string;
  amount: number;
  frequency: 'one-time' | 'monthly' | 'annually';
  designations: string[];
  comment?: string;
  isAnonymous: boolean;
  donorName?: string;
  donorEmail?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface DonationFormData {
  amount: number;
  frequency: 'one-time' | 'monthly' | 'annually';
  designations: string[];
  comment: string;
  isAnonymous: boolean;
  donorName: string;
  donorEmail: string;
}

export interface DonationSubmissionResult {
  success: boolean;
  donationId?: string;
  error?: string;
}
