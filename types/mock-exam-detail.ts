// src/types/mock-exam-detail.ts
export type QuestionCategory = 'Lý thuyết' | 'Biển báo' | 'Sa hình';

export interface ExamAnswer {
  id: string;
  label: string; // A, B, C, D
  content: string;
  isCorrect: boolean;
}

export interface ExamQuestion {
  id: string;
  order: number;
  content: string;
  category: QuestionCategory;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
  answers: ExamAnswer[];
}

export interface MockExamDetailInfo {
  id: string;
  title: string;
  course: string;
  difficulty: string;
  durationMinutes: number;
  totalQuestions: number;
}

export interface QuestionBankItem extends ExamQuestion {
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  updatedAt: string;
  type: 'Trắc nghiệm' | 'Đúng/Sai' | 'Tự luận ngắn';
}