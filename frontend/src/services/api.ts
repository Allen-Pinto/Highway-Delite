// services/api.ts
import axios from 'axios';
import type { CreateBookingData } from '../types/index';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Experience API - REAL ENDPOINTS
export const experienceApi = {
  // Get all experiences
  getAll: async (filters?: { category?: string; location?: string; search?: string }) => {
    const response = await apiClient.get('/experiences', { params: filters });
    return response.data;
  },

  // Get experience by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/experiences/${id}`);
    return response.data;
  },

  // Get available dates for experience
  getAvailableDates: async (id: string) => {
    const response = await apiClient.get(`/experiences/${id}/available-dates`);
    return response.data;
  },

  // Get slots by date
  getSlotsByDate: async (id: string, date: string) => {
    const response = await apiClient.get(`/experiences/${id}/slots`, {
      params: { date }
    });
    return response.data;
  },

  // Check slot availability
  checkAvailability: async (experienceId: string, slotId: string, quantity: number = 1) => {
    const response = await apiClient.get(
      `/experiences/${experienceId}/slots/${slotId}/availability`,
      { params: { quantity } }
    );
    return response.data;
  }
};

// Booking API - REAL ENDPOINTS
export const bookingApi = {
  // Create booking
  create: async (data: CreateBookingData) => {
    const response = await apiClient.post('/bookings', data);
    return response.data;
  },

  // Get booking by reference ID
  getByReference: async (referenceId: string, email: string) => {
    const response = await apiClient.get(`/bookings/${referenceId}`, {
      params: { email }
    });
    return response.data;
  },

  // Cancel booking
  cancel: async (referenceId: string, email: string) => {
    const response = await apiClient.put(`/bookings/${referenceId}/cancel`, {
      email
    });
    return response.data;
  }
};

// Promo Code API - REAL ENDPOINTS
export const promoApi = {
  // Validate promo code
  validate: async (code: string, subtotal: number, category?: string, email?: string) => {
    const response = await apiClient.post('/promo/validate', {
      code,
      subtotal,
      experienceCategory: category,
      customerEmail: email
    });
    return response.data;
  },

  // Get active promo codes
  getActive: async () => {
    const response = await apiClient.get('/promo/active');
    return response.data;
  }
};

// Legacy function for compatibility
export const fetchExperiences = async (filters = {}) => {
  return experienceApi.getAll(filters);
};

// Error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default apiClient;