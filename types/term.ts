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

export interface TermRecord {
  id: string;
  courseId: string;
  name: string;
  courseName: string;
  startDate: string;
  endDate: string;
  currentStudents: number;
  maxStudents: number;
  isActive: boolean;
}