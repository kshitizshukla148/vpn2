
// Import dependencies
import bcrypt from 'bcryptjs';                   // For hashing & comparing passwords
import dotenv from 'dotenv';                     // To load environment variables from .env
import jwt from 'jsonwebtoken';                  // To generate and verify JSON Web Tokens (JWT)
import User from '../models/user.model.js';      // Mongoose User model
import { sendMail } from '../models/emailTemplates.model.js'; // Function to send templated emails

// Load .env variables into process.env
dotenv.config();

// Secrets and URLs from environment
const JWT_SECRET        = process.env.JWT_SECRET        || 'default_jwt_secret';
// Secret for password reset tokens (use a different, strong secret)
const JWT_RESET_SECRET  = process.env.JWT_RESET_SECRET  || 'default_reset_secret';
// Frontend base URL for reset link construction
const FRONTEND_URL      = process.env.FRONTEND_URL      || 'http://localhost:4000';

/**
 * ==================================
 * 1) LOGIN CONTROLLER
 * ==================================
 * POST /login
 * Body: { email, password }
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input presence
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    // 1. Look up user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal whether email or password was wrong
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // 2. Compare submitted password with stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials.' });
    }

    // 3. Generate JWT for authenticated session
    //    Payload includes userId; tokens expire in 7 days
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Return token and basic user info
    return res.status(200).json({
      token,
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
        role:     user.role           // e.g., 'admin' or 'user'
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}

/**
 * ==================================
 * 2) REQUEST PASSWORD RESET
 * ==================================
 * POST /forgot-password
 * Body: { email }
 */
function isValidEmail(email) {
  // Simple regex to check basic email format; you can use a library for more robust validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;

    // Validate email presence and format
    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }

    // Generic response to avoid revealing if email is registered
    const genericResponse = {
      message: 'If that email is registered, you will receive a reset link shortly.'
    };

    // 1. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Always return 200 with generic message
      return res.status(200).json(genericResponse);
    }

    // 2. Create a one-time JWT for password reset, expires in 1 hour
    const resetToken = jwt.sign(
      { userId: user._id },
      JWT_RESET_SECRET,
      { expiresIn: '1h' }
    );

    // 3. Store token and expiry on user document
    user.resetPasswordToken   = resetToken;
    user.resetPasswordExpires = Date.now() + 3600_000; // 1 hour in ms
    await user.save();

    // 4. Prepare email variables for the templating engine
    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    const variables = {
      full_name:           user.name || 'User',        // Placeholder fallback
      reset_password_link: resetLink,
      email:               user.email
    };

    // 5. Send the "reset_password" template email
    await sendMail({
      to:           user.email,
      templateType: 'reset_password',
      variables
    });

    // 6. Return generic response
    return res.status(200).json(genericResponse);

  } catch (err) {
    console.error('requestPasswordReset error:', err);
    return res.status(500).json({ error: 'Unable to process request.' });
  }
}

/**
 * ==================================
 * 3) RESET PASSWORD
 * ==================================
 * POST /reset-password
 * Body: { token, newPassword }
 */
export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    // Validate presence of token and new password
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    // 1. Verify token and extract payload
    const payload = jwt.verify(token, JWT_RESET_SECRET);

    // 2. Find user by ID, matching token and expiry
    const user = await User.findOne({
      _id:                  payload.userId,
      resetPasswordToken:   token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    // 3. Hash the new password and clear reset fields
    user.password_hash         = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken    = undefined;
    user.resetPasswordExpires  = undefined;
    await user.save();

    // 4. Respond success
    return res.json({ message: 'Password has been reset successfully.' });

  } catch (err) {
    console.error('resetPassword error:', err);
    // If token verification fails, jwt.verify will throw
    return res.status(400).json({ error: err.message });
  }
}
