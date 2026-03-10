import styles from "@/styles/not-found.module.css";

export default function AccessDenied() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay}>
        <h1 className={styles.code}>Access Denied</h1>
        <p className={styles.text}>
          You do not have permission to access this page
        </p>
      </div>
    </div>
  );
}