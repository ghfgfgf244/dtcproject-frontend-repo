// src/constants/mock-exam-detail-data.ts
import {
  ExamQuestion,
  MockExamDetailInfo,
  QuestionBankItem,
} from "@/types/mock-exam-detail";

export const MOCK_EXAM_INFO: MockExamDetailInfo = {
  id: "EX-B2-05",
  title: "Đề thi thử số 5 - Hạng B2",
  course: "Đào tạo lái xe ô tô B2",
  difficulty: "Trung bình",
  durationMinutes: 20,
  totalQuestions: 35,
};

export const MOCK_QUESTIONS: ExamQuestion[] = [
  {
    id: "q1",
    order: 1,
    content:
      "Khi điều khiển xe ô tô rẽ phải ở chỗ đường giao nhau, người lái xe cần thực hiện các thao tác nào để đảm bảo an toàn?",
    category: "Lý thuyết",
    answers: [
      {
        id: "q1-a",
        label: "A",
        content:
          "Cách chỗ rẽ khoảng 30m có tín hiệu rẽ phải; quan sát an toàn phía sau.",
        isCorrect: false,
      },
      {
        id: "q1-b",
        label: "B",
        content:
          "Điều khiển xe bám sát vào phía bên phải đường; giảm tốc độ và quan sát.",
        isCorrect: true,
      },
      {
        id: "q1-c",
        label: "C",
        content:
          "Cách chỗ rẽ khoảng 30m có tín hiệu rẽ trái; quan sát an toàn xung quanh.",
        isCorrect: false,
      },
      {
        id: "q1-d",
        label: "D",
        content: "Tăng tốc độ để nhanh chóng đi qua chỗ giao nhau.",
        isCorrect: false,
      },
    ],
  },
  {
    id: "q2",
    order: 2,
    content: "Biển nào báo hiệu 'Cấm xe chở hàng nguy hiểm'?",
    category: "Biển báo",
    imageUrl: "https://via.placeholder.com/300x300?text=Bien+Bao+Cam", // Placeholder cho demo
    imageAlt: "Biển báo giao thông",
    imageCaption: "Hình ảnh minh họa câu hỏi 02",
    answers: [
      { id: "q2-a", label: "A", content: "Biển 1", isCorrect: false },
      { id: "q2-b", label: "B", content: "Biển 2", isCorrect: false },
      { id: "q2-c", label: "C", content: "Biển 3", isCorrect: true },
    ],
  },
  {
    id: "q3",
    order: 3,
    content: "Theo hướng mũi tên, những hướng nào xe mô tô được phép đi?",
    category: "Sa hình",
    imageUrl: "https://via.placeholder.com/600x350?text=Sa+Hinh+Giao+Thong", // Placeholder cho demo
    imageAlt: "Sa hình giao lộ",
    imageCaption: "Sa hình minh họa câu hỏi 03",
    answers: [
      { id: "q3-a", label: "A", content: "Cả ba hướng", isCorrect: false },
      { id: "q3-b", label: "B", content: "Hướng 1 và 3", isCorrect: true },
      { id: "q3-c", label: "C", content: "Hướng 1 và 2", isCorrect: false },
      { id: "q3-d", label: "D", content: "Hướng 2 và 3", isCorrect: false },
    ],
  },
];

export const MOCK_BANK: QuestionBankItem[] = [
  {
    id: "1042",
    order: 0,
    content:
      "Quy trình xử lý phản hồi khách hàng theo tiêu chuẩn ISO 9001:2015 bao gồm bao nhiêu bước chính?",
    category: "Lý thuyết",
    difficulty: "Trung bình",
    updatedAt: "2 ngày trước",
    type: "Trắc nghiệm",
    answers: [
      { id: "a1", label: "A", content: "4 bước", isCorrect: false },
      { id: "a2", label: "B", content: "5 bước", isCorrect: false },
      { id: "a3", label: "C", content: "6 bước", isCorrect: true },
      { id: "a4", label: "D", content: "7 bước", isCorrect: false },
    ],
  },
  {
    id: "1043",
    order: 0,
    content: "Biển nào báo hiệu 'Cấm xe chở hàng nguy hiểm'?",
    category: "Lý thuyết",
    difficulty: "Trung bình",
    updatedAt: "2 ngày trước",
    type: "Đúng/Sai",
    answers: [
      { id: "q2-a", label: "A", content: "Biển 1", isCorrect: false },
      { id: "q2-b", label: "B", content: "Biển 2", isCorrect: false },
      { id: "q2-c", label: "C", content: "Biển 3", isCorrect: true },
    ],
  },
];
