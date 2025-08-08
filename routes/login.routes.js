// routes/auth.routes.js

import express from 'express';
import {
  login,
  requestPasswordReset,
  resetPassword,
  forgotPassword // If you want a separate alias
} from '../controllers/login.controller.js';
import { authenticate } from '../middleweare/auth.middleware.js';


const router = express.Router();

/**
 * @route   POST /login
 * @desc    Authenticate user and issue JWT
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /forgot-password
 * @desc    Send password reset email if account exists
 * @access  Public
 */
router.post('/forgot-password', requestPasswordReset);

/**
 * (Optional Alias) Same as /forgot-password but different route name
 * @route   POST /request-reset
 * @access  Public
 */
router.post('/request-reset', forgotPassword);

/**
 * @route   POST /reset-password
 * @desc    Verify reset token and update password
 * @access  Public
 */
router.post('/reset-password', resetPassword);

/**
 * @route   GET /profile
 * @desc    Example protected route, returns user info
 * @access  Protected
 */
router.get('/profile', authenticate, (req, res) => {
  res.json({
    message: 'Your profile data',
    userId: req.user.userId
  });
});

/**
 * @route   POST /logout
 * @desc    Logout user (server-side)
 * @access  Protected
 */ 
router.post("/logout", authenticate, (req, res) => {
    // JWT ko cookie se clear karo
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});


export default router;
