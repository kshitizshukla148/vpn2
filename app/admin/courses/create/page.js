'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import Link from 'next/link';
import Navbar from '@/components/navbar';

const categories = [
  'Web Development',
  'Data Science',
  'Digital Marketing',
  'Mobile Development',
  'UI/UX Design',
  'Business',
  'AI & Machine Learning',
  'Cybersecurity'
];

const levels = ['Beginner', 'Intermediate', 'Advanced'];

export default function CreateCoursePage() {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    price: '',
    originalPrice: '',
    duration: '',
    thumbnail: '',
    features: [],
    learningOutcomes: []
  });

  const [courseContent, setCourseContent] = useState([]);
  const [newFeature, setNewFeature] = useState('');
  const [newOutcome, setNewOutcome] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const router = useRouter();

  const handleInputChange = (field, value) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setCourseData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setCourseData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addOutcome = () => {
    if (newOutcome.trim()) {
      setCourseData(prev => ({
        ...prev,
        learningOutcomes: [...prev.learningOutcomes, newOutcome.trim()]
      }));
      setNewOutcome('');
    }
  };

  const removeOutcome = (index) => {
    setCourseData(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index)
    }));
  };

  const addContentSection = () => {
    setCourseContent(prev => [...prev, {
      id: Date.now(),
      title: '',
      description: '',
      videoUrl: '',
      resources: []
    }]);
  };

  const updateContentSection = (id, field, value) => {
    setCourseContent(prev => prev.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const removeContentSection = (id) => {
    setCourseContent(prev => prev.filter(section => section.id !== id));
  };

  const handleThumbnailUpload = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'course_thumbnails');

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      toast.error('Failed to upload thumbnail');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!courseData.title || !courseData.description || !courseData.category || !courseData.level || !courseData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      let thumbnailUrl = courseData.thumbnail;

      // Upload thumbnail if file is selected
      if (thumbnailFile) {
        thumbnailUrl = await handleThumbnailUpload(thumbnailFile);
        if (!thumbnailUrl) {
          setIsLoading(false);
          return;
        }
      }

      const response = await fetch('/api/admin/courses/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${document.cookie.split('auth-token=')[1]?.split(';')[0]}`,
        },
        body: JSON.stringify({
          ...courseData,
          thumbnail: thumbnailUrl,
          content: courseContent,
          price: parseFloat(courseData.price),
          originalPrice: courseData.originalPrice ? parseFloat(courseData.originalPrice) : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Course created successfully!');
        router.push('/admin');
      } else {
        toast.error(data.message || 'Failed to create course');
      }
    } catch (error) {
      console.error('Course creation error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/admin">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Create New Course</h1>
              <p className="text-muted-foreground">
                Add a new course to your platform with content and resources.
              </p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Course Title *</Label>
                      <Input
                        id="title"
                        placeholder="Enter course title"
                        value={courseData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        placeholder="e.g., 40 hours"
                        value={courseData.duration}
                        onChange={(e) => handleInputChange('duration', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what students will learn in this course"
                      rows={4}
                      value={courseData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="level">Level *</Label>
                      <Select onValueChange={(value) => handleInputChange('level', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          {levels.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="2999"
                        value={courseData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (₹)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        placeholder="5999"
                        value={courseData.originalPrice}
                        onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Thumbnail */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Course Thumbnail</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail-file">Upload Thumbnail</Label>
                    <Input
                      id="thumbnail-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setThumbnailFile(e.target.files[0])}
                    />
                  </div>
                  <div className="text-center text-muted-foreground">OR</div>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail-url">Thumbnail URL</Label>
                    <Input
                      id="thumbnail-url"
                      placeholder="https://example.com/image.jpg"
                      value={courseData.thumbnail}
                      onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Course Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a course feature"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <Button type="button" onClick={addFeature}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courseData.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-2">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-xs hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Learning Outcomes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Learning Outcomes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="What will students learn?"
                      value={newOutcome}
                      onChange={(e) => setNewOutcome(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOutcome())}
                    />
                    <Button type="button" onClick={addOutcome}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {courseData.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <span className="flex-1">{outcome}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOutcome(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Course Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Course Content</CardTitle>
                    <Button type="button" onClick={addContentSection} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {courseContent.map((section, index) => (
                    <div key={section.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Section {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeContentSection(section.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Section Title</Label>
                          <Input
                            placeholder="Enter section title"
                            value={section.title}
                            onChange={(e) => updateContentSection(section.id, 'title', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Video URL</Label>
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="YouTube video URL"
                              value={section.videoUrl}
                              onChange={(e) => updateContentSection(section.id, 'videoUrl', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Section Description</Label>
                        <Textarea
                          placeholder="Describe what this section covers"
                          rows={3}
                          value={section.description}
                          onChange={(e) => updateContentSection(section.id, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  
                  {courseContent.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No content sections added yet.</p>
                      <p className="text-sm">Click "Add Section" to start building your course content.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              className="flex justify-end gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link href="/admin">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
                {isLoading ? 'Creating Course...' : 'Create Course'}
              </Button>
            </motion.div>
          </form>
        </div>
      </main>
    </div>
  );
}