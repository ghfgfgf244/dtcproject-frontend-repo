// src/types/center.ts
export type CenterStatus = 'Hoạt động' | 'Tạm dừng';

export interface CenterRecord {
  id: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  status: CenterStatus;
}

export interface CenterStatsData {
  total: number;
  active: number;
  suspended: number;
}