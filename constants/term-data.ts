// src/constants/term-data.ts
import { TermRecord } from "@/types/term";

export const MOCK_TERMS: TermRecord[] = [
  {
    id: "term-1",
    name: "Học kỳ Mùa Thu 2024",
    code: "TRM-2024-001",
    courseName: "Đào tạo Lái xe Hạng B2",
    startDate: "01 Thg 09, 2024",
    endDate: "15 Thg 12, 2024",
    status: "Active",
    academicYear: 2024
  },
  {
    id: "term-2",
    name: "Học kỳ Cấp tốc Mùa Đông 2025",
    code: "TRM-2025-002",
    courseName: "Đào tạo Lái xe Hạng C",
    startDate: "05 Thg 01, 2025",
    endDate: "30 Thg 01, 2025",
    status: "Scheduled",
    academicYear: 2025
  },
  {
    id: "term-3",
    name: "Học kỳ Mùa Hè 2024",
    code: "TRM-2024-009",
    courseName: "Đào tạo Lái xe Hạng B1",
    startDate: "15 Thg 06, 2024",
    endDate: "10 Thg 08, 2024",
    status: "Expired",
    academicYear: 2024
  }
];