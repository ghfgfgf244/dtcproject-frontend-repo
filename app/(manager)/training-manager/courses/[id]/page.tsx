// src/app/(manager)/training-manager/courses/[id]/page.tsx
import React from 'react';
import { MOCK_COURSE_DETAIL } from '@/constants/course-data';
import CourseDetailClientView from '@/components/manager/CourseManagement/CourseDetail/CourseDetailClientView';
// Thông thường bạn sẽ lấy param `id` ở đây để gọi API fetch chi tiết khóa học.
export default function CourseDetailPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        {/* Truyền dữ liệu chi tiết vào Client Component */}
        <CourseDetailClientView course={MOCK_COURSE_DETAIL} />
      </div>
    </div>
  );
}