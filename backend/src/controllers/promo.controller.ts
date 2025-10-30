import { Request, Response, NextFunction } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { PromoCode } from '../models/PromoCode';
import { Booking } from '../models/Booking';
import { calculateDiscount } from '../utils/helpers';

// @desc    Validate promo code (NO AUTH REQUIRED)
// @route   POST /api/promo/validate
// @access  Public
export const validatePromoCode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, subtotal, experienceCategory, customerEmail } = req.body;

    // Find promo code
    const promo = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!promo) {
      throw new AppError(404, 'Invalid promo code');
    }

    // Check validity dates
    const now = new Date();
    if (now < promo.validFrom) {
      throw new AppError(400, 'Promo code not yet valid');
    }

    if (now > promo.validUntil) {
      throw new AppError(400, 'Promo code has expired');
    }

    // Check usage limit
    if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
      throw new AppError(400, 'Promo code usage limit reached');
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
      experienceCategory &&
      !promo.applicableCategories.includes(experienceCategory)
    ) {
      throw new AppError(400, 'Promo code not applicable for this experience category');
    }

    // Check first-time user restriction (by email if provided)
    if (promo.firstTimeUserOnly && customerEmail) {
      const previousBookingsCount = await Booking.countDocuments({
        customerEmail: customerEmail,
        status: { $ne: 'cancelled' },
      });

      if (previousBookingsCount > 0) {
        throw new AppError(400, 'This promo code is only valid for first-time users');
      }
    }

    // Calculate discount
    const discountAmount = calculateDiscount(
      subtotal,
      promo.discountType,
      promo.discountValue,
      promo.maxDiscount
    );

    const finalAmount = subtotal - discountAmount;

    res.json({
      success: true,
      message: 'Promo code is valid',
      data: {
        code: promo.code,
        discountType: promo.discountType,
        discountValue: promo.discountValue,
        discountAmount,
        subtotal,
        finalAmount,
        maxDiscount: promo.maxDiscount,
        description:
          promo.discountType === 'percentage'
            ? `${promo.discountValue}% off`
            : `₹${promo.discountValue} off`,
      },
    });
  }
);

// @desc    Get all active promo codes (public info only)
// @route   GET /api/promo/active
// @access  Public
export const getActivePromoCodes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const now = new Date();

    const promoCodes = await PromoCode.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now },
      $or: [
        { usageLimit: { $exists: false } },
        { $expr: { $lt: ['$usedCount', '$usageLimit'] } },
      ],
    })
      .select('code discountType discountValue minOrderValue validUntil firstTimeUserOnly')
      .lean();

    // Format response
    const formattedPromoCodes = promoCodes.map(promo => ({
      code: promo.code,
      description:
        promo.discountType === 'percentage'
          ? `Get ${promo.discountValue}% off`
          : `Get ₹${promo.discountValue} off`,
      minOrderValue: promo.minOrderValue,
      validUntil: promo.validUntil,
      firstTimeUserOnly: promo.firstTimeUserOnly,
    }));

    res.json({
      success: true,
      data: formattedPromoCodes,
    });
  }
);