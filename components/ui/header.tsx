"use client";

import styles from "@/styles/header.module.css";
import NotificationDropdown from "./dropdown";
import Link from "next/link";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <div className={styles.icon}>??</div>

        <div style={{ fontSize: "10px" }}>
          <h1>DriveMaster</h1>
          <p>Academy</p>
        </div>
      </Link>

      <nav className={styles.nav}>
        <Link href="/">Trang chủ</Link>
        <Link href="/homepage">Bài đăng</Link>
        <Link href="/courses">Khóa học</Link>
        <Link href="/contact">Liên hệ</Link>
      </nav>

      <div className={styles.right}>
        <SignedOut>
          <div className={styles.authButtons}>
            <SignInButton mode="modal">
              <button className={styles.loginBtn}>Login</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className={styles.registerBtn}>Register</button>
            </SignUpButton>
          </div>
        </SignedOut>

        <SignedIn>
          <NotificationDropdown />
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
}
