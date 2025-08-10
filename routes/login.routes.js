// routes/login.routes.js
import express from 'express';
import {
  login,
  requestPasswordReset,
  resetPassword,
  forgotPassword
} from '../controllers/login.controller.js';
import { authenticate } from '../middleweare/auth.middleware.js';

const router = express.Router();

/**
 * @route POST /api/auth/login
 */
router.post('/login', login);

/**
 * @route POST /api/auth/forgot-password
 */
router.post('/forgot-password', requestPasswordReset);

/**
 * Optional alias
 */
router.post('/request-reset', forgotPassword);

/**
 * @route POST /api/auth/reset-password
 */
router.post('/reset-password', resetPassword);

/**
 * @route GET /api/auth/profile
 */
router.get('/profile', authenticate, (req, res) => {
  res.json({ message: 'Your profile data', userId: req.user.userId });
});

/**
 * @route POST /api/auth/logout
 */
router.post('/logout', authenticate, (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

export default router;
