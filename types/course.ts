// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\types\course.ts

export type LicenseType = 'A1' | 'B1' | 'B' | 'C';
export type CourseStatus = 'Hoạt động' | 'Ngừng hoạt động';

export interface LearningRoadmapItem {
  id: string;
  courseId: string;
  orderNo: number;
  title: string;
  type: string;
  content: string;
  attachmentUrl?: string;
  status: boolean;
  isDeleted: boolean;
  createdAt: string;
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