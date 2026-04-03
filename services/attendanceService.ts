import api from "@/lib/api";

export interface AttendanceSummary {
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
}

export interface AttendanceSession {
  scheduleId: string;
  date: string;
  startTime: string;
  endTime: string;
  lessonName: string;
  instructorName: string;
  status: "Present" | "Absent" | "Pending";
}

export interface StudentAttendanceReport {
  summary: AttendanceSummary;
  sessions: AttendanceSession[];
}

export const attendanceService = {
  getMyAttendanceReport: async (): Promise<StudentAttendanceReport> => {
    const response = await api.get("/Attendance/me");
    return response.data.data;
  },

  /**
   * Fetch attendance records for a specific class schedule (slot).
   * Used by instructor to see who is present/absent in a given session.
   */
  getBySchedule: async (classScheduleId: string): Promise<AttendanceRecord[]> => {
    try {
      const response = await api.get<{ success: boolean; data: AttendanceRecord[] }>(
        `/Attendance/Schedule/${classScheduleId}`
      );
      return response.data.data || [];
    } catch {
      return [];
    }
  },

  /**
   * Mark or toggle attendance for a student in a session.
   * Backend upserts: if record exists → update isPresent; otherwise → create.
   */
  mark: async (classScheduleId: string, studentId: string, isPresent: boolean): Promise<void> => {
    await api.post("/Attendance", { classScheduleId, studentId, isPresent });
  },
};

// ─── Instructor-facing types ──────────────────────────────────────────────────

export interface AttendanceRecord {
  id: string;
  classScheduleId: string;
  studentId: string;
  studentName: string;
  isPresent: boolean;
  checkedAt: string;
  sessionDate?: string;
}
