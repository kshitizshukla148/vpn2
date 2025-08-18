// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { motion } from 'framer-motion';
// // import {
// //   BarChart3,
// //   Users,
// //   BookOpen,
// //   DollarSign,
// //   Plus,
// //   Search,
// //   Filter,
// //   MoreVertical,
// //   Edit,
// //   Trash2,
// //   Eye,
// //   TrendingUp,
// //   TrendingDown,
// //   Award
// // } from 'lucide-react';
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Badge } from '@/components/ui/badge';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from '@/components/ui/dropdown-menu';
// // import { toast } from 'sonner';
// // import Link from 'next/link';
// // import Navbar from '@/components/navbar';

// // export default function AdminDashboard() {
// //   const [stats, setStats] = useState({
// //     totalUsers: 0,
// //     totalCourses: 0,
// //     totalRevenue: 0,
// //     activeStudents: 0,
// //     completionRate: 0,
// //     newEnrollments: 0
// //   });
// //   const [courses, setCourses] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [recentOrders, setRecentOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetchAdminData();
// //   }, []);

// //   const fetchAdminData = async () => {
// //     try {
// //       const response = await fetch('/api/admin/dashboard', {
// //         headers: {
// //           'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
// //         },
// //       });

// //       if (response.ok) {
// //         const data = await response.json();
// //         setStats(data.stats);
// //         setCourses(data.courses);
// //         setUsers(data.users);
// //         setRecentOrders(data.recentOrders);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching admin data:', error);
// //       toast.error('Error loading dashboard data');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const deleteCourse = async (courseId) => {
// //     if (!confirm('Are you sure you want to delete this course?')) return;

// //     try {
// //       const response = await fetch(`/api/admin/courses/${courseId}`, {
// //         method: 'DELETE',
// //         headers: {
// //           'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
// //         },
// //       });

// //       if (response.ok) {
// //         toast.success('Course deleted successfully');
// //         fetchAdminData();
// //       } else {
// //         toast.error('Error deleting course');
// //       }
// //     } catch (error) {
// //       console.error('Error deleting course:', error);
// //       toast.error('Error deleting course');
// //     }
// //   };

// //   const adminStats = [
// //     {
// //       title: 'Total Users',
// //       value: stats.totalUsers,
// //       icon: Users,
// //       color: 'text-blue-600',
// //       bgColor: 'bg-blue-50 dark:bg-blue-950',
// //       change: '+12.5%',
// //       trend: 'up'
// //     },
// //     {
// //       title: 'Total Courses',
// //       value: stats.totalCourses,
// //       icon: BookOpen,
// //       color: 'text-green-600',
// //       bgColor: 'bg-green-50 dark:bg-green-950',
// //       change: '+8.2%',
// //       trend: 'up'
// //     },
// //     {
// //       title: 'Total Revenue',
// //       value: `₹${stats.totalRevenue.toLocaleString()}`,
// //       icon: DollarSign,
// //       color: 'text-purple-600',
// //       bgColor: 'bg-purple-50 dark:bg-purple-950',
// //       change: '+23.1%',
// //       trend: 'up'
// //     },
// //     {
// //       title: 'Active Students',
// //       value: stats.activeStudents,
// //       icon: Award,
// //       color: 'text-orange-600',
// //       bgColor: 'bg-orange-50 dark:bg-orange-950',
// //       change: '+5.4%',
// //       trend: 'up'
// //     }
// //   ];

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-background">
// //       <Navbar />

// //       <main className="pt-20 pb-12">
// //         <div className="container mx-auto px-4">
// //           {/* Header */}
// //           <motion.div
// //             className="flex justify-between items-center mb-8"
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6 }}
// //           >
// //             <div>
// //               <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
// //               <p className="text-muted-foreground">
// //                 Manage your courses, users, and track platform performance.
// //               </p>
// //             </div>
// //             <Link href="/admin/courses/create">
// //               <Button className="flex items-center gap-2">
// //                 <Plus className="w-4 h-4" />
// //                 Add Course
// //               </Button>
// //             </Link>
// //           </motion.div>

// //           {/* Stats Cards */}
// //           <motion.div
// //             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6, delay: 0.1 }}
// //           >
// //             {adminStats.map((stat, index) => (
// //               <Card key={stat.title} className="hover:shadow-lg transition-shadow">
// //                 <CardContent className="p-6">
// //                   <div className="flex items-center justify-between mb-4">
// //                     <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
// //                       <stat.icon className={`w-6 h-6 ${stat.color}`} />
// //                     </div>
// //                     <div className={`flex items-center gap-1 text-xs ${
// //                       stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
// //                     }`}>
// //                       {stat.trend === 'up' ? (
// //                         <TrendingUp className="w-3 h-3" />
// //                       ) : (
// //                         <TrendingDown className="w-3 h-3" />
// //                       )}
// //                       {stat.change}
// //                     </div>
// //                   </div>
// //                   <div>
// //                     <p className="text-2xl font-bold mb-1">{stat.value}</p>
// //                     <p className="text-sm text-muted-foreground">{stat.title}</p>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             ))}
// //           </motion.div>

// //           {/* Main Content */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ duration: 0.6, delay: 0.2 }}
// //           >
// //             <Tabs defaultValue="courses" className="w-full">
// //               <TabsList className="grid w-full grid-cols-4">
// //                 <TabsTrigger value="courses">Courses</TabsTrigger>
// //                 <TabsTrigger value="users">Users</TabsTrigger>
// //                 <TabsTrigger value="orders">Orders</TabsTrigger>
// //                 <TabsTrigger value="analytics">Analytics</TabsTrigger>
// //               </TabsList>

// //               {/* Courses Tab */}
// //               <TabsContent value="courses" className="mt-6">
// //                 <Card>
// //                   <CardHeader>
// //                     <div className="flex justify-between items-center">
// //                       <div>
// //                         <CardTitle>Course Management</CardTitle>
// //                         <CardDescription>
// //                           Manage your courses, content, and pricing
// //                         </CardDescription>
// //                       </div>
// //                       <div className="flex gap-2">
// //                         <div className="relative">
// //                           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
// //                           <Input
// //                             placeholder="Search courses..."
// //                             className="pl-10 w-64"
// //                           />
// //                         </div>
// //                         <Button variant="outline" size="icon">
// //                           <Filter className="h-4 w-4" />
// //                         </Button>
// //                       </div>
// //                     </div>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <div className="space-y-4">
// //                       {courses.map((course) => (
// //                         <div
// //                           key={course.id}
// //                           className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
// //                         >
// //                           <img
// //                             src={course.thumbnail || 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg'}
// //                             alt={course.title}
// //                             className="w-16 h-16 rounded-lg object-cover"
// //                           />
// //                           <div className="flex-1">
// //                             <h3 className="font-semibold mb-1">{course.title}</h3>
// //                             <p className="text-sm text-muted-foreground mb-2">
// //                               {course.description?.substring(0, 100)}...
// //                             </p>
// //                             <div className="flex items-center gap-4">
// //                               <Badge variant="secondary">{course.category}</Badge>
// //                               <span className="text-sm text-muted-foreground">
// //                                 ₹{course.price}
// //                               </span>
// //                               <span className="text-sm text-muted-foreground">
// //                                 {course.enrolledCount} enrolled
// //                               </span>
// //                             </div>
// //                           </div>
// //                           <DropdownMenu>
// //                             <DropdownMenuTrigger asChild>
// //                               <Button variant="ghost" size="icon">
// //                                 <MoreVertical className="h-4 w-4" />
// //                               </Button>
// //                             </DropdownMenuTrigger>
// //                             <DropdownMenuContent align="end">
// //                               <DropdownMenuItem asChild>
// //                                 <Link href={`/admin/courses/${course.id}`}>
// //                                   <Eye className="mr-2 h-4 w-4" />
// //                                   View
// //                                 </Link>
// //                               </DropdownMenuItem>
// //                               <DropdownMenuItem asChild>
// //                                 <Link href={`/admin/courses/${course.id}/edit`}>
// //                                   <Edit className="mr-2 h-4 w-4" />
// //                                   Edit
// //                                 </Link>
// //                               </DropdownMenuItem>
// //                               <DropdownMenuItem
// //                                 onClick={() => deleteCourse(course.id)}
// //                                 className="text-red-600"
// //                               >
// //                                 <Trash2 className="mr-2 h-4 w-4" />
// //                                 Delete
// //                               </DropdownMenuItem>
// //                             </DropdownMenuContent>
// //                           </DropdownMenu>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </TabsContent>

// //               {/* Users Tab */}
// //               <TabsContent value="users" className="mt-6">
// //                 <Card>
// //                   <CardHeader>
// //                     <CardTitle>User Management</CardTitle>
// //                     <CardDescription>
// //                       View and manage registered users
// //                     </CardDescription>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <div className="space-y-4">
// //                       {users.map((user) => (
// //                         <div
// //                           key={user.id}
// //                           className="flex items-center gap-4 p-4 border rounded-lg"
// //                         >
// //                           <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
// //                             <Users className="w-6 h-6 text-primary" />
// //                           </div>
// //                           <div className="flex-1">
// //                             <h3 className="font-semibold">{user.fullName}</h3>
// //                             <p className="text-sm text-muted-foreground">{user.email}</p>
// //                             <p className="text-sm text-muted-foreground">
// //                               Joined {new Date(user.createdAt).toLocaleDateString()}
// //                             </p>
// //                           </div>
// //                           <div className="text-right">
// //                             <Badge
// //                               variant={user.isVerified ? 'default' : 'secondary'}
// //                             >
// //                               {user.isVerified ? 'Verified' : 'Pending'}
// //                             </Badge>
// //                             <p className="text-sm text-muted-foreground mt-1">
// //                               {user.enrolledCourses?.length || 0} courses
// //                             </p>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </TabsContent>

// //               {/* Orders Tab */}
// //               <TabsContent value="orders" className="mt-6">
// //                 <Card>
// //                   <CardHeader>
// //                     <CardTitle>Recent Orders</CardTitle>
// //                     <CardDescription>
// //                       Track course purchases and payments
// //                     </CardDescription>
// //                   </CardHeader>
// //                   <CardContent>
// //                     <div className="space-y-4">
// //                       {recentOrders.map((order) => (
// //                         <div
// //                           key={order.id}
// //                           className="flex items-center gap-4 p-4 border rounded-lg"
// //                         >
// //                           <div className="w-12 h-12 bg-green-50 dark:bg-green-950 rounded-full flex items-center justify-center">
// //                             <DollarSign className="w-6 h-6 text-green-600" />
// //                           </div>
// //                           <div className="flex-1">
// //                             <h3 className="font-semibold">{order.courseName}</h3>
// //                             <p className="text-sm text-muted-foreground">
// //                               by {order.userName}
// //                             </p>
// //                             <p className="text-sm text-muted-foreground">
// //                               {new Date(order.createdAt).toLocaleDateString()}
// //                             </p>
// //                           </div>
// //                           <div className="text-right">
// //                             <p className="font-semibold">₹{order.amount}</p>
// //                             <Badge
// //                               variant={
// //                                 order.status === 'completed'
// //                                   ? 'default'
// //                                   : order.status === 'pending'
// //                                   ? 'secondary'
// //                                   : 'destructive'
// //                               }
// //                             >
// //                               {order.status}
// //                             </Badge>
// //                           </div>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   </CardContent>
// //                 </Card>
// //               </TabsContent>

// //               {/* Analytics Tab */}
// //               <TabsContent value="analytics" className="mt-6">
// //                 <div className="grid md:grid-cols-2 gap-6">
// //                   <Card>
// //                     <CardHeader>
// //                       <CardTitle>Revenue Overview</CardTitle>
// //                       <CardDescription>
// //                         Monthly revenue and growth trends
// //                       </CardDescription>
// //                     </CardHeader>
// //                     <CardContent>
// //                       <div className="h-64 flex items-center justify-center text-muted-foreground">
// //                         <BarChart3 className="w-12 h-12 mb-4" />
// //                         <p>Revenue chart would be integrated here</p>
// //                       </div>
// //                     </CardContent>
// //                   </Card>

// //                   <Card>
// //                     <CardHeader>
// //                       <CardTitle>Course Performance</CardTitle>
// //                       <CardDescription>
// //                         Top performing courses by enrollment
// //                       </CardDescription>
// //                     </CardHeader>
// //                     <CardContent>
// //                       <div className="space-y-4">
// //                         {courses.slice(0, 5).map((course, index) => (
// //                           <div key={course.id} className="flex items-center gap-3">
// //                             <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
// //                               {index + 1}
// //                             </div>
// //                             <div className="flex-1">
// //                               <p className="font-medium text-sm">{course.title}</p>
// //                               <p className="text-xs text-muted-foreground">
// //                                 {course.enrolledCount} students
// //                               </p>
// //                             </div>
// //                             <Badge variant="outline">
// //                               ₹{course.price}
// //                             </Badge>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </CardContent>
// //                   </Card>
// //                 </div>
// //               </TabsContent>
// //             </Tabs>
// //           </motion.div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   BarChart3,
//   Users,
//   BookOpen,
//   DollarSign,
//   Plus,
//   Search,
//   Filter,
//   MoreVertical,
//   Edit,
//   Trash2,
//   Eye,
//   TrendingUp,
//   TrendingDown,
//   Award,
//   Shield,
//   UserPlus,
//   Settings,
//   Bell,
//   Download,
//   Calendar
// } from 'lucide-react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { toast } from 'sonner';
// import Link from 'next/link';
// import Navbar from '@/components/navbar';

// export default function AdminDashboard() {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalCourses: 0,
//     totalRevenue: 0,
//     activeStudents: 0,
//     completionRate: 0,
//     newEnrollments: 0,
//     totalAdmins: 0,
//     activeAdmins: 0
//   });
//   const [courses, setCourses] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [recentAdmins, setRecentAdmins] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     fetchAdminData();
//   }, []);

//   const fetchAdminData = async () => {
//     try {
//       const response = await fetch('/api/admin/dashboard', {
//         headers: {
//           'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setStats(data.stats);
//         setCourses(data.courses);
//         setUsers(data.users);
//         setRecentOrders(data.recentOrders);
//         setRecentAdmins(data.recentAdmins || []);
//       } else {
//         toast.error('Failed to load dashboard data');
//       }
//     } catch (error) {
//       console.error('Error fetching admin data:', error);
//       toast.error('Error loading dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteCourse = async (courseId) => {
//     if (!confirm('Are you sure you want to delete this course?')) return;

//     try {
//       const response = await fetch(`/api/admin/courses/${courseId}`, {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
//         },
//       });

//       if (response.ok) {
//         toast.success('Course deleted successfully');
//         fetchAdminData();
//       } else {
//         toast.error('Error deleting course');
//       }
//     } catch (error) {
//       console.error('Error deleting course:', error);
//       toast.error('Error deleting course');
//     }
//   };

//   const toggleCourseStatus = async (courseId, currentStatus) => {
//     try {
//       const response = await fetch(`/api/admin/courses/${courseId}/toggle-status`, {
//         method: 'PUT',
//         headers: {
//           'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
//         },
//       });

//       if (response.ok) {
//         toast.success(`Course ${currentStatus ? 'deactivated' : 'activated'} successfully`);
//         fetchAdminData();
//       } else {
//         toast.error('Error updating course status');
//       }
//     } catch (error) {
//       console.error('Error toggling course status:', error);
//       toast.error('Error updating course status');
//     }
//   };

//   const filteredCourses = courses.filter(course =>
//     course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     course.category.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredUsers = users.filter(user =>
//     user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const adminStats = [
//     {
//       title: 'Total Users',
//       value: stats.totalUsers,
//       icon: Users,
//       color: 'text-blue-600',
//       bgColor: 'bg-blue-50 dark:bg-blue-950',
//       change: '+12.5%',
//       trend: 'up'
//     },
//     {
//       title: 'Total Courses',
//       value: stats.totalCourses,
//       icon: BookOpen,
//       color: 'text-green-600',
//       bgColor: 'bg-green-50 dark:bg-green-950',
//       change: '+8.2%',
//       trend: 'up'
//     },
//     {
//       title: 'Total Revenue',
//       value: `₹${stats.totalRevenue.toLocaleString()}`,
//       icon: DollarSign,
//       color: 'text-purple-600',
//       bgColor: 'bg-purple-50 dark:bg-purple-950',
//       change: '+23.1%',
//       trend: 'up'
//     },
//     {
//       title: 'Active Students',
//       value: stats.activeStudents,
//       icon: Award,
//       color: 'text-orange-600',
//       bgColor: 'bg-orange-50 dark:bg-orange-950',
//       change: '+5.4%',
//       trend: 'up'
//     }
//   ];

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <main className="pt-20 pb-12">
//         <div className="container mx-auto px-4">
//           {/* Header */}
//           <motion.div
//             className="flex justify-between items-center mb-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//           >
//             <div>
//               <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
//               <p className="text-muted-foreground">
//                 Manage your courses, users, and track platform performance.
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <Link href="/admin/admins">
//                 <Button variant="outline" className="flex items-center gap-2">
//                   <Shield className="w-4 h-4" />
//                   Manage Admins
//                 </Button>
//               </Link>
//               <Link href="/admin/courses/create">
//                 <Button className="flex items-center gap-2">
//                   <Plus className="w-4 h-4" />
//                   Add Course
//                 </Button>
//               </Link>
//             </div>
//           </motion.div>

//           {/* Stats Cards */}
//           <motion.div
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//           >
//             {adminStats.map((stat, index) => (
//               <Card key={stat.title} className="hover:shadow-lg transition-shadow">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
//                       <stat.icon className={`w-6 h-6 ${stat.color}`} />
//                     </div>
//                     <div className={`flex items-center gap-1 text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
//                       }`}>
//                       {stat.trend === 'up' ? (
//                         <TrendingUp className="w-3 h-3" />
//                       ) : (
//                         <TrendingDown className="w-3 h-3" />
//                       )}
//                       {stat.change}
//                     </div>
//                   </div>
//                   <div>
//                     <p className="text-2xl font-bold mb-1">{stat.value}</p>
//                     <p className="text-sm text-muted-foreground">{stat.title}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </motion.div>

//           {/* Quick Actions */}
//           <motion.div
//             className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//           >
//             <Card className="hover:shadow-lg transition-shadow cursor-pointer">
//               <Link href="/admin/admins">
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950 rounded-lg flex items-center justify-center">
//                       <UserPlus className="w-6 h-6 text-purple-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold mb-1">Administrator Management</h3>
//                       <p className="text-sm text-muted-foreground">
//                         Add and manage admin accounts
//                       </p>
//                       <Badge variant="secondary" className="mt-2">
//                         {stats.totalAdmins || 0} Admins
//                       </Badge>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Link>
//             </Card>

//             <Card className="hover:shadow-lg transition-shadow cursor-pointer">
//               <Link href="/admin/courses/create">
//                 <CardContent className="p-6">
//                   <div className="flex items-center gap-4">
//                     <div className="w-12 h-12 bg-green-50 dark:bg-green-950 rounded-lg flex items-center justify-center">
//                       <Plus className="w-6 h-6 text-green-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold mb-1">Create New Course</h3>
//                       <p className="text-sm text-muted-foreground">
//                         Add courses with content and pricing
//                       </p>
//                       <Badge variant="secondary" className="mt-2">
//                         Quick Action
//                       </Badge>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Link>
//             </Card>

//             <Card className="hover:shadow-lg transition-shadow">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center">
//                     <BarChart3 className="w-6 h-6 text-blue-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold mb-1">Analytics Overview</h3>
//                     <p className="text-sm text-muted-foreground">
//                       View detailed platform analytics
//                     </p>
//                     <Badge variant="secondary" className="mt-2">
//                       Coming Soon
//                     </Badge>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Main Content */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.3 }}
//           >
//             <Tabs defaultValue="courses" className="w-full">
//               <TabsList className="grid w-full grid-cols-5">
//                 <TabsTrigger value="courses">Courses</TabsTrigger>
//                 <TabsTrigger value="users">Users</TabsTrigger>
//                 <TabsTrigger value="orders">Orders</TabsTrigger>
//                 <TabsTrigger value="admins">Admins</TabsTrigger>
//                 <TabsTrigger value="analytics">Analytics</TabsTrigger>
//               </TabsList>

//               {/* Courses Tab */}
//               <TabsContent value="courses" className="mt-6">
//                 <Card>
//                   <CardHeader>
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <CardTitle>Course Management</CardTitle>
//                         <CardDescription>
//                           Manage your courses, content, and pricing
//                         </CardDescription>
//                       </div>
//                       <div className="flex gap-2">
//                         <div className="relative">
//                           <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                           <Input
//                             placeholder="Search courses..."
//                             className="pl-10 w-64"
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                           />
//                         </div>
//                         <Button variant="outline" size="icon">
//                           <Filter className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {filteredCourses.map((course) => (
//                         <div
//                           key={course.id}
//                           className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
//                         >
//                           <img
//                             src={course.thumbnail || 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg'}
//                             alt={course.title}
//                             className="w-16 h-16 rounded-lg object-cover"
//                           />
//                           <div className="flex-1">
//                             <h3 className="font-semibold mb-1">{course.title}</h3>
//                             <p className="text-sm text-muted-foreground mb-2">
//                               {course.description?.substring(0, 100)}...
//                             </p>
//                             <div className="flex items-center gap-4">
//                               <Badge variant="secondary">{course.category}</Badge>
//                               <Badge variant={course.isActive ? 'default' : 'destructive'}>
//                                 {course.isActive ? 'Active' : 'Inactive'}
//                               </Badge>
//                               <span className="text-sm text-muted-foreground">
//                                 ₹{course.price}
//                               </span>
//                               <span className="text-sm text-muted-foreground">
//                                 {course.enrolledCount || 0} enrolled
//                               </span>
//                             </div>
//                           </div>
//                           <DropdownMenu>
//                             <DropdownMenuTrigger asChild>
//                               <Button variant="ghost" size="icon">
//                                 <MoreVertical className="h-4 w-4" />
//                               </Button>
//                             </DropdownMenuTrigger>
//                             <DropdownMenuContent align="end">
//                               <DropdownMenuItem asChild>
//                                 <Link href={`/admin/courses/${course.id}`}>
//                                   <Eye className="mr-2 h-4 w-4" />
//                                   View
//                                 </Link>
//                               </DropdownMenuItem>
//                               <DropdownMenuItem asChild>
//                                 <Link href={`/admin/courses/${course.id}/edit`}>
//                                   <Edit className="mr-2 h-4 w-4" />
//                                   Edit
//                                 </Link>
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 onClick={() => toggleCourseStatus(course.id, course.isActive)}
//                               >
//                                 <Settings className="mr-2 h-4 w-4" />
//                                 {course.isActive ? 'Deactivate' : 'Activate'}
//                               </DropdownMenuItem>
//                               <DropdownMenuItem
//                                 onClick={() => deleteCourse(course.id)}
//                                 className="text-red-600"
//                               >
//                                 <Trash2 className="mr-2 h-4 w-4" />
//                                 Delete
//                               </DropdownMenuItem>
//                             </DropdownMenuContent>
//                           </DropdownMenu>
//                         </div>
//                       ))}

//                       {filteredCourses.length === 0 && (
//                         <div className="text-center py-8 text-muted-foreground">
//                           <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                           <p>No courses found.</p>
//                           {searchTerm && (
//                             <p className="text-sm">Try adjusting your search criteria.</p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Users Tab */}
//               <TabsContent value="users" className="mt-6">
//                 <Card>
//                   <CardHeader>
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <CardTitle>User Management</CardTitle>
//                         <CardDescription>
//                           View and manage registered users
//                         </CardDescription>
//                       </div>
//                       <div className="relative">
//                         <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                         <Input
//                           placeholder="Search users..."
//                           className="pl-10 w-64"
//                           value={searchTerm}
//                           onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                       </div>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {filteredUsers.map((user) => (
//                         <div
//                           key={user.id}
//                           className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
//                         >
//                           <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
//                             <Users className="w-6 h-6 text-primary" />
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="font-semibold">{user.fullName}</h3>
//                             <p className="text-sm text-muted-foreground">{user.email}</p>
//                             <p className="text-sm text-muted-foreground">
//                               {user.location && `${user.location} • `}
//                               Joined {new Date(user.createdAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <Badge
//                               variant={user.isVerified ? 'default' : 'secondary'}
//                             >
//                               {user.isVerified ? 'Verified' : 'Pending'}
//                             </Badge>
//                             <p className="text-sm text-muted-foreground mt-1">
//                               {user.enrolledCourses?.length || 0} courses
//                             </p>
//                             {user.credits > 0 && (
//                               <p className="text-sm text-green-600 mt-1">
//                                 ₹{user.credits} credits
//                               </p>
//                             )}
//                           </div>
//                         </div>
//                       ))}

//                       {filteredUsers.length === 0 && (
//                         <div className="text-center py-8 text-muted-foreground">
//                           <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                           <p>No users found.</p>
//                           {searchTerm && (
//                             <p className="text-sm">Try adjusting your search criteria.</p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Orders Tab */}
//               <TabsContent value="orders" className="mt-6">
//                 <Card>
//                   <CardHeader>
//                     <CardTitle>Recent Orders</CardTitle>
//                     <CardDescription>
//                       Track course purchases and payments
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       {recentOrders.map((order) => (
//                         <div
//                           key={order.id}
//                           className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
//                         >
//                           <div className="w-12 h-12 bg-green-50 dark:bg-green-950 rounded-full flex items-center justify-center">
//                             <DollarSign className="w-6 h-6 text-green-600" />
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="font-semibold">{order.courseName}</h3>
//                             <p className="text-sm text-muted-foreground">
//                               by {order.userName}
//                             </p>
//                             <p className="text-sm text-muted-foreground">
//                               {new Date(order.createdAt).toLocaleDateString()}
//                             </p>
//                           </div>
//                           <div className="text-right">
//                             <p className="font-semibold">₹{order.amount}</p>
//                             <Badge
//                               variant={
//                                 order.status === 'completed'
//                                   ? 'default'
//                                   : order.status === 'pending'
//                                     ? 'secondary'
//                                     : 'destructive'
//                               }
//                             >
//                               {order.status}
//                             </Badge>
//                           </div>
//                         </div>
//                       ))}

//                       {recentOrders.length === 0 && (
//                         <div className="text-center py-8 text-muted-foreground">
//                           <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
//                           <p>No recent orders found.</p>
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Admins Tab */}
//               <TabsContent value="admins" className="mt-6">
//                 <Card>
//                   <CardHeader>
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <CardTitle>Administrator Overview</CardTitle>
//                         <CardDescription>
//                           Quick view of admin accounts and recent activity
//                         </CardDescription>
//                       </div>
//                       <Link href="/admin/admins">
//                         <Button className="flex items-center gap-2">
//                           <Shield className="w-4 h-4" />
//                           Manage All Admins
//                         </Button>
//                       </Link>
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="grid md:grid-cols-2 gap-6 mb-6">
//                       <div className="p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <Shield className="w-8 h-8 text-purple-600" />
//                           <div>
//                             <p className="text-2xl font-bold">{stats.totalAdmins || 0}</p>
//                             <p className="text-sm text-muted-foreground">Total Administrators</p>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <UserPlus className="w-8 h-8 text-green-600" />
//                           <div>
//                             <p className="text-2xl font-bold">{stats.activeAdmins || 0}</p>
//                             <p className="text-sm text-muted-foreground">Active Administrators</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-4">
//                       <h4 className="font-semibold">Recent Admin Activity</h4>
//                       {recentAdmins.slice(0, 3).map((admin) => (
//                         <div
//                           key={admin.id}
//                           className="flex items-center gap-4 p-3 border rounded-lg"
//                         >
//                           <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
//                             <Shield className="w-5 h-5 text-purple-600" />
//                           </div>
//                           <div className="flex-1">
//                             <h5 className="font-medium">{admin.fullName}</h5>
//                             <p className="text-sm text-muted-foreground">{admin.email}</p>
//                           </div>
//                           <Badge variant={admin.isActive ? 'default' : 'secondary'}>
//                             {admin.isActive ? 'Active' : 'Inactive'}
//                           </Badge>
//                         </div>
//                       ))}

//                       {recentAdmins.length === 0 && (
//                         <div className="text-center py-6 text-muted-foreground">
//                           <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                           <p className="text-sm">No admin data available</p>
//                         </div>
//                       )}
//                     </div>
//                   </CardContent>
//                 </Card>
//               </TabsContent>

//               {/* Analytics Tab */}
//               <TabsContent value="analytics" className="mt-6">
//                 <div className="grid md:grid-cols-2 gap-6">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Revenue Overview</CardTitle>
//                       <CardDescription>
//                         Monthly revenue and growth trends
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
//                         <BarChart3 className="w-12 h-12 mb-4" />
//                         <p>Revenue chart integration coming soon</p>
//                         <p className="text-sm">Connect with analytics service</p>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Course Performance</CardTitle>
//                       <CardDescription>
//                         Top performing courses by enrollment
//                       </CardDescription>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {courses.slice(0, 5).map((course, index) => (
//                           <div key={course.id} className="flex items-center gap-3">
//                             <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
//                               {index + 1}
//                             </div>
//                             <div className="flex-1">
//                               <p className="font-medium text-sm">{course.title}</p>
//                               <p className="text-xs text-muted-foreground">
//                                 {course.enrolledCount || 0} students
//                               </p>
//                             </div>
//                             <Badge variant="outline">
//                               ₹{course.price}
//                             </Badge>
//                           </div>
//                         ))}

//                         {courses.length === 0 && (
//                           <div className="text-center py-6 text-muted-foreground">
//                             <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
//                             <p className="text-sm">No course data available</p>
//                           </div>
//                         )}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </motion.div>
//         </div>
//       </main>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  BookOpen,
  DollarSign,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  Award,
  Shield,
  UserPlus,
  Settings,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import Link from 'next/link';
import AdminNavbar from '@/components/admin-navbar';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeStudents: 0,
    completionRate: 0,
    newEnrollments: 0,
    totalAdmins: 0,
    activeAdmins: 0
  });
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentAdmins, setRecentAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setCourses(data.courses);
        setUsers(data.users);
        setRecentOrders(data.recentOrders);
        setRecentAdmins(data.recentAdmins || []);
      } else {
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
        },
      });

      if (response.ok) {
        toast.success('Course deleted successfully');
        fetchAdminData();
      } else {
        toast.error('Error deleting course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Error deleting course');
    }
  };

  const toggleCourseStatus = async (courseId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
        },
      });

      if (response.ok) {
        toast.success(`Course ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        fetchAdminData();
      } else {
        toast.error('Error updating course status');
      }
    } catch (error) {
      console.error('Error toggling course status:', error);
      toast.error('Error updating course status');
    }
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminStats = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      change: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950',
      change: '+8.2%',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      change: '+23.1%',
      trend: 'up'
    },
    {
      title: 'Active Students',
      value: stats.activeStudents,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950',
      change: '+5.4%',
      trend: 'up'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your courses, users, and track platform performance.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/admin/admins">
                <Button variant="outline" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Manage Admins
                </Button>
              </Link>
              <Link href="/admin/courses/create">
                <Button className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Course
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {adminStats.map((stat, index) => (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/admin/admins">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950 rounded-lg flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Administrator Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Add and manage admin accounts
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        {stats.totalAdmins || 0} Admins
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/admin/courses/create">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-950 rounded-lg flex items-center justify-center">
                      <Plus className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Create New Course</h3>
                      <p className="text-sm text-muted-foreground">
                        Add courses with content and pricing
                      </p>
                      <Badge variant="secondary" className="mt-2">
                        Quick Action
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Analytics Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      View detailed platform analytics
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      Coming Soon
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Tabs defaultValue="courses" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="courses">Courses</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="admins">Admins</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Courses Tab */}
              <TabsContent value="courses" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Course Management</CardTitle>
                        <CardDescription>
                          Manage your courses, content, and pricing
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search courses..."
                            className="pl-10 w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <Button variant="outline" size="icon">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredCourses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <img
                            src={course.thumbnail || 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg'}
                            alt={course.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{course.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              {course.description?.substring(0, 100)}...
                            </p>
                            <div className="flex items-center gap-4">
                              <Badge variant="secondary">{course.category}</Badge>
                              <Badge variant={course.isActive ? 'default' : 'destructive'}>
                                {course.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                ₹{course.price}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {course.enrolledCount || 0} enrolled
                              </span>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/courses/${course.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/courses/${course.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleCourseStatus(course.id, course.isActive)}
                              >
                                <Settings className="mr-2 h-4 w-4" />
                                {course.isActive ? 'Deactivate' : 'Activate'}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => deleteCourse(course.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}

                      {filteredCourses.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No courses found.</p>
                          {searchTerm && (
                            <p className="text-sm">Try adjusting your search criteria.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>
                          View and manage registered users
                        </CardDescription>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          className="pl-10 w-64"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{user.fullName}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground">
                              {user.location && `${user.location} • `}
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant={user.isVerified ? 'default' : 'secondary'}
                            >
                              {user.isVerified ? 'Verified' : 'Pending'}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {user.enrolledCourses?.length || 0} courses
                            </p>
                            {user.credits > 0 && (
                              <p className="text-sm text-green-600 mt-1">
                                ₹{user.credits} credits
                              </p>
                            )}
                          </div>
                        </div>
                      ))}

                      {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No users found.</p>
                          {searchTerm && (
                            <p className="text-sm">Try adjusting your search criteria.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>
                      Track course purchases and payments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-12 h-12 bg-green-50 dark:bg-green-950 rounded-full flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{order.courseName}</h3>
                            <p className="text-sm text-muted-foreground">
                              by {order.userName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">₹{order.amount}</p>
                            <Badge
                              variant={
                                order.status === 'completed'
                                  ? 'default'
                                  : order.status === 'pending'
                                    ? 'secondary'
                                    : 'destructive'
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}

                      {recentOrders.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No recent orders found.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Admins Tab */}
              <TabsContent value="admins" className="mt-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Administrator Overview</CardTitle>
                        <CardDescription>
                          Quick view of admin accounts and recent activity
                        </CardDescription>
                      </div>
                      <Link href="/admin/admins">
                        <Button className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Manage All Admins
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="p-4 bg-purple-50 dark:bg-purple-950/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Shield className="w-8 h-8 text-purple-600" />
                          <div>
                            <p className="text-2xl font-bold">{stats.totalAdmins || 0}</p>
                            <p className="text-sm text-muted-foreground">Total Administrators</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-green-50 dark:bg-green-950/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <UserPlus className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="text-2xl font-bold">{stats.activeAdmins || 0}</p>
                            <p className="text-sm text-muted-foreground">Active Administrators</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold">Recent Admin Activity</h4>
                      {recentAdmins.slice(0, 3).map((admin) => (
                        <div
                          key={admin.id}
                          className="flex items-center gap-4 p-3 border rounded-lg"
                        >
                          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                            <Shield className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium">{admin.fullName}</h5>
                            <p className="text-sm text-muted-foreground">{admin.email}</p>
                          </div>
                          <Badge variant={admin.isActive ? 'default' : 'secondary'}>
                            {admin.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      ))}

                      {recentAdmins.length === 0 && (
                        <div className="text-center py-6 text-muted-foreground">
                          <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No admin data available</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Overview</CardTitle>
                      <CardDescription>
                        Monthly revenue and growth trends
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
                        <BarChart3 className="w-12 h-12 mb-4" />
                        <p>Revenue chart integration coming soon</p>
                        <p className="text-sm">Connect with analytics service</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Course Performance</CardTitle>
                      <CardDescription>
                        Top performing courses by enrollment
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {courses.slice(0, 5).map((course, index) => (
                          <div key={course.id} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{course.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {course.enrolledCount || 0} students
                              </p>
                            </div>
                            <Badge variant="outline">
                              ₹{course.price}
                            </Badge>
                          </div>
                        ))}

                        {courses.length === 0 && (
                          <div className="text-center py-6 text-muted-foreground">
                            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No course data available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  );
}