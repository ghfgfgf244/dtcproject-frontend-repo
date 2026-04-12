// src/constants/term-data.ts
import { TermRecord } from "@/types/term";

// FIX: Removed unknown 'code', 'status', 'academicYear' fields.
//      Added required fields: courseId, currentStudents, maxStudents, isActive.
export const MOCK_TERMS: TermRecord[] = [
  {
    id: "term-1",
    courseId: "crs-1",
    name: "Học kỳ Mùa Thu 2024",
    courseName: "Đào tạo Lái xe Hạng B2",
    startDate: "01 Thg 09, 2024",
    endDate: "15 Thg 12, 2024",
    currentStudents: 32,
    maxStudents: 40,
    isActive: true,
  },
  {
    id: "term-2",
    courseId: "crs-4",
    name: "Học kỳ Cấp tốc Mùa Đông 2025",
    courseName: "Đào tạo Lái xe Hạng C",
    startDate: "05 Thg 01, 2025",
    endDate: "30 Thg 01, 2025",
    currentStudents: 0,
    maxStudents: 30,
    isActive: true,
  },
  {
    id: "term-3",
    courseId: "crs-2",
    name: "Học kỳ Mùa Hè 2024",
    courseName: "Đào tạo Lái xe Hạng B1",
    startDate: "15 Thg 06, 2024",
    endDate: "10 Thg 08, 2024",
    currentStudents: 28,
    maxStudents: 35,
    isActive: false,
  }
];