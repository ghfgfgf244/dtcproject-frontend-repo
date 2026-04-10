// src/types/assignment.ts
export type AssignmentStatus = 'Trống' | 'Cần đổi' | 'Đã phân công';

export interface InstructorOption {
  id: string;
  fullName: string;
  expertise: string; // VD: "Lý thuyết", "Thực hành B2"
  isRecommended?: boolean; // Để highlight giảng viên gợi ý
}

export interface PendingClass {
  id: string;
  code: string;
  name: string;
  course: string;
  term: string;
  currentStudents: number;
  maxStudents: number;
  status: AssignmentStatus;
  assignedInstructorId: string | null;
}

export interface AssignmentStatsData {
  pendingCount: number;
  availableInstructors: number;
  urgentChanges: number;
  fillRate: number;
}