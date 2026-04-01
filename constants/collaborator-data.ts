// src/constants/collaborator-data.ts
import { Collaborator, CollaboratorStats, RegionalDistribution } from '@/types/collaborator';

export const MOCK_COLLABORATORS: Collaborator[] = [
  {
    id: '1', code: 'CTV-2024-001', fullName: 'Nguyễn Minh Anh', email: 'minhanh.ng@gmail.com', phone: '0987-654-321',
    referralCode: 'AZURE-MA-24', registrationCount: 142, pendingCommission: 8500000, status: 'ACTIVE', initials: 'MA'
  },
  {
    id: '2', code: 'CTV-2024-042', fullName: 'Trần Hoàng Long', email: 'long.th@azure.edu.vn', phone: '0912-333-444',
    referralCode: 'AZURE-HL-99', registrationCount: 89, pendingCommission: 4250000, status: 'ACTIVE', initials: 'HL'
  },
  {
    id: '3', code: 'CTV-2023-112', fullName: 'Lê Thị Thu Thủy', email: 'thuthuy.le@gmail.com', phone: '0938-111-222',
    referralCode: 'AZURE-TT-55', registrationCount: 215, pendingCommission: 12700000, status: 'INACTIVE', initials: 'TT'
  }
];

export const MOCK_COLLAB_STATS: CollaboratorStats = {
  total: 1284,
  growth: '+12%',
  activeCodes: 852,
  pendingCommissionTotal: '45.2M',
  totalPayouts: '1.4B'
};

export const REGIONAL_DATA: RegionalDistribution[] = [
  { label: 'TP. Hồ Chí Minh', percentage: 65, colorClass: 'bg-blue-600' },
  { label: 'Hà Nội', percentage: 25, colorClass: 'bg-purple-500' },
  { label: 'Đà Nẵng & Khác', percentage: 10, colorClass: 'bg-amber-500' }
];