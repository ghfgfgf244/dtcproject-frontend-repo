// src/app/(manager)/training-manager/courses/page.tsx
import React from 'react';
import CourseClientView from '@/components/manager/CourseManagement/CourseClientView';

export default function CourseManagementPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        <CourseClientView />
      </div>
    </div>
  );
}