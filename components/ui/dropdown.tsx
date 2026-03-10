"use client";

import { useState } from "react";
import styles from "@/styles/header.module.css";
import { Bell } from "lucide-react";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.notiWrapper}>
      
      {/* Bell button */}
      <button
        className={styles.notiBell}
        onClick={() => setOpen(!open)}
      >
        <Bell size={18} />
        <span className={styles.notiBadge}></span>
      </button>

      {/* Dropdown */}
      <div
        className={`${styles.notiDropdown} ${
          open ? styles.show : ""
        }`}
      >

        <div className={styles.notiHeader}>
          <span>Notifications</span>
        </div>

        <div className={styles.notiItem}>
          <div className={`${styles.notiIcon} ${styles.blue}`}>📅</div>
          <div>
            <p>New driving lesson scheduled for tomorrow</p>
            <span>2 mins ago</span>
          </div>
        </div>

        <div className={styles.notiItem}>
          <div className={`${styles.notiIcon} ${styles.yellow}`}>📄</div>
          <div>
            <p>B2 Theory Exam results are out</p>
            <span>1 hour ago</span>
          </div>
        </div>

        <div className={styles.notiItem}>
          <div className={`${styles.notiIcon} ${styles.green}`}>✔</div>
          <div>
            <p>Tuition payment successful</p>
            <span>3 hours ago</span>
          </div>
        </div>

        <div className={styles.notiItem}>
          <img
            src="https://i.pravatar.cc/40"
            className={styles.notiAvatar}
            alt="avatar"
          />
          <div>
            <p>New message from Instructor Nam</p>
            <span>5 hours ago</span>
          </div>
        </div>

      </div>

    </div>
  );
}