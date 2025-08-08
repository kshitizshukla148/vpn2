// middleware/auth.middleware.js
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("❌ ERROR: JWT_SECRET not set in environment variables");
  process.exit(1); // Stop server if no secret
}

// Example: You can keep a blacklist in memory (for logout)
const tokenBlacklist = new Set();

export function blacklistToken(token) {
  tokenBlacklist.add(token);
}

/**
 * Middleware: Verify JWT and authorize user
 */
export function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. Token missing." });
    }

    const token = authHeader.split(" ")[1];

    // If token is in blacklist, block request
    if (tokenBlacklist.has(token)) {
      return res.status(401).json({ error: "Token has been logged out." });
    }

    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Attach user payload to request
    req.user = payload;

    // Pass to next middleware
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid token." });
  }
}
