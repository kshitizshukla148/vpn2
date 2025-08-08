// controllers/auth.controller.js
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { sendMail } from '../models/emailTemplates.model.js';
import db from '../config/firebase.admin.js';
import { validatePassword } from '../middleweare/validate.password.js';
import { hashPassword } from '../middleweare/hash.password.js';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  Timestamp
} from 'firebase/firestore';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';
const JWT_RESET_SECRET = process.env.JWT_RESET_SECRET || 'default_reset_secret';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4000';

// 🔹 Helper: Fetch user by email
async function findUserByEmail(email) {
  const usersRef = collection(db, 'ji_users');
  const q = query(usersRef, where('email', '==', email.toLowerCase()));
  const snapshot = await getDocs(q);
  return snapshot.empty ? null : snapshot.docs[0];
}

// 🔹 Helper: Generate reset token
function generateResetToken(userId) {
  return jwt.sign({ userId }, JWT_RESET_SECRET, { expiresIn: '1h' });
}

// ==================================
// 1) LOGIN
// ==================================
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const userDoc = await findUserByEmail(email);
    if (!userDoc) return res.status(400).json({ error: 'Invalid credentials.' });

    const user = userDoc.data();
    const isMatch = await validatePassword(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

    const token = jwt.sign({ userId: userDoc.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      token,
      user: {
        id: userDoc.id,
        email: user.email,
        role: user.role || 'student',
        name: user.name || ''
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ==================================
// 2) REQUEST PASSWORD RESET
// ==================================
export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Valid email is required.' });
    }

    const userDoc = await findUserByEmail(email);
    if (!userDoc) {
      return res.status(200).json({ message: 'Email is not registered' });
    }

    const resetToken = generateResetToken(userDoc.id);
    const userRef = doc(db, 'ji_users', userDoc.id);

    await updateDoc(userRef, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: Timestamp.fromDate(new Date(Date.now() + 3600_000))
    });

    const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
    const user = userDoc.data();

    await sendMail({
      to: user.email,
      templateType: 'reset_password',
      variables: {
        full_name: user.name || 'User',
        reset_password_link: resetLink,
        email: user.email
      }
    });

    return res.status(200).json({ message: 'Reset password links has been sent to your registered email' });

  } catch (err) {
    console.error('requestPasswordReset error:', err);
    return res.status(500).json({ error: 'Unable to process request.' });
  }
}

// ==================================
// 3) RESET PASSWORD
// ==================================
export async function resetPassword(req, res) {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required.' });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_RESET_SECRET);
    } catch (err) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    const q = query(collection(db, 'ji_users'), where('__name__', '==', payload.userId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (
      user.resetPasswordToken !== token ||
      (user.resetPasswordExpires?.toMillis?.() || 0) < Date.now()
    ) {
      return res.status(400).json({ error: 'Token has expired or is invalid.' });
    }

    const hashed = await hashPassword(newPassword);
    const userRef = doc(db, 'ji_users', payload.userId);

    await updateDoc(userRef, {
      password_hash: hashed,
      resetPasswordToken: null,
      resetPasswordExpires: null,
      updatedAt: Timestamp.now()
    });

    return res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    console.error('resetPassword error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ==================================
// 4) FORGOT PASSWORD (Alias)
// ==================================
export const forgotPassword = requestPasswordReset;
