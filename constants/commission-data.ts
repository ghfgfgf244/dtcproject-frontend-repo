// src/constants/commission-data.ts
import { CommissionRecord, CommissionStatsData } from "@/types/commission";

export const MOCK_COMMISSION_STATS: CommissionStatsData = {
  totalAmount: 1250000000,
  paidAmount: 845000000,
  pendingAmount: 405000000,
  activeCollaborators: 1542
};

export const MOCK_COMMISSIONS: CommissionRecord[] = [
  { id: "com-1", collaboratorCode: "CTV-8821", collaboratorName: "Nguyễn Lâm Anh", referralCode: "LANH8821", amount: 15500000, date: "2023-10-22", status: "Chờ thanh toán" },
  { id: "com-2", collaboratorCode: "CTV-7742", collaboratorName: "Trần Hoàng Minh", referralCode: "MINHTH77", amount: 8200000, date: "2023-10-21", status: "Đã thanh toán" },
  { id: "com-3", collaboratorCode: "CTV-1029", collaboratorName: "Phạm Thu Thảo", referralCode: "THAOPT10", amount: 22000000, date: "2023-10-20", status: "Chờ thanh toán" },
  { id: "com-4", collaboratorCode: "CTV-4552", collaboratorName: "Lê Văn Đạt", referralCode: "DATLE455", amount: 12750000, date: "2023-10-19", status: "Đã thanh toán" },
  { id: "com-5", collaboratorCode: "CTV-3310", collaboratorName: "Đặng Hồng Liên", referralCode: "LIENDH33", amount: 5400000, date: "2023-10-18", status: "Chờ thanh toán" },
];