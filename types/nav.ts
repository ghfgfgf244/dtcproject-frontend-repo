// types/nav.ts

// Định nghĩa cứng các Role lấy từ Clerk publicMetadata
export type AppRole = 
  | 'Guest' 
  | 'Student' 
  | 'Instructor' 
  | 'Collaborator' 
  | 'TrainingManager' 
  | 'EnrollmentManager' 
  | 'Admin';

export interface NavItem {
  label: string;
  href: string;
  icon: string; // Tên của Google Material Symbol (VD: 'dashboard')
}

export interface MenuConfig {
  title: string;
  items: NavItem[];
}