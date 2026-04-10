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

function answerToNumber(answer?: string) {
  const normalized = (answer || "").trim().toUpperCase();
  if (normalized === "A") return 1;
  if (normalized === "B") return 2;
  if (normalized === "C") return 3;
  if (normalized === "D") return 4;
  const numeric = Number.parseInt(normalized, 10);
  return Number.isNaN(numeric) ? undefined : numeric;
}

export default function TheoryExamPage() {
  const searchParams = useSearchParams();
  const { getToken, isLoaded } = useAuth();
  const examRef = useRef<HTMLDivElement | null>(null);

  const examId = searchParams.get("examId") || "";
  const license = searchParams.get("license") || "Chưa chọn";
  const examNo = searchParams.get("examNo") || "-";
  const examTitle = searchParams.get("title") || "Đề thi thử";

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
        const token = await getToken();
        setAuthToken(token);

        const detail = await mockExamService.getDetail(examId);
        const mapped = mockExamService.mapExamDetail(detail);
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

    fetchDetail();
  }, [examId, getToken, isLoaded]);

  const currentQuestion = useMemo(
    () => questions.find((question) => question.id === current) ?? questions[0],
    [current, questions],
  );

  const totalSeconds = durationMinutes * 60;

  const scoreSummary = useMemo(() => {
    if (!result) {
      return {
        totalCorrect: 0,
        progressPercent: totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0,
      };
    }

    const totalCorrect = questions.reduce((count, question) => {
      const selectedAnswer = selected[question.id];
      const correctAnswer = answerToNumber(result.correctAnswers?.[question.id]);
      return selectedAnswer === correctAnswer ? count + 1 : count;
    }, 0);

    return {
      totalCorrect,
      progressPercent: totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0,
    };
  }, [questions, remaining, result, selected, totalSeconds]);

  const pick = (choice: number) => {
    if (finished || !currentQuestion) return;
    setSelected((prev) => ({ ...prev, [currentQuestion.id]: choice }));
  };

  const submitExam = useCallback(async (forcedDurationSeconds?: number) => {
    if (!examId || questions.length === 0 || submitting || result) {
      setFinished(true);
      return;
    }

    setSubmitting(true);
    try {
      const token = await getToken();
      setAuthToken(token);

      const usedSeconds =
        forcedDurationSeconds ?? Math.max(totalSeconds - remaining, 0);

      const answers = Object.fromEntries(
        Object.entries(selected).map(([questionId, choice]) => [
          Number(questionId),
          String(choice),
        ]),
      );

      const response = await mockExamService.submit(examId, {
        durationSeconds: usedSeconds,
        answers,
      });

      setResult(response);
      setFinished(true);
    } catch (error) {
      console.error("Failed to submit sample exam:", error);
      window.alert("Không thể nộp bài thi thử. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }, [examId, getToken, questions.length, remaining, result, selected, submitting, totalSeconds]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!lockedKeys || loading || !currentQuestion) return;

      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();
      }

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        setCurrent((prev) => questions[Math.min(questions.length - 1, questions.findIndex((q) => q.id === prev) + 1)]?.id ?? prev);
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        setCurrent((prev) => questions[Math.max(0, questions.findIndex((q) => q.id === prev) - 1)]?.id ?? prev);
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
  }, [currentQuestion, loading, lockedKeys, questions, result, submitExam]);

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
  const resultLabel = result?.isPassed ? "Đậu" : "Trượt";

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
                <span>{currentQuestion.category}</span>
              </div>

              <h1>{currentQuestion.content}</h1>

              {currentQuestion.imageUrl && (
                <div className={styles.questionImageWrap}>
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Hình minh họa câu hỏi"
                    className={styles.questionImage}
                  />
                </div>
              )}

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
                          <strong>{answer.label}.</strong> {answer.content}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ol>

              {finished && result && (
                <div className={styles.resultBox}>
                  <p>
                    Đáp án đúng:{" "}
                    <strong>
                      {result.correctAnswers?.[currentQuestion.id] || "Chưa có"}
                    </strong>
                  </p>
                  <p>
                    Bạn chọn:{" "}
                    <strong>
                      {selected[currentQuestion.id]
                        ? selected[currentQuestion.id]
                        : "Chưa chọn"}
                    </strong>
                  </p>
                  <div className={styles.resultStatus}>
                    Kết quả hiện tại:{" "}
                    <span className={result.isPassed ? styles.pass : styles.fail}>
                      {resultLabel}
                    </span>{" "}
                    ({scoreSummary.totalCorrect}/{questions.length} câu đúng · {result.totalScore}/100 điểm)
                  </div>

                  {currentQuestion.explanation && (
                    <div className={styles.explanationBox}>
                      <h4>Mẹo ghi nhớ / giải thích</h4>
                      <p>{currentQuestion.explanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.statusBar}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${scoreSummary.progressPercent}%` }}
                />
              </div>
              <div className={styles.statusInfo}>
                <div className={styles.inlineTimer}>
                  ⏱ Thời gian còn lại: <strong>{timeText}</strong>
                </div>
                <p>Đề thi: {examTitle}</p>
                <p>Hạng GPLX: {license}</p>
                <p>Mã đề: {examNo}</p>
                <p>Trạng thái: <span>{finished ? "Đã nộp bài" : "Đang thi"}</span></p>
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
                  finished && selectedAnswer && selectedAnswer !== correctAnswer
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
                        <span
                          key={item}
                          className={selectedAnswer === item ? styles.filledDot : ""}
                        />
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
              <p>Mẹo giải sẽ chỉ hiển thị sau khi bạn nộp bài.</p>
              <p>Các câu đúng và sai sẽ được tô màu để bạn review.</p>
            </div>

            <div className={styles.sideActions}>
              <Link href="/courses/my-course/theory-practice">Đổi đề/hạng khác</Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
