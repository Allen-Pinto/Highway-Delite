import { Router } from 'express';
import {
  createBooking,
  getBookingByReference,
  cancelBooking,
} from '../controllers/booking.controller';
import { validate } from '../middleware/validator';
import { createBookingSchema } from '../validators/schemas';

const router = Router();

// All booking routes are PUBLIC (no auth required)

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Public
router.post('/', validate(createBookingSchema), createBooking);

// @route   GET /api/bookings/:referenceId?email=xxx
// @desc    Get booking by reference ID and email
// @access  Public
router.get('/:referenceId', getBookingByReference);

// @route   PUT /api/bookings/:referenceId/cancel
// @desc    Cancel booking
// @access  Public
router.put('/:referenceId/cancel', cancelBooking);

export default router;