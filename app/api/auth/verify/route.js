

// import { doc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { generateToken } from '@/lib/auth';
// import admin from 'firebase-admin';

// // Initialize Firebase Admin if not already initialized
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.cert({
//       projectId: process.env.FIREBASE_PROJECT_ID,
//       clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//       privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//     }),
//   });
// }

// export async function POST(request) {
//   try {
//     const authHeader = request.headers.get('authorization');
//     const token = authHeader?.replace('Bearer ', '');

//     if (!token) {
//       return Response.json(
//         { message: 'No token provided' },
//         { status: 401 }
//       );
//     }

//     let firebaseUid;
//     try {
//       // Verify Firebase ID token
//       const decodedToken = await admin.auth().verifyIdToken(token);
//       firebaseUid = decodedToken.uid;
//       console.log('Firebase token verified for user:', firebaseUid);
//     } catch (firebaseError) {
//       console.error('Firebase token verification failed:', firebaseError);
//       return Response.json(
//         { message: 'Invalid or expired token' },
//         { status: 401 }
//       );
//     }

//     // Get user data from Firestore
//     const userDoc = await getDoc(doc(db, 'users', firebaseUid));
//     if (!userDoc.exists()) {
//       return Response.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     const userData = userDoc.data();
        
//     // Check if user is verified
//     if (!userData.isVerified) {
//       return Response.json(
//         { message: 'Email not verified' },
//         { status: 401 }
//       );
//     }

//     // Generate custom JWT token for API authorization
//     const customToken = generateToken({
//       userId: firebaseUid,
//       email: userData.email,
//       fullName: userData.fullName,
//       role: userData.role,
//     });

//     const { password, ...userWithoutPassword } = userData;

//     return Response.json({
//       user: {
//         id: firebaseUid,
//         ...userWithoutPassword,
//       },
//       customToken,
//     });
//   } catch (error) {
//     console.error('Token verification error:', error);
//     return Response.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // Support GET for backward compatibility
// export const GET = POST;




// Netlify-safe API route without Firebase Admin
// Verification will be handled on the client using Firebase Auth

export const dynamic = "force-dynamic"; // Prevent build-time execution

export async function POST(request) {
  try {
    return Response.json(
      {
        message: "Firebase Admin removed. Client-side authentication only.",
        status: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify route error:", error);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Support GET as well
export const GET = POST;
