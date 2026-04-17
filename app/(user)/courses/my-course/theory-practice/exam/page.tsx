"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/theory-exam.module.css";
import { setAuthToken } from "@/lib/api";
import {
  mockExamService,
  SubmitMockExamResponse,
} from "@/services/mockExamService";
import { ExamQuestion } from "@/types/mock-exam-detail";

function answerToNumber(answer?: string | null) {
  const normalized = (answer || "").trim().toUpperCase();
  if (normalized === "A") return 1;
  if (normalized === "B") return 2;
  if (normalized === "C") return 3;
  if (normalized === "D") return 4;
  const numeric = Number.parseInt(normalized, 10);
  return Number.isNaN(numeric) ? undefined : numeric;
}

function answerToLabel(answer?: string | null) {
  const numeric = answerToNumber(answer);
  if (!numeric) return "Chưa chọn";
  return `${numeric}`;
}

function normalizeCorruptedText(value?: string | null) {
  return (value || "")
    .replace(/ChÆ°a/g, "Chưa")
    .replace(/LÃ½ thuyáº¿t/g, "Lý thuyết")
    .replace(/Biá»ƒn bÃ¡o/g, "Biển báo")
    .replace(/Sa hÃ¬nh/g, "Sa hình")
    .replace(/KhÃ´ng/g, "Không")
    .replace(/Äá»/g, "Đề")
    .replace(/Äang/g, "Đang")
    .replace(/ÄÃ£/g, "Đã")
    .replace(/há»£p/g, "hợp")
    .replace(/láº¡i/g, "lại")
    .replace(/chá»n/g, "chọn")
    .replace(/Ã´n/g, "ôn")
    .replace(/Thá»i/g, "Thời")
    .replace(/cÃ²n/g, "còn")
    .trim();
}

function formatCategoryLabel(category?: string | null) {
  const normalized = normalizeCorruptedText(category).trim().toLowerCase();
  if (normalized === "ly thuyet" || normalized === "lý thuyết") return "Lý thuyết";
  if (normalized === "bien bao" || normalized === "biển báo") return "Biển báo";
  if (normalized === "sa hinh" || normalized === "sa hình") return "Sa hình";
  return normalizeCorruptedText(category) || "Lý thuyết";
}

function formatInsightSummary(summary?: string | null) {
  const raw = normalizeCorruptedText(summary);

  if (!raw) {
    return "Bạn hãy xem lại các câu sai, ưu tiên đúng nhóm kiến thức đang mất điểm nhiều nhất và luyện lại đề tương tự để cải thiện độ chính xác.";
  }

  if (
    raw ===
    "Ban dang nam bai kha tot. Hay tiep tuc giu nhip on tap de duy tri toc do lam bai va do chinh xac."
  ) {
    return "Bạn đang nắm bài khá tốt. Hãy tiếp tục giữ nhịp ôn tập để duy trì tốc độ làm bài và độ chính xác.";
  }

  if (
    raw ===
    "Ban chua co nhieu cau sai noi bat theo nhom, nhung diem so van chua dat. Nen luyen them de day toc do va do on dinh khi lam bai."
  ) {
    return "Bạn chưa có nhiều câu sai nổi bật theo nhóm, nhưng điểm số vẫn chưa đạt. Nên luyện thêm để tăng tốc độ và độ ổn định khi làm bài.";
  }

  if (raw.startsWith("Ban dang mat diem nhieu nhat o nhom ")) {
    return raw
      .replace("Ban dang mat diem nhieu nhat o nhom ", "Bạn đang mất điểm nhiều nhất ở nhóm ")
      .replace(" Uu tien on lai: ", " Ưu tiên ôn lại: ")
      .replace(
        " Tap trung lam lai cac cau da sai va doc ky giai thich sau moi lan nop bai.",
        " Tập trung làm lại các câu đã sai và đọc kỹ giải thích sau mỗi lần nộp bài.",
      );
  }

  return raw;
}

function formatStudyTip(studyTip?: string | null) {
  const raw = normalizeCorruptedText(studyTip);

  switch (raw) {
    case "Ban da tra loi dung cau nay. Nen ghi nho quy tac va tiep tuc giu nhip lam bai on dinh.":
      return "Bạn đã trả lời đúng câu này. Nên ghi nhớ quy tắc và tiếp tục giữ nhịp làm bài ổn định.";
    case "Nen hoc lai theo nhom bien bao va lien ket y nghia bien voi tinh huong giao thong cu the.":
      return "Nên học lại theo nhóm biển báo và liên kết ý nghĩa biển với tình huống giao thông cụ thể.";
    case "Nen quan sat huong di, diem xung dot va thu tu uu tien cua tung xe trong tinh huong sa hinh.":
      return "Nên quan sát hướng đi, điểm xung đột và thứ tự ưu tiên của từng xe trong tình huống sa hình.";
    case "Nen doc ky meo ghi nho, doi chieu dap an dung va lam lai nhom cau ly thuyet tuong tu.":
      return "Nên đọc kỹ mẹo ghi nhớ, đối chiếu đáp án đúng và làm lại nhóm câu lý thuyết tương tự.";
    default:
      return raw;
  }
}

export default function TheoryExamPage() {
  const searchParams = useSearchParams();
  const { getToken, isLoaded } = useAuth();
  const examRef = useRef<HTMLDivElement | null>(null);

  const examId = searchParams.get("examId") || "";
  const license = normalizeCorruptedText(searchParams.get("license")) || "Chưa chọn";
  const examNo = searchParams.get("examNo") || "-";
  const examTitle = normalizeCorruptedText(searchParams.get("title")) || "Đề thi thử";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [passingScore, setPassingScore] = useState(90);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [lockedKeys, setLockedKeys] = useState(true);
  const [result, setResult] = useState<SubmitMockExamResponse | null>(null);
  const [remaining, setRemaining] = useState(20 * 60);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!isLoaded || !examId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const detail = await mockExamService.getPublicDetail(examId);
        const mapped = mockExamService.mapPublicExamDetail(detail);
        setQuestions(mapped.questions);
        setDurationMinutes(mapped.info.durationMinutes);
        setPassingScore(mapped.info.passingScore);
        setRemaining(mapped.info.durationMinutes * 60);
        setCurrent(mapped.questions[0]?.id ?? 1);
      } catch (error) {
        console.error("Failed to fetch sample exam detail:", error);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    void fetchDetail();
  }, [examId, isLoaded]);

  const currentQuestion = useMemo(
    () => questions.find((question) => question.id === current) ?? questions[0],
    [current, questions],
  );

  const currentReview = useMemo(
    () => result?.reviewItems?.find((item) => item.questionId === currentQuestion?.id) ?? null,
    [currentQuestion?.id, result?.reviewItems],
  );

  const totalSeconds = durationMinutes * 60;
  const progressPercent = useMemo(
    () => (totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0),
    [remaining, totalSeconds],
  );

  const wrongCategoryEntries = useMemo(
    () =>
      Object.entries(result?.insight?.wrongCountsByCategory || {}).map(([category, count]) => [
        formatCategoryLabel(category),
        count,
      ] as const),
    [result?.insight?.wrongCountsByCategory],
  );

  const formattedInsightSummary = useMemo(
    () => formatInsightSummary(result?.insight?.summary),
    [result?.insight?.summary],
  );

  const formattedSuggestedTopics = useMemo(
    () => (result?.insight?.suggestedTopics || []).map((topic) => formatCategoryLabel(topic)),
    [result?.insight?.suggestedTopics],
  );

  const pick = (choice: number) => {
    if (finished || !currentQuestion) return;
    setSelected((prev) => ({ ...prev, [currentQuestion.id]: choice }));
  };

  const submitExam = useCallback(
    async (forcedDurationSeconds?: number) => {
      if (!examId || questions.length === 0 || submitting || result) {
        setFinished(true);
        return;
      }

      setSubmitting(true);
      try {
        const token = await getToken();
        setAuthToken(token);

        const usedSeconds = forcedDurationSeconds ?? Math.max(totalSeconds - remaining, 0);
        const answers = Object.fromEntries(
          Object.entries(selected).map(([questionId, choice]) => [Number(questionId), String(choice)]),
        );

        const response = token
          ? await mockExamService.submit(examId, { durationSeconds: usedSeconds, answers })
          : await mockExamService.submitPublic(examId, { durationSeconds: usedSeconds, answers });

        setResult(response);
        setFinished(true);
      } catch (error) {
        console.error("Failed to submit sample exam:", error);
        window.alert("Không thể nộp bài thi thử. Vui lòng thử lại sau.");
      } finally {
        setSubmitting(false);
      }
    },
    [examId, getToken, questions.length, remaining, result, selected, submitting, totalSeconds],
  );

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!lockedKeys || loading || !currentQuestion) return;

      if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        setCurrent((prev) => {
          const nextIndex = Math.min(
            questions.length - 1,
            questions.findIndex((question) => question.id === prev) + 1,
          );
          return questions[nextIndex]?.id ?? prev;
        });
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        setCurrent((prev) => {
          const nextIndex = Math.max(
            0,
            questions.findIndex((question) => question.id === prev) - 1,
          );
          return questions[nextIndex]?.id ?? prev;
        });
      }

      if (["1", "2", "3", "4"].includes(event.key)) {
        pick(Number(event.key));
      }

      if (event.key === "Escape") {
        void submitExam();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentQuestion, loading, lockedKeys, questions, submitExam]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (examRef.current && target && examRef.current.contains(target)) {
        setLockedKeys(true);
      } else {
        setLockedKeys(false);
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (loading || finished || result || totalSeconds <= 0) return;

    const timer = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          void submitExam(totalSeconds);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [finished, loading, result, submitExam, totalSeconds]);

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  const timeText = `${minutes}:${seconds}`;
  const resultLabel = result?.isPassed ? "Đậu" : "Chưa đạt";

  if (loading) {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="courses" />
        <section className={shellStyles.content}>
          <div className={styles.loadingState}>Đang tải đề thi thử...</div>
        </section>
      </div>
    );
  }

  if (!examId || questions.length === 0 || !currentQuestion) {
    return (
      <div className={shellStyles.page}>
        <Sidebar activeKey="courses" />
        <section className={shellStyles.content}>
          <div className={styles.emptyState}>
            <h2>Không tìm thấy đề thi thử</h2>
            <p>Vui lòng quay lại để chọn hạng GPLX và đề thi hợp lệ.</p>
            <Link href="/courses/my-course/theory-practice">Quay lại chọn đề</Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="courses" />

      <section className={shellStyles.content}>
        <div className={styles.examLayout} ref={examRef}>
          <div className={styles.questionPanel}>
            <div className={styles.questionContent}>
              <div className={styles.questionMeta}>
                <span>Câu {questions.findIndex((item) => item.id === currentQuestion.id) + 1}</span>
                <span>{formatCategoryLabel(currentQuestion.category)}</span>
              </div>

              <h1>{normalizeCorruptedText(currentQuestion.content)}</h1>

              {currentQuestion.imageUrl ? (
                <div className={styles.questionImageWrap}>
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Hình minh họa câu hỏi"
                    className={styles.questionImage}
                  />
                </div>
              ) : null}

              <ol>
                {currentQuestion.answers.map((answer, index) => {
                  const selectedAnswer = selected[currentQuestion.id];
                  const answerNumber = index + 1;
                  const correctAnswer = answerToNumber(result?.correctAnswers?.[currentQuestion.id]);

                  return (
                    <li
                      key={answer.id}
                      className={[
                        selectedAnswer === answerNumber ? styles.activeAnswer : "",
                        finished && correctAnswer === answerNumber ? styles.correctAnswer : "",
                        finished &&
                        selectedAnswer === answerNumber &&
                        correctAnswer !== answerNumber
                          ? styles.wrongAnswer
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <label className={styles.answerLabel}>
                        <span className={styles.choiceCircle}>
                          <input
                            type="radio"
                            checked={selectedAnswer === answerNumber}
                            onChange={() => pick(answerNumber)}
                            disabled={finished}
                          />
                        </span>
                        <span className={styles.answerContent}>
                          <strong>{answer.label}.</strong> {normalizeCorruptedText(answer.content)}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ol>

              {finished && result ? (
                <div className={styles.resultBox}>
                  <p>
                    Đáp án đúng:{" "}
                    <strong>{normalizeCorruptedText(result.correctAnswers?.[currentQuestion.id]) || "Chưa có"}</strong>
                  </p>
                  <p>
                    Bạn chọn:{" "}
                    <strong>{answerToLabel(String(selected[currentQuestion.id] || ""))}</strong>
                  </p>
                  <div className={styles.resultStatus}>
                    Kết quả hiện tại:{" "}
                    <span className={result.isPassed ? styles.pass : styles.fail}>{resultLabel}</span> (
                    {result.correctCount}/{result.totalQuestions} câu đúng · {result.totalScore}/100 điểm)
                  </div>

                  {currentReview ? (
                    <div className={styles.reviewStats}>
                      <span className={currentReview.isCorrect ? styles.passPill : styles.failPill}>
                        {currentReview.isCorrect ? "Câu này đúng" : "Câu này sai"}
                      </span>
                      <span>Lượt làm toàn hệ thống: {currentReview.attemptCount}</span>
                      <span>Tỷ lệ sai: {(currentReview.wrongRate * 100).toFixed(0)}%</span>
                    </div>
                  ) : null}

                  {currentReview?.explanation ? (
                    <div className={styles.explanationBox}>
                      <h4>Giải thích</h4>
                      <p>{normalizeCorruptedText(currentReview.explanation)}</p>
                    </div>
                  ) : null}

                  {currentReview?.studyTip ? (
                    <div className={styles.studyTipBox}>
                      <h4>Gợi ý ôn tập</h4>
                      <p>{formatStudyTip(currentReview.studyTip)}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>

            {finished && result?.insight ? (
              <div className={styles.insightBanner}>
                <div className={styles.insightContent}>
                  <div>
                    <p className={styles.insightEyebrow}>Phân tích ôn tập thông minh</p>
                    <h3>Tổng kết sau khi nộp bài</h3>
                    <p className={styles.insightSummary}>{formattedInsightSummary}</p>
                  </div>

                  {wrongCategoryEntries.length > 0 ? (
                    <div className={styles.categoryStats}>
                      {wrongCategoryEntries.map(([category, count]) => (
                        <span key={category} className={styles.categoryChip}>
                          {category}: {count} câu sai
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {formattedSuggestedTopics.length > 0 ? (
                    <div className={styles.topicList}>
                      {formattedSuggestedTopics.map((topic) => (
                        <span key={topic}>{topic}</span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className={styles.insightMeta}>
                  <span>{result.correctCount}/{result.totalQuestions} câu đúng</span>
                  <span>{result.totalScore}/100 điểm</span>
                  <span>{resultLabel}</span>
                  <span>Mô hình: {normalizeCorruptedText(result.insight.model) || "Phân tích nội bộ"}</span>
                </div>
              </div>
            ) : null}

            <div className={styles.statusBar}>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
              </div>
              <div className={styles.statusInfo}>
                <div className={styles.inlineTimer}>
                  ⏱ Thời gian còn lại: <strong>{timeText}</strong>
                </div>
                <p>Đề thi: {examTitle}</p>
                <p>Hạng GPLX: {license}</p>
                <p>Mã đề: {examNo}</p>
                <p>
                  Trạng thái: <span>{finished ? "Đã nộp bài" : "Đang thi"}</span>
                </p>
                <p>
                  Điều kiện đạt: <strong>{passingScore}/100 điểm</strong>
                </p>
              </div>
              <div className={styles.qrBox}>
                <div className={styles.qr} />
                <p>Drive Safe Academy</p>
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.timer}>⏱ THỜI GIAN THI CÒN LẠI: {timeText}</div>

            <div className={styles.questionGrid}>
              {questions.map((question, index) => {
                const selectedAnswer = selected[question.id];
                const correctAnswer = answerToNumber(result?.correctAnswers?.[question.id]);
                const navClass = [
                  styles.questionBtn,
                  current === question.id ? styles.activeQuestion : "",
                  finished && selectedAnswer && selectedAnswer === correctAnswer
                    ? styles.questionCorrect
                    : "",
                  finished && (!selectedAnswer || selectedAnswer !== correctAnswer)
                    ? styles.questionWrong
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <button
                    key={question.id}
                    type="button"
                    className={navClass}
                    onClick={() => setCurrent(question.id)}
                  >
                    <span>{index + 1}</span>
                    <div className={styles.answerDots}>
                      {[1, 2, 3, 4].map((item) => (
                        <span key={item} className={selectedAnswer === item ? styles.filledDot : ""} />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              className={styles.finishBtn}
              onClick={() => void submitExam()}
              disabled={finished || submitting}
            >
              {submitting ? "Đang nộp bài..." : "KẾT THÚC"}
            </button>

            <div className={styles.quickGuide}>
              <h4>Hướng dẫn nhanh:</h4>
              <p>Di chuyển câu bằng phím mũi tên hoặc dùng chuột.</p>
              <p>Chọn đáp án bằng chuột hoặc phím 1, 2, 3, 4.</p>
              <p>Mẹo giải và thống kê sai chỉ hiển thị sau khi bạn nộp bài.</p>
              <p>Các câu đúng và sai sẽ được tô màu để bạn review lại.</p>
            </div>

            <div className={styles.sideActions}>
              <Link href="/courses/my-course/theory-practice">Đổi đề / hạng khác</Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
