import { FinanceKpi, Transaction } from "@/types/finance";

export const FINANCE_KPIS: FinanceKpi[] = [
  { id: 'kpi-1', title: 'Tổng doanh thu', value: '3.112.500.000 ₫', trendValue: '+12%', trendType: 'up', icon: 'payments' },
  { id: 'kpi-2', title: 'Đang chờ thanh toán', value: '208.750.000 ₫', trendValue: '+5%', trendType: 'up', icon: 'pending' },
  { id: 'kpi-3', title: 'Lượt đăng ký mới', value: '45', trendValue: '-2%', trendType: 'down', icon: 'enrollments' },
];

export const RECENT_TRANSACTIONS: Transaction[] = [
  { id: 'txn-1', studentName: 'Nguyễn Văn Minh', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh', licenseType: 'Hạng B2 (Số sàn)', date: '24 Thg 10, 2023', amount: 11250000, status: 'Completed' },
  { id: 'txn-2', studentName: 'Trần Thị Lan', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lan', licenseType: 'Hạng B1 (Số tự động)', date: '23 Thg 10, 2023', amount: 9500000, status: 'Pending' },
  { id: 'txn-3', studentName: 'Lê Hoàng Quốc', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Quoc', licenseType: 'Hạng C (Xe tải)', date: '22 Thg 10, 2023', amount: 21250000, status: 'Refunded' },
  { id: 'txn-4', studentName: 'Phạm Phương Thảo', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thao', licenseType: 'Hạng B2 (Số sàn)', date: '22 Thg 10, 2023', amount: 11250000, status: 'Completed' },
];