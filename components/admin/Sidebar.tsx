import Link from "next/link";
import styles from "@/styles/admin.module.css";
import {
  GraduationCap,
  ClipboardList,
  User,
  Users,
  BookOpen,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Link href="/admin/training-managers" className={styles.sideItem}>
        <GraduationCap size={20} />
        <span>Training Manager</span>
      </Link>

      <Link href="/admin/enrollment-managers" className={styles.sideItem}>
        <ClipboardList size={20} />
        <span>Enrollment Manager</span>
      </Link>

      <Link href="/admin/instructors" className={styles.sideItem}>
        <User size={20} />
        <span>Instructor</span>
      </Link>

      <Link href="/admin/collaborators" className={styles.sideItem}>
        <Users size={20} />
        <span>Collaborator</span>
      </Link>

      <Link href="/admin/students" className={styles.sideItem}>
        <BookOpen size={20} />
        <span>Student</span>
      </Link>

      <button className={styles.logout}>
        Log out
      </button>
    </aside>
  );
}