// routes/auth.routes.js

import express from 'express';
import { login, requestPasswordReset, resetPassword } from '../controllers/login.controller.js';
import { authenticate } from '../middleweare/auth.middleware.js';

const router = express.Router();

/**
 * @route   POST /login
 * @desc    Authenticate user and issue JWT
 * @access  Public
 */
router.post(
  '/login',
  login
);

/** 
 * @route   POST /register
 * @desc    Register a new user
 * @access  Public
  */
 
// Protected profile endpoint
router.get('/profile', authenticate, (req, res) => {
  res.json({
    message: 'Your profile data',
    userId:  req.user.userId
  });
});

/**
 * @route   POST /forgot-password
 * @desc    Send password-reset email if account exists
 * @access  Public
 */
router.post(
  '/forgot-password',
  requestPasswordReset
);

/**
 * @route   POST /reset-password
 * @desc    Verify reset token and update to new password
 * @access  Public
 */
router.post(
  '/reset-password',
  resetPassword
);

/**
 * @route   GET /profile
 * @desc    Example protected route, returns user info
 * @access  Protected
 */
router.get(
  '/profile',
  authenticate,       // 1) Verify JWT, attach req.user
  (req, res) => {
    // 2) After authenticate, req.user exists
    res.json({
      message: 'Your profile data',
      userId:  req.user.userId
    });
  }
);

export default router;
