// src/constants/mock-exam-data.ts
import { MockExamRecord, MockExamStats } from "@/types/mock-exam";

export const MOCK_EXAM_STATS: MockExamStats = {
  totalExams: 124,
  growth: "+12%",
  b1Count: 45,
  b2Count: 62,
  cCount: 17
};

export const MOCK_EXAMS: MockExamRecord[] = [
  {
    id: "me-1",
    examId: "#EX-B2-01",
    createdAt: "Created 2 days ago",
    courseCode: "B2-2024-01",
    examNumber: "01",
    difficulty: "Dễ",
    currentQuestions: 35,
    totalQuestions: 35
  },
  {
    id: "me-2",
    examId: "#EX-B2-05",
    createdAt: "Created 1 week ago",
    courseCode: "B2-2024-01",
    examNumber: "05",
    difficulty: "Trung bình",
    currentQuestions: 35,
    totalQuestions: 35
  },
  {
    id: "me-3",
    examId: "#EX-C-12",
    createdAt: "Created 4 hours ago",
    courseCode: "C-2024-02",
    examNumber: "12",
    difficulty: "Khó",
    currentQuestions: 32, // Đề này đang thiếu câu hỏi
    totalQuestions: 40
  },
  {
    id: "me-4",
    examId: "#EX-B1-02",
    createdAt: "Created yesterday",
    courseCode: "B1-2024-03",
    examNumber: "02",
    difficulty: "Dễ",
    currentQuestions: 30,
    totalQuestions: 30
  }
];