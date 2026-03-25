// src/types/report.ts

export interface ReportKPIs {
  totalNewStudents: number;
  studentGrowth: string; // VD: "+12%"
  churnRate: number;
  totalCommission: number;
  approvedCommission: number;
  pendingCommission: number;
  topCollaborator: {
    name: string;
    avatar: string;
    studentsCount: number;
    performanceGrowth: string;
  };
}

export interface CollaboratorLeaderboard {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  students: number;
  revenue: number;
  estimatedCommission: number;
}
