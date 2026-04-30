"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/hero.module.css";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Hero() {
  const heroImages = [
    "/Banner1.jpeg",
    "/Banner2.jpeg",
    "/Background.jpg",
    "/CourseImage.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Dừng lại 4 giây rồi lướt tiếp
    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <section className={styles.hero}>
      <div className={styles.sliderContainer}>
        <div
          className={styles.sliderTrack}
          style={{ transform: `translateX(-${currentIndex * 100}vw)` }}
        >
          {heroImages.map((src, idx) => (
            <div key={idx} className={styles.slide}>
              <Image
                src={src}
                alt="Background"
                fill
                priority={idx === 0}
                className={styles.slideImage}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.overlay}>
        <p className={styles.welcome}>Hệ thống hỗ trợ đào tạo lái xe</p>
        <h1 className={styles.title}>Chọn đúng - Chất lượng - Uy tín</h1>
        <p className={styles.subtitle}>
          Tư vấn khóa học, kỳ học và địa điểm thi phù hợp ngay trên trang chủ.
        </p>

        <div className={styles.actions}>
          <Link href="#course-advisor" className={styles.primaryBtn}>
            Tư vấn ngay
          </Link>

          <SignUpButton mode="modal">
            <button className={styles.secondaryBtn}>Đăng ký tài khoản</button>
          </SignUpButton>
        </div>
      </div>
    </section>
  );
}
