"use client";

import styles from "@/styles/AuthModal.module.css";

type Props = {
  open: boolean;
  mode: "login" | "register";
  onClose: () => void;
  onSwitch: (mode: "login" | "register") => void;
};

export default function AuthModal({
  open,
  mode,
  onClose,
  onSwitch,
}: Props) {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT */}
        <div className={styles.left}>
          <h2 className={styles.title}>
            {mode === "login" ? "Login" : "Register"}
          </h2>

          {/* COMMON */}
          {/* <input
            className={styles.input}
            placeholder="Name"
          /> */}

          {/* REGISTER ONLY */}
          {/* {mode === "register" && (
            <input
              className={styles.input}
              placeholder="Email"
            />
          )} */}

          <input
            className={styles.input}
            type="email"
            placeholder="Email"
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
          />

          {/* REGISTER ONLY */}
          {mode === "register" && (
            <input
              className={styles.input}
              type="password"
              placeholder="Confirm Password"
            />
          )}

          {/* LOGIN ONLY */}
          {mode === "login" && (
            <span className={styles.forgot}>
              Forgot your password
            </span>
          )}

          <button className={styles.primaryBtn}>
            {mode === "login" ? "Login" : "Create account"}
          </button>

          <p className={styles.divider}>Or sign up by</p>

          <div className={styles.socials}>
            <button className={styles.social}>f</button>
            <button className={styles.social}>G</button>
            <button className={styles.social}>◎</button>
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right} />
      </div>
    </div>
  );
}