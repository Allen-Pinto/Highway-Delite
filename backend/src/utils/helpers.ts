import { customAlphabet } from 'nanoid';

// Generate unique booking reference ID
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 8);

export const generateBookingReference = (): string => {
  return `BK${nanoid()}`;
};

// Calculate discount amount
export const calculateDiscount = (
  subtotal: number,
  discountType: 'percentage' | 'flat',
  discountValue: number,
  maxDiscount?: number
): number => {
  let discount = 0;

  if (discountType === 'percentage') {
    discount = (subtotal * discountValue) / 100;
    if (maxDiscount && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else {
    discount = discountValue;
  }

  // Ensure discount doesn't exceed subtotal
  return Math.min(discount, subtotal);
};

// Calculate Indian GST (CGST 9% + SGST 9% = 18% total)
export const calculateGST = (amount: number): { cgst: number; sgst: number; total: number } => {
  const cgst = Math.round((amount * 9) / 100);  // Central GST 9%
  const sgst = Math.round((amount * 9) / 100);  // State GST 9%
  const total = cgst + sgst;                     // Total 18%
  
  return { cgst, sgst, total };
};

// Legacy tax calculation (kept for compatibility)
export const calculateTax = (amount: number, taxRate: number = 18): number => {
  return Math.round((amount * taxRate) / 100);
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

// Validate date is in future
export const isFutureDate = (date: Date): boolean => {
  return new Date(date) > new Date();
};

// Check if date is within range
export const isDateInRange = (
  date: Date,
  startDate: Date,
  endDate: Date
): boolean => {
  const checkDate = new Date(date);
  return checkDate >= startDate && checkDate <= endDate;
};

// Generate idempotency key from request
export const generateIdempotencyKey = (
  userId: string,
  experienceId: string,
  slotId: string,
  timestamp: number
): string => {
  return `${userId}-${experienceId}-${slotId}-${timestamp}`;
};

// Sleep utility for testing
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Parse pagination params
export const parsePagination = (
  page?: string,
  limit?: string
): { page: number; limit: number; skip: number } => {
  const pageNum = Math.max(1, parseInt(page || '1', 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit || '100', 10)));
  const skip = (pageNum - 1) * limitNum;

  return { page: pageNum, limit: limitNum, skip };
};

// Sanitize user input
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};