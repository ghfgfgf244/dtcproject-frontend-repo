// src/types/class.ts

export type ClassTheme = 'blue' | 'emerald' | 'purple' | 'orange';

export interface ClassRecord {
  id: string;
  code: string;           // Ký hiệu hạng bằng (VD: B2, B1, A1)
  name: string;           // Tên lớp (VD: Lớp B2-Jan2026)
  courseName: string;     // Khóa học áp dụng
  studentCount: number;   // Số lượng học viên
  startDate: string;      // Ngày khai giảng
  endDate: string;        // Ngày bế giảng dự kiến
  theme: ClassTheme;      // Màu sắc hiển thị icon
}

export type ClassStatus = 'Đang tuyển' | 'Đang học' | 'Kết thúc';

// Giao diện cho 1 buổi học trong lịch trình
export interface ClassSession {
  id: string; // ID giả để quản lý state (không lưu xuống DB)
  instructorId: string;
  startTime: string; // VD: 2024-05-20T08:00
  endTime: string;   // VD: 2024-05-20T11:30
}

// Giao diện dữ liệu cho Form Modal
export interface ClassFormData {
  id?: string;
  name: string;
  termId: string;    // ID học kỳ
  maxStudents: number;
  status: ClassStatus;
  sessions: ClassSession[];
}