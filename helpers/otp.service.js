import crypto from 'crypto';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import db from '../config/firebase.admin.js';

const digits = '0123456789';
const lowerCaseAlphabets = 'abcdefghijklmnopqrstuvwxyz';
const upperCaseAlphabets = lowerCaseAlphabets.toUpperCase();
const specialChars = '#!&@';

export function otpGenerator(length = 6, options = {}) {
  const {
    digits: includeDigits = true,
    lowerCaseAlphabets: includeLowerCase = false,
    upperCaseAlphabets: includeUpperCase = false,
    specialChars: includeSpecialChars = false,
  } = options;

  const allowedChars =
    (includeDigits ? digits : '') +
    (includeLowerCase ? lowerCaseAlphabets : '') +
    (includeUpperCase ? upperCaseAlphabets : '') +
    (includeSpecialChars ? specialChars : '');

  if (!allowedChars) {
    throw new Error('No characters available to generate OTP.');
  }

  let otp = '';
  while (otp.length < length) {
    const charIndex = crypto.randomInt(0, allowedChars.length);
    if (otp.length === 0 && includeDigits && allowedChars[charIndex] === '0') continue;
    otp += allowedChars[charIndex];
  }
  return otp;
}

export function addMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

// Save OTP (using email as document ID for quick lookup)
export async function saveOTP(email, otp, expiresAt) {
  const otpRef = doc(db, 'otp_verification', email.toLowerCase());
  return setDoc(otpRef, {
    otp,
    expiresAt,
    createdAt: serverTimestamp()
  });
}

// Get OTP by email
export async function getOTP(email) {
  const otpRef = doc(db, 'otp_verification', email.toLowerCase());
  const otpDoc = await getDoc(otpRef);
  return otpDoc.exists() ? otpDoc.data() : null;
}
