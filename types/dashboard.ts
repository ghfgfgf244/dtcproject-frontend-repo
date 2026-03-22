// src/types/dashboard.ts

export interface KpiStat {
  title: string;
  value: string | number;
  trend: number; // % thay đổi (âm hoặc dương)
  icon: 'courses' | 'classes' | 'students' | 'passRate';
}

export interface UpcomingExam {
  id: string;
  title: string;
  date: string; // VD: "24", "26"
  month: string; // VD: "Thg 10"
  time: string;
  candidatesCount: number;
  theme: 'primary' | 'blue' | 'emerald';
}

export interface InstructorStat {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'Rảnh rỗi' | 'Đang dạy' | 'Nghỉ phép';
  currentLoad: number; // 0 - 100%
  rating: number; // 1.0 - 5.0
}

export interface DashboardData {
  kpis: KpiStat[];
  upcomingExams: UpcomingExam[];
  instructors: InstructorStat[];
}