import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token');
    
    if (!token) return null;
    
    const decoded = verifyToken(token.value);
    return decoded;
  } catch (error) {
    return null;
  }
}

// import jwt from 'jsonwebtoken';
// import { cookies } from 'next/headers';

// export function generateToken(payload) {
//   return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
// }

// export function verifyToken(token) {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET);
//   } catch (error) {
//     console.error('Token verification error:', error);
//     return null;
//   }
// }

// export async function getCurrentUser() {
//   try {
//     const cookieStore = cookies();
//     const token = cookieStore.get('auth-token');
    
//     if (!token || !token.value) {
//       return null;
//     }
    
//     const decoded = verifyToken(token.value);
//     return decoded;
//   } catch (error) {
//     console.error('Get current user error:', error);
//     return null;
//   }
// }