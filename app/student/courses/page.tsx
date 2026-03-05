'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CourseFilter } from '@/components/ui/student/CourseFilter';
import { CourseCard } from '@/components/ui/student/CourseCard';
import { Course } from '@/types/course';

// Mock Data chuẩn theo Database Schema
const MOCK_COURSES: Course[] = [
  {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6", // UNIQUEIDENTIFIER format
    centerId: "123e4567-e89b-12d3-a456-426614174000",
    courseName: "B1 Standard Manual",
    licenseType: "B1",
    description: "Foundational manual transmission training. Includes 20 hours of road practice.",
    price: 12500000, // DECIMAL format in DB -> number in TS
    isActive: true,
    createdAt: "2024-03-04T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
    duration: "4 Weeks"
  },
  {
    id: "4ea85f64-5717-4562-b3fc-2c963f66afa7",
    centerId: "123e4567-e89b-12d3-a456-426614174000",
    courseName: "B2 Premium Automatic",
    licenseType: "B2",
    description: "Master automatic driving with flexible scheduling and comprehensive exam prep.",
    price: 15000000,
    isActive: true,
    createdAt: "2024-03-04T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
    duration: "6 Weeks"
  },
  {
    id: "5fa85f64-5717-4562-b3fc-2c963f66afa8",
    centerId: "123e4567-e89b-12d3-a456-426614174000",
    courseName: "Class C Heavy Vehicle",
    licenseType: "Class C",
    description: "Professional commercial truck driving license for career growth in logistics.",
    price: 18900000,
    isActive: true,
    createdAt: "2024-03-04T10:00:00Z",
    imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
    duration: "10 Weeks"
  }
];

export default function StudentExploreCoursesPage() {
  const router = useRouter();

  const handleEnroll = (courseId: string) => {
    // Luồng Enroll: Đẩy student sang trang checkout kèm CourseId (GUID)
    router.push(`/checkout?courseId=${courseId}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <CourseFilter />

      <section className="flex-1">
        {/* Phần Header & Grid View Buttons (giữ nguyên như trước) ... */}
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {MOCK_COURSES.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onEnroll={handleEnroll} 
            />
          ))}
        </div>
        
        {/* Phần Pagination (giữ nguyên như trước) ... */}
      </section>
    </div>
  );
}