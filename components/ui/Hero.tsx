import styles from "@/styles/hero.module.css";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.overlay}>
        <p className={styles.welcome}>WELCOME TO</p>
        <h1 className={styles.title}>Driving school system</h1>
        <p className={styles.subtitle}>Theory and Practice Course</p>

        <div className={styles.actions}>
          <Link href="/courses" className={styles.primaryBtn}>
            View courses
          </Link>

          <SignUpButton mode="modal">
            <button className={styles.secondaryBtn}>
              Register now
            </button>
          </SignUpButton>
        </div>
      </div>
    </section>
  );
}
