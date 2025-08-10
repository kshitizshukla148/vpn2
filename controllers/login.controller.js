import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { sendMail } from "../models/emailTemplates.model.js";
import db from "../config/firebase.admin.js"; // admin.firestore() instance exported
import admin from "firebase-admin"; // for Timestamp
import { validatePassword } from "../middleweare/validate.password.js";
import { hashPassword } from "../middleweare/hash.password.js";
import { asyncHandler, AppError } from "../middleweare/error.middleware.js";

dotenv.config();

// ---- enforce required env vars ----
if (!process.env.JWT_SECRET) {
  throw new Error("Missing environment variable: JWT_SECRET");
}
if (!process.env.JWT_RESET_SECRET) {
  throw new Error("Missing environment variable: JWT_RESET_SECRET");
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:4000";
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Helper: Fetch user by email (returns DocumentSnapshot or null)
async function findUserByEmail(email) {
  const emailLower = String(email).toLowerCase();
  const usersRef = db.collection("ji_users");
  const q = usersRef.where("email", "==", emailLower);
  const snapshot = await q.get();
  return snapshot.empty ? null : snapshot.docs[0]; // DocumentSnapshot
}

// Helper: Generate reset token (short lived)
function generateResetToken(userId) {
  const jti = Math.random().toString(36).slice(2);
  return jwt.sign({ userId, jti }, JWT_RESET_SECRET, { expiresIn: "1h" });
}

// ==================================
// 1) LOGIN
// ==================================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email and password are required.", 400, true);
  }

  const userDoc = await findUserByEmail(email);
  if (!userDoc) throw new AppError("Invalid credentials.", 400, true);

  const user = userDoc.data();

  // validatePassword should compare plain password with stored hash
  const isMatch = await validatePassword(password, user.password_hash);
  if (!isMatch) throw new AppError("Invalid credentials.", 400, true);

  const token = jwt.sign(
    { userId: userDoc.id, role: user.role || "student" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Set HttpOnly cookie (optional but recommended)
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
  });

  return res.status(200).json({
    success: true,
    token,
    user: {
      id: userDoc.id,
      email: user.email,
      role: user.role || "student",
      name: user.name || "",
    },
  });
});

// ==================================
// 2) REQUEST PASSWORD RESET
// ==================================
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new AppError("Valid email is required.", 400, true);
  }

  const userDoc = await findUserByEmail(email);
  if (!userDoc) {
    // Do not reveal existence — return generic success
    return res
      .status(200)
      .json({ success: true, message: "If an account exists, a reset link has been sent." });
  }

  const resetToken = generateResetToken(userDoc.id);
  const userRef = db.collection("ji_users").doc(userDoc.id);

  // Save token and expiry in user's doc (so we can validate later)
  await userRef.set(
    {
      resetPasswordToken: resetToken,
      resetPasswordExpires: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 3600_000)
      ), // 1 hour
    },
    { merge: true }
  );

  const resetLink = `${FRONTEND_URL}/reset-password?token=${encodeURIComponent(resetToken)}`;
  const user = userDoc.data();

  // sendMail should handle templating and errors internally
  await sendMail({
    to: user.email,
    templateType: "reset_password",
    variables: {
      full_name: user.name || "User",
      reset_password_link: resetLink,
      email: user.email,
    },
  });

  return res
    .status(200)
    .json({ success: true, message: "If an account exists, a reset link has been sent." });
});

// ==================================
// 3) RESET PASSWORD
// ==================================
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new AppError("Token and new password are required.", 400, true);
  }
  // Verify token signature and expiry
  let payload;
  try {
    payload = jwt.verify(token, JWT_RESET_SECRET);
  } catch (err) {
    throw new AppError("Invalid or expired token.", 400, true);
  }

  // Fetch user by id (doc)
  const userRef = db.collection("ji_users").doc(payload.userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    throw new AppError("Invalid or expired token.", 400, true);
  }

  const user = userSnap.data();

  // Validate token stored & expiry
  const storedToken = user.resetPasswordToken;
  const storedExpiry = user.resetPasswordExpires; // Firestore Timestamp
  const expiryMillis = storedExpiry && storedExpiry.toMillis ? storedExpiry.toMillis() : 0;

  if (!storedToken || storedToken !== token || expiryMillis < Date.now()) {
    throw new AppError("Token has expired or is invalid.", 400, true);
  }

  // Validate password strength via your existing middleware function if desired
  // e.g., if (!validatePasswordStrength(newPassword)) throw new AppError(...)

  // Hash new password and update
  const hashed = await hashPassword(newPassword);

  await userRef.set(
    {
      password_hash: hashed,
      resetPasswordToken: admin.firestore.FieldValue.delete(),
      resetPasswordExpires: admin.firestore.FieldValue.delete(),
      updatedAt: admin.firestore.Timestamp.now(),
    },
    { merge: true }
  );

  return res.json({ success: true, message: "Password has been reset successfully." });
});

// ==================================
// 4) FORGOT PASSWORD (Alias)
// ==================================
export const forgotPassword = requestPasswordReset;
