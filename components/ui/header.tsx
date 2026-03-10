"use client";

import styles from "@/styles/header.module.css";
import NotificationDropdown from "./dropdown";
import Link from "next/link";

export default function Header() {
  return (
    <header className={styles.header}>

      {/* Logo */}
      <Link href="/" className={styles.logo}>
        <div className={styles.icon}>🚗</div>

        <div style={{ fontSize: "10px" }}>
          <h1>DriveMaster</h1>
          <p>Academy</p>
        </div>
      </Link>

      {/* Menu */}
      <nav className={styles.nav}>
        <Link href="/homepage">Homepage</Link>
        <Link href="courses/my-course">My Courses</Link>
      </nav>

      {/* Right */}
      <div className={styles.right}>

        <NotificationDropdown />

        <img
          src="https://i.pravatar.cc/40"
          className={styles.avatar}
        />
      </div>

    </header>
  );
}