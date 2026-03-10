import React from 'react';
import { ClassDetailData } from '@/types/class';
import { ClassDetailHeader } from '@/components/manager/ClassManagement/ClassDetail/ClassDetailHeader';
import { ClassInfoCard } from '@/components/manager/ClassManagement/ClassDetail/ClassInfoCard';
import { EnrolledStudents } from '@/components/manager/ClassManagement/ClassDetail/EnrolledStudents';
import { ClassSidePanel } from '@/components/manager/ClassManagement/ClassDetail/ClassSidePanel';
import styles from './ClassDetail.module.css';

// Mock Data chuẩn Domain Lái Xe
const getMockClassDetail = async (id: string): Promise<ClassDetailData> => {
  return {
    id: id,
    courseId: 'c1',
    className: 'Class B2-Jan2026',
    startDate: '2026-01-05',
    endDate: '2026-03-30',
    courseName: 'Standard Car B2',
    licenseType: 'B2',
    studentCount: 24,
    location: 'Yard A - Practice Track',
    progressPercent: 44,
    instructor: {
      id: 'inst-1',
      fullName: 'Marcus Johnson',
      email: 'marcus.j@drivemaster.com',
      phone: '+1 (555) 123-4567'
    },
    students: [
      { id: 's1', fullName: 'Jane Smith', email: 'jane.smith@example.com', enrollDate: '2025-12-12' },
      { id: 's2', fullName: 'Michael Chen', email: 'm.chen@university.edu', enrollDate: '2025-12-15' },
      { id: 's3', fullName: 'Robert Wilson', email: 'robert.wilson@corp.com', enrollDate: '2026-01-02' },
      { id: 's4', fullName: 'Sarah Garcia', email: 'sarah.g@designstudio.io', enrollDate: '2026-01-05' },
    ]
  };
};

export default async function ClassDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const data = await getMockClassDetail(params.id);

  return (
    <div className={styles.pageWrapper}>
      {/* Header đã bao gồm Breadcrumbs, Tiêu đề và Nút Edit (kèm Modal) */}
      <ClassDetailHeader data={data} />

      <div className={styles.contentGrid}>
        {/* Cột trái (Rộng hơn) */}
        <div className={styles.mainContent}>
          <ClassInfoCard data={data} />
          <EnrolledStudents students={data.students} totalCount={data.studentCount} />
        </div>

        {/* Cột phải (Sidebar hẹp) */}
        <div>
          <ClassSidePanel data={data} />
        </div>
      </div>
    </div>
  );
}