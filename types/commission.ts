// src/types/commission.ts
export type CommissionStatus = 'Chờ thanh toán' | 'Đã thanh toán';

export interface CommissionRecord {
  id: string;
  collaboratorCode: string;
  collaboratorName: string;
  referralCode: string;
  amount: number; // Lưu bằng số để dễ format VNĐ
  date: string;
  status: CommissionStatus;
}

export interface CommissionStatsData {
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  activeCollaborators: number;
}