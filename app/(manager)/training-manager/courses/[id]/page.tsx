import React from 'react';
import { CourseItem } from '@/types/course';
import { CourseDetailHeader } from '@/components/manager/CourseManagement/CourseDetail/CourseDetailHeader';
import { CourseContent } from '@/components/manager/CourseManagement/CourseDetail/CourseContent';
import { CourseSidePanel } from '@/components/manager/CourseManagement/CourseDetail/CourseSidePanel';

// Mock Fetch Data
const getMockCourseDetail = async (id: string): Promise<CourseItem> => {
  return {
    id: id,
    courseName: 'Standard Car B2',
    licenseType: 'B2',
    description: 'Complete program for manual passenger cars up to 9 seats. Includes theoretical sessions, simulator practice, and on-road driving with certified instructors.',
    price: 18500000,
    isActive: true,
    createdAt: '2026-01-10T08:30:00Z',
    createdBy: 'admin-uuid-001',
    updatedAt: '2026-02-01T14:20:00Z',
  };
};

export default async function CourseDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // Resolve Promise của params (Fix lỗi Next.js 15)
  const resolvedParams = await params; 
  const courseId = resolvedParams.id;
  
  const courseData = await getMockCourseDetail(courseId);

  return (
    <div className="max-w-6xl mx-auto">
      <CourseDetailHeader course={courseData} />

      {/* Grid Layout chia cột (Content rộng 2 phần, SidePanel 1 phần) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <CourseContent course={courseData} />
        </div>
        <div className="lg:col-span-1">
          <CourseSidePanel course={courseData} />
        </div>
      </div>
    </div>
  );
}