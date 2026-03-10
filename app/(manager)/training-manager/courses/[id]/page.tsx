import React from 'react';
import { Course } from '@/types/course';
import { CourseHeader } from '@/components/manager/CourseManagement/CourseDetail/CourseHeader';
import { CourseContent } from '@/components/manager/CourseManagement/CourseDetail/CourseContent';
import { CourseSidePanel } from '@/components/manager/CourseManagement/CourseDetail/CourseSidePanel';
import styles from './CourseDetail.module.css';

// Mock Fetching Logic (Thay thế bằng call API DB sau này)
const getCourseDetail = async (id: string): Promise<Course> => {
  // Giả lập delay mạng
  await new Promise(resolve => setTimeout(resolve, 500)); 

  return {
    id: id,
    centerId: 'center-123',
    courseName: 'B2 Standard Driving Package',
    licenseType: 'B2',
    description: 'The B2 Standard Driving Package is our most popular program designed for individuals seeking a professional passenger vehicle license. This comprehensive curriculum covers theoretical traffic law, practical basic driving maneuvers, and intensive road training. Our certified instructors ensure students develop safe driving habits and high confidence for the national certification exam.',
    price: 15000000,
    isActive: true,
    createdAt: '2023-10-12T09:45:00Z',
    createdBy: 'Admin Nguyen Van A',
    updatedAt: '2024-01-24T14:30:00Z',
  };
};

export default async function CourseDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const course = await getCourseDetail(params.id);

  return (
    <div>
      <CourseHeader course={course} />
      
      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <CourseContent course={course} />
        </div>
        <div>
          <CourseSidePanel course={course} />
        </div>
      </div>
    </div>
  );
}