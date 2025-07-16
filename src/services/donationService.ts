
import { DonationRecord, DonationFormData, DonationSubmissionResult } from '@/types/donation';

const DONATIONS_STORAGE_KEY = 'gocarbontracker_donations';
const DONATION_STATS_KEY = 'gocarbontracker_donation_stats';

// Simulate network delay and occasional failures for testing
const simulateNetworkCall = async (): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  // 5% failure rate for testing error handling
  return Math.random() > 0.05;
};

export class DonationService {
  private static generateId(): string {
    return `donation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static async submitDonation(formData: DonationFormData): Promise<DonationSubmissionResult> {
    try {
      const success = await simulateNetworkCall();
      
      if (!success) {
        return {
          success: false,
          error: 'Network error occurred. Please try again.',
        };
      }

      const donationRecord: DonationRecord = {
        id: this.generateId(),
        amount: formData.amount,
        frequency: formData.frequency,
        designations: formData.designations,
        comment: formData.comment || undefined,
        isAnonymous: formData.isAnonymous,
        donorName: formData.isAnonymous ? undefined : formData.donorName,
        donorEmail: formData.isAnonymous ? undefined : formData.donorEmail,
        timestamp: new Date().toISOString(),
        status: 'completed',
      };

      // Store in localStorage
      const existingDonations = this.getDonationHistory();
      const updatedDonations = [donationRecord, ...existingDonations];
      localStorage.setItem(DONATIONS_STORAGE_KEY, JSON.stringify(updatedDonations));

      // Update donation statistics
      this.updateDonationStats(donationRecord);

      return {
        success: true,
        donationId: donationRecord.id,
      };
    } catch (error) {
      console.error('Donation submission error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
      };
    }
  }

  static getDonationHistory(): DonationRecord[] {
    try {
      const stored = localStorage.getItem(DONATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading donation history:', error);
      return [];
    }
  }

  static getDonationStats() {
    try {
      const stored = localStorage.getItem(DONATION_STATS_KEY);
      const defaultStats = {
        totalAmount: 0,
        totalDonations: 0,
        recurringDonations: 0,
        lastDonationDate: null,
      };
      return stored ? { ...defaultStats, ...JSON.parse(stored) } : defaultStats;
    } catch (error) {
      console.error('Error loading donation stats:', error);
      return {
        totalAmount: 0,
        totalDonations: 0,
        recurringDonations: 0,
        lastDonationDate: null,
      };
    }
  }

  private static updateDonationStats(donation: DonationRecord) {
    try {
      const currentStats = this.getDonationStats();
      const updatedStats = {
        totalAmount: currentStats.totalAmount + donation.amount,
        totalDonations: currentStats.totalDonations + 1,
        recurringDonations: donation.frequency !== 'one-time' 
          ? currentStats.recurringDonations + 1 
          : currentStats.recurringDonations,
        lastDonationDate: donation.timestamp,
      };
      localStorage.setItem(DONATION_STATS_KEY, JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Error updating donation stats:', error);
    }
  }

  static clearDonationHistory(): void {
    localStorage.removeItem(DONATIONS_STORAGE_KEY);
    localStorage.removeItem(DONATION_STATS_KEY);
  }
}
