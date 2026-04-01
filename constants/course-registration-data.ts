// src/constants/registration-data.ts
import { Registration, RegistrationStats, RecentActivity } from '@/types/course-registration';

export const MOCK_REGISTRATION_STATS: RegistrationStats = {
  totalNew: 1284,
  newGrowth: '+12%',
  pendingCount: 42,
  pendingLabel: 'Ưu tiên cao',
  approvalRate: 94.2,
  approvalTarget: 95
};

export const MOCK_REGISTRATIONS: Registration[] = [
  {
    id: 'REG-001', studentId: 'HV-2024-001', fullName: 'Nguyễn Anh Tuấn', avatarInitials: 'NA', theme: 'blue',
    courseName: 'Khóa tiêu chuẩn', licenseType: 'B2', registrationDate: '24/05/2024', registrationTime: '14:30 PM',
    tuitionFee: 12500000, paymentStatus: 'PAID', approvalStatus: 'PENDING'
  },
  {
    id: 'REG-002', studentId: 'HV-2024-002', fullName: 'Trần Hoàng Nam', avatarInitials: 'TH', theme: 'purple',
    courseName: 'Khóa cấp tốc', licenseType: 'B1', registrationDate: '23/05/2024', registrationTime: '09:15 AM',
    tuitionFee: 18000000, paymentStatus: 'UNPAID', approvalStatus: 'PENDING'
  },
  {
    id: 'REG-003', studentId: 'HV-2024-003', fullName: 'Lê Thu Hà', avatarInitials: 'LT', theme: 'emerald',
    courseName: 'Nâng hạng bằng', licenseType: 'C', registrationDate: '23/05/2024', registrationTime: '08:00 AM',
    tuitionFee: 9200000, paymentStatus: 'PAID', approvalStatus: 'PENDING'
  },
  {
    id: 'REG-004', studentId: 'HV-2024-004', fullName: 'Phạm Minh Quân', avatarInitials: 'PM', theme: 'amber',
    courseName: 'Khóa tiêu chuẩn', licenseType: 'B2', registrationDate: '22/05/2024', registrationTime: '16:50 PM',
    tuitionFee: 12500000, paymentStatus: 'UNPAID', approvalStatus: 'PENDING'
  }
];

export const MOCK_RECENT_ACTIVITIES: RecentActivity[] = [
  { id: 'ACT-1', type: 'approve', actor: 'Bạn', action: 'đã duyệt hồ sơ của', target: 'Ngô Quốc Bảo', detail: '(Hạng B1)', timeAgo: '10 phút trước' },
  { id: 'ACT-2', type: 'reject', actor: 'Bạn', action: 'đã từ chối hồ sơ', target: 'Lê Văn Tám', detail: '(Thiếu chứng minh nhân dân)', timeAgo: '45 phút trước' },
  { id: 'ACT-3', type: 'system', actor: 'Hệ thống', action: 'tự động cập nhật trạng thái thanh toán cho', target: '15 học viên mới', timeAgo: '2 giờ trước' }
];