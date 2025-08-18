// import { NextResponse } from 'next/server';
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { withAdminAuth } from '@/lib/middleware-auth';

// async function handler(request) {
//   try {
//     const courseData = await request.json();

//     // Validate required fields
//     const requiredFields = ['title', 'description', 'category', 'level', 'price'];
//     for (const field of requiredFields) {
//       if (!courseData[field]) {
//         return NextResponse.json(
//           { message: `${field} is required` },
//           { status: 400 }
//         );
//       }
//     }

//     // Create course document
//     const course = {
//       ...courseData,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       createdBy: request.user.userId,
//       enrolled: 0,
//       rating: 0,
//       reviews: [],
//       isActive: true,
//     };

//     const docRef = await addDoc(collection(db, 'courses'), course);

//     return NextResponse.json({
//       message: 'Course created successfully',
//       courseId: docRef.id,
//     }, { status: 201 });
//   } catch (error) {
//     console.error('Course creation error:', error);
//     return NextResponse.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export const POST = withAdminAuth(handler);

import { NextResponse } from 'next/server';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { withAdminAuth } from '@/lib/middleware-auth';

async function handler(request) {
  try {
    const courseData = await request.json();

    // Validate required fields
    const requiredFields = ['title', 'description', 'category', 'level', 'price'];
    for (const field of requiredFields) {
      if (!courseData[field]) {
        return NextResponse.json(
          { message: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Create course document
    const course = {
      ...courseData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: request.user.userId,
      enrolled: 0,
      rating: 0,
      reviews: [],
      isActive: true,
      enrolledCount: 0,
      instructor: request.user.fullName,
    };

    const docRef = await addDoc(collection(db, 'courses'), course);

    return NextResponse.json({
      message: 'Course created successfully',
      courseId: docRef.id,
    }, { status: 201 });
  } catch (error) {
    console.error('Course creation error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAdminAuth(handler);