export const STUDENT_MENU = [
  {
    label: "Dashboard",
    icon: "dashboard",
    href: "/student/dashboard",
    active: true,
  },
  { label: "Courses", icon: "menu_book", href: "/student/courses" },
  { label: "Classes", icon: "school", href: "/student/classes" },
  { label: "Schedule", icon: "calendar_month", href: "/student/schedule" },
  { label: "Materials", icon: "folder", href: "/student/materials" },
  { label: "Mock Exams", icon: "edit_note", href: "/student/exams" },
  { label: "Results", icon: "bar_chart", href: "/student/results" },
  { label: "Profile", icon: "person", href: "/student/profile" },
];
export const ADM_MENU = [
  { icon: "dashboard", label: "Dashboard", href: "/admin" },
  { icon: "group", label: "User Management", href: "/admin/users" },
  { icon: "badge", label: "Role Assignment", href: "/admin/roles" },
  { icon: "lock_person", label: "Access Control", href: "/admin/access" },
  {
    icon: "payments",
    label: "Finance",
    href: "/admin/finance",
    active: true,
  },
];
