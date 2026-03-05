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
