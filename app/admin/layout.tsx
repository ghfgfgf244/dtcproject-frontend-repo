"use client";

import Sidebar from "../../components/admin/Sidebar";
import styles from "@/styles/admin.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <div className={styles.main}>
        <div className={styles.page}>
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}