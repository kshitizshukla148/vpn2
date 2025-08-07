// routes/register.route.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import { registerUser } from '../controllers/register.controller.js';

const router = express.Router();

/**
 * @route   POST /api/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  // Validate and sanitize incoming request fields
  [
    body('email')           // Email must be valid
      .isEmail().withMessage('Must be a valid email')
      .normalizeEmail(),
    body('password')        // Password length requirement
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name')            // Optional name field
      .optional().trim().escape(),
    body('dob')             // Optional date of birth in ISO format
      .optional().isISO8601().toDate(),
    body('mobile')          // Optional mobile phone validation
      .optional().isMobilePhone()
  ],
  async (req, res, next) => {
    // Check validation result
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return 400 with array of errors
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    // Proceed to controller logic
    return registerUser(req, res, next);
  }
);

export default router;
