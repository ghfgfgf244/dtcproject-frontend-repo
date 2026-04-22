export type SortDirection = "asc" | "desc";

export interface ExamScoreboardQuery {
  courseId?: string;
  termId?: string;
  examBatchId?: string;
  search?: string;
  sortDirection?: SortDirection;
  page?: number;
  pageSize?: number;
}

export interface ExamScoreboardItem {
  studentId: string;
  studentName: string;
  email: string;
  phone: string;
  courseId: string;
  courseName: string;
  licenseTypeLabel: string;
  termId: string;
  termName: string;
  examBatchId: string;
  examBatchName: string;
  hasSimulationExam: boolean;
  theoryScore?: number | null;
  practiceScore?: number | null;
  simulationScore?: number | null;
  theoryPassed: boolean;
  practicePassed: boolean;
  simulationPassed?: boolean | null;
  overallScore: number;
  isPassedAll: boolean;
  completedComponents: number;
  totalComponents: number;
}

export interface ExamScoreboardResponse {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  totalPassed: number;
  averageOverallScore: number;
  hasSimulationExam: boolean;
  items: ExamScoreboardItem[];
}

export interface UpsertStudentExamScoresRequest {
  courseId: string;
  termId: string;
  examBatchId: string;
  studentId: string;
  theoryScore?: number | null;
  practiceScore?: number | null;
  simulationScore?: number | null;
}

export interface ExamScoreImportResponse {
  importedCount: number;
  warnings: string[];
}
