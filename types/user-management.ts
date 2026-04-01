// src/types/user-management.ts

export type UserRole = 'INSTRUCTOR' | 'STUDENT';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface BaseUser {
  id: string;
  code: string;
  fullName: string;
  email: string;
  phone: string;
  status: UserStatus;
  role: UserRole;
  avatarInitials: string;
  theme: 'blue' | 'purple' | 'emerald' | 'orange' | 'slate';
}

export interface Instructor extends BaseUser {
  role: 'INSTRUCTOR';
  specialty: string; // Chuyên môn
}

export interface Student extends BaseUser {
  role: 'STUDENT';
  enrolledCourse: string; // Lớp/Khóa đang học
}

export type ManagedUser = Instructor | Student;