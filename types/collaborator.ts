// src/types/collaborator.ts

export type CollaboratorStatus = 'ACTIVE' | 'INACTIVE';

export interface Collaborator {
  id: string;
  code: string; // ID hiển thị như CTV-2024-001
  fullName: string;
  email: string;
  phone: string;
  referralCode: string;
  registrationCount: number;
  pendingCommission: number;
  status: CollaboratorStatus;
  avatarUrl?: string;
  initials: string;
}

export interface CollaboratorStats {
  total: number;
  growth: string;
  activeCodes: number;
  pendingCommissionTotal: string;
  totalPayouts: string;
}

export interface RegionalDistribution {
  label: string;
  percentage: number;
  colorClass: string;
}