// src/constants/assignment-data.ts
import { PendingClass, InstructorOption, AssignmentStatsData } from "@/types/assignment";

export const MOCK_ASSIGNMENT_STATS: AssignmentStatsData = {
  pendingCount: 12,
  availableInstructors: 45,
  urgentChanges: 3,
  fillRate: 94
};

export const MOCK_AVAILABLE_INSTRUCTORS: InstructorOption[] = [
  { id: "ins-1", fullName: "Thầy Nguyễn Văn A", expertise: "Lý thuyết Luật GTĐB", isRecommended: true },
  { id: "ins-2", fullName: "Thầy Trần Hữu B", expertise: "Thực hành B1, B2" },
  { id: "ins-3", fullName: "Cô Lê Thị C", expertise: "Thực hành B2", isRecommended: true },
  { id: "ins-4", fullName: "Thầy Phạm Văn D", expertise: "Thực hành Hạng C" },
];

export const MOCK_PENDING_CLASSES: PendingClass[] = [
  {
    id: "cls-1", code: "#CLS-9021", name: "Lý thuyết K12 - Lớp 1", course: "Hạng B2 - Cấp tốc", term: "Khóa K12/2024",
    currentStudents: 28, maxStudents: 30, status: "Trống", assignedInstructorId: null
  },
  {
    id: "cls-2", code: "#CLS-8842", name: "Thực hành Sa hình B1", course: "Hạng B1 - Số tự động", term: "Khóa K01/2025",
    currentStudents: 15, maxStudents: 20, status: "Cần đổi", assignedInstructorId: "ins-4" // Sai chuyên môn nên cần đổi
  },
  {
    id: "cls-3", code: "#CLS-7731", name: "Thực hành Đường trường C", course: "Hạng C - Xe tải", term: "Khóa K12/2024",
    currentStudents: 10, maxStudents: 12, status: "Trống", assignedInstructorId: null
  },
  {
    id: "cls-4", code: "#CLS-4421", name: "Mô phỏng 120 tình huống", course: "Hạng B2 - Tiêu chuẩn", term: "Khóa K02/2025",
    currentStudents: 35, maxStudents: 35, status: "Trống", assignedInstructorId: null
  }
];