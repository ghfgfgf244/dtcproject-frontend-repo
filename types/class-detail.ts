import { ClassStatus, ClassType } from "@/types/class";

export interface EnrolledStudent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  enrollDate: string;
  avatarUrl?: string;
  initials: string;
  theme: "blue" | "emerald" | "amber" | "pink" | "purple" | "slate";
}

export interface StudentOption {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  enrolledCourses: string[];
}

export interface ClassDetailRecord {
  id: string;
  className: string;
  courseName: string;
  termName: string;
  classType: ClassType;
  status: ClassStatus;
  currentStudents: number;
  maxStudents: number;
  startDate: string;
  endDate: string;
  instructor: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    avatarUrl: string;
  };
  students: EnrolledStudent[];
}
