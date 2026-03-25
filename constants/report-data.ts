// src/constants/report-data.ts
import { ReportKPIs, CollaboratorLeaderboard } from "@/types/report";

export const MOCK_REPORT_KPIS: ReportKPIs = {
  totalNewStudents: 1245,
  studentGrowth: "+12%",
  churnRate: 4.2,
  totalCommission: 450000000,
  approvedCommission: 300000000,
  pendingCommission: 150000000,
  topCollaborator: {
    name: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?u=nguyen-van-a",
    studentsCount: 52,
    performanceGrowth: "+15%"
  }
};

export const MOCK_LEADERBOARD: CollaboratorLeaderboard[] = [
  { id: "lb-1", rank: 1, name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/150?u=nguyen-van-a", students: 52, revenue: 520000000, estimatedCommission: 52000000 },
  { id: "lb-2", rank: 2, name: "Trần Thị B", avatar: "https://i.pravatar.cc/150?u=tran-thi-b", students: 48, revenue: 480000000, estimatedCommission: 48000000 },
  { id: "lb-3", rank: 3, name: "Lê Văn C", avatar: "https://i.pravatar.cc/150?u=le-van-c", students: 35, revenue: 350000000, estimatedCommission: 35000000 },
];
