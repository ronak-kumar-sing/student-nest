"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VerifyBadge } from '@/components/room-sharing/VerifyBadge';
import {
  MessageCircle,
  MapPin,
  GraduationCap,
  Calendar,
  User,
  Shield,
  Star,
  Clock,
  Home,
  Music,
  Users
} from 'lucide-react';
import { toast } from 'sonner';

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id;
  const [student, setStudent] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentProfile();
  }, [studentId]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);

      // Try to fetch student data from room sharing API
      const response = await fetch(`/api/room-sharing/list?studentId=${studentId}`);
      const data = await response.json();

      if (data.success) {
        // Find the student in sharing posts or create mock data
        let foundStudent = null;
        let foundAssessment = null;

        // Look through sharing posts to find student data
        for (const post of data.data || []) {
          const participant = post.participants.find(p => p.studentId === parseInt(studentId));
          if (participant && participant.student) {
            foundStudent = participant.student;
            foundAssessment = post.assessmentAnswers;
            break;
          }
        }

        // If not found in sharing posts, create mock data based on ID
        if (!foundStudent) {
          const mockStudents = {
            2: {
              id: 2,
              fullName: "Priya Sharma",
              avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b000?w=150&h=150&fit=crop&crop=face",
              collegeName: "Indian Institute of Technology, Delhi",
              course: "Computer Science Engineering",
              year: "3rd Year",
              emailVerified: true,
              phoneVerified: true,
              studentIdVerified: true,
              collegeVerified: true,
              bio: "Passionate computer science student looking for like-minded roommates who value cleanliness and academic focus.",
              interests: ["Coding", "Reading", "Music", "Fitness"]
            },
            4: {
              id: 4,
              fullName: "Arjun Kumar",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
              collegeName: "Delhi Technological University",
              course: "Mechanical Engineering",
              year: "2nd Year",
              emailVerified: true,
              phoneVerified: false,
              studentIdVerified: false,
              collegeVerified: false,
              bio: "Mechanical engineering student with interests in robotics and sports.",
              interests: ["Robotics", "Cricket", "Gaming", "Movies"]
            },
            5: {
              id: 5,
              fullName: "Anjali Singh",
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
              collegeName: "Delhi University",
              course: "Economics",
              year: "3rd Year",
              emailVerified: true,
              phoneVerified: true,
              studentIdVerified: true,
              collegeVerified: true,
              bio: "Economics student passionate about social work and community development.",
              interests: ["Economics", "Social Work", "Photography", "Travel"]
            }
          };

          foundStudent = mockStudents[parseInt(studentId)] || {
            id: parseInt(studentId),
            fullName: "Student User",
            avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`,
            collegeName: "University",
            course: "General Studies",
            year: "Student",
            emailVerified: true,
            phoneVerified: true,
            studentIdVerified: false,
            collegeVerified: true,
            bio: "Student looking for accommodation.",
            interests: ["Study", "Music", "Sports"]
          };
        }

        // Add common fields
        foundStudent.joinedDate = "2024-01-15";
        foundStudent.location = "New Delhi";

        setStudent(foundStudent);
        setAssessment(foundAssessment);
      } else {
        throw new Error('Failed to fetch student data');
      }
    } catch (error) {
      console.error('Error fetching student profile:', error);
      toast.error('Failed to load student profile');
    } finally {
      setLoading(false);
    }
  };

  const getPreferenceLabel = (key, value) => {
    const labels = {
      sleepSchedule: {
        early: 'Early Bird (9 PM - 6 AM)',
        moderate: 'Moderate (11 PM - 7 AM)',
        night: 'Night Owl (1 AM - 9 AM)'
      },
      cleanliness: {
        high: 'Very Clean',
        medium: 'Moderately Clean',
        low: 'Relaxed about Mess'
      },
      studyHabits: {
        quiet: 'Prefers Quiet',
        music: 'Studies with Music'
      },
      socialLevel: {
        introvert: 'Introvert',
        moderate: 'Moderately Social',
        social: 'Very Social'
      },
      cookingFrequency: {
        often: 'Cooks Often',
        sometimes: 'Cooks Sometimes',
        rarely: 'Rarely Cooks'
      },
      musicPreference: {
        quiet: 'Quiet Environment',
        moderate: 'Moderate Volume',
        loud: 'Enjoys Loud Music'
      },
      guestPolicy: {
        rare: 'Rarely Has Guests',
        occasional: 'Occasional Guests',
        frequent: 'Frequent Guests'
      }
    };

    return labels[key]?.[value] || value;
  };

  const getPreferenceIcon = (key) => {
    const icons = {
      sleepSchedule: Clock,
      cleanliness: Home,
      studyHabits: User,
      socialLevel: Users,
      cookingFrequency: Home,
      musicPreference: Music,
      guestPolicy: Users
    };

    return icons[key] || User;
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 space-y-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-800 rounded-lg h-48 w-full"></div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Student Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              The student profile you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={student.avatar} alt={student.fullName} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl">
                {student.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{student.fullName}</h1>
                <VerifyBadge
                  isVerified={student.emailVerified && student.phoneVerified &&
                    student.studentIdVerified && student.collegeVerified}
                  showText={true}
                />
              </div>

              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  <span>{student.course} - {student.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{student.collegeName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {new Date(student.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>

              {student.bio && (
                <p className="mt-3 text-gray-700 dark:text-gray-300">{student.bio}</p>
              )}

              <div className="flex gap-2 mt-4">
                <Button>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Email Verification</span>
              <Badge variant={student.emailVerified ? "default" : "secondary"}>
                {student.emailVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Phone Verification</span>
              <Badge variant={student.phoneVerified ? "default" : "secondary"}>
                {student.phoneVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Student ID Verification</span>
              <Badge variant={student.studentIdVerified ? "default" : "secondary"}>
                {student.studentIdVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>College Verification</span>
              <Badge variant={student.collegeVerified ? "default" : "secondary"}>
                {student.collegeVerified ? "Verified" : "Pending"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Living Preferences */}
        {assessment && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Living Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(assessment).map(([key, value]) => {
                const Icon = getPreferenceIcon(key);
                return (
                  <div key={key} className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
                      <span className="text-sm font-medium capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {getPreferenceLabel(key, value)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Interests */}
        {student.interests && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Interests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}