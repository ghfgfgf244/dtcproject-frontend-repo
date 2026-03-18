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
  LogOut,
  Settings,
} from "lucide-react";
import styles from "@/styles/sidebar.module.css";

const mainMenu = [
  {
    key: "courses",
    label: "Khóa học của tôi",
    icon: BookOpenCheck,
    href: "/courses/my-course",
  },
  {
    key: "progress",
    label: "Tiến độ học tập",
    icon: BarChart3,
    href: "/progress",
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
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          <GraduationCap className={styles.brandIconSvg} />
        </div>
        <span className={styles.brandText}>DriveMaster</span>
      </div>

      <div className={styles.user}>
        <div className={styles.avatar}>
          <span className={styles.avatarInitials}>AJ</span>
          <span className={styles.statusDot} />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>Alex Johnson</div>
          <div className={styles.userMeta}>Học viên B2</div>
        </div>
      </div>

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
