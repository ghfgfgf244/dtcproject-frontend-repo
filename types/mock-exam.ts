export interface MockExamRecord {
  id: string;
  courseId: string;
  courseName: string;
  licenseType: string;
  examNo: number;
  level: number;
  durationMinutes: number;
  passingScore: number;
  totalQuestions: number;
  isActive: boolean;
  createdAt: string;
}

export interface MockExamStats {
  totalExams: number;
  activeExams: number;
  totalQuestions: number;
  theoryQuestions: number;
  signQuestions: number;
  simulationQuestions: number;
}
