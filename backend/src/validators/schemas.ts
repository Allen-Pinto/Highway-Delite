import { z } from 'zod';

// Experience Validators
export const getExperienceSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Experience ID is required'),
  }),
});

export const listExperiencesSchema = z.object({
  query: z.object({
    category: z.string().optional(),
    location: z.string().optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
    search: z.string().optional(),
  }),
});

// Booking Validators
export const createBookingSchema = z.object({
  body: z.object({
    experienceId: z.string().min(1, 'Experience ID is required'),
    slotId: z.string().min(1, 'Slot ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Maximum 10 people per booking'),
    customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
    customerEmail: z.string().email('Invalid email address'),
    customerPhone: z.string().min(10, 'Phone number must be at least 10 digits').max(15),
    promoCode: z.string().optional(),
    idempotencyKey: z.string().optional(),
  }),
});

export const getBookingSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
});

export const cancelBookingSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
});

export const listUserBookingsSchema = z.object({
  query: z.object({
    status: z.enum(['confirmed', 'cancelled', 'completed']).optional(),
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

// Promo Code Validators
export const validatePromoSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Promo code is required').toUpperCase(),
    subtotal: z.number().positive('Subtotal must be positive'),
    experienceCategory: z.string().optional(),
    customerEmail: z.string().email().optional(),
  }),
});

// Slot Validators
export const checkSlotAvailabilitySchema = z.object({
  params: z.object({
    experienceId: z.string().min(1, 'Experience ID is required'),
    slotId: z.string().min(1, 'Slot ID is required'),
  }),
  query: z.object({
    quantity: z.string().optional(),
  }),
});