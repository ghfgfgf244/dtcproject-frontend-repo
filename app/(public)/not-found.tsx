import styles from "@/styles/not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.text}>Page Not Found</p>
      </div>
    </div>
  );
}