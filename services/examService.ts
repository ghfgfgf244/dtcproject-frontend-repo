import api from "@/lib/api";

export enum ExamType {
  Theory = 1,
  Simulation = 2,
  Practice = 3
}

export enum ExamStatus {
  Draft = 1,
  Scheduled = 2,
  Finished = 3,
  Cancelled = 4
}

export interface ExamResponse {
  id: string;
  examBatchId: string;
  courseId: string;
  addressId: number;
  addressName: string;
  examName: string;
  examDate: string;
  examType: ExamType;
  durationMinutes: number;
  totalScore: number;
  passScore: number;
  licenseType?: number;
  status: ExamStatus;
  createdAt: string;
}

export const examService = {
  getMyExams: async (): Promise<ExamResponse[]> => {
    const response = await api.get("/Exam/me");
    return response.data.data || [];
  },
  
  getMyExamResults: async (): Promise<any[]> => {
    const response = await api.get("/Exam/results/me");
    return response.data.data || [];
  },

  getAllExamBatches: async (): Promise<any[]> => {
    const response = await api.get("/ExamBatch");
    return response.data.data || [];
  },

  createExamBatch: async (data: any): Promise<any> => {
    const response = await api.post("/ExamBatch", data);
    return response.data.data;
  },

  updateExamBatch: async (id: string, data: any): Promise<any> => {
    const response = await api.put(`/ExamBatch/${id}`, data);
    return response.data.data;
  },

  updateExamBatchStatus: async (id: string, status: number): Promise<void> => {
    await api.patch(`/ExamBatch/${id}/status`, { status });
  },

  deleteExamBatch: async (id: string): Promise<void> => {
    await api.delete(`/ExamBatch/${id}`);
  },

  getAllExams: async (): Promise<any[]> => {
    const response = await api.get("/Exam");
    return response.data.data || [];
  },

  createExam: async (data: any): Promise<any> => {
    const response = await api.post("/Exam", data);
    return response.data.data;
  },

  updateExam: async (id: string, data: any): Promise<any> => {
    const response = await api.put(`/Exam/${id}`, data);
    return response.data.data;
  },

  deleteExam: async (id: string): Promise<void> => {
    await api.delete(`/Exam/${id}`);
  }
};
