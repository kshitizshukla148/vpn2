// // import { NextResponse } from 'next/server';
// // import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
// // import { db } from '@/lib/firebase';
// // import { withAuth } from '@/lib/middleware-auth';
// // import bcrypt from 'bcryptjs';
// // import nodemailer from 'nodemailer';

// // async function handler(request) {
// //   try {
// //     const userId = request.user.userId;
// //     const { currentPassword, newPassword } = await request.json();

// //     if (!currentPassword || !newPassword) {
// //       return NextResponse.json(
// //         { message: 'Current password and new password are required' },
// //         { status: 400 }
// //       );
// //     }

// //     if (newPassword.length < 6) {
// //       return NextResponse.json(
// //         { message: 'New password must be at least 6 characters long' },
// //         { status: 400 }
// //       );
// //     }

// //     // Get user data
// //     const userDoc = await getDoc(doc(db, 'users', userId));
// //     if (!userDoc.exists()) {
// //       return NextResponse.json(
// //         { message: 'User not found' },
// //         { status: 404 }
// //       );
// //     }

// //     const userData = userDoc.data();

// //     // Verify current password
// //     const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password);
// //     if (!isCurrentPasswordValid) {
// //       return NextResponse.json(
// //         { message: 'Current password is incorrect' },
// //         { status: 400 }
// //       );
// //     }

// //     // Generate OTP for verification
// //     const otp = Math.floor(100000 + Math.random() * 900000).toString();
// //     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

// //     // Store OTP
// //     await addDoc(collection(db, 'otpStore'), {
// //       email: userData.email,
// //       otp,
// //       expiryAt: otpExpiry,
// //       type: 'password_change',
// //       newPasswordHash: await bcrypt.hash(newPassword, 12),
// //       userId,
// //       createdAt: new Date(),
// //     });

// //     // Send OTP email
// //     const transporter = nodemailer.createTransporter({
// //       service: 'gmail',
// //       auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS,
// //       },
// //     });

// //     await transporter.sendMail({
// //       from: process.env.EMAIL_USER,
// //       to: userData.email,
// //       subject: 'Password Change Verification - VPN Academy',
// //       html: `
// //         <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
// //           <h2 style="color: #333; text-align: center;">Password Change Request</h2>
// //           <p>Hello ${userData.fullName},</p>
// //           <p>We received a request to change your password. To complete this process, please verify using the OTP below:</p>
// //           <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
// //             <h1 style="color: #007bff; font-size: 32px; letter-spacing: 2px; margin: 0;">${otp}</h1>
// //           </div>
// //           <p>This OTP is valid for 10 minutes.</p>
// //           <p>If you didn't request this password change, please ignore this email and contact support.</p>
// //           <p>Best regards,<br>The VPN Academy Team</p>
// //         </div>
// //       `,
// //     });

// //     return NextResponse.json({
// //       message: 'OTP sent to your email. Please verify to complete password change.',
// //       requireOTP: true,
// //     });
// //   } catch (error) {
// //     console.error('Error changing password:', error);
// //     return NextResponse.json(
// //       { message: 'Internal server error' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export const POST = withAuth(handler);

// import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { withAuth } from '@/lib/middleware-auth';
// import bcrypt from 'bcryptjs';
// import nodemailer from 'nodemailer';

// async function handler(request) {
//   try {
//     const userId = request.user.userId;
//     const { currentPassword, newPassword } = await request.json();

//     if (!currentPassword || !newPassword) {
//       return Response.json(
//         { message: 'Current password and new password are required' },
//         { status: 400 }
//       );
//     }

//     if (newPassword.length < 6) {
//       return Response.json(
//         { message: 'New password must be at least 6 characters long' },
//         { status: 400 }
//       );
//     }

//     // Get user data
//     const userDoc = await getDoc(doc(db, 'users', userId));
//     if (!userDoc.exists()) {
//       return Response.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     const userData = userDoc.data();

//     // Verify current password
//     const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password);
//     if (!isCurrentPasswordValid) {
//       return Response.json(
//         { message: 'Current password is incorrect' },
//         { status: 400 }
//       );
//     }

//     // Generate OTP for verification
//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

//     // Store OTP
//     await addDoc(collection(db, 'otpStore'), {
//       email: userData.email,
//       otp,
//       expiryAt: otpExpiry,
//       type: 'password_change',
//       newPasswordHash: await bcrypt.hash(newPassword, 12),
//       userId,
//       createdAt: new Date(),
//     });

//     // Send OTP email
//     const transporter = nodemailer.createTransporter({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: userData.email,
//       subject: 'Password Change Verification - VPN Academy',
//       html: `
//         <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
//           <h2 style="color: #333; text-align: center;">Password Change Request</h2>
//           <p>Hello ${userData.fullName},</p>
//           <p>We received a request to change your password. To complete this process, please verify using the OTP below:</p>
//           <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
//             <h1 style="color: #007bff; font-size: 32px; letter-spacing: 2px; margin: 0;">${otp}</h1>
//           </div>
//           <p>This OTP is valid for 10 minutes.</p>
//           <p>If you didn't request this password change, please ignore this email and contact support.</p>
//           <p>Best regards,<br>The VPN Academy Team</p>
//         </div>
//       `,
//     });

//     return Response.json({
//       message: 'OTP sent to your email. Please verify to complete password change.',
//       requireOTP: true,
//     });
//   } catch (error) {
//     console.error('Error changing password:', error);
//     return Response.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export const POST = withAuth(handler);
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { withAuth } from '@/lib/middleware-auth';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

async function handler(request) {
  try {
    const userId = request.user.userId;
    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return Response.json(
        { message: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return Response.json(
        { message: 'New password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Get user data
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, userData.password);
    if (!isCurrentPasswordValid) {
      return Response.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }

    // Generate OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP
    await addDoc(collection(db, 'otpStore'), {
      email: userData.email,
      otp,
      expiryAt: otpExpiry,
      type: 'password_change',
      newPasswordHash: await bcrypt.hash(newPassword, 12),
      userId,
      createdAt: new Date(),
    });

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userData.email,
      subject: 'Password Change Verification - VPN Academy',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <h2 style="color: #333; text-align: center;">Password Change Request</h2>
          <p>Hello ${userData.fullName},</p>
          <p>We received a request to change your password. To complete this process, please verify using the OTP below:</p>
          <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 2px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this password change, please ignore this email and contact support.</p>
          <p>Best regards,<br>The VPN Academy Team</p>
        </div>
      `,
    });

    return Response.json({
      message: 'OTP sent to your email. Please verify to complete password change.',
      requireOTP: true,
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAuth(handler);
