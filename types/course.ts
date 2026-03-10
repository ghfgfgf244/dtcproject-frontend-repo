export type LicenseType = 'A1' | 'A2' | 'B1' | 'B2' | 'C' | 'D' | 'E' | 'F' | string;

export interface CourseItem {
  id: string;
  centerId?: string;
  courseName: string;
  licenseType: string; // VD: B1, B2, C
  description: string;
  price: number;
  isActive: boolean; // Thay thế cho status kiểu string
  
  // Các trường Audit
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}