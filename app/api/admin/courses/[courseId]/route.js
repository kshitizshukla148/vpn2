// import { doc, deleteDoc, getDoc } from 'firebase/firestore';
// import { db } from '@/lib/firebase';
// import { withAdminAuth } from '@/lib/middleware-auth';

// async function handler(request, { params }) {
//   try {
//     const { courseId } = params;

//     const courseRef = doc(db, 'courses', courseId);
//     const courseSnap = await getDoc(courseRef);

//     if (!courseSnap.exists()) {
//       return Response.json(
//         { message: 'Course not found' },
//         { status: 404 }
//       );
//     }

//     await deleteDoc(courseRef);

//     return Response.json({
//       message: 'Course deleted successfully',
//     });
//   } catch (error) {
//     console.error('Error deleting course:', error);
//     return Response.json(
//       { message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export const DELETE = withAdminAuth(handler);

import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { withAdminAuth } from '@/lib/middleware-auth';

async function handler(request, context) {
  try {
    const { courseId } = context.params;

    const courseRef = doc(db, 'courses', courseId);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      return Response.json(
        { message: 'Course not found' },
        { status: 404 }
      );
    }

    await deleteDoc(courseRef);

    return Response.json({
      message: 'Course deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const DELETE = withAdminAuth(handler);