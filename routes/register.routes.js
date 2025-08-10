// routes/register.routes.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import {
  requestRegistrationOTP,
  registerUserWithOTP
} from '../controllers/register.controller.js';

const router = express.Router();

/**
 * POST /request-otp
 * Body: { email, captchaToken }
 */
router.post(
  '/request-otp',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('captchaToken').notEmpty().withMessage('CAPTCHA token is required')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    return requestRegistrationOTP(req, res);
  }
);

/**
 * POST /register
 * Body: { email, password, otp, name?, dob?, mobile? }
 */
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('otp').notEmpty().withMessage('OTP is required'),
    body('name').optional().trim().escape(),
    body('dob').optional().isISO8601().toDate(),
    body('mobile').optional().isMobilePhone()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    return registerUserWithOTP(req, res);
  }
);

export default router;
