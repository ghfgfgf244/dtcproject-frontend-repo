"use client";

import { useMemo, useState } from "react";
import Header from "@/components/ui/header";
import Sidebar from "@/components/ui/sidebar";
import { contactService } from "@/services/contactService";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/contact.module.css";

type ContactForm = {
  fullName: string;
  phoneNumber: string;
  email: string;
  subject: string;
  message: string;
};

const initialForm: ContactForm = {
  fullName: "",
  phoneNumber: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const isDisabled = useMemo(() => {
    return (
      isSubmitting ||
      !form.fullName.trim() ||
      !form.phoneNumber.trim() ||
      !form.email.trim() ||
      !form.message.trim()
    );
  }, [form, isSubmitting]);

  const handleChange =
    (field: keyof ContactForm) =>
    (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const value = event.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setSubmitError("");
      setSubmitSuccess("");
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isDisabled) return;

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      await contactService.sendContact({
        fullName: form.fullName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        email: form.email.trim(),
        subject: form.subject.trim() || undefined,
        message: form.message.trim(),
      });

      setSubmitSuccess(
        "Đã gửi liên hệ thành công. Trung tâm sẽ phản hồi sớm qua email hoặc số điện thoại bạn đã cung cấp."
      );
      setForm(initialForm);
    } catch (error: any) {
      const responseData = error?.response?.data;
      const validationErrors = responseData?.errors;

      const apiMessage = Array.isArray(validationErrors)
        ? validationErrors[0]
        : validationErrors && typeof validationErrors === "object"
          ? Object.values(validationErrors).flat()[0]
          : responseData?.message ||
            responseData?.detailed ||
            "Không thể gửi liên hệ lúc này. Vui lòng thử lại sau.";
      setSubmitError(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  Liên hệ với đội ngũ <br />
                  <span>chuyên viên Drive Safe Academy.</span>
                </h1>
                <p>
                  Dù bạn đang muốn bắt đầu hành trình học lái hay cần hỗ trợ cho
                  khóa học hiện tại, đội ngũ của chúng tôi luôn sẵn sàng đồng
                  hành cùng bạn trên từng chặng đường.
                </p>

                <div className={styles.contactCard}>
                  <div className={styles.cardTitle}>Thông tin trung tâm đào tạo</div>
                  <div className={styles.contactGrid}>
                    <div className={styles.contactItem}>
                      <div className={styles.iconChip}>
                        <span className="material-symbols-outlined">
                          location_on
                        </span>
                      </div>
                      <div>
                        <span>Địa chỉ</span>
                        <strong>123 Nguyễn Văn Linh, Đà Nẵng</strong>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <div className={styles.iconChip}>
                        <span className="material-symbols-outlined">call</span>
                      </div>
                      <div>
                        <span>Điện thoại</span>
                        <strong>0901 234 567</strong>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <div className={styles.iconChip}>
                        <span className="material-symbols-outlined">mail</span>
                      </div>
                      <div>
                        <span>Email hệ thống</span>
                        <strong>hungghfgfgf244@gmail.com</strong>
                      </div>
                    </div>
                    <div className={styles.contactItem}>
                      <div className={styles.iconChip}>
                        <span className="material-symbols-outlined">
                          schedule
                        </span>
                      </div>
                      <div>
                        <span>Giờ làm việc</span>
                        <strong>8:00 - 17:30 từ Thứ hai đến Thứ bảy</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.mapCard}>
                <iframe
                  title="Vị trí Drive Safe Academy"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.856069316429!2d108.25831637486753!3d15.968891042116757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142116949840599%3A0x365b35580f52e8d5!2zxJDhuqFpIGjhu41jIEZQVCDEkMOgIE7hurVuZw!5e0!3m2!1svi!2s!4v1774247108504!5m2!1svi!2s"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className={styles.mapBadge}>
                  <span>Khu vực trung tâm Đà Nẵng</span>
                  <strong>ĐÀ NẴNG</strong>
                </div>
              </div>
            </section>

            <section className={styles.contactPurpose}>
              <div className={styles.sectionLabel}>Liên hệ theo nhu cầu</div>
              <div className={styles.purposeGrid}>
                <article className={styles.purposeCard}>
                  <div className={styles.purposeTag}>Tư vấn mới</div>
                  <h3>Hỗ trợ đăng ký khóa học</h3>
                  <p>
                    Dành cho khách quan tâm và học viên tiềm năng. Bạn có thể
                    hỏi về chương trình học, điều kiện đăng ký và mức học phí
                    hiện tại.
                  </p>
                  <div className={styles.pillRow}>
                    <span>Thông tin học phí</span>
                    <span>Lộ trình khóa học</span>
                  </div>
                </article>

                <article className={styles.purposeCard}>
                  <div className={styles.purposeTag}>Dịch vụ học viên</div>
                  <h3>Hỗ trợ lớp học</h3>
                  <p>
                    Ưu tiên cho học viên đã đăng ký. Bạn có thể cần hỗ trợ về
                    lịch học, phản ánh phòng học hoặc gửi yêu cầu điều chỉnh lớp.
                  </p>
                  <div className={styles.pillRow}>
                    <span>Đổi lịch học</span>
                    <span>Hỗ trợ cơ sở vật chất</span>
                  </div>
                </article>
              </div>
            </section>

            <section className={styles.messageSection}>
              <div className={styles.messageIntro}>
                <h2>Gửi tin nhắn cho chúng tôi</h2>
                <p>
                  Đội ngũ tư vấn học vụ thường phản hồi trong vòng 2-4 giờ làm
                  việc. Vui lòng mô tả càng chi tiết càng tốt để chúng tôi hỗ
                  trợ bạn nhanh và chính xác hơn.
                </p>
              </div>

              <form className={styles.messageForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>Họ và tên</label>
                  <input
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Số điện thoại</label>
                    <input
                      value={form.phoneNumber}
                      onChange={handleChange("phoneNumber")}
                      placeholder="+84 000 000 000"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="tenban@example.com"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Chủ đề</label>
                  <input
                    value={form.subject}
                    onChange={handleChange("subject")}
                    placeholder="Ví dụ: Tư vấn khóa học B"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Nội dung</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={handleChange("message")}
                    placeholder="Hãy cho chúng tôi biết rõ yêu cầu của bạn..."
                  />
                </div>

                {submitSuccess ? (
                  <div className={styles.formSuccess}>{submitSuccess}</div>
                ) : null}

                {submitError ? (
                  <div className={styles.formError}>{submitError}</div>
                ) : null}

                <div className={styles.formActions}>
                  <button type="submit" disabled={isDisabled}>
                    {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </section>
      </div>
    </div>
  );
}
