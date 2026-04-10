import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/contact.module.css";

export default function ContactPage() {
  return (
    <div>
      <Header />

      <div className={shellStyles.page}>
        <Sidebar activeKey="support" />

        <section className={shellStyles.content}>
          <div className={styles.page}>
            <section className={styles.heroSection}>
              <div className={styles.heroCopy}>
                <h1>
                  Get in touch with our <br />
                  <span>Drive Safe Academy Experts.</span>
                </h1>
                <p>
                  Whether you're looking to start your journey or need help with your
                  current curriculum, our team is here to guide you through every mile.
                </p>

                <div className={styles.contactCard}>
                  <div className={styles.cardTitle}>Training Center Contact</div>
                  <div className={styles.contactGrid}>
                    <div className={styles.contactItem}>
                      <div className={styles.iconChip}>
                        <span className="material-symbols-outlined">location_on</span>
                      </div>
                      <div>
                        <span>Address</span>
                        <strong>123 Nguyen Van Linh, Da Nang</strong>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <div className={styles.iconChip}>
                        <span className="material-symbols-outlined">call</span>
                      </div>
                      <div>
                        <span>Phone</span>
                        <strong>0901 234 567</strong>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <div className={styles.iconChip}>
                        <span className="material-symbols-outlined">mail</span>
                      </div>
                      <div>
                        <span>Email</span>
                        <strong>support@trainingcenter.com</strong>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <div className={styles.iconChip}>
                        <span className="material-symbols-outlined">schedule</span>
                      </div>
                      <div>
                        <span>Working hours</span>
                        <strong>8:00 - 17:30 Mon-Sat</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.mapCard}>
                <iframe
                  title="Drive Safe Academy location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.856069316429!2d108.25831637486753!3d15.968891042116757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142116949840599%3A0x365b35580f52e8d5!2zxJDhuqFpIGjhu41jIEZQVCDEkMOgIE7hurVuZw!5e0!3m2!1svi!2s!4v1774247108504!5m2!1svi!2s"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className={styles.mapBadge}>
                  <span>Da Nang Central District</span>
                  <strong>DA NANG</strong>
                </div>
              </div>
            </section>

            <section className={styles.contactPurpose}>
              <div className={styles.sectionLabel}>Contact by purpose</div>
              <div className={styles.purposeGrid}>
                <article className={styles.purposeCard}>
                  <div className={styles.purposeTag}>New Enquiries</div>
                  <h3>Support for Course Registration</h3>
                  <p>
                    Dedicated support for guests and prospective students. Ask about
                    curriculum details, eligibility requirements, and current tuition
                    fee structures.
                  </p>
                  <div className={styles.pillRow}>
                    <span>Tuition Info</span>
                    <span>Course Roadmap</span>
                  </div>
                </article>

                <article className={styles.purposeCard}>
                  <div className={styles.purposeTag}>Student Services</div>
                  <h3>Support for Classes</h3>
                  <p>
                    Priority assistance for registered students. Manage your training
                    schedule, report room issues, or request class changes with our
                    academic office.
                  </p>
                  <div className={styles.pillRow}>
                    <span>Schedule Swap</span>
                    <span>Facility Support</span>
                  </div>
                </article>
              </div>
            </section>

            <section className={styles.messageSection}>
              <div className={styles.messageIntro}>
                <h2>Send us a message</h2>
                <p>
                  Our academic advisors typically respond within 2-4 business hours.Please provide as much detail as possible to help us assist you better.
                </p>
              </div>

              <form className={styles.messageForm}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input placeholder="Alex Johnson" />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input placeholder="+84 000 000 000" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input placeholder="alex@example.com" />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Message</label>
                  <textarea rows={5} placeholder="Tell us more about your request..." />
                </div>

                <div className={styles.formActions}>
                  <button type="button">Send Message</button>
                </div>
              </form>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
