import Link from "next/link";
import {
  BarChart3,
  BookOpenCheck,
  CalendarCheck2,
  CalendarClock,
  CheckCircle,
  ChevronRight,
  GraduationCap,
  HelpCircle,
  Home,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import styles from "@/styles/sidebar.module.css";

const mainMenu = [
  {
    key: "homepage",
    label: "Trang chủ",
    icon: Home,
    href: "/homepage",
  },
  {
    key: "courses",
    label: "Khóa học của tôi",
    icon: BookOpenCheck,
    href: "/courses/my-course",
  },
  { key: "schedule", label: "Lịch học", icon: CalendarClock, href: "/schedule" },
  { key: "exams", label: "Lịch thi", icon: CalendarCheck2, href: "/exams" },
  { key: "attendance", label: "Điểm danh", icon: CheckCircle, href: "/attendance" },
  {
    key: "report",
    label: "Báo cáo điểm",
    icon: GraduationCap,
    href: "/report",
  },
  {
    key: "profile",
    label: "Hồ sơ",
    icon: User,
    href: "/profile",
  },
  {
    key: "teaching-schedule",
    label: "Lịch giảng dạy",
    icon: CalendarClock,
    href: "/teaching-schedule",
  },
  {
    key: "partner-dashboard",
    label: "Đối tác",
    icon: BookOpenCheck,
    href: "/partner-dashboard",
  },
];

const supportMenu = [
  { label: "Cài đặt", icon: Settings },
  { label: "Hỗ trợ", icon: HelpCircle },
];

type SidebarProps = {
  activeKey?: string;
};

export default function Sidebar({ activeKey = "courses" }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>

      <nav className={styles.nav}>
        <ul className={styles.menuList}>
          {mainMenu.map((item) => {
            const Icon = item.icon;
            const isActive = item.key === activeKey;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`${styles.menuItem} ${
                    isActive ? styles.menuItemActive : ""
                  }`}
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

      <div className={styles.footer}>
        <button type="button" className={styles.logout}>
          <span className={styles.menuIconMuted}>
            <LogOut size={18} />
          </span>
          <span className={styles.menuLabel}>Đăng xuất</span>
          <ChevronRight className={styles.chevron} size={18} />
        </button>
        <div className={styles.version}>DRIVEMASTER ACADEMY V2.4.0</div>
      </div>
    </aside>
  );
}
