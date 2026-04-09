import api from "@/lib/api";
import { MockExamDetailInfo, ExamQuestion } from "@/types/mock-exam-detail";
import { MockExamRecord } from "@/types/mock-exam";
import { mapQuestion, type BackendQuestion } from "@/services/questionService";

type BackendSampleExam = {
  id: string;
  courseId: string;
  examNo: number;
  level: number;
  durationMinutes: number;
  passingScore: number;
  isActive: boolean;
  createdAt: string;
  totalQuestions: number;
};

type BackendSampleExamDetail = BackendSampleExam & {
  questions: BackendQuestion[];
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface SubmitMockExamRequest {
  durationSeconds: number;
  answers: Record<number, string>;
}

export interface SubmitMockExamResponse {
  resultId: string;
  totalScore: number;
  durationSeconds: number;
  isPassed: boolean;
  correctAnswers: Record<number, string>;
}

export interface CreateMockExamRequest {
  courseId: string;
  examNo: number;
  level: number;
  durationMinutes: number;
  passingScore: number;
}

function mapExam(base: BackendSampleExam, courseName = "Chua co khoa hoc", licenseType = ""): MockExamRecord {
  return {
    id: base.id,
    courseId: base.courseId,
    courseName,
    licenseType,
    examNo: base.examNo,
    level: base.level,
    durationMinutes: base.durationMinutes,
    passingScore: base.passingScore,
    totalQuestions: base.totalQuestions,
    isActive: base.isActive,
    createdAt: base.createdAt,
  };
}

function mapExamDetail(base: BackendSampleExamDetail, courseName = "Chua co khoa hoc"): { info: MockExamDetailInfo; questions: ExamQuestion[] } {
  return {
    info: {
      id: base.id,
      title: `De thi thu so ${base.examNo}`,
      courseId: base.courseId,
      course: courseName,
      level: String(base.level),
      durationMinutes: base.durationMinutes,
      passingScore: base.passingScore,
      totalQuestions: base.totalQuestions,
      isActive: base.isActive,
    },
    questions: (base.questions || []).map((question, index) => {
      const mapped = mapQuestion(question);
      return {
        ...mapped,
        order: question.order ?? index + 1,
      };
    }),
  };
}

export const mockExamService = {
  async getAll(): Promise<BackendSampleExam[]> {
    const response = await api.get<ApiResponse<BackendSampleExam[]>>("/SampleExam");
    return response.data.data || [];
  },

  async getDetail(id: string): Promise<BackendSampleExamDetail> {
    const response = await api.get<ApiResponse<BackendSampleExamDetail>>(`/SampleExam/${id}`);
    return response.data.data;
  },

  async create(data: CreateMockExamRequest): Promise<BackendSampleExam> {
    const response = await api.post<ApiResponse<BackendSampleExam>>("/SampleExam", data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/SampleExam/${id}`);
  },

  async submit(id: string, data: SubmitMockExamRequest): Promise<SubmitMockExamResponse> {
    const response = await api.post<ApiResponse<SubmitMockExamResponse>>(
      `/SampleExam/${id}/submit`,
      data,
    );
    return response.data.data;
  },

  async updateQuestions(id: string, questions: { questionId: number; order: number }[]): Promise<void> {
    await api.put(`/SampleExam/${id}/questions`, { questions });
  },

  mapExam,
  mapExamDetail,
};
