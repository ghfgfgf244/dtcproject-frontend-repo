import { Copy, UserPlus, Wallet, PiggyBank } from "lucide-react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/partner-dashboard.module.css";

export default function PartnerDashboardPage() {
  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="partner" />

      <section className={shellStyles.content}>
        <div className={styles.page}>
          <header className={styles.header}>
            <div>
              <h1>Partner Dashboard</h1>
              <p>
                Good morning, Alex. Here's your referral performance for this term.
              </p>
            </div>

            <div className={styles.referralCard}>
              <span className={styles.refLabel}>Your referral code</span>
              <div className={styles.refRow}>
                <strong>DRIVE-2026-REF</strong>
                <button type="button" className={styles.copyButton}>
                  <Copy size={16} />
                  Copy
                </button>
              </div>
            </div>
          </header>

          <section className={styles.metricsGrid}>
            <article className={styles.metricCard}>
              <div className={styles.iconCircle}>
                <UserPlus size={18} />
              </div>
              <span className={styles.metricLabel}>Code Users this Term</span>
              <div className={styles.metricValue}>128</div>
              <span className={styles.metricDelta}>+12% from last term</span>
              <div className={styles.metricFoot} />
            </article>

            <article className={styles.metricCard}>
              <div className={styles.iconCircle}>
                <Wallet size={18} />
              </div>
              <span className={styles.metricLabel}>Total Commission</span>
              <div className={styles.metricValue}>15,000,000</div>
              <span className={styles.metricSub}>VND</span>
              <span className={styles.metricHint}>Lifetime earnings</span>
              <div className={styles.metricFootSoft} />
            </article>

            <article className={styles.metricCard}>
              <div className={`${styles.iconCircle} ${styles.iconOrange}`}>
                <PiggyBank size={18} />
              </div>
              <span className={styles.metricLabel}>Commission this Term</span>
              <div className={styles.metricValue}>4,500,000</div>
              <span className={styles.metricSub}>VND</span>
              <span className={styles.metricHint}>Next payout: Oct 15</span>
              <div className={styles.metricFootWarm} />
            </article>
          </section>

          <section className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <div>
                <h2>Student Registration Trends</h2>
                <p>Track new registrations by month.</p>
              </div>
              <div className={styles.termPills}>
                <button type="button" className={styles.termActive}>
                  Term 1
                </button>
                <button type="button" className={styles.termPill}>
                  Term 2
                </button>
              </div>
            </div>

            <div className={styles.chartArea}>
              <div className={styles.barGroup}>
                <div className={styles.bar} style={{ height: "120px" }} />
                <span>Jan</span>
              </div>
              <div className={styles.barGroup}>
                <div className={styles.bar} style={{ height: "150px" }} />
                <span>Feb</span>
              </div>
              <div className={styles.barGroup}>
                <div className={styles.bar} style={{ height: "110px" }} />
                <span>Mar</span>
              </div>
              <div className={styles.barGroup}>
                <div className={styles.bar} style={{ height: "160px" }} />
                <span>Apr</span>
              </div>
              <div className={styles.barGroup}>
                <div className={styles.bar} style={{ height: "140px" }} />
                <span>May</span>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
