import { ExamBatch, Exam } from "@/types/exam";

// Cấu hình các Tabs lọc
export const EXAM_TABS = [
  { id: 'all', label: 'All Batches' },
  { id: 'active', label: 'Active' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'completed', label: 'Completed' },
];

// Mock data (Sau này đổi thành Fetch API)
export const MOCK_BATCHES: ExamBatch[] = [
  { id: "batch-1", courseId: "FE-B-24", batchName: "Driver License B Summer 2024", registrationStartDate: "2024-10-01", registrationEndDate: "2024-10-15", examStartDate: "2024-11-05", status: "ACTIVE" },
  { id: "batch-2", courseId: "FE-A-24", batchName: "Driver License A Winter 2024", registrationStartDate: "2024-11-15", registrationEndDate: "2024-11-30", examStartDate: "2024-12-10", status: "UPCOMING" },
];

export const MOCK_EXAMS: Exam[] = [
  { id: "ex-1", examBatchId: "batch-1", examName: "Theory Test", examType: "ONLINE", examDate: "2024-11-12", durationMinutes: 90 },
  { id: "ex-2", examBatchId: "batch-1", examName: "Practical Test", examType: "ONSITE", examDate: "2024-12-05", durationMinutes: 180 },
  { id: "ex-3", examBatchId: "batch-2", examName: "Theory Test", examType: "ONLINE", examDate: "2024-11-12", durationMinutes: 90 },
  { id: "ex-4", examBatchId: "batch-2", examName: "Practical Test", examType: "ONSITE", examDate: "2024-12-05", durationMinutes: 180 },
];