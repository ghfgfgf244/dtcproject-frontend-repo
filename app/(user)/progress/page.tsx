import Image from "next/image";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/learning-progress.module.css";

export default function LearningProgressPage() {
  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="progress" />

      <section className={shellStyles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Learning Progress</h1>
          <p className={styles.subtitle}>
            Track your journey to becoming a certified professional driver
          </p>
        </header>

        <div className={styles.progressCard}>
          <div className={styles.progressInfo}>
            <div className={styles.statusRow}>
              <span className={styles.statusPill}>On track</span>
              <span className={styles.enrollment}>Enrollment: #DM-2024-081</span>
            </div>
            <h2 className={styles.courseTitle}>B2 Driving Course</h2>
            <p className={styles.courseDesc}>
              Comprehensive manual and automatic passenger vehicle license
              certification program.
            </p>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Sessions</span>
                <span className={styles.statValue}>
                  14 <span className={styles.statMuted}>/ 20</span>
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Absences</span>
                <span className={styles.statValue}>
                  1 <span className={styles.statMuted}>Allowed: 3</span>
                </span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statLabel}>Est. completion</span>
                <span className={styles.statValue}>Oct 24, 2024</span>
              </div>
            </div>
          </div>

          <div className={styles.progressRing}>
            <div className={styles.ring}>
              <div className={styles.ringInner}>
                <span className={styles.ringValue}>70%</span>
                <span className={styles.ringLabel}>Overall</span>
              </div>
            </div>
            <span className={styles.ringCaption}>6 sessions remaining</span>
          </div>
        </div>

        <div className={styles.lowerGrid}>
          <div className={styles.roadmap}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Learning Roadmap</h3>
            </div>
            <div className={styles.roadmapList}>
              <div className={styles.roadmapItem}>
                <span className={`${styles.roadmapIcon} ${styles.done}`} />
                <div className={styles.roadmapContent}>
                  <h4>Basic Driving Skills</h4>
                  <p>
                    Introduction to vehicle controls, steering techniques, and
                    safety procedures.
                  </p>
                  <span className={styles.completed}>Completed August 12</span>
                </div>
              </div>

              <div className={styles.roadmapItem}>
                <span className={`${styles.roadmapIcon} ${styles.done}`} />
                <div className={styles.roadmapContent}>
                  <h4>Traffic Signs &amp; Rules</h4>
                  <p>
                    Understanding road markers, priority rules, and local
                    traffic legislation.
                  </p>
                  <span className={styles.completed}>Completed August 28</span>
                </div>
              </div>

              <div className={styles.roadmapItem}>
                <span className={`${styles.roadmapIcon} ${styles.current}`} />
                <div className={styles.roadmapContent}>
                  <h4>Parallel Parking</h4>
                  <p>
                    Mastering reverse parking and tight space maneuvers with
                    precision.
                  </p>
                  <div className={styles.inlineProgress}>
                    <span className={styles.inlineBar} />
                    <span className={styles.inlineValue}>65%</span>
                  </div>
                </div>
              </div>

              <div className={styles.roadmapItem}>
                <span className={`${styles.roadmapIcon} ${styles.locked}`} />
                <div className={styles.roadmapContent}>
                  <h4>Night Driving</h4>
                  <p>
                    Driving in low visibility, managing headlight glare and
                    hazards.
                  </p>
                </div>
              </div>

              <div className={styles.roadmapItem}>
                <span className={`${styles.roadmapIcon} ${styles.locked}`} />
                <div className={styles.roadmapContent}>
                  <h4>Final Mock Test</h4>
                  <p>
                    Complete simulation of the official licensing practical
                    exam.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.activeModules}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Active Modules</h3>
              <button type="button" className={styles.viewAll}>
                View All
              </button>
            </div>

            <div className={styles.moduleCard}>
              <Image
                src="/CourseImage.jpg"
                alt="Advance Maneuvers"
                width={360}
                height={200}
                className={styles.moduleImage}
              />
              <div className={styles.moduleBody}>
                <div className={styles.moduleTitleRow}>
                  <h4>Advance Maneuvers</h4>
                  <span className={styles.moduleCount}>4 / 10 Units</span>
                </div>
                <div className={styles.moduleProgressRow}>
                  <span className={styles.moduleProgressLabel}>Progress</span>
                  <span className={styles.moduleProgressValue}>45%</span>
                </div>
                <div className={styles.moduleBar}>
                  <span className={styles.moduleBarFill} />
                </div>
                <button type="button" className={styles.moduleButton}>
                  Continue Learning
                </button>
              </div>
            </div>

            <div className={styles.badgeCard}>
              <div className={styles.badgeIcon}>🏅</div>
              <div className={styles.badgeText}>
                Next badge unlocks after completing 2 more lessons.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
