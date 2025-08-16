import { NextResponse } from 'next/server';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { withAdminAuth } from '@/lib/middleware-auth';

async function handler(request) {
  try {
    // Fetch all users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    // Fetch all courses
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    const courses = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    // Fetch recent orders
    const ordersQuery = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      limit(10)
    );
    const ordersSnapshot = await getDocs(ordersQuery);
    const recentOrders = ordersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
    }));

    // Calculate stats
    const totalUsers = users.length;
    const totalCourses = courses.length;
    const totalRevenue = recentOrders.reduce((sum, order) => {
      return order.status === 'completed' ? sum + (order.amount || 0) : sum;
    }, 0);
    const activeStudents = users.filter(user => user.enrolledCourses?.length > 0).length;

    const stats = {
      totalUsers,
      totalCourses,
      totalRevenue,
      activeStudents,
      completionRate: 85, // This would be calculated based on actual completion data
      newEnrollments: 45 // This would be calculated based on recent enrollments
    };

    // Add enrollment count to courses
    const coursesWithStats = courses.map(course => ({
      ...course,
      enrolledCount: users.reduce((count, user) => {
        return user.enrolledCourses?.includes(course.id) ? count + 1 : count;
      }, 0)
    }));

    return NextResponse.json({
      stats,
      courses: coursesWithStats,
      users: users.filter(user => user.role !== 'admin'), // Don't show admin users
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const GET = withAdminAuth(handler);