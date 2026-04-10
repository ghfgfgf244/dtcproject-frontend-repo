export type PassStatus = 'Pass' | 'Fail';

export interface StudentResult {
  id: string; // Tương đương ID bản ghi
  studentId: string; // Ví dụ: #AE-88921
  studentName: string;
  initials: string; // Tên viết tắt (VD: AM)
  examName: string;
  score: number; // Thang 100
  isPassed: boolean;
  examDate: string;
}

export interface FilterOptions {
  batches: string[];
  exams: string[];
  statuses: string[];
}