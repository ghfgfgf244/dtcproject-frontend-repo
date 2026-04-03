"use client";

import styles from "@/styles/header.module.css";
import NotificationDropdown from "./dropdown";
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <div className={styles.icon}>🚗</div>
        <div style={{ fontSize: "10px" }}>
          <h1>DriveMaster</h1>
          <p>Academy</p>
        </div>
      </Link>

      {/* Top nav links — visible for everyone */}
      <nav className={styles.nav}>
        <Link href="/">Trang chủ</Link>
        <Link href="/homepage">Bài đăng</Link>
        <Link href="/courses">Khóa học</Link>
        <Link href="/contact">Liên hệ</Link>
      </nav>

      <div className={styles.right}>
        {/* Not logged in → show login/register buttons */}
        <SignedOut>
          <div className={styles.authButtons}>
            <SignInButton mode="modal">
              <button className={styles.loginBtn}>Đăng nhập</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className={styles.registerBtn}>Đăng ký</button>
            </SignUpButton>
          </div>
        </SignedOut>

        {/* Logged in → show notification bell + avatar */}
        <SignedIn>
          <NotificationDropdown />
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
