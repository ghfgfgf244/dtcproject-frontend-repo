export type QuestionCategory = "Lý thuyết" | "Biển báo" | "Sa hình";
export type AnswerLabel = "A" | "B" | "C" | "D";

export interface ExamAnswer {
  id: string;
  label: AnswerLabel;
  content: string;
  isCorrect: boolean;
}

export interface ExamQuestion {
  id: number;
  order: number;
  content: string;
  category: QuestionCategory;
  imageUrl?: string;
  explanation?: string;
  answers: ExamAnswer[];
}

export interface MockExamDetailInfo {
  id: string;
  title: string;
  courseId: string;
  course: string;
  level: string;
  durationMinutes: number;
  passingScore: number;
  totalQuestions: number;
  isActive: boolean;
}

export interface QuestionBankItem extends ExamQuestion {
  createdAt: string;
}

export interface QuestionFormData {
  category: QuestionCategory;
  content: string;
  answerA?: string;
  answerB?: string;
  answerC?: string;
  answerD?: string;
  correctAnswer: 1 | 2 | 3 | 4;
  imageLink?: string;
  explanation?: string;
}
