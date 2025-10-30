import { Request, Response, NextFunction } from 'express';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { Experience } from '../models/Experience';
import { parsePagination } from '../utils/helpers';

// @desc    Get all experiences
// @route   GET /api/experiences
// @access  Public
export const getExperiences = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { category, location, search } = req.query;
    const { page, limit, skip } = parsePagination(
      req.query.page as string,
      req.query.limit as string
    );

    // Build filter
    const filter: any = { isActive: true };

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Get experiences with pagination
    const [experiences, total] = await Promise.all([
      Experience.find(filter)
        .select('-slots') // Don't send slots in list view
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Experience.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: experiences,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  }
);

// @desc    Get single experience by ID with slots
// @route   GET /api/experiences/:id
// @access  Public
export const getExperience = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const experience = await Experience.findById(id).lean();

    if (!experience) {
      throw new AppError(404, 'Experience not found');
    }

    if (!experience.isActive) {
      throw new AppError(404, 'Experience is not available');
    }

    // Filter out past slots and sort by date
    const now = new Date();
    const availableSlots = experience.slots
      .filter(slot => new Date(slot.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.json({
      success: true,
      data: {
        ...experience,
        slots: availableSlots,
      },
    });
  }
);

// @desc    Get available dates for an experience
// @route   GET /api/experiences/:id/available-dates
// @access  Public
export const getAvailableDates = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const experience = await Experience.findById(id).select('slots').lean();

    if (!experience) {
      throw new AppError(404, 'Experience not found');
    }

    // Get unique dates that have available spots
    const now = new Date();
    const availableDates = experience.slots
      .filter(slot => {
        const slotDate = new Date(slot.date);
        return slotDate >= now && slot.availableSpots > slot.bookedSpots;
      })
      .map(slot => slot.date.toISOString().split('T')[0]) // Get date only
      .filter((date, index, self) => self.indexOf(date) === index) // Unique dates
      .sort();

    res.json({
      success: true,
      data: availableDates,
    });
  }
);

// @desc    Get slots for a specific date
// @route   GET /api/experiences/:id/slots
// @access  Public
export const getSlotsByDate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      throw new AppError(400, 'Date query parameter is required');
    }

    const experience = await Experience.findById(id).select('slots').lean();

    if (!experience) {
      throw new AppError(404, 'Experience not found');
    }

    // Filter slots by date
    const requestedDate = new Date(date as string).toISOString().split('T')[0];
    const slots = experience.slots
      .filter(slot => {
        const slotDate = new Date(slot.date).toISOString().split('T')[0];
        return slotDate === requestedDate && slot.availableSpots > slot.bookedSpots;
      })
      .sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));

    res.json({
      success: true,
      data: slots,
    });
  }
);

// @desc    Check slot availability
// @route   GET /api/experiences/:experienceId/slots/:slotId/availability
// @access  Public
export const checkSlotAvailability = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { experienceId, slotId } = req.params;
    const quantity = parseInt(req.query.quantity as string) || 1;

    const experience = await Experience.findById(experienceId).lean();

    if (!experience) {
      throw new AppError(404, 'Experience not found');
    }

    const slot = experience.slots.find(s => s._id?.toString() === slotId);

    if (!slot) {
      throw new AppError(404, 'Slot not found');
    }

    // Check if slot is in the past
    if (new Date(slot.date) < new Date()) {
      return res.json({
        success: true,
        available: false,
        reason: 'Slot is in the past',
      });
    }

    const availableSpots = slot.availableSpots - slot.bookedSpots;

    return res.json({
      success: true,
      available: availableSpots >= quantity,
      availableSpots,
      requestedQuantity: quantity,
      slot: {
        id: slot._id,
        date: slot.date,
        timeSlot: slot.timeSlot,
        price: slot.price,
      },
    });
  }
);