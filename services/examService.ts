import api from "@/lib/api";
import { ExamBatch, Exam, ExamBatchStatus, ExamType, ExamLevel } from "@/types/exam";

// Define the standard unified API response structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors: string[];
}

export const examService = {
  // --- EXAM BATCHES (ĐỢT THI) ---
  getAllExamBatches: async (): Promise<ExamBatch[]> => {
    const response = await api.get<ApiResponse<any[]>>("/ExamBatch");
    return (response.data.data || []).map(mapToExamBatch);
  },

  getExamBatchById: async (id: string): Promise<ExamBatch> => {
    const response = await api.get<ApiResponse<any>>(`/ExamBatch/${id}`);
    return mapToExamBatch(response.data.data);
  },

  createExamBatch: async (data: Partial<ExamBatch>): Promise<ExamBatch> => {
    const response = await api.post<ApiResponse<any>>("/ExamBatch", {
      batchName: data.batchName,
      registrationStartDate: data.registrationStartDate,
      registrationEndDate: data.registrationEndDate,
      examStartDate: data.examStartDate,
      maxCandidates: data.maxCandidates,
    });
    return mapToExamBatch(response.data.data);
  },

  updateExamBatch: async (id: string, data: Partial<ExamBatch>): Promise<ExamBatch> => {
    const payload: any = {
      batchName: data.batchName,
      registrationStartDate: data.registrationStartDate,
      registrationEndDate: data.registrationEndDate,
      examStartDate: data.examStartDate,
      maxCandidates: data.maxCandidates,
    };
    if (data.status) {
      payload.status = mapBatchStatusToNumber(data.status);
    }
    const response = await api.put<ApiResponse<any>>(`/ExamBatch/${id}`, payload);
    return mapToExamBatch(response.data.data);
  },

  updateExamBatchStatus: async (id: string, status: ExamBatchStatus): Promise<void> => {
    await api.patch(`/ExamBatch/${id}/status`, { status });
  },

  deleteExamBatch: async (id: string): Promise<void> => {
    await api.delete(`/ExamBatch/${id}`);
  },

  // --- EXAMS (BÀI THI) ---
  getAllExams: async (): Promise<Exam[]> => {
    const response = await api.get<ApiResponse<any[]>>("/Exam");
    return (response.data.data || []).map(mapToExam);
  },

  getExamById: async (id: string): Promise<Exam> => {
    const response = await api.get<ApiResponse<any>>(`/Exam/${id}`);
    return mapToExam(response.data.data);
  },

  createExam: async (data: Partial<Exam> & { courseId?: string }): Promise<Exam> => {
    const payload = {
      examBatchId: data.examBatchId,
      courseId: data.courseId || "44444444-4444-4444-4444-444444444441", 
      examName: data.examName,
      examDate: data.examDate,
      examType: mapExamTypeToNumber(data.examType),
      durationMinutes: data.durationMinutes,
      totalScore: data.totalScore || 100,
      passScore: data.passScore || 40,
    };
    console.log("POST /api/Exam Payload:", payload);
    const response = await api.post<ApiResponse<any>>("/Exam", payload);
    return mapToExam(response.data.data);
  },

  updateExam: async (id: string, data: Partial<Exam>): Promise<Exam> => {
    const response = await api.put<ApiResponse<any>>(`/Exam/${id}`, {
      examName: data.examName,
      examDate: data.examDate,
      examType: mapExamTypeToNumber(data.examType),
      durationMinutes: data.durationMinutes,
      totalScore: data.totalScore,
      passScore: data.passScore,
    });
    return mapToExam(response.data.data);
  },

  deleteExam: async (id: string): Promise<void> => {
    await api.delete(`/Exam/${id}`);
  },
};

// --- Mappers ---

const mapToExamBatch = (data: any): ExamBatch => ({
  id: data.id,
  batchName: data.batchName,
  registrationStartDate: data.registrationStartDate,
  registrationEndDate: data.registrationEndDate,
  examStartDate: data.examStartDate,
  status: mapBatchStatus(data.status),
  maxCandidates: data.maxCandidates,
  currentCandidates: data.currentCandidates,
});

const mapToExam = (data: any): Exam => ({
  id: data.id,
  examBatchId: data.examBatchId,
  courseId: data.courseId,
  examName: data.examName,
  examDate: data.examDate,
  examType: mapExamType(data.examType),
  licenseType: mapExamLevel(data.licenseType),
  durationMinutes: data.durationMinutes,
  totalScore: data.totalScore || 100,
  passScore: data.passScore || 40,
});

const mapBatchStatus = (status: any): ExamBatchStatus => {
  if (typeof status === 'string') return status as ExamBatchStatus;
  switch (status) {
    case 1: return 'Pending';
    case 2: return 'OpenForRegistration';
    case 3: return 'ClosedForRegistration';
    case 4: return 'InProgress';
    case 5: return 'Completed';
    case 6: return 'Cancelled';
    default: return 'Pending';
  }
};

const mapExamType = (type: any): ExamType => {
  if (typeof type === 'string') return type as ExamType;
  switch (type) {
    case 1: return 'Theory';
    case 2: return 'Simulation';
    case 3: return 'Practice';
    default: return 'Theory';
  }
};

const mapExamLevel = (level: any): ExamLevel | undefined => {
  if (typeof level === 'string') return level as ExamLevel;
  const levels: Record<number, ExamLevel> = {
    1: 'A1', 2: 'A', 3: 'B1', 4: 'B', 5: 'B2', 6: 'C1', 7: 'C', 
    8: 'D1', 9: 'D2', 10: 'D', 11: 'BE', 12: 'C1E', 13: 'CE', 
    14: 'D1E', 15: 'D2E', 16: 'DE'
  };
  return levels[level];
};

const mapExamTypeToNumber = (type: ExamType | undefined): number => {
  switch (type) {
    case 'Theory': return 1;
    case 'Simulation': return 2;
    case 'Practice': return 3;
    default: return 1;
  }
};

const mapBatchStatusToNumber = (status: ExamBatchStatus): number => {
  switch (status) {
    case 'Pending': return 1;
    case 'OpenForRegistration': return 2;
    case 'ClosedForRegistration': return 3;
    case 'InProgress': return 4;
    case 'Completed': return 5;
    case 'Cancelled': return 6;
    default: return 1;
  }
};
