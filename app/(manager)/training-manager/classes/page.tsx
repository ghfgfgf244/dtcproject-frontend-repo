import React from 'react';
import { ClassItem } from '@/types/class';
import { ClassTable } from '@/components/manager/ClassManagement/ClassTable';
import { ClassActionCards } from '@/components/manager/ClassManagement/ClassActionCards';

// Mock Data
const MOCK_CLASSES: ClassItem[] = [
  { id: 'cls-01', courseId: 'c1', className: 'Class B2-Jan2026', startDate: '2026-01-05', endDate: '2026-03-30', courseName: 'Standard Car B2', licenseType: 'B2', studentCount: 24 },
  { id: 'cls-02', courseId: 'c2', className: 'Class B1-Feb2026', startDate: '2026-02-10', endDate: '2026-05-15', courseName: 'Premium Automatic B1', licenseType: 'B1', studentCount: 18 },
  { id: 'cls-03', courseId: 'c3', className: 'Class A1-Mar2026', startDate: '2026-03-12', endDate: '2026-06-12', courseName: 'Motorcycle Basics A1', licenseType: 'A1', studentCount: 32 },
  { id: 'cls-04', courseId: 'c4', className: 'Class C-Apr2026',  startDate: '2026-04-01', endDate: '2026-08-15', courseName: 'Heavy Truck License C', licenseType: 'C', studentCount: 12 },
];

export default async function ClassManagementPage() {
  const classes = MOCK_CLASSES;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Table Component giờ đã chứa Header, Stats và Modal */}
      <ClassTable classes={classes} />

      {/* Tùy chọn: Giữ lại Action Cards ở dưới cùng nếu bạn muốn */}
      <div className="mt-8">
        <ClassActionCards />
      </div>
    </div>
  );
}