// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\types\course.ts

import { ExamLevelLabel } from "@/constants/exam-levels";

export type LicenseType = ExamLevelLabel;
export type CourseStatus = 'Hoạt động' | 'Ngừng hoạt động';

export interface LearningRoadmapItem {
  id: string;
  courseId: string;
  orderNo: number;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  centerId: string;
  courseName: string;
  licenseType: string;
  durationInWeeks: number;
  maxStudents: number;
  thumbnailUrl?: string;
  description: string;
  price: number;
  isActive: boolean;
  centerName?: string;
  centerAddress?: string;
  learningRoadmap?: LearningRoadmapItem[];
  createdAt: string;
}

// Keeping CourseRecord for potential internal usage (if any)
export interface CourseRecord {
  id: string;
  name: string;
  description: string;
  licenseType: LicenseType;
  price: number; 
  status: CourseStatus;
}
