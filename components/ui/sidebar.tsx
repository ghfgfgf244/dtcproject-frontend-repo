"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  CalendarCheck2,
  CalendarClock,
  CheckCircle,
  GraduationCap,
  HelpCircle,
  Home,
  Settings,
  User,
  Users,
} from "lucide-react";
import styles from "@/styles/sidebar.module.css";
import { useUser } from "@clerk/nextjs";

// ─── Menu definitions per role ───────────────────────────────────────────────

const STUDENT_MENU = [
  { key: "homepage", label: "Trang chủ",        icon: Home,           href: "/homepage" },
  { key: "courses",  label: "Khóa học của tôi", icon: BookOpenCheck,  href: "/courses/my-course" },
  { key: "schedule", label: "Lịch học",          icon: CalendarClock,  href: "/schedule" },
  { key: "exams",    label: "Lịch thi",          icon: CalendarCheck2, href: "/exams" },
  { key: "attendance", label: "Điểm danh",       icon: CheckCircle,    href: "/attendance" },
  { key: "profile",  label: "Hồ sơ",             icon: User,           href: "/profile" },
];

const INSTRUCTOR_MENU = [
  { key: "homepage",          label: "Trang chủ",     icon: Home,          href: "/homepage" },
  { key: "teaching-schedule", label: "Lịch giảng dạy", icon: CalendarClock, href: "/teaching-schedule" },
  { key: "profile",           label: "Hồ sơ",          icon: User,          href: "/profile" },
];

const COLLABORATOR_MENU = [
  { key: "homepage",           label: "Trang chủ", icon: Home,         href: "/homepage" },
  { key: "partner-dashboard",  label: "Đối tác",   icon: Users,        href: "/partner-dashboard" },
  { key: "profile",            label: "Hồ sơ",     icon: User,         href: "/profile" },
];

// Default menu (fallback for unknown roles still inside (user) layout)
const DEFAULT_MENU = [
  { key: "homepage", label: "Trang chủ", icon: Home, href: "/homepage" },
  { key: "profile",  label: "Hồ sơ",     icon: User, href: "/profile" },
];

function getMenuForRole(role: string) {
  switch (role) {
    case "Student":      return STUDENT_MENU;
    case "Instructor":   return INSTRUCTOR_MENU;
    case "Collaborator": return COLLABORATOR_MENU;
    default:             return DEFAULT_MENU;
  }
}

const supportMenu = [
  { label: "Cài đặt", icon: Settings },
  { label: "Hỗ trợ",  icon: HelpCircle },
];

type SidebarProps = {
  activeKey?: string;
};

export default function Sidebar({ activeKey = "homepage" }: SidebarProps) {
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as string) ?? "Student";
  const mainMenu = getMenuForRole(role);

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {mainMenu.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeKey;
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={`${styles.menuItem} ${isActive ? styles.menuItemActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={styles.menuIcon}>
                    <Icon size={18} />
                  </span>
                  <span className={styles.menuLabel}>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={styles.divider} />

        <ul className={styles.menuList}>
          {supportMenu.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button type="button" className={styles.menuItem}>
                  <span className={styles.menuIconMuted}>
                    <Icon size={18} />
                  </span>
                  <span className={styles.menuLabel}>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer – version info only, no logout button */}
      <div className={styles.footer}>
        <div className={styles.version}>DRIVEMASTER ACADEMY V2.4.0</div>
      </div>
    </aside>
  );
}
