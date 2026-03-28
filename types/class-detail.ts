// src/types/class-detail.ts

export interface EnrolledStudent {
  id: string;
  fullName: string;
  email: string;
  enrollDate: string;
  avatarUrl?: string;
  initials: string;
  theme: 'blue' | 'emerald' | 'amber' | 'pink' | 'purple';
}

export interface ClassDetailRecord {
  id: string;
  code: string;
  name: string;
  courseName: string;
  status: 'Active' | 'Pending' | 'Completed';
  startDate: string;
  endDate: string;
  instructor: {
    name: string;
    role: string;
    email: string;
    phone: string;
    avatarUrl: string;
  };
  location: {
    room: string;
    building: string;
  };
  students: EnrolledStudent[];
}

export interface StudentOption {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  enrolledCourses: string[];
}