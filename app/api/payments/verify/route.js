import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { withAuth } from '@/lib/middleware-auth';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

async function handler(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = await request.json();

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { message: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update order status
    const ordersRef = collection(db, 'orders');
    const orderQuery = query(ordersRef, where('orderId', '==', razorpay_order_id));
    const orderSnapshot = await getDocs(orderQuery);

    if (!orderSnapshot.empty) {
      const orderDoc = orderSnapshot.docs[0];
      await updateDoc(doc(db, 'orders', orderDoc.id), {
        status: 'completed',
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        completedAt: new Date(),
      });
    }

    // Add course to user's enrolled courses
    const userDoc = await getDoc(doc(db, 'users', request.user.userId));
    if (userDoc.exists()) {
      await updateDoc(doc(db, 'users', request.user.userId), {
        enrolledCourses: arrayUnion(courseId),
      });
    }

    // Get course details for email
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    const courseData = courseDoc.data();

    // Send confirmation email
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: request.user.email,
      subject: 'Course Purchase Confirmation - VPN Academy',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333;">Course Purchase Successful!</h2>
          <p>Dear ${request.user.fullName},</p>
          <p>Thank you for purchasing the course: <strong>${courseData.title}</strong></p>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Purchase Details:</h3>
            <p><strong>Course:</strong> ${courseData.title}</p>
            <p><strong>Amount Paid:</strong> ₹${orderSnapshot.docs[0].data().amount}</p>
            <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
          <p>You can now access your course from your dashboard.</p>
          <p>Best regards,<br>The VPN Academy Team</p>
        </div>
      `,
    });

    return NextResponse.json({
      message: 'Payment verified successfully',
      success: true,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { message: 'Payment verification failed' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);