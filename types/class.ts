// src/types/class.ts

export type ClassTheme = 'blue' | 'emerald' | 'purple' | 'orange';
export type ClassType = 'Theory' | 'Practice';

export interface ClassRecord {
  id: string;
  code: string;
  name: string;
  courseName: string;
  classType?: ClassType;
  studentCount: number;
  startDate: string;
  endDate: string;
  theme: ClassTheme;
}

export type ClassStatus = 'Dang tuyen' | 'Dang hoc' | 'Ket thuc';

export interface ClassSession {
  id: string;
  instructorId: string;
  startTime: string;
  endTime: string;
}

export interface ClassFormData {
  id?: string;
  name: string;
  termId: string;
  classType?: ClassType;
  maxStudents: number;
  status: ClassStatus;
  sessions: ClassSession[];
}
