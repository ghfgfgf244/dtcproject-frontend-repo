export interface TermItem {
  id: string;
  courseId: string; // Khóa này dạy theo chương trình nào
  termName: string; // VD: Khóa K122 - B2
  startDate: string;
  endDate: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  
  // Các trường join thêm để hiển thị lên bảng
  courseName?: string;
  classCount?: number; // Số lượng lớp học đang mở trong khóa này
}

export type TermStatus = 'Active' | 'Scheduled' | 'Expired';

export interface TermRecord {
  id: string;
  code: string;           // VD: TRM-2024-001
  name: string;           // VD: Học kỳ Mùa Thu 2024
  courseName: string;     // VD: B2 Nâng cao
  startDate: string;
  endDate: string;
  status: TermStatus;
  academicYear: number;   // Dùng để filter
}