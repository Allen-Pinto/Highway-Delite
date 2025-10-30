import { Router } from 'express';
import { validatePromoCode, getActivePromoCodes } from '../controllers/promo.controller';
import { validate } from '../middleware/validator';
import { validatePromoSchema } from '../validators/schemas';

const router = Router();

// @route   POST /api/promo/validate
// @desc    Validate promo code
// @access  Public (No auth required)
router.post('/validate', validate(validatePromoSchema), validatePromoCode);

// @route   GET /api/promo/active
// @desc    Get all active promo codes
// @access  Public
router.get('/active', getActivePromoCodes);

export default router;