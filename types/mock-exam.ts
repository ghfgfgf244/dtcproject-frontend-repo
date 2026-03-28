// src/types/mock-exam.ts
export type ExamDifficulty = 'Dễ' | 'Trung bình' | 'Khó';

export interface MockExamRecord {
  id: string;
  examId: string; // VD: #EX-B2-01
  createdAt: string; // VD: Created 2 days ago
  courseCode: string; // VD: B2-2024-01
  examNumber: string; // VD: 01
  difficulty: ExamDifficulty;
  totalQuestions: number;
  currentQuestions: number; // Thường bằng total, nhưng có thể thiếu
}

export interface MockExamStats {
  totalExams: number;
  growth: string;
  b1Count: number;
  b2Count: number;
  cCount: number;
}