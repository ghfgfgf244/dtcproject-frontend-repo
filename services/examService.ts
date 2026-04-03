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
  }
};
