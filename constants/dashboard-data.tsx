// src/constants/dashboard-data.ts
import { DashboardData } from "@/types/dashboard";

export const MOCK_DASHBOARD_DATA: DashboardData = {
  kpis: [
    { title: "Tổng số Khóa học", value: 24, trend: 2.4, icon: "courses" },
    { title: "Lớp học đang mở", value: 12, trend: 12, icon: "classes" },
    { title: "Tổng số Học viên", value: 485, trend: 18, icon: "students" },
    { title: "Tỷ lệ Đỗ trung bình", value: "88.4%", trend: -0.5, icon: "passRate" }
  ],
  upcomingExams: [
    { id: "ex1", title: "Thi Sát hạch Lý thuyết Cuối kỳ", month: "Thg 10", date: "24", candidatesCount: 18, time: "09:00 SA", theme: "primary" },
    { id: "ex2", title: "Thi Thực hành Sa hình B2", month: "Thg 10", date: "26", candidatesCount: 12, time: "08:30 SA", theme: "blue" },
    { id: "ex3", title: "Thi Thực hành Đường trường B1", month: "Thg 10", date: "28", candidatesCount: 5, time: "11:00 SA", theme: "emerald" }
  ],
  instructors: [
    { id: "ins1", name: "Nguyễn Văn Marcus", avatarUrl: "https://ui-avatars.com/api/?name=Marcus&background=e2e8f0&color=475569", status: "Rảnh rỗi", currentLoad: 45, rating: 4.9 },
    { id: "ins2", name: "Elena Trần", avatarUrl: "https://ui-avatars.com/api/?name=Elena&background=e2e8f0&color=475569", status: "Đang dạy", currentLoad: 85, rating: 4.8 },
    { id: "ins3", name: "Lê Hoàng Sarah", avatarUrl: "https://ui-avatars.com/api/?name=Sarah&background=e2e8f0&color=475569", status: "Nghỉ phép", currentLoad: 20, rating: 5.0 }
  ]
};