import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { Booking } from '../models/Booking';
import { generateIdempotencyKey } from '../utils/helpers';
import {
  createBookingService,
  cancelBookingService,
  canUserBook,
} from '../services/booking.service';

// @desc    Create a new booking (NO AUTH REQUIRED)
// @route   POST /api/bookings
// @access  Public
export const createBooking = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      experienceId,
      slotId,
      quantity,
      customerName,
      customerEmail,
      customerPhone,
      promoCode,
      idempotencyKey: providedKey,
    } = req.body;

    // Generate or use provided idempotency key
    const idempotencyKey = providedKey || generateIdempotencyKey(
      customerEmail,
      experienceId,
      slotId,
      Date.now()
    );

    // Check if customer can book
    const bookingCheck = await canUserBook(customerEmail, experienceId, slotId);
    if (!bookingCheck.canBook) {
      throw new AppError(400, bookingCheck.reason || 'Cannot create booking');
    }

    // Create booking using service
    const { booking } = await createBookingService({
      experienceId,
      slotId,
      quantity,
      customerName,
      customerEmail,
      customerPhone,
      promoCode,
      idempotencyKey,
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  }
);

// @desc    Get booking by reference ID and email
// @route   GET /api/bookings/:referenceId
// @access  Public
export const getBookingByReference = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { referenceId } = req.params;
    const { email } = req.query;

    if (!email) {
      throw new AppError(400, 'Email is required');
    }

    const booking = await Booking.findOne({
      referenceId: referenceId.toUpperCase(),
      customerEmail: email,
    })
      .populate('experience')
      .lean();

    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }

    res.json({
      success: true,
      data: booking,
    });
  }
);

// @desc    Cancel booking by reference ID and email
// @route   PUT /api/bookings/:referenceId/cancel
// @access  Public
export const cancelBooking = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { referenceId } = req.params;
    const { email } = req.body;

    if (!email) {
      throw new AppError(400, 'Email is required');
    }

    // Find booking first
    const booking = await Booking.findOne({
      referenceId: referenceId.toUpperCase(),
      customerEmail: email,
    });

    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }

    const { booking: cancelledBooking } = await cancelBookingService(
      (booking._id as mongoose.Types.ObjectId).toString(),
      email
    );

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: cancelledBooking,
    });
  }
);