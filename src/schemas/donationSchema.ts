
import { z } from 'zod';

export const donationSchema = z.object({
  amount: z
    .number()
    .min(1, 'Amount must be at least $1')
    .max(100000, 'Amount cannot exceed $100,000')
    .positive('Amount must be positive'),
  
  frequency: z.enum(['one-time', 'monthly', 'annually'], {
    required_error: 'Please select a donation frequency',
  }),
  
  designations: z
    .array(z.string())
    .min(1, 'Please select at least one designation'),
  
  comment: z
    .string()
    .max(500, 'Comment cannot exceed 500 characters')
    .optional(),
  
  isAnonymous: z.boolean(),
  
  donorName: z
    .string()
    .min(1, 'Name is required for non-anonymous donations')
    .optional(),
  
  donorEmail: z
    .string()
    .email('Please enter a valid email address')
    .optional(),
}).refine((data) => {
  // If not anonymous, require name and email
  if (!data.isAnonymous) {
    return data.donorName && data.donorEmail;
  }
  return true;
}, {
  message: 'Name and email are required for non-anonymous donations',
  path: ['donorName'], // Show error on name field
});

export type DonationFormData = z.infer<typeof donationSchema>;
