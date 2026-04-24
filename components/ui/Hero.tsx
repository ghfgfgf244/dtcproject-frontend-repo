import styles from "@/styles/hero.module.css";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className={styles.hero}>
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
