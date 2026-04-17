import api from "@/lib/api";
import {
  ExamQuestion,
  MockExamDetailInfo,
  SampleExamInsight,
  SampleExamQuestionReview,
} from "@/types/mock-exam-detail";
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

type BackendPublicQuestion = {
  id: number;
  order?: number | null;
  category: string;
  content: string;
  answerA?: string | null;
  answerB?: string | null;
  answerC?: string | null;
  answerD?: string | null;
  imageLink?: string | null;
};

type BackendPublicSampleExamDetail = BackendSampleExam & {
  questions: BackendPublicQuestion[];
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
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  correctAnswers: Record<number, string>;
  explanations: Record<number, string>;
  reviewItems: SampleExamQuestionReview[];
  insight?: SampleExamInsight | null;
}

type BackendSubmitMockExamResponse = Omit<SubmitMockExamResponse, "reviewItems"> & {
  reviewItems: Array<Omit<SampleExamQuestionReview, "category"> & { category: string }>;
};

export interface CreateMockExamRequest {
  courseId: string;
  examNo: number;
  level: number;
  durationMinutes: number;
  passingScore: number;
}

function mapExam(
  base: BackendSampleExam,
  courseName = "Chưa có khóa học",
  licenseType = "",
): MockExamRecord {
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

function mapExamDetail(
  base: BackendSampleExamDetail,
  courseName = "Chưa có khóa học",
): { info: MockExamDetailInfo; questions: ExamQuestion[] } {
  return {
    info: {
      id: base.id,
      title: `Đề thi thử số ${base.examNo}`,
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

function mapPublicExamDetail(
  base: BackendPublicSampleExamDetail,
  courseName = "Chưa có khóa học",
): { info: MockExamDetailInfo; questions: ExamQuestion[] } {
  return {
    info: {
      id: base.id,
      title: `Đề thi thử số ${base.examNo}`,
      courseId: base.courseId,
      course: courseName,
      level: String(base.level),
      durationMinutes: base.durationMinutes,
      passingScore: base.passingScore,
      totalQuestions: base.totalQuestions,
      isActive: base.isActive,
    },
    questions: (base.questions || []).map((question, index) => ({
      id: question.id,
      order: question.order ?? index + 1,
      content: question.content,
      category: mapQuestion({
        id: question.id,
        order: question.order,
        category: question.category,
        content: question.content,
        answerA: question.answerA ?? null,
        answerB: question.answerB ?? null,
        answerC: question.answerC ?? null,
        answerD: question.answerD ?? null,
        correctAnswer: 1,
        imageLink: question.imageLink ?? null,
        explanation: null,
        wrongAttemptCount: 0,
        createdAt: new Date().toISOString(),
      }).category,
      imageUrl: question.imageLink || undefined,
      answers: [
        { id: `${question.id}-A`, label: "A", content: question.answerA || "", isCorrect: false },
        { id: `${question.id}-B`, label: "B", content: question.answerB || "", isCorrect: false },
        { id: `${question.id}-C`, label: "C", content: question.answerC || "", isCorrect: false },
        { id: `${question.id}-D`, label: "D", content: question.answerD || "", isCorrect: false },
      ].filter((answer) => answer.content.trim().length > 0),
    })),
  };
}

function normalizeCategoryLabel(category?: string): SampleExamQuestionReview["category"] {
  const normalized = (category || "").trim().toLowerCase();
  if (normalized === "bien bao") return "Biển báo";
  if (normalized === "sa hinh") return "Sa hình";
  return "Lý thuyết";
}

function mapSubmitResult(payload: BackendSubmitMockExamResponse): SubmitMockExamResponse {
  return {
    ...payload,
    reviewItems: (payload.reviewItems || []).map((item) => ({
      ...item,
      category: normalizeCategoryLabel(item.category),
    })),
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

  async getPublicDetail(id: string): Promise<BackendPublicSampleExamDetail> {
    const response = await api.get<ApiResponse<BackendPublicSampleExamDetail>>(
      `/SampleExam/${id}/public`,
    );
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
    const response = await api.post<ApiResponse<BackendSubmitMockExamResponse>>(
      `/SampleExam/${id}/submit`,
      data,
    );
    return mapSubmitResult(response.data.data);
  },

  async submitPublic(id: string, data: SubmitMockExamRequest): Promise<SubmitMockExamResponse> {
    const response = await api.post<ApiResponse<BackendSubmitMockExamResponse>>(
      `/SampleExam/${id}/public-submit`,
      data,
    );
    return mapSubmitResult(response.data.data);
  },

  async updateQuestions(id: string, questions: { questionId: number; order: number }[]): Promise<void> {
    await api.put(`/SampleExam/${id}/questions`, { questions });
  },

  mapExam,
  mapExamDetail,
  mapPublicExamDetail,
};
