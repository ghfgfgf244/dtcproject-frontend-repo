import { SessionCategory } from "./schedule";

export type CourseStatus = 'Active' | 'Draft' | 'Inactive';

export interface CourseListItem {
  id: string;
  name: string;
  licenseType: string;
  price: number;
  status: CourseStatus;
  lessons: number;
  exams: number;
}

// 3.6.1 Course Management
export interface CourseDTO {
  id: string;
  courseName: string;
  licenseType: string; // B1, B2, C...
  price: number;
  description: string;
  isActive: boolean;
  centerId: string;
  roadmapCount?: number; // Số lượng giai đoạn trong roadmap
  resourceCount?: number; // Số lượng tài liệu đính kèm
}

// 3.6.2 Class & Schedule Management
export interface ClassDTO {
  id: string;
  courseId: string;
  courseName?: string; 
  className: string;
  startDate: string;
  endDate: string;
  studentCount?: number;
}

export interface ClassScheduleUpdateDTO {
  classId: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  location: string;
}

// 3.6.3 Exam Management
export interface ExamDTO {
  id: string;
  courseId: string;
  courseName?: string;
  examName: string;
  examDate: string;
  examType: 'Theory' | 'Practice';
}

// 3.6.4 Instructor Management
export interface InstructorDTO {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  centerId: string;
}
