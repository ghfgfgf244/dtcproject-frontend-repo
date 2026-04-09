"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import NotificationDropdown from "./dropdown";
import styles from "@/styles/header.module.css";

export default function Header() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        <div className={styles.icon}>
          <Image
            src="/brand-car.svg"
            alt="Drive Safe Academy"
            width={44}
            height={44}
            className={styles.logoImage}
          />
        </div>
        <div className={styles.brandText}>
          <h1>Drive Safe</h1>
          <p>Academy</p>
        </div>
      </Link>

      <nav className={styles.nav}>
        <Link href="/">Trang chủ</Link>
        <Link href="/homepage">Bài đăng</Link>
        <Link href="/courses">Khóa học</Link>
        <Link href="/courses/my-course/theory-practice">Thi thử</Link>
        <Link href="/resources">Tài liệu</Link>
        <Link href="/contact">Liên hệ</Link>
      </nav>

      <div className={styles.right}>
        {!mounted ? (
          <div className={styles.authButtons}>
            <button type="button" className={styles.loginBtn}>
              Đăng nhập
            </button>
            <button type="button" className={styles.registerBtn}>
              Đăng ký
            </button>
          </div>
        ) : (
          <>
            <SignedOut>
              <div className={styles.authButtons}>
                <SignInButton mode="modal">
                  <button type="button" className={styles.loginBtn}>
                    Đăng nhập
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button type="button" className={styles.registerBtn}>
                    Đăng ký
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>

            <SignedIn>
              <NotificationDropdown />
              <UserButton />
            </SignedIn>
          </>
        )}
      </div>
    </header>
  );
}
