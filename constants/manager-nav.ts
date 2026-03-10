import { AppRole, MenuConfig } from '@/types/nav';

// Chỉ lấy các role thuộc nhóm quản trị
type ManagerRole = Extract<AppRole, 'TrainingManager' | 'EnrollmentManager' | 'Admin'>;

export const MANAGER_MENUS: Record<ManagerRole, MenuConfig> = {
  TrainingManager: {
    title: 'Training Operations',
    items: [
      { label: 'Dashboard', href: '/training/dashboard', icon: 'dashboard' },
      { label: 'Courses', href: '/training/courses', icon: 'auto_stories' },
      { label: 'Classes & Schedules', href: '/training/classes', icon: 'groups' },
      { label: 'Exams', href: '/training/exams', icon: 'assignment' },
      { label: 'Instructors', href: '/training/instructors', icon: 'badge' },
    ]
  },
  EnrollmentManager: {
    title: 'Enrollment Hub',
    items: [
      { label: 'Dashboard', href: '/enrollment/dashboard', icon: 'monitoring' },
      { label: 'Admissions', href: '/enrollment/admissions', icon: 'campaign' },
      { label: 'Collaborators', href: '/enrollment/collaborators', icon: 'handshake' },
      { label: 'Registrations', href: '/enrollment/registrations', icon: 'how_to_reg' },
      { label: 'Reports', href: '/enrollment/reports', icon: 'bar_chart' },
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
    ]
  }
};