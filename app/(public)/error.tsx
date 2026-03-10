"use client";

import styles from "@/styles/not-found.module.css";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.overlay}>
        <h1 className={styles.code}>500</h1>
        <p className={styles.text}>
          Internal Server Error
        </p>

        <button
          onClick={reset}
          style={{
            marginTop: "24px",
            padding: "10px 28px",
            borderRadius: "24px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
}