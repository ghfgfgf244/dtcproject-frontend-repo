import { AppRole, MenuConfig } from '@/types/nav';

// Chỉ lấy các role thuộc nhóm quản trị
type ManagerRole = Extract<AppRole, 'TrainingManager' | 'EnrollmentManager' | 'Admin'>;

export const MANAGER_MENUS: Record<ManagerRole, MenuConfig> = {
  TrainingManager: {
    title: 'Quản lý đào tạo',
    items: [
      { label: 'Trang chủ', href: '/training-manager/dashboard', icon: 'dashboard' },
      { label: 'Khóa học', href: '/training-manager/courses', icon: 'auto_stories' },
      { label: 'Lớp học', href: '/training-manager/classes', icon: 'groups' },
      { label: 'Lịch học', href: '/training-manager/schedule', icon: 'calendar_today' },
      { label: 'Kỳ thi', href: '/training-manager/exams', icon: 'assignment' },
      { label: 'Giảng viên', href: '/training-manager/instructors', icon: 'badge' },
      { label: 'Duyệt đăng ký', href: '/training-manager/registrations', icon: 'how_to_reg' },
      { label: 'Bộ đề thi thử', href: '/training-manager/mock-exams', icon: 'note' },
      { label: 'Điều phối giảng viên', href: '/training-manager/assignments', icon: 'swap_horiz' },
      { label: 'Thông báo', href: '/training-manager/notifications', icon: 'notifications' },
      { label: 'Tài liệu cá nhân', href: '/training-manager/documents', icon: 'description' }, 
      { label: 'Quản lý lộ trình', href: '/training-manager/roadmaps', icon: 'bar_chart' },
      { label: 'Quản lý tài nguyên', href: '/training-manager/resources', icon: 'library_books' },
    ]
  },
  EnrollmentManager: {
    title: 'Quản lý tuyển sinh',
    items: [
      { label: 'Trang chủ', href: '/enrollment-manager/dashboard', icon: 'dashboard' },
      { label: 'Kỳ tuyển sinh', href: '/enrollment-manager/terms', icon: 'calendar_view_month' },
      { label: 'Bài đăng tuyển sinh', href: '/enrollment-manager/posts', icon: 'post_add' },
      { label: 'Thống kê & Báo cáo', href: '/enrollment-manager/reports', icon: 'bar_chart' },
      { label: 'Thông báo', href: '/enrollment-manager/notifications', icon: 'notifications' },
      { label: 'Quản lý cộng tác viên', href: '/enrollment-manager/collaborators', icon: 'group_add' },
      { label: 'Quản lý hồ sơ', href: '/enrollment-manager/profiles', icon: 'people_alt' },
      { label: 'Quản lý hoa hồng', href: '/enrollment-manager/commissions', icon: 'description' },
      { label: 'Tài liệu cá nhân', href: '/enrollment-manager/documents', icon: 'description' }, 
      
    ]
  },
  Admin: {
    title: 'Admin',
    items: [
      { label: 'Tổng quan', href: '/admin/dashboard', icon: 'pie_chart' },
      { label: 'Quản lý trung tâm', href: '/admin/centers', icon: 'domain' },
      { label: 'Quản lý người dùng', href: '/admin/users', icon: 'manage_accounts' },
      { label: 'Duyệt kỳ thi', href: '/admin/exam-approvals', icon: 'verified' },
      { label: 'Duyệt khóa học', href: '/admin/courses', icon: 'auto_stories' },
      { label: 'Tài chính', href: '/admin/financials', icon: 'account_balance' },
      { label: 'Cài đặt', href: '/admin/settings', icon: 'settings' },
      { label: 'Thông báo', href: '/admin/notifications', icon: 'notifications' },
    ]
  }
};