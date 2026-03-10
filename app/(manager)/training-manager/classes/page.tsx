import React from 'react';
import { ClassItem } from '@/types/class';
import { Breadcrumbs } from '@/components/manager/Shared/Breadcrumbs';
import { ClassStats } from '@/components/manager/ClassManagement/ClassStats';
import { ClassTable } from '@/components/manager/ClassManagement/ClassTable';
import { ClassActionCards } from '@/components/manager/ClassManagement/ClassActionCards';
import { ClassPageHeader } from '@/components/manager/ClassManagement/ClassPageHeader';

// Mock Data chuẩn Domain Lái Xe (Dựa trên DB Schema)
const MOCK_CLASSES: ClassItem[] = [
  { id: '1', courseId: 'c1', className: 'Class B2-Jan2026', startDate: '2026-01-05', endDate: '2026-03-30', courseName: 'Standard Car B2', licenseType: 'B2', studentCount: 24 },
  { id: '2', courseId: 'c2', className: 'Class B1-Feb2026', startDate: '2026-02-10', endDate: '2026-05-15', courseName: 'Premium Automatic B1', licenseType: 'B1', studentCount: 18 },
  { id: '3', courseId: 'c3', className: 'Class A1-Mar2026', startDate: '2026-03-12', endDate: '2026-06-12', courseName: 'Motorcycle Basics A1', licenseType: 'A1', studentCount: 32 },
  { id: '4', courseId: 'c4', className: 'Class C-Apr2026',  startDate: '2026-04-01', endDate: '2026-08-15', courseName: 'Heavy Truck License C', licenseType: 'C', studentCount: 12 },
];

export default async function ClassManagementPage() {
  const classes = MOCK_CLASSES; // Sau này thay bằng await fetch/DB call

  return (
    <div>
      {/* Header & Actions */}
      <ClassPageHeader/>

      {/* Stats */}
      <ClassStats />

      {/* Table */}
      <ClassTable classes={classes} />

      {/* Actions */}
      <ClassActionCards />
    </div>
  );
}