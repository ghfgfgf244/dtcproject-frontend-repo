export type ExamBatchStatus = 'ACTIVE' | 'UPCOMING' | 'COMPLETED' | 'CANCELED';

export type ExamType = 'ONLINE' | 'ONSITE' | 'Theory' | 'Practice' | 'Simulation';

export interface ExamBatch {
  id: string;
  courseId: string;
  batchName: string;
  registrationStartDate: string;
  registrationEndDate: string;
  examStartDate: string;
  status: ExamBatchStatus;
}

export interface Exam {
  id: string;
  examBatchId: string;
  examName: string;
  examDate: string;
  examType: ExamType;
  durationMinutes: number;
}


export interface ExamBatch {
  id: string;
  courseId: string;
  batchName: string;
  registrationStartDate: string;
  registrationEndDate: string;
  examStartDate: string;
  status: ExamBatchStatus;
}

export interface Exam {
  id: string;
  examBatchId: string;
  examName: string;
  examDate: string;
  examType: ExamType;
  durationMinutes: number;
  // Bạn có thể thêm các trường phụ thuộc UI vào đây nếu cần, hoặc bỏ qua
}