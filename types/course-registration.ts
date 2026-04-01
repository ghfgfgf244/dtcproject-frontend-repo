// src/types/registration.ts

export type PaymentStatus = 'PAID' | 'UNPAID';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LicenseType = 'B1' | 'B2' | 'C' | 'ALL';

export interface Registration {
  id: string;
  studentId: string;
  fullName: string;
  avatarInitials: string;
  theme: 'blue' | 'purple' | 'emerald' | 'amber' | 'slate';
  courseName: string;
  licenseType: LicenseType;
  registrationDate: string;
  registrationTime: string;
  tuitionFee: number;
  paymentStatus: PaymentStatus;
  approvalStatus: ApprovalStatus;
}

export interface RegistrationStats {
  totalNew: number;
  newGrowth: string;
  pendingCount: number;
  pendingLabel: string;
  approvalRate: number;
  approvalTarget: number;
}

export interface RecentActivity {
  id: string;
  type: 'approve' | 'reject' | 'system';
  actor: string;
  action: string;
  target: string;
  detail?: string;
  timeAgo: string;
}