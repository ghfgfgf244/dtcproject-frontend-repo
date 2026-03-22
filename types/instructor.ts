// src/types/instructor.ts

export type InstructorStatus = 'Active' | 'Inactive' | 'Pending';
export type LicenseType = 'B1' | 'B2' | 'C' | 'D' | 'E';

export interface Instructor {
  id: string;
  code: string; 
  name: string;
  email: string;
  phone: string;
  avatar: string;
  licenses: LicenseType[];
  classesWeekly: number;
  status: InstructorStatus;
}

export interface InstructorStatsData {
  total: number;
  newThisMonth: number;
  activeToday: number;
  capacityPercent: number;
  avgRating: number;
  pendingCerts: number;
}

export interface InstructorFormData {
  id?: string;           // Khớp: Users.Id
  email: string;         // Khớp: Users.Email
  fullName: string;      // Khớp: Users.FullName
  phone: string;         // Khớp: Users.Phone
  isActive: boolean;     // Khớp: Users.IsActive
  
  avatarUrl?: string;    // Backend sẽ lưu vào bảng Documents với DocumentType = 'Avatar'
  licenses: LicenseType[]; // Backend sẽ lưu/kiểm tra bảng Documents với DocumentType = 'License_B1', 'License_B2'...
}