import { NextResponse } from 'next/server';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    // Find OTP record
    const otpRef = collection(db, 'otpStore');
    const otpQuery = query(
      otpRef, 
      where('email', '==', email),
      where('otp', '==', otp)
    );
    const otpSnapshot = await getDocs(otpQuery);

    if (otpSnapshot.empty) {
      return NextResponse.json(
        { message: 'Invalid OTP' },
        { status: 400 }
      );
    }

    const otpDoc = otpSnapshot.docs[0];
    const otpData = otpDoc.data();

    // Check if OTP is expired
    if (new Date() > otpData.expiryAt.toDate()) {
      await deleteDoc(doc(db, 'otpStore', otpDoc.id));
      return NextResponse.json(
        { message: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Find and update user
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('email', '==', email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const userDoc = userSnapshot.docs[0];
    await updateDoc(doc(db, 'users', userDoc.id), {
      isVerified: true,
      verifiedAt: new Date(),
    });

    // Delete OTP record
    await deleteDoc(doc(db, 'otpStore', otpDoc.id));

    return NextResponse.json(
      { message: 'Email verified successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}