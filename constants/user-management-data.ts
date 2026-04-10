// src/constants/user-management-data.ts
import { Instructor, Student } from '@/types/user-management';

export const MOCK_INSTRUCTORS: Instructor[] = [
  { id: '1', code: 'GV-2024-001', fullName: 'Trần Nhật Nam', email: 'nam.tn@azure.edu.vn', phone: '0987-123-456', status: 'ACTIVE', role: 'INSTRUCTOR', specialty: 'Kỹ thuật phần mềm', avatarInitials: 'TN', theme: 'blue' },
  { id: '2', code: 'GV-2024-042', fullName: 'Phạm Hồng Nhung', email: 'nhung.ph@azure.edu.vn', phone: '0912-345-678', status: 'ACTIVE', role: 'INSTRUCTOR', specialty: 'Phân tích dữ liệu', avatarInitials: 'PH', theme: 'purple' },
  { id: '3', code: 'GV-2023-118', fullName: 'Lê Văn Thành', email: 'thanh.lv@azure.edu.vn', phone: '0933-445-566', status: 'SUSPENDED', role: 'INSTRUCTOR', specialty: 'An toàn thông tin', avatarInitials: 'LV', theme: 'slate' },
  { id: '4', code: 'GV-2024-089', fullName: 'Hoàng Thu Trang', email: 'trang.ht@azure.edu.vn', phone: '0944-555-666', status: 'ACTIVE', role: 'INSTRUCTOR', specialty: 'Thiết kế UI/UX', avatarInitials: 'HT', theme: 'orange' },
];

export const MOCK_STUDENTS: Student[] = [
  { id: '5', code: 'HV-2024-001', fullName: 'Nguyễn Văn An', email: 'an.nv@student.edu.vn', phone: '0911-222-333', status: 'ACTIVE', role: 'STUDENT', enrolledCourse: 'Java Core Fullstack', avatarInitials: 'NA', theme: 'emerald' },
  { id: '6', code: 'HV-2024-002', fullName: 'Trần Thị Bình', email: 'binh.tt@student.edu.vn', phone: '0922-333-444', status: 'ACTIVE', role: 'STUDENT', enrolledCourse: 'ReactJS Nâng cao', avatarInitials: 'TB', theme: 'blue' },
  { id: '7', code: 'HV-2024-003', fullName: 'Lê Hoàng Minh', email: 'minh.lh@student.edu.vn', phone: '0933-444-555', status: 'SUSPENDED', role: 'STUDENT', enrolledCourse: 'Data Science 101', avatarInitials: 'LM', theme: 'slate' },
];