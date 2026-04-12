import api from "@/lib/api";
import { ExamAnswer, ExamQuestion, QuestionBankItem, QuestionCategory, QuestionFormData } from "@/types/mock-exam-detail";

type BackendQuestion = {
  id: number;
  order?: number | null;
  category: string;
  content: string;
  answerA?: string | null;
  answerB?: string | null;
  answerC?: string | null;
  answerD?: string | null;
  correctAnswer: 1 | 2 | 3 | 4;
  imageLink?: string | null;
  explanation?: string | null;
  createdAt: string;
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface ImportResponse {
  importedCount: number;
  warnings: string[];
  questions: BackendQuestion[];
}

const CATEGORY_LABELS: Record<string, QuestionCategory> = {
  "Ly thuyet": "Lý thuyết",
  "Bien bao": "Biển báo",
  "Sa hinh": "Sa hình",
  "Lý thuyết": "Lý thuyết",
  "Biển báo": "Biển báo",
  "Sa hình": "Sa hình",
};

function normalizeCategory(category?: string): QuestionCategory {
  return CATEGORY_LABELS[category || "Ly thuyet"] || "Lý thuyết";
}

function buildAnswers(question: BackendQuestion): ExamAnswer[] {
  return ([
    { label: "A", content: question.answerA || "" },
    { label: "B", content: question.answerB || "" },
    { label: "C", content: question.answerC || "" },
    { label: "D", content: question.answerD || "" },
  ] as const)
    .filter((answer) => answer.content.trim().length > 0)
    .map((answer) => ({
      id: `${question.id}-${answer.label}`,
      label: answer.label,
      content: answer.content,
      isCorrect:
        (question.correctAnswer === 1 && answer.label === "A") ||
        (question.correctAnswer === 2 && answer.label === "B") ||
        (question.correctAnswer === 3 && answer.label === "C") ||
        (question.correctAnswer === 4 && answer.label === "D"),
    }));
}

export function mapQuestion(question: BackendQuestion): QuestionBankItem {
  return {
    id: question.id,
    order: question.order ?? 0,
    content: question.content,
    category: normalizeCategory(question.category),
    imageUrl: question.imageLink || undefined,
    explanation: question.explanation || undefined,
    answers: buildAnswers(question),
    createdAt: question.createdAt,
  };
}

function toPayload(data: QuestionFormData) {
  return {
    category: data.category,
    content: data.content,
    answerA: data.answerA || null,
    answerB: data.answerB || null,
    answerC: data.answerC || null,
    answerD: data.answerD || null,
    correctAnswer: data.correctAnswer,
    imageLink: data.imageLink || null,
    explanation: data.explanation || null,
  };
}

export const questionService = {
  async getAll(category?: string): Promise<QuestionBankItem[]> {
    const response = await api.get<ApiResponse<BackendQuestion[]>>("/Question", {
      params: category ? { category } : undefined,
    });
    return (response.data.data || []).map(mapQuestion);
  },

  async getById(id: number): Promise<QuestionBankItem | null> {
    try {
      const response = await api.get<ApiResponse<BackendQuestion>>(`/Question/${id}`);
      return mapQuestion(response.data.data);
    } catch {
      return null;
    }
  },

  async create(data: QuestionFormData): Promise<QuestionBankItem> {
    const response = await api.post<ApiResponse<BackendQuestion>>("/Question", toPayload(data));
    return mapQuestion(response.data.data);
  },

  async update(id: number, data: QuestionFormData): Promise<QuestionBankItem> {
    const response = await api.put<ApiResponse<BackendQuestion>>(`/Question/${id}`, toPayload(data));
    return mapQuestion(response.data.data);
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/Question/${id}`);
  },

  async importFile(file: File): Promise<{ importedCount: number; warnings: string[]; questions: QuestionBankItem[] }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<ApiResponse<ImportResponse>>("/Question/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const payload = response.data.data;
    return {
      importedCount: payload.importedCount,
      warnings: payload.warnings || [],
      questions: (payload.questions || []).map(mapQuestion),
    };
  },

  async downloadTemplate(): Promise<void> {
    const response = await api.get("/Question/import-template", {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "question-import-template.xlsx";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  },
};

export type { BackendQuestion };
