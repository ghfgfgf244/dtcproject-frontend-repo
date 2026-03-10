import React from 'react';
import { CourseTable } from '@/components/manager/CourseManagement/CourseTable';
import { CourseItem } from '@/types/course';

// Mock Data chuẩn DB Schema (Sử dụng licenseType và isActive)
const MOCK_COURSES: CourseItem[] = [
  { id: 'c1', courseName: 'Standard Car B2', licenseType: 'B2', description: 'Complete program for manual passenger cars up to 9 seats.', price: 18500000, isActive: true, createdAt: '2026-01-10T00:00:00Z' },
  { id: 'c2', courseName: 'Premium Automatic B1', licenseType: 'B1', description: 'Automatic transmission only. Focus on safety and urban driving.', price: 16000000, isActive: true, createdAt: '2026-02-15T00:00:00Z' },
  { id: 'c3', courseName: 'Motorcycle Basics A1', licenseType: 'A1', description: 'Standard license for two-wheeled vehicles up to 175cc.', price: 1200000, isActive: true, createdAt: '2026-03-20T00:00:00Z' },
  { id: 'c4', courseName: 'Heavy Truck License C', licenseType: 'C', description: 'Commercial driving license for trucks exceeding 3,500kg.', price: 22000000, isActive: false, createdAt: '2026-04-05T00:00:00Z' },
];

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <CourseTable courses={MOCK_COURSES} />
    </div>
  );
}