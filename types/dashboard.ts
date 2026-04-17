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

export interface MonthlyMetricDto {
  year: number;
  month: number;
  value: number;
}

export interface DashboardKpiDto {
  title: string;
  value: string;
  note?: string | null;
  tone: string;
}

export interface DashboardCourseMetricDto {
  courseId: string;
  courseName: string;
  licenseType?: string | null;
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
}

export interface DashboardCollaboratorMetricDto {
  collaboratorId: string;
  collaboratorName: string;
  referralCode?: string | null;
  referralRegistrations: number;
  pendingCommission: number;
  paidCommission: number;
}

export interface DashboardRecentPostDto {
  id: string;
  title: string;
  categoryName?: string | null;
  isPublished: boolean;
  createdAt: string;
}

export interface EnrollmentOperationalDashboardDto {
  kpis: DashboardKpiDto[];
  registrationTrend: MonthlyMetricDto[];
  topCourses: DashboardCourseMetricDto[];
  topCollaborators: DashboardCollaboratorMetricDto[];
  recentPosts: DashboardRecentPostDto[];
  totalStudents: number;
  totalRegistrations: number;
  pendingRegistrations: number;
  approvedRegistrations: number;
  rejectedRegistrations: number;
  cancelledRegistrations: number;
  activeCollaborators: number;
  pendingBacklogOlderThan3Days: number;
  approvalRate: number;
}

export interface DashboardUpcomingExamDto {
  id: string;
  batchName: string;
  examDate: string;
  currentCandidates: number;
  maxCandidates: number;
  status: string;
}

export interface DashboardInstructorLoadDto {
  instructorId: string;
  instructorName: string;
  assignedClasses: number;
  schedulesThisWeek: number;
  utilizationRate: number;
  statusLabel: string;
}

export interface DashboardAttendanceAlertDto {
  classId: string;
  className: string;
  attendanceRate: number;
  presentCount: number;
  totalRecords: number;
}

export interface TrainingOperationalDashboardDto {
  kpis: DashboardKpiDto[];
  classOpeningTrend: MonthlyMetricDto[];
  upcomingExamBatches: DashboardUpcomingExamDto[];
  instructorLoads: DashboardInstructorLoadDto[];
  lowAttendanceClasses: DashboardAttendanceAlertDto[];
  totalClasses: number;
  theoryClasses: number;
  practiceClasses: number;
  activeInstructors: number;
  scheduleConflictCount: number;
  classesStartingThisWeek: number;
}

export interface DashboardCenterPerformanceDto {
  centerId: string;
  centerName: string;
  totalCourses: number;
  activeTerms: number;
  activeClasses: number;
  totalRegistrations: number;
  approvedRegistrations: number;
  revenue: number;
}

export interface AdminOperationalDashboardDto {
  kpis: DashboardKpiDto[];
  revenueTrend: MonthlyMetricDto[];
  centerPerformance: DashboardCenterPerformanceDto[];
  pendingExamApprovals: DashboardUpcomingExamDto[];
  totalUsers: number;
  activeCenters: number;
  activeCourses: number;
  pendingCourseRegistrations: number;
  pendingExamBatches: number;
  totalRevenue: number;
  totalCommission: number;
}
