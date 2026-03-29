// types/schedule.ts

export type SessionCategory = "Theory" | "Practice" | "Simulator" | "Exam";

export interface ClassScheduleDTO {
  id: string; // ClassSchedules.Id
  classId: string; // Classes.Id
  className: string; // Classes.ClassName
  instructorName: string; // Users.FullName (Instructor)
  startTime: string; // ClassSchedules.StartTime (ISO String)
  endTime: string; // ClassSchedules.EndTime (ISO String)
  location: string; // ClassSchedules.Location
  category: SessionCategory; // Logic mapping từ ClassName hoặc Course
  equipment?: string; // Thông tin bổ sung (Xe/Thiết bị)
}

export interface UpcomingScheduleDTO {
  id: string;
  title: string;
  date: string;
  details: string;
}

// src/types/schedule.ts
export type ScheduleEventType = 'Lý thuyết' | 'Thực hành' | 'Mô phỏng';
export type CourseStatusType = 'Hoàn thành' | 'Đang diễn ra' | 'Sắp diễn ra';

export interface ScheduleEvent {
  id: string;
  courseId: string;
  courseName: string;
  eventType: ScheduleEventType;
  startTime: string;
  endTime: string;
  instructorName: string;
  date: number;
  // --- Các trường bổ sung cho Lịch Ngày ---
  location?: string;
  description?: string;
  studentCount?: number;
}

export interface CourseStatusItem {
  id: string;
  courseCode: string;
  courseName: string;
  instructorName: string;
  type: ScheduleEventType;
  status: CourseStatusType;
}

export interface WeeklyInsight {
  completedClasses: number;
  totalClasses: number;
  activeClasses: number;
  pendingCourses: number;
}

// --- Type mới cho Thống kê Ngày ---
export interface DailyInsight {
  theoryCount: number;
  practiceCount: number;
  simulationCount: number;
  totalStudents: number;
}

