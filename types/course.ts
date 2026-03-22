// src/types/course.ts

export type LicenseType = 'A1' | 'B1' | 'B2' | 'C';
export type CourseStatus = 'Hoạt động' | 'Ngừng hoạt động';

export interface CourseRecord {
  id: string;
  name: string;
  description: string;
  licenseType: LicenseType;
  price: number; // Lưu theo VNĐ
  status: CourseStatus;
}