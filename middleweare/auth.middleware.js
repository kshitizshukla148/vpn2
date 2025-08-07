// middleware/auth.middleware.js

import dotenv from 'dotenv'; // Load .env variables
import jwt from 'jsonwebtoken'; // For verifying JWTs

dotenv.config();                  // Initialize dotenv

// Use a strong secret from .env, with a fallback
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

/**
 * Authentication middleware.
 * 
 * - Checks for `Authorization: Bearer <token>` header
 * - Verifies the token
 * - Attaches decoded payload to `req.user`
 * - Calls next() if valid, else returns 401
 */
export function authenticate(req, res, next) {
  // 1 Retrieve the Authorization header (or empty string)
  const authHeader = req.headers.authorization || '';

  // 2️ Extract token if header starts with "Bearer "
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7) // Remove "Bearer " prefix
    : null;

  // 3️ If no token present, reject access
  if (!token) {
    return res
      .status(401)
      .json({ error: 'Access denied. No token provided.' });
  }

  try {
    // 4️ Verify token signature and expiry
    const payload = jwt.verify(token, JWT_SECRET);

    // 5️ Attach payload (e.g., { userId, iat, exp }) to request
    req.user = payload;

    // 6️ Token valid → proceed to next middleware/handler
    next();

  } catch (err) {
    // 7️ Token invalid or expired
    return res
      .status(401)
      .json({ error: 'Invalid or expired token.' });
  }
}
