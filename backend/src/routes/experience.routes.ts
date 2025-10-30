import { Router } from 'express';
import {
  getExperiences,
  getExperience,
  getAvailableDates,
  getSlotsByDate,
  checkSlotAvailability,
} from '../controllers/experience.controller';
import { validate } from '../middleware/validator';
import {
  listExperiencesSchema,
  getExperienceSchema,
  checkSlotAvailabilitySchema,
} from '../validators/schemas';

const router = Router();

// @route   GET /api/experiences
// @desc    Get all experiences
// @access  Public
router.get('/', validate(listExperiencesSchema), getExperiences);

// @route   GET /api/experiences/:id
// @desc    Get single experience by ID
// @access  Public
router.get('/:id', validate(getExperienceSchema), getExperience);

// @route   GET /api/experiences/:id/available-dates
// @desc    Get available dates for experience
// @access  Public
router.get('/:id/available-dates', validate(getExperienceSchema), getAvailableDates);

// @route   GET /api/experiences/:id/slots
// @desc    Get slots for a specific date
// @access  Public
router.get('/:id/slots', validate(getExperienceSchema), getSlotsByDate);

// @route   GET /api/experiences/:experienceId/slots/:slotId/availability
// @desc    Check slot availability
// @access  Public
router.get(
  '/:experienceId/slots/:slotId/availability',
  validate(checkSlotAvailabilitySchema),
  checkSlotAvailability
);

export default router;