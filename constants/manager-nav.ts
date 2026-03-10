import { AppRole, MenuConfig } from '@/types/nav';

// Chỉ lấy các role thuộc nhóm quản trị
type ManagerRole = Extract<AppRole, 'TrainingManager' | 'EnrollmentManager' | 'Admin'>;

export const MANAGER_MENUS: Record<ManagerRole, MenuConfig> = {
  TrainingManager: {
    title: 'Training Operations',
    items: [
      { label: 'Dashboard', href: '/training-manager/dashboard', icon: 'dashboard' },
      { label: 'Courses', href: '/training-manager/courses', icon: 'auto_stories' },
      { label: 'Terms (Batches)', href: '/training-manager/terms', icon: 'calendar_view_month' },
      { label: 'Classes & Schedules', href: '/training-manager/classes', icon: 'groups' },
      { label: 'Exams', href: '/training-manager/exams', icon: 'assignment' },
      { label: 'Instructors', href: '/training-manager/instructors', icon: 'badge' },
      { label: 'Notifications', href: '/training-manager/notifications', icon: 'notifications' },
      { label: 'Personal Docs', href: '/training-manager/documents', icon: 'description' }, 
    ]
  },
  EnrollmentManager: {
    title: 'Enrollment System',
    items: [
      { label: 'Dashboard', href: '/enrollment-manager/dashboard', icon: 'dashboard' },
      { label: 'Collaborator Management', href: '/enrollment-manager/collaborators', icon: 'group' },
      { label: 'Admission Posts', href: '/enrollment-manager/admissions', icon: 'post_add' },
      { label: 'Statistics & Reports', href: '/enrollment-manager/reports', icon: 'bar_chart' },
      { label: 'Notifications', href: '/enrollment-manager/notifications', icon: 'notifications' },
      { label: 'Personal Docs', href: '/training-manager/documents', icon: 'description' }, 
    ]
  },
  Admin: {
    title: 'System Admin',
    items: [
      { label: 'Overview', href: '/admin/dashboard', icon: 'pie_chart' },
      { label: 'Centers', href: '/admin/centers', icon: 'domain' },
      { label: 'Users & Roles', href: '/admin/users', icon: 'manage_accounts' },
      { label: 'Financials', href: '/admin/financials', icon: 'account_balance' },
      { label: 'Settings', href: '/admin/settings', icon: 'settings' },
      { label: 'Notifications', href: '/admin/notifications', icon: 'notifications' },
    ]
  }
};