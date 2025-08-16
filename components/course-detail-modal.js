'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Clock, Users, Star, IndianRupee, CheckCircle, Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth-provider';

export default function CourseDetailModal({ course, isOpen, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  if (!course) return null;

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Please login to purchase the course');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
        },
        body: JSON.stringify({
          courseId: course.id,
          amount: course.price,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: 'INR',
          name: 'VPN Academy',
          description: course.title,
          order_id: data.orderId,
          handler: async function (response) {
            try {
              const verifyResponse = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  courseId: course.id,
                }),
              });

              if (verifyResponse.ok) {
                toast.success('Payment successful! Course enrolled.');
                onClose();
                window.location.href = '/dashboard';
              } else {
                toast.error('Payment verification failed');
              }
            } catch (error) {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: user.fullName,
            email: user.email,
          },
          theme: {
            color: '#a855f7',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const courseFeatures = [
    'Lifetime Access',
    'Certificate of Completion',
    '24/7 Support',
    'Mobile & Desktop Access',
    'Downloadable Resources',
    'Community Access'
  ];

  const learningOutcomes = [
    'Master the fundamentals and advanced concepts',
    'Build real-world projects from scratch',
    'Get hands-on experience with industry tools',
    'Develop problem-solving skills',
    'Prepare for job interviews',
    'Join a community of learners'
  ];

  return (
    <>
      {/* Load Razorpay script */}
      {isOpen && (
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        />
      )}
      
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-background transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="relative">
                  <img
                    src={course.thumbnail || 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg'}
                    alt={course.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>

                  {/* Course Info Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant={course.level === 'Beginner' ? 'secondary' : course.level === 'Intermediate' ? 'default' : 'destructive'}>
                        {course.level}
                      </Badge>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {course.title}
                    </h2>
                    <div className="flex items-center gap-4 text-white/90">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.enrolled} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Description */}
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Course Description</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {course.description || 'This comprehensive course is designed to take you from beginner to expert level. You\'ll learn through hands-on projects, real-world examples, and expert guidance. Our curriculum is constantly updated to reflect industry best practices and emerging trends.'}
                        </p>
                      </div>

                      <Separator />

                      {/* What You'll Learn */}
                      <div>
                        <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {learningOutcomes.map((outcome, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{outcome}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      {/* Course Features */}
                      <div>
                        <h3 className="text-xl font-semibold mb-4">Course Features</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {courseFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center gap-3">
                              <Award className="w-5 h-5 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                      <Card className="sticky top-6">
                        <CardContent className="p-6">
                          {/* Price */}
                          <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <IndianRupee className="w-6 h-6" />
                              <span className="text-3xl font-bold">{course.price}</span>
                              {course.originalPrice && (
                                <span className="text-lg text-muted-foreground line-through">
                                  ₹{course.originalPrice}
                                </span>
                              )}
                            </div>
                            {course.originalPrice && (
                              <div className="text-sm text-green-600 font-medium">
                                Save ₹{course.originalPrice - course.price} ({Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off)
                              </div>
                            )}
                          </div>

                          {/* Purchase Button */}
                          <Button 
                            className="w-full mb-4" 
                            size="lg"
                            onClick={handlePurchase}
                            disabled={isLoading}
                          >
                            {isLoading ? 'Processing...' : 'Buy Course'}
                          </Button>

                          <div className="text-center text-sm text-muted-foreground mb-4">
                            30-day money-back guarantee
                          </div>

                          <Separator className="my-4" />

                          {/* Course Stats */}
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Duration</span>
                              <span className="font-medium">{course.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Students</span>
                              <span className="font-medium">{course.enrolled}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Level</span>
                              <span className="font-medium">{course.level}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Language</span>
                              <span className="font-medium">English</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Certificate</span>
                              <span className="font-medium">Yes</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}