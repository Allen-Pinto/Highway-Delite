import mongoose from 'mongoose';
import { Booking, IBooking } from '../models/Booking';
import { Experience, IExperience } from '../models/Experience';
import { PromoCode } from '../models/PromoCode';
import { AppError } from '../middleware/errorHandler';
import {
  generateBookingReference,
  calculateDiscount,
  calculateGST,
} from '../utils/helpers';
import { sendBookingConfirmation, sendCancellationEmail } from './email.service';

interface CreateBookingData {
  experienceId: string;
  slotId: string;
  quantity: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  promoCode?: string;
  idempotencyKey?: string;
}

interface BookingResult {
  booking: IBooking;
  experience: IExperience;
}

/**
 * Create a new booking with transaction safety
 */
export const createBookingService = async (
  data: CreateBookingData
): Promise<BookingResult> => {
  const {
    experienceId,
    slotId,
    quantity,
    customerName,
    customerEmail,
    customerPhone,
    promoCode,
    idempotencyKey,
  } = data;

  // Check for duplicate booking with idempotency key
  if (idempotencyKey) {
    const existingBooking = await Booking.findOne({ idempotencyKey })
      .populate('experience')
      .lean();
    
    if (existingBooking) {
      // Type assertion to handle populated experience
      const booking = existingBooking as unknown as IBooking;
      const experience = (existingBooking as any).experience as IExperience;
      
      return { booking, experience };
    }
  }

  // Start MongoDB transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Get and lock experience for update
    const experience = await Experience.findById(experienceId).session(session);

    if (!experience || !experience.isActive) {
      throw new AppError(404, 'Experience not found or not available');
    }

    // Find the specific slot
    const slot = experience.slots.find(s => s._id?.toString() === slotId);

    if (!slot) {
      throw new AppError(404, 'Slot not found');
    }

    // Validate slot is in the future
    if (new Date(slot.date) < new Date()) {
      throw new AppError(400, 'Cannot book slots in the past');
    }

    // Check slot availability
    const availableSpots = slot.availableSpots - slot.bookedSpots;
    if (availableSpots < quantity) {
      throw new AppError(
        400,
        `Only ${availableSpots} spot${availableSpots !== 1 ? 's' : ''} available`
      );
    }

    // Calculate base pricing
    let subtotal = slot.price * quantity;
    let discount = 0;
    let appliedPromoCode: string | null = null;

    // Apply promo code if provided
    if (promoCode) {
      const promoResult = await applyPromoCode(
        promoCode,
        subtotal,
        experience.category,
        customerEmail,
        session
      );

      discount = promoResult.discountAmount;
      appliedPromoCode = promoResult.code;
    }

    // Calculate GST (on amount after discount)
    const taxableAmount = subtotal - discount;
    const gst = calculateGST(taxableAmount);
    
    const total = taxableAmount + gst.total;

    // Update slot booked count
    slot.bookedSpots += quantity;
    await experience.save({ session });

    // Create booking
    const bookings = await Booking.create(
      [
        {
          experience: experienceId,
          slotId: slot._id,
          bookingDate: slot.date,
          timeSlot: slot.timeSlot,
          quantity,
          customerName,
          customerEmail,
          customerPhone,
          subtotal,
          cgst: gst.cgst,
          sgst: gst.sgst,
          totalTax: gst.total,
          discount,
          total,
          promoCode: appliedPromoCode,
          referenceId: generateBookingReference(),
          idempotencyKey,
          status: 'confirmed',
          paymentStatus: 'paid',
        },
      ],
      { session }
    );

    // Increment total bookings counter
    experience.totalBookings = (experience.totalBookings || 0) + 1;
    await experience.save({ session });

    // Commit transaction
    await session.commitTransaction();

    const booking = bookings[0];

    // Send confirmation email (async, don't block)
    sendBookingConfirmation(booking, experience).catch(err =>
      console.error('Email notification failed:', err)
    );

    return { booking, experience };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Apply and validate promo code
 */
const applyPromoCode = async (
  code: string,
  subtotal: number,
  experienceCategory: string,
  customerEmail: string,
  session: mongoose.ClientSession
): Promise<{ discountAmount: number; code: string }> => {
  const promo = await PromoCode.findOne({
    code: code.toUpperCase(),
    isActive: true,
  }).session(session);

  if (!promo) {
    throw new AppError(400, 'Invalid promo code');
  }

  // Validate promo code timing
  const now = new Date();
  if (now < promo.validFrom) {
    throw new AppError(400, 'Promo code is not yet valid');
  }

  if (now > promo.validUntil) {
    throw new AppError(400, 'Promo code has expired');
  }

  // Check usage limit
  if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
    throw new AppError(400, 'Promo code usage limit has been reached');
  }

  // Check minimum order value
  if (promo.minOrderValue && subtotal < promo.minOrderValue) {
    throw new AppError(
      400,
      `Minimum order value of ₹${promo.minOrderValue} required for this promo code`
    );
  }

  // Check category restriction
  if (
    promo.applicableCategories &&
    promo.applicableCategories.length > 0 &&
    !promo.applicableCategories.includes(experienceCategory)
  ) {
    throw new AppError(
      400,
      'This promo code is not applicable for this experience category'
    );
  }

  // Check first-time user restriction (by email)
  if (promo.firstTimeUserOnly) {
    const previousBookingsCount = await Booking.countDocuments({
      customerEmail: customerEmail,
      status: { $ne: 'cancelled' },
    }).session(session);

    if (previousBookingsCount > 0) {
      throw new AppError(
        400,
        'This promo code is only valid for first-time users'
      );
    }
  }

  // Calculate discount
  const discountAmount = calculateDiscount(
    subtotal,
    promo.discountType,
    promo.discountValue,
    promo.maxDiscount
  );

  // Increment usage count
  promo.usedCount += 1;
  await promo.save({ session });

  return {
    discountAmount,
    code: promo.code,
  };
};

/**
 * Cancel a booking with transaction safety
 */
export const cancelBookingService = async (
  bookingId: string,
  customerEmail: string
): Promise<{ booking: IBooking; experience: IExperience | null }> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find booking by ID and email
    const booking = await Booking.findOne({
      _id: bookingId,
      customerEmail: customerEmail,
    }).session(session);

    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }

    // Validate booking status
    if (booking.status === 'cancelled') {
      throw new AppError(400, 'Booking is already cancelled');
    }

    if (booking.status === 'completed') {
      throw new AppError(400, 'Cannot cancel a completed booking');
    }

    // Check if booking date has passed
    if (new Date(booking.bookingDate) < new Date()) {
      throw new AppError(400, 'Cannot cancel past bookings');
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save({ session });

    // Release the slot
    const experience = await Experience.findById(booking.experience).session(session);
    
    if (experience) {
      const slot = experience.slots.find(
        s => s._id?.toString() === booking.slotId.toString()
      );

      if (slot) {
        slot.bookedSpots = Math.max(0, slot.bookedSpots - booking.quantity);
        await experience.save({ session });
      }
    }

    await session.commitTransaction();

    // Send cancellation email (async)
    if (experience) {
      sendCancellationEmail(booking, experience).catch(err =>
        console.error('Email notification failed:', err)
      );
    }

    return { booking, experience };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Check if user can book (by email)
 */
export const canUserBook = async (
  customerEmail: string,
  experienceId: string,
  slotId: string
): Promise<{ canBook: boolean; reason?: string }> => {
  // Check if email already booked this exact slot
  const existingBooking = await Booking.findOne({
    customerEmail: customerEmail,
    experience: experienceId,
    slotId: slotId,
    status: { $ne: 'cancelled' },
  });

  if (existingBooking) {
    return {
      canBook: false,
      reason: 'You have already booked this time slot',
    };
  }

  return { canBook: true };
};