import api from "@/lib/api";
import {
  ExamScoreboardQuery,
  ExamScoreboardResponse,
  ExamScoreImportResponse,
  UpsertStudentExamScoresRequest,
} from "@/types/exam-result";
import { ExamBatch, Exam } from "@/types/exam";

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

  getAllExamBatches: async (): Promise<ExamBatch[]> => {
    const response = await api.get("/ExamBatch");
    return response.data.data || [];
  },

  createExamBatch: async (data: Partial<ExamBatch>): Promise<ExamBatch> => {
    const response = await api.post("/ExamBatch", data);
    return response.data.data;
  },

  updateExamBatch: async (id: string, data: Partial<ExamBatch>): Promise<ExamBatch> => {
    const response = await api.put(`/ExamBatch/${id}`, data);
    return response.data.data;
  },

  updateExamBatchStatus: async (id: string, status: number): Promise<void> => {
    await api.patch(`/ExamBatch/${id}/status`, { status });
  },

  deleteExamBatch: async (id: string): Promise<void> => {
    await api.delete(`/ExamBatch/${id}`);
  },

  getAllExams: async (): Promise<Exam[]> => {
    const response = await api.get("/Exam");
    return response.data.data || [];
  },

  createExam: async (data: Partial<Exam>): Promise<Exam> => {
    const response = await api.post("/Exam", data);
    return response.data.data;
  },

  updateExam: async (id: string, data: Partial<Exam>): Promise<Exam> => {
    const response = await api.put(`/Exam/${id}`, data);
    return response.data.data;
  },

  deleteExam: async (id: string): Promise<void> => {
    await api.delete(`/Exam/${id}`);
  },

  getScoreboard: async (
    query: ExamScoreboardQuery
  ): Promise<ExamScoreboardResponse> => {
    const response = await api.get("/Exam/scoreboard", { params: query });
    return response.data.data;
  },

  upsertScoreboard: async (
    data: UpsertStudentExamScoresRequest
  ): Promise<any> => {
    const response = await api.post("/Exam/scoreboard", data);
    return response.data.data;
  },

  importScoreboard: async (
    file: File,
    data: { courseId: string; termId: string; examBatchId: string }
  ): Promise<ExamScoreImportResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("courseId", data.courseId);
    formData.append("termId", data.termId);
    formData.append("examBatchId", data.examBatchId);

    const response = await api.post("/Exam/scoreboard/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },

  downloadScoreboardTemplate: async (params: {
    courseId: string;
    termId: string;
    examBatchId: string;
  }): Promise<Blob> => {
    const response = await api.get("/Exam/scoreboard/import-template", {
      params,
      responseType: "blob",
    });

    return response.data;
  }
};
