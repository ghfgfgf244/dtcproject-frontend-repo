export type SessionCategory = "Theory" | "Practice" | "Simulator" | "Exam";

export interface ClassScheduleDTO {
  id: string;
  classId: string;
  className: string;
  instructorId: string;
  instructorName: string;
  startTime: string;
  endTime: string;
  addressId: number;
  addressName: string;
  location: string;
}

export interface UpcomingScheduleDTO {
  id: string;
  title: string;
  date: string;
  details: string;
}

export type ScheduleEventType = "Theory" | "Practice" | "Simulator" | "Exam";
export type CourseStatusType = "Completed" | "InProgress" | "Pending" | "Cancelled";

export interface ScheduleEvent {
  id: string;
  classId: string;
  className: string;
  courseId: string;
  courseName: string;
  instructorId: string;
  instructorName: string;
  eventType: ScheduleEventType;
  startTime: string;
  endTime: string;
  startDateTime: string;
  endDateTime: string;
  dateKey: string;
  addressId: number;
  addressName: string;
  location?: string;
  description?: string;
  studentCount?: number;
}

export interface CourseStatusItem {
  id: string;
  classId: string;
  className: string;
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

export interface DailyInsight {
  theoryCount: number;
  practiceCount: number;
  simulationCount: number;
  totalStudents: number;
}
