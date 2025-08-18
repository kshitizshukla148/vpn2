// // // // import { NextResponse } from 'next/server';
// // // // import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
// // // // import { db } from '@/lib/firebase';
// // // // import { withAuth } from '@/lib/middleware-auth';

// // // // async function handler(request) {
// // // //   try {
// // // //     const userId = request.user.userId;

// // // //     // Get user document
// // // //     const userDoc = await getDoc(doc(db, 'users', userId));
// // // //     if (!userDoc.exists()) {
// // // //       return NextResponse.json(
// // // //         { message: 'User not found' },
// // // //         { status: 404 }
// // // //       );
// // // //     }

// // // //     const userData = userDoc.data();

// // // //     // Get enrolled courses details
// // // //     const enrolledCourseIds = userData.enrolledCourses || [];
// // // //     const enrolledCourses = [];

// // // //     for (const courseId of enrolledCourseIds) {
// // // //       const courseDoc = await getDoc(doc(db, 'courses', courseId));
// // // //       if (courseDoc.exists()) {
// // // //         const courseData = courseDoc.data();

// // // //         // Get user's progress for this course (this would come from a progress collection)
// // // //         const progress = Math.floor(Math.random() * 100); // Mock progress
// // // //         const completed = progress === 100;
// // // //         const canDownloadCertificate = completed && 
// // // //           (new Date() - new Date(courseData.completedAt || 0)) > (30 * 24 * 60 * 60 * 1000); // 30 days

// // // //         enrolledCourses.push({
// // // //           id: courseDoc.id,
// // // //           ...courseData,
// // // //           progress,
// // // //           completed,
// // // //           canDownloadCertificate,
// // // //           credentialId: completed ? `VPN${Math.random().toString(36).substring(2, 12).toUpperCase()}` : null
// // // //         });
// // // //       }
// // // //     }

// // // //     // Calculate stats
// // // //     const stats = {
// // // //       enrolledCourses: enrolledCourses.length,
// // // //       completedCourses: enrolledCourses.filter(course => course.completed).length,
// // // //       certificatesEarned: enrolledCourses.filter(course => course.canDownloadCertificate).length,
// // // //       totalWatchTime: 0, // This would be calculated from actual viewing data
// // // //       credits: userData.credits || 0
// // // //     };

// // // //     // Mock recent activity
// // // //     const recentActivity = [
// // // //       {
// // // //         title: 'Course Progress',
// // // //         description: 'Completed lesson 5 of Web Development Bootcamp',
// // // //         timestamp: '2 hours ago'
// // // //       },
// // // //       {
// // // //         title: 'Certificate Earned',
// // // //         description: 'Received certificate for Python Data Science',
// // // //         timestamp: '1 day ago'
// // // //       },
// // // //       {
// // // //         title: 'New Enrollment',
// // // //         description: 'Enrolled in Digital Marketing course',
// // // //         timestamp: '3 days ago'
// // // //       }
// // // //     ];

// // // //     return NextResponse.json({
// // // //       stats,
// // // //       enrolledCourses,
// // // //       recentActivity
// // // //     });
// // // //   } catch (error) {
// // // //     console.error('Error fetching user dashboard data:', error);
// // // //     return NextResponse.json(
// // // //       { message: 'Internal server error' },
// // // //       { status: 500 }
// // // //     );
// // // //   }
// // // // }

// // // // export const GET = withAuth(handler);

// // // import { NextResponse } from 'next/server';
// // // import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
// // // import { db } from '@/lib/firebase';
// // // import { withAuth } from '@/lib/middleware-auth';

// // // async function handler(request) {
// // //   try {
// // //     const userId = request.user.userId;

// // //     // Get user document
// // //     const userDoc = await getDoc(doc(db, 'users', userId));
// // //     if (!userDoc.exists()) {
// // //       return NextResponse.json(
// // //         { message: 'User not found' },
// // //         { status: 404 }
// // //       );
// // //     }

// // //     const userData = userDoc.data();

// // //     // Get enrolled courses details
// // //     const enrolledCourseIds = userData.enrolledCourses || [];
// // //     const enrolledCourses = [];

// // //     for (const courseId of enrolledCourseIds) {
// // //       const courseDoc = await getDoc(doc(db, 'courses', courseId));
// // //       if (courseDoc.exists()) {
// // //         const courseData = courseDoc.data();

// // //         // Get user's progress for this course (this would come from a progress collection)
// // //         const progress = Math.floor(Math.random() * 100); // Mock progress
// // //         const completed = progress === 100;
// // //         const canDownloadCertificate = completed &&
// // //           (new Date() - new Date(courseData.completedAt || 0)) > (30 * 24 * 60 * 60 * 1000); // 30 days

// // //         enrolledCourses.push({
// // //           id: courseDoc.id,
// // //           ...courseData,
// // //           progress,
// // //           completed,
// // //           canDownloadCertificate,
// // //           credentialId: completed ? `VPN${Math.random().toString(36).substring(2, 12).toUpperCase()}` : null
// // //         });
// // //       }
// // //     }

// // //     // Calculate stats
// // //     const stats = {
// // //       enrolledCourses: enrolledCourses.length,
// // //       completedCourses: enrolledCourses.filter(course => course.completed).length,
// // //       certificatesEarned: enrolledCourses.filter(course => course.canDownloadCertificate).length,
// // //       totalWatchTime: 0, // This would be calculated from actual viewing data
// // //       credits: userData.credits || 0
// // //     };

// // //     // Mock recent activity
// // //     const recentActivity = [
// // //       {
// // //         title: 'Course Progress',
// // //         description: 'Completed lesson 5 of Web Development Bootcamp',
// // //         timestamp: '2 hours ago'
// // //       },
// // //       {
// // //         title: 'Certificate Earned',
// // //         description: 'Received certificate for Python Data Science',
// // //         timestamp: '1 day ago'
// // //       },
// // //       {
// // //         title: 'New Enrollment',
// // //         description: 'Enrolled in Digital Marketing course',
// // //         timestamp: '3 days ago'
// // //       }
// // //     ];

// // //     return NextResponse.json({
// // //       stats,
// // //       enrolledCourses,
// // //       recentActivity
// // //     });
// // //   } catch (error) {
// // //     console.error('Error fetching user dashboard data:', error);
// // //     return NextResponse.json(
// // //       { message: 'Internal server error' },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // export const GET = withAuth(handler);

// // import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
// // import { db } from '@/lib/firebase';
// // import { withAuth } from '@/lib/middleware-auth';

// // async function handler(request) {
// //   try {
// //     const userId = request.user.userId;

// //     // Get user document
// //     const userDoc = await getDoc(doc(db, 'users', userId));
// //     if (!userDoc.exists()) {
// //       return Response.json(
// //         { message: 'User not found' },
// //         { status: 404 }
// //       );
// //     }

// //     const userData = userDoc.data();

// //     // Get enrolled courses details
// //     const enrolledCourseIds = userData.enrolledCourses || [];
// //     const enrolledCourses = [];

// //     for (const courseId of enrolledCourseIds) {
// //       const courseDoc = await getDoc(doc(db, 'courses', courseId));
// //       if (courseDoc.exists()) {
// //         const courseData = courseDoc.data();

// //         // Get user's progress for this course (this would come from a progress collection)
// //         const progress = Math.floor(Math.random() * 100); // Mock progress
// //         const completed = progress === 100;
// //         const canDownloadCertificate = completed &&
// //           (new Date() - new Date(courseData.completedAt || 0)) > (30 * 24 * 60 * 60 * 1000); // 30 days

// //         enrolledCourses.push({
// //           id: courseDoc.id,
// //           ...courseData,
// //           progress,
// //           completed,
// //           canDownloadCertificate,
// //           credentialId: completed ? `VPN${Math.random().toString(36).substring(2, 12).toUpperCase()}` : null
// //         });
// //       }
// //     }

// //     // Calculate stats
// //     const stats = {
// //       enrolledCourses: enrolledCourses.length,
// //       completedCourses: enrolledCourses.filter(course => course.completed).length,
// //       certificatesEarned: enrolledCourses.filter(course => course.canDownloadCertificate).length,
// //       totalWatchTime: 0, // This would be calculated from actual viewing data
// //       credits: userData.credits || 0
// //     };

// //     // Mock recent activity
// //     const recentActivity = [
// //       {
// //         title: 'Course Progress',
// //         description: 'Completed lesson 5 of Web Development Bootcamp',
// //         timestamp: '2 hours ago'
// //       },
// //       {
// //         title: 'Certificate Earned',
// //         description: 'Received certificate for Python Data Science',
// //         timestamp: '1 day ago'
// //       },
// //       {
// //         title: 'New Enrollment',
// //         description: 'Enrolled in Digital Marketing course',
// //         timestamp: '3 days ago'
// //       }
// //     ];

// //     return Response.json({
// //       stats,
// //       enrolledCourses,
// //       recentActivity
// //     });
// //   } catch (error) {
// //     console.error('Error fetching user dashboard data:', error);
// //     return Response.json(
// //       { message: 'Internal server error' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export const GET = withAuth(handler);
// import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { withAuth } from '@/lib/middleware-auth';

// async function handler(request) {
//   try {
//     const userId = request.user.userId;

//     // Get user document
//     const userDoc = await getDoc(doc(db, 'users', userId));
//     if (!userDoc.exists()) {
//       return Response.json(
//         { message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     const userData = userDoc.data();

//     // Get enrolled courses details
//     const enrolledCourseIds = userData.enrolledCourses || [];
//     const enrolledCourses = [];

//     for (const courseId of enrolledCourseIds) {
//       const courseDoc = await getDoc(doc(db, 'courses', courseId));
//       if (courseDoc.exists()) {
//         const courseData = courseDoc.data();

//         // Get user's progress for this course (this would come from a progress collection)
//         const progress = Math.floor(Math.random() * 100); // Mock progress
//         const completed = progress === 100;
//         const canDownloadCertificate = completed &&
//           (new Date() - new Date(courseData.completedAt || 0)) > (30 * 24 * 60 * 60 * 1000); // 30 days

//         enrolledCourses.push({
//           id: courseDoc.id,
//           ...courseData,
//           progress,
//           completed,
//           canDownloadCertificate,
//           credentialId: completed ? `VPN${Math.random().toString(36).substring(2, 12).toUpperCase()}` : null
//         });
//       }
//     }

//     // Calculate stats
//     const stats = {
//       enrolledCourses: enrolledCourses.length,
//       completedCourses: enrolledCourses.filter(course => course.completed).length,
//       certificatesEarned: enrolledCourses.filter(course => course.canDownloadCertificate).length,
//       totalWatchTime: 0, // This would be calculated from actual viewing data
//       credits: userData.credits || 0
//     };

//     // Mock recent activity
//     const recentActivity = [
//       {
//         title: 'Course Progress',
//         description: 'Completed lesson 5 of Web Development Bootcamp',
//         timestamp: '2 hours ago'
//       },
//       {
//         title: 'Certificate Earned',
//         description: 'Received certificate for Python Data Science',
//         timestamp: '1 day ago'
//       },
//       {
//         title: 'New Enrollment',
//         description: 'Enrolled in Digital Marketing course',
//         timestamp: '3 days ago'
//       }
//     ];

//     return Response.json({
//       stats,
//       enrolledCourses,
//       recentActivity
//     });
//   } catch (error) {
//     console.error('Error fetching user dashboard data:', error);
//     return Response.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export const GET = withAuth(handler);
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { withAuth } from '@/lib/middleware-auth';

async function handler(request) {
  try {
    const userId = request.user.userId;

    // Get user document
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return Response.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // Get enrolled courses details
    const enrolledCourseIds = userData.enrolledCourses || [];
    const enrolledCourses = [];

    for (const courseId of enrolledCourseIds) {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        const courseData = courseDoc.data();

        // Get user's progress for this course (this would come from a progress collection)
        const progress = Math.floor(Math.random() * 100); // Mock progress
        const completed = progress === 100;
        const canDownloadCertificate = completed &&
          (new Date() - new Date(courseData.completedAt || 0)) > (30 * 24 * 60 * 60 * 1000); // 30 days

        enrolledCourses.push({
          id: courseDoc.id,
          ...courseData,
          progress,
          completed,
          canDownloadCertificate,
          credentialId: completed ? `VPN${Math.random().toString(36).substring(2, 12).toUpperCase()}` : null
        });
      }
    }

    // Calculate stats
    const stats = {
      enrolledCourses: enrolledCourses.length,
      completedCourses: enrolledCourses.filter(course => course.completed).length,
      certificatesEarned: enrolledCourses.filter(course => course.canDownloadCertificate).length,
      totalWatchTime: 0, // This would be calculated from actual viewing data
      credits: userData.credits || 0
    };

    // Mock recent activity
    const recentActivity = [
      {
        title: 'Course Progress',
        description: 'Completed lesson 5 of Web Development Bootcamp',
        timestamp: '2 hours ago'
      },
      {
        title: 'Certificate Earned',
        description: 'Received certificate for Python Data Science',
        timestamp: '1 day ago'
      },
      {
        title: 'New Enrollment',
        description: 'Enrolled in Digital Marketing course',
        timestamp: '3 days ago'
      }
    ];

    return Response.json({
      stats,
      enrolledCourses,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching user dashboard data:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAuth(handler);

