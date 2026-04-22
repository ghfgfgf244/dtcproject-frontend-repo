import {
  ExamBatch,
  Exam,
  ExamBatchScopeType,
  ExamStatus,
  ExamType,
} from "@/types/exam";

export const EXAM_TABS = [
  { id: "all", label: "Tất cả đợt thi" },
  { id: 1, label: "Chờ duyệt" },
  { id: 2, label: "Đang mở đăng ký" },
  { id: 3, label: "Đã đóng đăng ký" },
  { id: 4, label: "Đang thi" },
  { id: 5, label: "Đã kết thúc" },
  { id: 6, label: "Đã hủy" },
];

export const MOCK_BATCHES: ExamBatch[] = [
  {
    id: "88888888-8888-8888-8888-888888888881",
    scopeType: ExamBatchScopeType.Center,
    centerId: "33333333-3333-3333-3333-333333333331",
    centerName: "Trung Tâm Lái Xe Quận 1",
    batchName: "Khóa thi B2 - Hè 2024",
    registrationStartDate: "2024-10-01",
    registrationEndDate: "2024-10-15",
    examStartDate: "2024-11-20",
    status: 2,
    maxCandidates: 200,
    currentCandidates: 142,
  },
  {
    id: "88888888-8888-8888-8888-888888888882",
    scopeType: ExamBatchScopeType.National,
    centerId: null,
    centerName: null,
    batchName: "Khóa thi A1 - Toàn quốc 2024",
    registrationStartDate: "2024-11-01",
    registrationEndDate: "2024-11-10",
    examStartDate: "2024-11-25",
    status: 1,
    maxCandidates: 100,
    currentCandidates: 0,
  },
];

export const MOCK_EXAMS: Exam[] = [
  {
    id: "ex-4",
    examBatchId: "88888888-8888-8888-8888-888888888882",
    courseId: "44444444-4444-4444-4444-444444444441",
    addressId: 1,
    examName: "Thực hành vòng số 8",
    examType: ExamType.Practice,
    examDate: "2024-12-05",
    durationMinutes: 90,
    totalScore: 100,
    passScore: 80,
    status: ExamStatus.Scheduled,
  },
];
