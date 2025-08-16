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

    // Find admin in admins collection
    const adminsRef = collection(db, 'admins');
    const q = query(adminsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const adminDoc = querySnapshot.docs[0];
    const adminData = adminDoc.data();

    // Check if admin is verified
    if (!adminData.isVerified) {
      return NextResponse.json(
        { message: 'Admin account not verified' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, adminData.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: adminDoc.id,
      email: adminData.email,
      fullName: adminData.fullName,
      role: 'admin',
    });

    // Remove password from admin data
    const { password: _, ...adminWithoutPassword } = adminData;

    return NextResponse.json({
      message: 'Admin login successful',
      token,
      user: {
        id: adminDoc.id,
        ...adminWithoutPassword,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}