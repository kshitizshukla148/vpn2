// import { NextResponse } from 'next/server';
// import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { withAuth } from '@/lib/middleware-auth';
// import Razorpay from 'razorpay';

// const razorpay = new Razorpay({
//   key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// async function handler(request) {
//   try {
//     const { courseId, amount } = await request.json();

//     // Get course details
//     const courseDoc = await getDoc(doc(db, 'courses', courseId));
//     if (!courseDoc.exists()) {
//       return NextResponse.json(
//         { message: 'Course not found' },
//         { status: 404 }
//       );
//     }

//     const courseData = courseDoc.data();

//     // Create Razorpay order
//     const options = {
//       amount: amount * 100, // Convert to paise
//       currency: 'INR',
//       receipt: `course_${courseId}_${Date.now()}`,
//       notes: {
//         courseId,
//         userId: request.user.userId,
//         courseName: courseData.title,
//       },
//     };

//     const order = await razorpay.orders.create(options);

//     // Store order in database
//     await addDoc(collection(db, 'orders'), {
//       orderId: order.id,
//       courseId,
//       userId: request.user.userId,
//       amount,
//       currency: 'INR',
//       status: 'created',
//       createdAt: new Date(),
//       courseName: courseData.title,
//       userName: request.user.fullName,
//     });

//     return NextResponse.json({
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//     });
//   } catch (error) {
//     console.error('Order creation error:', error);
//     return NextResponse.json(
//       { message: 'Failed to create order' },
//       { status: 500 }
//     );
//   }
// }

// export const POST = withAuth(handler);

import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { withAuth } from '@/lib/middleware-auth';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function handler(request) {
  try {
    const { courseId, amount } = await request.json();

    // Validate input parameters
    if (!courseId || typeof courseId !== 'string') {
      console.error('Invalid courseId:', courseId);
      return Response.json(
        { message: 'Valid courseId is required' },
        { status: 400 }
      );
    }

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      console.error('Invalid amount:', amount);
      return Response.json(
        { message: 'Valid amount is required' },
        { status: 400 }
      );
    }

    // Validate user data from middleware
    if (!request.user || !request.user.userId) {
      console.error('User data not found in request');
      return Response.json(
        { message: 'User authentication failed' },
        { status: 401 }
      );
    }

    console.log('Creating order for courseId:', courseId, 'userId:', request.user.userId);

    // Get course details
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    if (!courseDoc.exists()) {
      console.error('Course not found:', courseId);
      return Response.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    const courseData = courseDoc.data();

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `course_${courseId}_${Date.now()}`,
      notes: {
        courseId,
        userId: request.user.userId,
        courseName: courseData.title,
      },
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created:', order.id);

    // Store order in database
    await addDoc(collection(db, 'orders'), {
      orderId: order.id,
      courseId,
      userId: request.user.userId,
      amount,
      currency: 'INR',
      status: 'created',
      createdAt: new Date(),
      courseName: courseData.title,
      userName: request.user.fullName,
    });

    console.log('Order stored in database');

    return Response.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    
    // More specific error handling
    if (error.code === 'permission-denied') {
      return Response.json(
        { message: 'Access denied to database' },
        { status: 403 }
      );
    }
    
    if (error.message?.includes('courseId')) {
      return Response.json(
        { message: 'Invalid course ID provided' },
        { status: 400 }
      );
    }

    return Response.json(
      { message: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);