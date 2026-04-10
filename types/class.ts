export type ClassTheme = "blue" | "emerald" | "orange" | "slate";
export type ClassType = "Theory" | "Practice";
export type ClassStatus = "Pending" | "InProgress" | "Completed" | "Cancelled";

export interface ClassRecord {
  id: string;
  code: string;
  name: string;
  courseName: string;
  termName: string;
  classType: ClassType;
  status: ClassStatus;
  currentStudents: number;
  maxStudents: number;
  instructorName: string;
  startDate: string;
  endDate: string;
  theme: ClassTheme;
}

export interface ClassSession {
  id?: string;
  instructorId: string;
  startTime: string;
  endTime: string;
  addressId: number;
}

export interface ClassFormData {
  id?: string;
  className: string;
  termId: string;
  instructorId: string;
  classType: ClassType;
  maxStudents: number;
  schedules: ClassSession[];
}
