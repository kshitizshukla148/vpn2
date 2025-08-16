'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  Play, 
  Download,
  Users,
  Star,
  Gift,
  Copy,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth-provider';
import Navbar from '@/components/navbar';

export default function Dashboard() {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    certificatesEarned: 0,
    totalWatchTime: 0,
    credits: 0
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    if (user) {
      fetchUserData();
      setReferralCode(user.referralCode || '');
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/dashboard', {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserStats(data.stats);
        setEnrolledCourses(data.enrolledCourses);
        setRecentActivity(data.recentActivity);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/auth/register?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const downloadCertificate = async (courseId) => {
    try {
      const response = await fetch(`/api/certificates/download/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `certificate-${courseId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Certificate downloaded successfully!');
      } else {
        toast.error('Error downloading certificate');
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Error downloading certificate');
    }
  };

  const stats = [
    {
      title: 'Enrolled Courses',
      value: userStats.enrolledCourses,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950'
    },
    {
      title: 'Completed',
      value: userStats.completedCourses,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950'
    },
    {
      title: 'Certificates',
      value: userStats.certificatesEarned,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950'
    },
    {
      title: 'Credits',
      value: userStats.credits,
      icon: Gift,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950'
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user.fullName}! 👋
            </h1>
            <p className="text-muted-foreground">
              Continue your learning journey and track your progress.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {stats.map((stat, index) => (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Tabs defaultValue="enrolled" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="enrolled">Enrolled</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="certificates">Certificates</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="enrolled" className="mt-6">
                    <div className="space-y-4">
                      {enrolledCourses.filter(course => !course.completed).map((course) => (
                        <Card key={course.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <img
                                src={course.thumbnail || 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg'}
                                alt={course.title}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                                <p className="text-muted-foreground text-sm mb-3">{course.description}</p>
                                <div className="flex items-center gap-4 mb-3">
                                  <Badge variant="secondary">{course.category}</Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="w-4 h-4" />
                                    {course.duration}
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center text-sm">
                                    <span>Progress</span>
                                    <span>{course.progress}%</span>
                                  </div>
                                  <Progress value={course.progress} className="w-full" />
                                </div>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button className="flex items-center gap-2">
                                <Play className="w-4 h-4" />
                                Continue
                              </Button>
                                <Button variant="outline" size="sm" className="text-xs">
                                  View Content
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {enrolledCourses.filter(course => !course.completed).length === 0 && (
                        <Card>
                          <CardContent className="p-12 text-center">
                            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No enrolled courses yet.</p>
                            <Button className="mt-4">Browse Courses</Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="completed" className="mt-6">
                    <div className="space-y-4">
                      {enrolledCourses.filter(course => course.completed).map((course) => (
                        <Card key={course.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <img
                                src={course.thumbnail || 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg'}
                                alt={course.title}
                                className="w-20 h-20 rounded-lg object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
                                <p className="text-muted-foreground text-sm mb-3">{course.description}</p>
                                <div className="flex items-center gap-4">
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Completed
                                  </Badge>
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    Rate Course
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                className="flex items-center gap-2"
                                onClick={() => downloadCertificate(course.id)}
                                disabled={!course.canDownloadCertificate}
                              >
                                <Download className="w-4 h-4" />
                                Certificate
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {enrolledCourses.filter(course => course.completed).length === 0 && (
                        <Card>
                          <CardContent className="p-12 text-center">
                            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No completed courses yet.</p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="certificates" className="mt-6">
                    <div className="space-y-4">
                      {enrolledCourses.filter(course => course.completed && course.canDownloadCertificate).map((course) => (
                        <Card key={course.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center">
                                  <Award className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{course.title}</h3>
                                  <p className="text-muted-foreground">
                                    Completed on {new Date(course.completedAt).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Credential ID: {course.credentialId}
                                  </p>
                                </div>
                              </div>
                              <Button
                                className="flex items-center gap-2"
                                onClick={() => downloadCertificate(course.id)}
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {enrolledCourses.filter(course => course.completed && course.canDownloadCertificate).length === 0 && (
                        <Card>
                          <CardContent className="p-12 text-center">
                            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-muted-foreground">No certificates available yet.</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Certificates become available 30 days after course completion.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Referral Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5" />
                      Refer & Earn
                    </CardTitle>
                    <CardDescription>
                      Earn credits when your friends join and purchase courses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-primary/10 rounded-lg text-center">
                      <p className="text-2xl font-bold text-primary">{userStats.credits}</p>
                      <p className="text-sm text-muted-foreground">Available Credits</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="referral-code">Your Referral Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="referral-code"
                          value={referralCode}
                          readOnly
                          className="font-mono"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={copyReferralLink}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <p>• Earn 100 credits per successful referral</p>
                      <p>• Use credits for discounts on courses</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.title}</p>
                            <p className="text-xs text-muted-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No recent activity
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}