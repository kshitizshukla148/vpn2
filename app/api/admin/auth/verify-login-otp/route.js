// import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { generateToken } from '@/lib/auth';
// import { cookies } from 'next/headers';

// export async function POST(request) {
//   try {
//     const { email, otp } = await request.json();

//     console.log('Admin login OTP verification attempt for:', email);

//     // Find OTP record
//     const otpQuery = query(
//       collection(db, 'adminLoginOtpStore'),
//       where('email', '==', email),
//       where('otp', '==', otp)
//     );
    
//     const otpSnapshot = await getDocs(otpQuery);

//     if (otpSnapshot.empty) {
//       console.log('Invalid login OTP for admin:', email);
//       return Response.json(
//         { message: 'Invalid OTP' },
//         { status: 400 }
//       );
//     }

//     const otpDoc = otpSnapshot.docs[0];
//     const otpData = otpDoc.data();

//     // Check if OTP has expired
//     if (new Date() > otpData.expiryAt.toDate()) {
//       // Delete expired OTP
//       await deleteDoc(doc(db, 'adminLoginOtpStore', otpDoc.id));
//       console.log('Expired login OTP for admin:', email);
//       return Response.json(
//         { message: 'OTP has expired. Please request a new one.' },
//         { status: 400 }
//       );
//     }

//     // Get admin data from Firestore
//     // const adminDoc = await getDoc(doc(db, 'admins', otpData.firebaseUid));
//     // if (!adminDoc.exists()) {
//     //   console.error('Admin document not found in Firestore');
//     //   return Response.json(
//     //     { message: 'Admin data not found' },
//     //     { status: 404 }
//     //   );
//     // }



// import { cookies } from "next/headers";

// export async function POST(req) {
//   try {
//     const cookieStore = await cookies();  // ✅ await

//     cookieStore.set("auth-token", customToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//       maxAge: 60 * 60 * 24, // 1 day
//     });

//     return Response.json({ success: true });
//   } catch (error) {
//     console.error(error);
//     return Response.json({ error: "Internal error" }, { status: 500 });
//   }
// }


//     const adminData = adminDoc.data();

//     // Generate custom JWT token for API authorization
//     const customToken = generateToken({
//       userId: otpData.firebaseUid,
//       email: adminData.email,
//       fullName: adminData.fullName,
//       role: 'admin',
//     });

//     // Set httpOnly cookie
//     const cookieStore = cookies();
//     cookieStore.set('auth-token', customToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       maxAge: 7 * 24 * 60 * 60, // 7 days
//       path: '/',
//     });

//     // Delete OTP after successful verification
//     await deleteDoc(doc(db, 'adminLoginOtpStore', otpDoc.id));

//     // Remove password from admin data
//     const { password, ...adminWithoutPassword } = adminData;

//     const responseData = {
//       message: 'Admin login successful',
//       token: customToken,
//       user: {
//         id: otpData.firebaseUid,
//         ...adminWithoutPassword,
//       },
//     };

//     console.log('Admin login successful for:', email);

//     return Response.json(responseData);
//   } catch (error) {
//     console.error('Admin login OTP verification error:', error);
//     return Response.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }



import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { cookies } from "next/headers";
import { db } from "@/lib/firebase";
import { generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    console.log("Admin login OTP verification attempt for:", email);

    // 1️⃣ Find OTP record
    const otpQuery = query(
      collection(db, "adminLoginOtpStore"),
      where("email", "==", email),
      where("otp", "==", otp)
    );

    const otpSnapshot = await getDocs(otpQuery);

    if (otpSnapshot.empty) {
      return Response.json({ message: "Invalid OTP" }, { status: 400 });
    }

    const otpDoc = otpSnapshot.docs[0];
    const otpData = otpDoc.data();

    // 2️⃣ Check OTP expiry
    if (new Date() > otpData.expiryAt.toDate()) {
      await deleteDoc(doc(db, "adminLoginOtpStore", otpDoc.id));
      return Response.json(
        { message: "OTP expired. Request a new one." },
        { status: 400 }
      );
    }

    // 3️⃣ Get admin data
    const adminDoc = await getDoc(doc(db, "admins", otpData.firebaseUid));
    if (!adminDoc.exists()) {
      return Response.json(
        { message: "Admin not found" },
        { status: 404 }
      );
    }

    const adminData = adminDoc.data();

    // 4️⃣ Generate JWT
    const customToken = generateToken({
      userId: otpData.firebaseUid,
      email: adminData.email,
      fullName: adminData.fullName,
      role: "admin",
    });

    // 5️⃣ Set auth cookie (CORRECT way)
    const cookieStore = await cookies(); // ✅ MUST await
    cookieStore.set("auth-token", customToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // 6️⃣ Cleanup OTP
    await deleteDoc(doc(db, "adminLoginOtpStore", otpDoc.id));

    const { password, ...adminWithoutPassword } = adminData;

    return Response.json({
      message: "Admin login successful",
      user: {
        id: otpData.firebaseUid,
        ...adminWithoutPassword,
      },
    });
  } catch (error) {
    console.error("Admin OTP verify error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
