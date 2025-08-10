// controllers/register.controller.js
import { otpGenerator, addMinutesToDate, saveOTP } from '../helpers/otp.service.js';
import { verifyCloudflareCaptcha } from '../helpers/captcha.service.js';
import { sendOTPEmail } from '../helpers/email.service.js';
import { findUserByEmail } from '../models/user.model.js';
import { collection, query, where, getDocs, Timestamp, doc, deleteDoc } from 'firebase/firestore';
import { registerUser } from '../models/user.service.js';
import db from '../config/firebase.admin.js';

/**
 * POST /request-otp
 * Step 1: Request OTP for registration
 */
export async function requestRegistrationOTP(req, res) {
  try {
    const { email, captchaToken } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    if (!captchaToken) {
      return res.status(400).json({ success: false, message: 'CAPTCHA token is required' });
    }

    // get user's IP (Cloudflare adds CF-Connecting-IP)
    const remoteIp = req.headers['cf-connecting-ip'] || req.ip;

    // Verify captcha
    const captchaResult = await verifyCloudflareCaptcha(captchaToken, remoteIp);
    if (!captchaResult.success) {
      // return error-codes if available for debugging
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA verification failed',
        details: captchaResult['error-codes'] || captchaResult.message
      });
    }

    // Check user already exists
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    // Generate OTP and save with expiry (5 minutes)
    const otp = otpGenerator(6, { digits: true });
    const expiresAt = Timestamp.fromDate(addMinutesToDate(new Date(), 5));

    // saveOTP should upsert into collection 'otp_verification' with docId = email or hashed email
    await saveOTP(email, otp, expiresAt);

    // send OTP via email (async) — don't block or reveal too many details
    try {
      await sendOTPEmail(email, otp);
    } catch (mailErr) {
      console.error('sendOTPEmail error:', mailErr);
      // optionally delete saved OTP if mailing fails
      // await deleteOTP(email);
      return res.status(500).json({ success: false, message: 'Failed to send OTP email' });
    }

    return res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error('requestRegistrationOTP Error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * POST /register
 * Step 2: Verify OTP and Register User
 */
export async function registerUserWithOTP(req, res) {
  try {
    const { email, password, name, dob, mobile, otp } = req.body;

    if (!email || !password || !otp) {
      return res
        .status(400)
        .json({ success: false, message: 'Email, password and OTP are required' });
    }

    // fetch OTP doc from Firestore
    const otpSnapshot = await getDocs(
      query(collection(db, 'otp_verification'), where('__name__', '==', email))
    );
    if (otpSnapshot.empty) {
      return res.status(400).json({ success: false, message: 'OTP not found' });
    }

    const otpDoc = otpSnapshot.docs[0];
    const otpData = otpDoc.data();

    // validate OTP and expiry
    const now = Date.now();
    const expiresMillis = otpData.expiresAt?.toMillis ? otpData.expiresAt.toMillis() : 0;
    if (otpData.otp !== otp || now > expiresMillis) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    // create user (registerUser should hash password and create user in Firestore)
    const token = await registerUser(email, password, name, dob, mobile);

    // optionally delete OTP doc so it can't be reused
    try {
      await deleteDoc(doc(db, 'otp_verification', email));
    } catch (e) {
      console.warn('Failed to delete OTP doc for', email, e.message);
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    console.error('registerUserWithOTP Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}
