import styles from "@/styles/hero.module.css";

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
          <button className={styles.primary}>Learn More</button>

          <button onClick={onRegister}>
            Register now
          </button>
        </div>
      </div>
    </section>
  );
}
