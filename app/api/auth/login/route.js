import { NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, turnstileToken } = await request.json();

    // Verify Cloudflare Turnstile
    const turnstileResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${turnstileToken}`,
    });

    const turnstileResult = await turnstileResponse.json();
    if (!turnstileResult.success) {
      return NextResponse.json(
        { message: 'Turnstile verification failed' },
        { status: 400 }
      );
    }

    // Find user
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Check if user is verified
    if (!userData.isVerified) {
      return NextResponse.json(
        { message: 'Please verify your email first' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: userDoc.id,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
    });

    // Remove password from user data
    const { password: _, ...userWithoutPassword } = userData;

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: userDoc.id,
        ...userWithoutPassword,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}