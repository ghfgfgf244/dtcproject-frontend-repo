import React from 'react';
import { CourseTable } from '@/components/manager/CourseManagement/CourseTable';
import { CourseItem } from '@/types/course';

// Mock Data bám sát Schema
const MOCK_COURSES: CourseItem[] = [
  { id: 'c1', courseName: 'Standard Car B2', description: 'Complete program for manual passenger cars up to 9 seats.', price: 18500000, durationMonths: 3, status: 'Active', category: 'Car' },
  { id: 'c2', courseName: 'Premium Automatic B1', description: 'Automatic transmission only. Focus on safety and urban driving.', price: 16000000, durationMonths: 3, status: 'Active', category: 'Car' },
  { id: 'c3', courseName: 'Motorcycle Basics A1', description: 'Standard license for two-wheeled vehicles up to 175cc.', price: 1200000, durationMonths: 1, status: 'Active', category: 'Motorcycle' },
  { id: 'c4', courseName: 'Heavy Truck License C', description: 'Commercial driving license for trucks exceeding 3,500kg.', price: 22000000, durationMonths: 5, status: 'Draft', category: 'Truck' },
];

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <CourseTable courses={MOCK_COURSES} />
    </div>
  );
}