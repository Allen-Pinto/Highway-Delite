/**
 * Format currency in Indian Rupees
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Get Tailwind CSS classes for experience categories
 */
export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    adventure: 'bg-red-100 text-red-800',
    cultural: 'bg-blue-100 text-blue-800',
    nature: 'bg-green-100 text-green-800',
    food: 'bg-yellow-100 text-yellow-800',
    wellness: 'bg-purple-100 text-purple-800',
    kayaking: 'bg-blue-100 text-blue-800',
    sunrise: 'bg-orange-100 text-orange-800',
    trail: 'bg-green-100 text-green-800',
    camping: 'bg-amber-100 text-amber-800',
    trekking: 'bg-green-100 text-green-800',
  };
  return colors[category] || 'bg-gray-100 text-gray-800';
};

/**
 * Format date to long format (e.g., "Monday, January 1, 2024")
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date to short format (e.g., "Jan 1")
 */
export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date for display in cards (e.g., "Mon, Jan 1")
 */
export const formatDateCard = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Calculate GST (9% CGST + 9% SGST = 18% total)
 */
export const calculateGST = (amount: number) => {
  const cgst = Math.round(amount * 0.09);
  const sgst = Math.round(amount * 0.09);
  return {
    cgst,
    sgst,
    total: cgst + sgst,
  };
};

/**
 * Generate unique idempotency key for payments (BACKEND-COMPATIBLE)
 */
export const generateIdempotencyKey = (
  email: string,
  experienceId: string,
  slotId: string,
  timestamp: number
): string => {
  return `booking_${email}_${experienceId}_${slotId}_${timestamp}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Indian phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Format phone number for display
 */
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned}`;
  }
  return phone;
};

/**
 * Get initial from name for avatars
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
};

/**
 * Debounce function for search inputs
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => func(...args), wait);
  };
};

/**
 * Generate random reference ID for bookings (BACKEND-COMPATIBLE)
 */
export const generateReferenceId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'HD';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Calculate discount amount based on promo type (BACKEND-COMPATIBLE)
 */
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
    discount = Math.min(discountValue, subtotal);
  }
  
  return Math.round(discount);
};

/**
 * Get experience rating color
 */
export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-yellow-600';
  if (rating >= 3.0) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Format duration for display
 */
export const formatDuration = (duration: string): string => {
  return duration.charAt(0).toUpperCase() + duration.slice(1);
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (dateString: string): boolean => {
  return new Date(dateString) > new Date();
};

/**
 * Get days between two dates
 */
export const getDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\b\w/g, char => char.toUpperCase());
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

/**
 * Generate random color for avatars
 */
export const getRandomColor = (): string => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Sort experiences by various criteria
 */
export const sortExperiences = (experiences: any[], sortBy: string) => {
  const sorted = [...experiences];
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.basePrice - b.basePrice);
    case 'price-high':
      return sorted.sort((a, b) => b.basePrice - a.basePrice);
    case 'rating':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case 'name':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
};

/**
 * Filter experiences based on criteria
 */
export const filterExperiences = (experiences: any[], filters: any) => {
  return experiences.filter(exp => {
    if (filters.category && exp.category !== filters.category) return false;
    if (filters.maxPrice && exp.basePrice > filters.maxPrice) return false;
    if (filters.location && !exp.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.search && !exp.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
};

/**
 * Get time slot display text
 */
export const formatTimeSlot = (timeSlot: string): string => {
  return timeSlot;
};

/**
 * Check if slot is available
 */
export const isSlotAvailable = (slot: any, quantity: number = 1): boolean => {
  return (slot.availableSpots - slot.bookedSpots) >= quantity;
};

/**
 * Get available spots for a slot
 */
export const getAvailableSpots = (slot: any): number => {
  return slot.availableSpots - slot.bookedSpots;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate random number in range
 */
export const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Sanitize input text
 */
export const sanitizeInput = (text: string): string => {
  return text.replace(/[<>]/g, '').trim();
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj: any): boolean => {
  return Object.keys(obj).length === 0;
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get query parameter from URL
 */
export const getQueryParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

/**
 * Set query parameter in URL
 */
export const setQueryParam = (param: string, value: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.set(param, value);
  window.history.pushState({}, '', url.toString());
};

/**
 * Remove query parameter from URL
 */
export const removeQueryParam = (param: string): void => {
  const url = new URL(window.location.href);
  url.searchParams.delete(param);
  window.history.pushState({}, '', url.toString());
};