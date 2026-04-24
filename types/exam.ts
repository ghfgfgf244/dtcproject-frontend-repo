export enum ExamBatchStatus {
  Pending = 1,
  OpenForRegistration = 2,
  ClosedForRegistration = 3,
  InProgress = 4,
  Completed = 5,
  Cancelled = 6
}

export enum ExamBatchScopeType {
  Center = 1,
  National = 2,
}

export enum ExamType {
  Theory = 1,
  Simulation = 2,
  Practice = 3
}

export enum ExamLevel {
  A1 = 1,
  A = 2,
  B1 = 3,
  B = 4,
  C1 = 5,
  C = 6,
  D1 = 7,
  D2 = 8,
  D = 9,
  BE = 10,
  C1E = 11,
  CE = 12,
  D1E = 13,
  D2E = 14,
  DE = 15
}

export enum ExamStatus {
  Draft = 1,
  Scheduled = 2,
  Finished = 3,
  Cancelled = 4
}

export interface ExamBatch {
  id: string;
  scopeType: ExamBatchScopeType;
  centerId?: string | null;
  centerName?: string | null;
  batchName: string;
  registrationStartDate: string;
  registrationEndDate: string;
  examStartDate: string;
  status: ExamBatchStatus;
  maxCandidates: number;
  currentCandidates: number;
}

export interface ExamBatchPagedResponse {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  pendingItems: number;
  approvedItems: number;
  totalCandidates: number;
  totalCapacity: number;
  items: ExamBatch[];
}

export interface Exam {
  id: string;
  examBatchId: string;
  courseId: string;
  addressId: number;
  addressName?: string;
  examName: string;
  examDate: string;
  examType: ExamType;
  licenseType?: ExamLevel;
  durationMinutes: number;
  totalScore: number;
  passScore: number;
  status: ExamStatus;
}
