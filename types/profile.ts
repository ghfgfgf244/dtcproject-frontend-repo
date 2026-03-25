// src/types/profile.ts
export type ProfileStatus = 'Đang học' | 'Chờ duyệt' | 'Đã tốt nghiệp' | 'Hoạt động' | 'Ngừng hoạt động';

export interface StudentProfile {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  registrationDate: string;
  status: ProfileStatus;
}

export interface CollaboratorProfile {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  totalReferred: number;
  commission: number; // Lưu theo VNĐ
  status: ProfileStatus;
}

export interface ProfileStatsData {
  totalStudents: number;
  totalCollaborators: number;
  pendingApprovals: number;
  monthlyCommission: string;
}

// Bổ sung vào src/types/profile.ts

export interface ProfileFormData {
  id?: string;
  role: 'student' | 'collaborator';
  fullName: string;
  phone: string;
  email: string;
  address: string;
  // Dành riêng cho Học viên
  licenseType?: string;
  course?: string;
  studentStatus?: string;
  // Dành riêng cho Cộng tác viên
  referralCode?: string;
  collaboratorRegion?: string;
}