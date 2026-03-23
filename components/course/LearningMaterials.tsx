import styles from "@/styles/mycourse.module.css";
import Link from "next/link";

export default function LearningMaterials() {
  return (
    <div className={styles.card}>

      <h3>Learning Materials</h3>

      <div className={styles.materialGrid}>

        <Link href="/courses/my-course/theory-practice" className={styles.materialCard}>
          Theory questions and answers
        </Link>

        <div className={styles.materialCard}>
          Simulation test and tips
        </div>

        <div className={styles.materialCard}>
          Practical driving, tips and tricks
        </div>

      </div>

    </div>
  );
}
