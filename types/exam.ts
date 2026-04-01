export type ExamBatchStatus = 
  | 'Pending' 
  | 'OpenForRegistration' 
  | 'ClosedForRegistration' 
  | 'InProgress' 
  | 'Completed' 
  | 'Cancelled';

export type ExamType = 'Theory' | 'Simulation' | 'Practice';

export type ExamLevel = 'A1' | 'A' | 'B1' | 'B' | 'B2' | 'C1' | 'C' | 'D1' | 'D2' | 'D' | 'BE' | 'C1E' | 'CE' | 'D1E' | 'D2E' | 'DE';

export interface ExamBatch {
  id: string;
  batchName: string;
  registrationStartDate: string;
  registrationEndDate: string;
  examStartDate: string;
  status: ExamBatchStatus;
  maxCandidates: number;
  currentCandidates: number;
}

export interface Exam {
  id: string;
  examBatchId: string;
  courseId: string;
  examName: string;
  examDate: string;
  examType: ExamType;
  licenseType?: ExamLevel;
  durationMinutes: number;
  totalScore: number;
  passScore: number;
}