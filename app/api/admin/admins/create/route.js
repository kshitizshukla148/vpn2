import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import bcrypt from 'bcryptjs';
import { sendAdminCreatedEmail } from '@/lib/email';
import { withAdminAuth } from '@/lib/middleware-auth';

async function handler(request) {
  try {
    const { fullName, email, password } = await request.json();
    const creatorInfo = request.user; // From auth middleware

    // Check if admin already exists
    const adminsRef = collection(db, 'admins');
    const q = query(adminsRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return Response.json(
        { message: 'Admin with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin document
    const adminData = {
      fullName,
      email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: creatorInfo.userId,
      permissions: {
        canCreateCourses: true,
        canManageUsers: true,
        canViewAnalytics: true,
        canManageAdmins: true,
        canManageOrders: true
      }
    };

    const docRef = await addDoc(collection(db, 'admins'), adminData);

    // Send email notification to new admin
    try {
      await sendAdminCreatedEmail({
        to: email,
        adminName: fullName,
        createdBy: creatorInfo.fullName || creatorInfo.email
      });
    } catch (emailError) {
      console.error('Failed to send admin creation email:', emailError);
      // Don't fail the creation if email fails
    }

    return Response.json({
      message: 'Administrator created successfully',
      adminId: docRef.id,
    }, { status: 201 });

  } catch (error) {
    console.error('Admin creation error:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const POST = withAdminAuth(handler);