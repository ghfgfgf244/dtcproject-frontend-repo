import { AppRole, MenuConfig } from '@/types/nav';

// Chỉ lấy các role thuộc nhóm quản trị
type ManagerRole = Extract<AppRole, 'TrainingManager' | 'EnrollmentManager' | 'Admin'>;

export const MANAGER_MENUS: Record<ManagerRole, MenuConfig> = {
  TrainingManager: {
    title: 'Quản lý đào tạo',
    items: [
      { label: 'Trang chủ', href: '/training-manager/dashboard', icon: 'dashboard' },
      { label: 'Khóa học', href: '/training-manager/courses', icon: 'auto_stories' },
      { label: 'Lớp học & Lịch trình', href: '/training-manager/classes', icon: 'groups' },
      { label: 'Kỳ thi', href: '/training-manager/exams', icon: 'assignment' },
      { label: 'Giảng viên', href: '/training-manager/instructors', icon: 'badge' },
      { label: 'Thông báo', href: '/training-manager/notifications', icon: 'notifications' },
      { label: 'Tài liệu cá nhân', href: '/training-manager/documents', icon: 'description' }, 
    ]
  },
  EnrollmentManager: {
    title: 'Quản lý tuyển sinh',
    items: [
      { label: 'Trang chủ', href: '/enrollment-manager/dashboard', icon: 'dashboard' },
      { label: 'Kỳ tuyển sinh', href: '/enrollment-manager/terms', icon: 'calendar_view_month' },
      { label: 'Quản lý cộng tác viên', href: '/enrollment-manager/collaborators', icon: 'group' },
      { label: 'Bài đăng tuyển sinh', href: '/enrollment-manager/admissions', icon: 'post_add' },
      { label: 'Thống kê & Báo cáo', href: '/enrollment-manager/reports', icon: 'bar_chart' },
      { label: 'Thông báo', href: '/enrollment-manager/notifications', icon: 'notifications' },
      { label: 'Tài liệu cá nhân', href: '/enrollment-manager/documents', icon: 'description' }, 
    ]
  },
  Admin: {
    title: 'Admin',
    items: [
      { label: 'Tổng quan', href: '/admin/dashboard', icon: 'pie_chart' },
      { label: 'Trung tâm', href: '/admin/centers', icon: 'domain' },
      { label: 'Quản lý người dùng', href: '/admin/users', icon: 'manage_accounts' },
      { label: 'Tài chính', href: '/admin/financials', icon: 'account_balance' },
      { label: 'Cài đặt', href: '/admin/settings', icon: 'settings' },
      { label: 'Thông báo', href: '/admin/notifications', icon: 'notifications' },
    ]
  }
};