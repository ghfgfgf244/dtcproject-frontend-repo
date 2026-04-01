import { ExamBatch, Exam } from "@/types/exam";

// Cấu hình các Tabs lọc dựa trên backend enum names
export const EXAM_TABS = [
  { id: 'all', label: 'Tất cả đợt thi' },
  { id: 'Pending', label: 'Chờ mở đăng ký' },
  { id: 'OpenForRegistration', label: 'Đang mở đăng ký' },
  { id: 'ClosedForRegistration', label: 'Đã đóng đăng ký' },
  { id: 'InProgress', label: 'Đang thi' },
  { id: 'Completed', label: 'Đã kết thúc' },
  { id: 'Cancelled', label: 'Đã hủy' },
];

// Mock data (Sau này đổi thành Fetch API)
export const MOCK_BATCHES: ExamBatch[] = [
  { 
    id: "88888888-8888-8888-8888-888888888881", 
    batchName: "Khóa thi B2 - Hè 2024", 
    registrationStartDate: "2024-10-01", 
    registrationEndDate: "2024-10-15", 
    examStartDate: "2024-11-20", 
    status: 'OpenForRegistration',
    maxCandidates: 200,
    currentCandidates: 142
  }, 
  { 
    id: "88888888-8888-8888-8888-888888888882", 
    batchName: "Khóa thi A1 - Thu 2024", 
    registrationStartDate: "2024-11-01", 
    registrationEndDate: "2024-11-10", 
    examStartDate: "2024-11-25", 
    status: 'Pending',
    maxCandidates: 100,
    currentCandidates: 0
  }
];

export const MOCK_EXAMS: Exam[] = [
  { id: "ex-4", examBatchId: "88888888-8888-8888-8888-888888888882", courseId: "44444444-4444-4444-4444-444444444441", examName: "Thực hành vòng số 8", examType: "Practice", examDate: "2024-12-05", durationMinutes: 90, totalScore: 100, passScore: 80 },
];