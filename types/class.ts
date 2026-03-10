// types/class.ts
import { LicenseType } from './course';

export interface ClassItem {
  id: string;               // UNIQUEIDENTIFIER
  courseId: string;         // UNIQUEIDENTIFIER FK
  className: string;        // NVARCHAR(255)
  startDate: string;        // DATE
  endDate: string;          // DATE
  
  // Các trường join từ bảng Courses để hiển thị UI
  courseName: string;       
  licenseType: LicenseType; 
  
  // Lấy từ Count() bảng ClassStudents
  studentCount: number;     
}
export interface UserBasicInfo {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface EnrolledStudent extends UserBasicInfo {
  enrollDate: string;
}

export interface ClassDetailData extends ClassItem {
  instructor: UserBasicInfo | null;
  students: EnrolledStudent[];
  location: string;
  progressPercent: number; // Mock data tiến độ lớp học
}