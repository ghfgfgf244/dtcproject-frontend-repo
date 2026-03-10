import styles from "@/styles/hero.module.css";
import Link from "next/link";

type HeroProps = {
  onRegister: () => void;
};

export default function Hero({ onRegister }: HeroProps) {
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

          <button 
            onClick={onRegister}
            className={styles.secondaryBtn}
          >
            Register now
          </button>
        </div>
      </div>
    </section>
  );
}
