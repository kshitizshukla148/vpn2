import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { withAdminAuth } from '@/lib/middleware-auth';

async function handler(request) {
  try {
    // Fetch all admins
    const adminsSnapshot = await getDocs(collection(db, 'admins'));
    const admins = adminsSnapshot.docs.map(doc => {
      const data = doc.data();
      // Remove password from response
      const { password, ...adminWithoutPassword } = data;
      return {
        id: doc.id,
        ...adminWithoutPassword,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    });

    return Response.json({
      admins
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handler);