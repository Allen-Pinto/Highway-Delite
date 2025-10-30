// Experience Types
export interface Experience {
  _id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  basePrice: number;
  image: string;
  duration: string;
  includedItems: string[];
  maxGroupSize: number;
  slots: Slot[];
  rating?: number;
  isActive: boolean;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

export interface Slot {
  _id: string;
  date: string;
  timeSlot: string;
  availableSpots: number;
  bookedSpots: number;
  price: number;
}

// Booking Types (matches your backend IBooking)
export interface Booking {
  _id: string;
  referenceId: string;
  experience: Experience | string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  timeSlot: string;
  quantity: number;
  subtotal: number;
  discount: number;
  cgst: number;
  sgst: number;
  total: number;
  promoCode?: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookingData {
  experienceId: string;
  slotId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  promoCode?: string;
  idempotencyKey: string;
}

// Promo Code Types (matches your backend response)
export interface PromoCode {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  discountAmount: number;
  subtotal: number;
  finalAmount: number;
  maxDiscount?: number;
  description: string;
  isValid: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}