import React from 'react';
import { Course } from '@/types/course';
import { CourseFilters } from '@/components/manager/CourseManagement/CourseFilter';
import { CourseTable } from '@/components/manager/CourseManagement/CourseTable'
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import Link from 'next/link';
import { CoursePageHeader } from '@/components/manager/CourseManagement/CoursePageHeader';

const MOCK_COURSES: Course[] = [
  { id: '1', centerId: 'center-1', courseName: 'Standard Car B2', description: '20 Sessions • Private Instructor', licenseType: 'B2', price: 1200, isActive: true, icon: 'directions_car' },
  { id: '2', centerId: 'center-1', courseName: 'Premium Automatic B1', description: '24 Sessions • Luxury Fleet', licenseType: 'B1', price: 1550, isActive: true, icon: 'minor_crash' },
  { id: '3', centerId: 'center-1', courseName: 'Motorcycle Basics A1', description: '12 Sessions • Gear Included', licenseType: 'A1', price: 450, isActive: false, icon: 'moped' },
  { id: '4', centerId: 'center-1', courseName: 'Heavy Truck License C', description: '30 Sessions • Advanced Certification', licenseType: 'C', price: 2100, isActive: true, icon: 'local_shipping' },
];

export default async function CourseManagementPage() {
  // Lợi thế của Server Component: Bạn có thể fetch DB trực tiếp ở đây
  const courses = MOCK_COURSES;
  const breadcrumbs = [
    { label: 'Dashboard', href: '/training/dashboard' },
    { label: 'Courses' } // Trang hiện tại không cần href
  ];

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <Breadcrumbs items={breadcrumbs} />
      
      <CoursePageHeader />

      <CourseFilters />
      
      <CourseTable courses={courses} />
    </div>
  );
}