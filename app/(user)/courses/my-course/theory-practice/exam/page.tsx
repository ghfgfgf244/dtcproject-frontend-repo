"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import shellStyles from "@/styles/user-shell.module.css";
import styles from "@/styles/theory-exam.module.css";
import Link from "next/link";

const QUESTION_BANK = [
  {
    text: "Dải phân cách được lắp đặt để làm gì?",
    answers: [
      "Để phân chia các làn đường dành cho xe cơ giới và xe thô sơ trên đường cao tốc.",
      "Để phân chia phần đường xe chạy thành hai chiều riêng biệt hoặc để phân chia phần đường dành cho xe cơ giới và xe thô sơ hoặc của nhiều loại xe khác nhau trên cùng một chiều đường.",
      "Để phân tách phần đường xe chạy và hành lang an toàn giao thông.",
      "Đáp án khác.",
    ],
    correct: 2,
  },
  {
    text: "Biển báo hình tròn nền xanh có ý nghĩa gì?",
    answers: [
      "Biển hiệu lệnh bắt buộc phải chấp hành.",
      "Biển cấm các loại xe.",
      "Biển chỉ dẫn hướng đi.",
      "Biển cảnh báo nguy hiểm.",
    ],
    correct: 1,
  },
  {
    text: "Khi gặp đèn vàng nhấp nháy, người lái xe phải làm gì?",
    answers: [
      "Giảm tốc độ, chú ý quan sát và đi tiếp nếu an toàn.",
      "Dừng lại ngay lập tức.",
      "Tăng tốc để vượt qua nhanh.",
      "Chỉ được rẽ trái.",
    ],
    correct: 1,
  },
  {
    text: "Khoảng cách an toàn khi lái xe trong điều kiện trời mưa là?",
    answers: [
      "Tăng khoảng cách so với điều kiện bình thường.",
      "Giảm khoảng cách để tránh xe khác chen vào.",
      "Giữ nguyên khoảng cách như bình thường.",
      "Phụ thuộc vào màu xe.",
    ],
    correct: 1,
  },
  {
    text: "Khi tham gia giao thông, người lái xe phải mang theo gì?",
    answers: [
      "Giấy phép lái xe phù hợp.",
      "Giấy đăng ký xe.",
      "Giấy chứng nhận kiểm định an toàn kỹ thuật (nếu có).",
      "Tất cả các đáp án trên.",
    ],
    correct: 4,
  },
  {
    text: "Tốc độ tối đa trong khu dân cư (trừ đường cao tốc) là?",
    answers: [
      "50 km/h.",
      "60 km/h.",
      "70 km/h.",
      "80 km/h.",
    ],
    correct: 1,
  },
  {
    text: "Khi vượt xe khác, người lái xe phải làm gì trước?",
    answers: [
      "Bật tín hiệu xin vượt và quan sát an toàn.",
      "Bấm còi liên tục.",
      "Tăng tốc đột ngột.",
      "Đi sát vào xe phía trước.",
    ],
    correct: 1,
  },
  {
    text: "Biển báo nào báo hiệu đường một chiều?",
    answers: [
      "Biển hình chữ nhật nền xanh có mũi tên trắng.",
      "Biển tròn viền đỏ có số tốc độ.",
      "Biển tam giác viền đỏ có biểu tượng.",
      "Biển hình vuông nền vàng.",
    ],
    correct: 1,
  },
  {
    text: "Khi qua nơi giao nhau không có đèn tín hiệu, quy tắc ưu tiên là?",
    answers: [
      "Nhường đường cho xe đến từ bên phải.",
      "Nhường đường cho xe đến từ bên trái.",
      "Xe lớn được ưu tiên.",
      "Xe nhỏ được ưu tiên.",
    ],
    correct: 1,
  },
  {
    text: "Trong hầm đường bộ, người lái xe không được làm gì?",
    answers: [
      "Dừng, đỗ xe trái quy định.",
      "Giữ khoảng cách an toàn.",
      "Bật đèn chiếu gần.",
      "Giảm tốc độ.",
    ],
    correct: 1,
  },
  {
    text: "Khi lùi xe, người lái xe cần làm gì?",
    answers: [
      "Quan sát phía sau và hai bên, nhường đường cho người đi bộ.",
      "Bấm còi liên tục và lùi nhanh.",
      "Chỉ cần nhìn gương chiếu hậu.",
      "Tắt đèn tín hiệu.",
    ],
    correct: 1,
  },
  {
    text: "Biển báo tam giác viền đỏ có ý nghĩa gì?",
    answers: [
      "Biển cảnh báo nguy hiểm.",
      "Biển hiệu lệnh.",
      "Biển cấm.",
      "Biển chỉ dẫn.",
    ],
    correct: 1,
  },
  {
    text: "Khi gặp người đi bộ qua đường, người lái xe phải?",
    answers: [
      "Giảm tốc độ, nhường đường.",
      "Bấm còi thúc giục.",
      "Tăng tốc để đi trước.",
      "Chỉ dừng khi có đèn đỏ.",
    ],
    correct: 1,
  },
  {
    text: "Khi xe bị nổ lốp, người lái xe nên?",
    answers: [
      "Giữ chặt vô lăng, giảm tốc từ từ và đưa xe vào lề.",
      "Phanh gấp ngay lập tức.",
      "Đánh lái mạnh sang trái.",
      "Tắt máy ngay.",
    ],
    correct: 1,
  },
  {
    text: "Khoảng cách an toàn tối thiểu khi dừng xe sau xe khác là?",
    answers: [
      "Tối thiểu 2 mét.",
      "Tối thiểu 1 mét.",
      "Sát cản sau.",
      "Không cần khoảng cách.",
    ],
    correct: 1,
  },
  {
    text: "Khi gặp biển STOP, người lái xe phải?",
    answers: [
      "Dừng hẳn lại trước vạch dừng.",
      "Giảm tốc độ và đi tiếp.",
      "Bấm còi rồi đi.",
      "Chỉ dừng khi có người qua đường.",
    ],
    correct: 1,
  },
  {
    text: "Tác dụng của dây an toàn là?",
    answers: [
      "Giảm chấn thương khi va chạm.",
      "Giúp xe đi nhanh hơn.",
      "Tăng khả năng bám đường.",
      "Giảm tiêu hao nhiên liệu.",
    ],
    correct: 1,
  },
  {
    text: "Khi trời tối, người lái xe cần sử dụng đèn nào?",
    answers: [
      "Đèn chiếu gần và đèn hậu.",
      "Chỉ đèn sương mù.",
      "Chỉ đèn xi-nhan.",
      "Không cần bật đèn nếu có đèn đường.",
    ],
    correct: 1,
  },
  {
    text: "Biển báo cấm đỗ xe có nền màu gì?",
    answers: [
      "Nền xanh, viền đỏ, có gạch đỏ.",
      "Nền vàng, viền đỏ.",
      "Nền trắng, viền xanh.",
      "Nền đen, chữ trắng.",
    ],
    correct: 1,
  },
  {
    text: "Khi tránh xe ngược chiều trên đường hẹp, người lái xe cần?",
    answers: [
      "Giảm tốc độ, đi sát về bên phải.",
      "Tăng tốc để vượt nhanh.",
      "Đi sát về bên trái.",
      "Bấm còi liên tục.",
    ],
    correct: 1,
  },
  {
    text: "Khi vào đường cao tốc, người lái xe cần?",
    answers: [
      "Tăng tốc trên làn tăng tốc trước khi nhập làn.",
      "Đi thẳng vào làn chạy.",
      "Dừng lại quan sát rồi đi.",
      "Bật đèn cảnh báo nguy hiểm.",
    ],
    correct: 1,
  },
  {
    text: "Ý nghĩa của vạch kẻ đường màu vàng là?",
    answers: [
      "Phân chia hai chiều xe chạy ngược nhau.",
      "Phân chia các làn xe cùng chiều.",
      "Chỉ dẫn vị trí dừng.",
      "Không có ý nghĩa.",
    ],
    correct: 1,
  },
  {
    text: "Khi gặp xe ưu tiên đang làm nhiệm vụ, người lái xe phải?",
    answers: [
      "Nhanh chóng giảm tốc, tránh hoặc dừng lại.",
      "Bấm còi xin vượt.",
      "Tiếp tục chạy bình thường.",
      "Chỉ nhường đường nếu có cảnh sát.",
    ],
    correct: 1,
  },
  {
    text: "Người lái xe không được sử dụng rượu bia khi?",
    answers: [
      "Lái xe bất kỳ phương tiện nào.",
      "Lái xe tải.",
      "Lái xe khách.",
      "Chỉ khi chạy đường dài.",
    ],
    correct: 1,
  },
  {
    text: "Khi xe bị trượt nước, người lái xe nên?",
    answers: [
      "Giữ vô lăng thẳng, giảm ga từ từ.",
      "Phanh gấp ngay.",
      "Đánh lái mạnh.",
      "Tăng ga để thoát nhanh.",
    ],
    correct: 1,
  },
  {
    text: "Biển báo hiệu đường cấm xe máy là?",
    answers: [
      "Biển tròn viền đỏ, hình xe máy bị gạch chéo.",
      "Biển tam giác viền đỏ có xe máy.",
      "Biển nền xanh có xe máy.",
      "Biển vuông nền vàng.",
    ],
    correct: 1,
  },
  {
    text: "Khi điều khiển xe trên đường trơn, người lái xe cần?",
    answers: [
      "Đi chậm, giữ khoảng cách an toàn.",
      "Đi nhanh để qua nhanh.",
      "Phanh gấp khi cần.",
      "Bấm còi liên tục.",
    ],
    correct: 1,
  },
  {
    text: "Biển báo cấm quay đầu xe có dạng?",
    answers: [
      "Biển tròn viền đỏ, mũi tên quay đầu bị gạch chéo.",
      "Biển tam giác viền đỏ.",
      "Biển nền xanh có mũi tên.",
      "Biển vuông nền trắng.",
    ],
    correct: 1,
  },
  {
    text: "Khi điều khiển xe qua ngã tư, người lái xe cần?",
    answers: [
      "Giảm tốc độ, quan sát và nhường đường.",
      "Tăng tốc để qua nhanh.",
      "Bấm còi liên tục.",
      "Đi giữa làn.",
    ],
    correct: 1,
  },
  {
    text: "Ý nghĩa của biển báo tốc độ tối đa là?",
    answers: [
      "Giới hạn tốc độ xe được phép chạy.",
      "Khuyến cáo tốc độ tối thiểu.",
      "Cấm vượt.",
      "Chỉ dẫn hướng đi.",
    ],
    correct: 1,
  },
  {
    text: "Khi gặp chướng ngại vật trên đường, người lái xe phải?",
    answers: [
      "Giảm tốc độ và xử lý an toàn.",
      "Tăng tốc vượt qua nhanh.",
      "Đi sát lề trái.",
      "Dừng đột ngột giữa đường.",
    ],
    correct: 1,
  },
  {
    text: "Khi rẽ phải, người lái xe cần?",
    answers: [
      "Bật xi-nhan phải và quan sát người đi bộ.",
      "Bật xi-nhan trái.",
      "Không cần xi-nhan.",
      "Bấm còi liên tục.",
    ],
    correct: 1,
  },
  {
    text: "Khi vượt xe đạp, người lái xe cần?",
    answers: [
      "Giữ khoảng cách an toàn và vượt từ bên trái.",
      "Vượt sát bên phải.",
      "Bấm còi và vượt nhanh.",
      "Chỉ vượt khi đường có 3 làn.",
    ],
    correct: 1,
  },
  {
    text: "Khi dừng xe trên dốc, người lái xe nên?",
    answers: [
      "Kéo phanh tay và về số phù hợp.",
      "Chỉ đạp phanh chân.",
      "Tắt máy và thả trôi.",
      "Bật đèn pha.",
    ],
    correct: 1,
  },
  {
    text: "Khi xe bị hỏng trên đường, người lái xe cần?",
    answers: [
      "Bật đèn cảnh báo, đặt biển báo nguy hiểm.",
      "Dừng xe giữa đường.",
      "Tắt hết đèn.",
      "Rời xe ngay lập tức.",
    ],
    correct: 1,
  },
  {
    text: "Khoảng cách tối thiểu để bật đèn báo nguy hiểm khi xe dừng là?",
    answers: [
      "Tùy điều kiện, đặt biển báo cách xe phù hợp.",
      "Không cần đặt biển báo.",
      "Chỉ bật đèn xi-nhan.",
      "Chỉ cần đứng sau xe.",
    ],
    correct: 1,
  },
];

const getRandomQuestions = () => {
  const pool = [...QUESTION_BANK];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 30).map((q, index) => ({
    id: index + 1,
    ...q,
  }));
};

export default function TheoryExamPage() {
  const [questions] = useState(getRandomQuestions);
  const [current, setCurrent] = useState(1);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const totalSeconds = 20 * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [lockedKeys, setLockedKeys] = useState(true);
  const examRef = useRef<HTMLDivElement | null>(null);

  const currentQuestion = useMemo(
    () => questions.find((q) => q.id === current) ?? questions[0],
    [current, questions]
  );

  const pick = (choice: number) => {
    if (finished) return;
    setSelected((prev) => ({ ...prev, [current]: choice }));
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!lockedKeys) {
        return;
      }
      if (
        event.key === "ArrowRight" ||
        event.key === "ArrowDown" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowUp"
      ) {
        event.preventDefault();
      }
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        setCurrent((prev) => Math.min(prev + 1, questions.length));
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        setCurrent((prev) => Math.max(prev - 1, 1));
      }
      if (["1", "2", "3", "4"].includes(event.key)) {
        pick(Number(event.key));
      }
      if (event.key === "Escape") {
        setFinished(true);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [questions.length, current, finished, lockedKeys]);

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
    if (finished) return;
    const timer = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [finished]);

  const totalCorrect = useMemo(() => {
    return questions.reduce((acc, q) => {
      if (selected[q.id] === q.correct) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [questions, selected]);

  const resultLabel = totalCorrect >= 27 ? "Đậu" : "Trượt";
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  const timeText = `${minutes}:${seconds}`;
  const progressPercent = (remaining / totalSeconds) * 100;

  return (
    <div className={shellStyles.page}>
      <Sidebar activeKey="courses" />

      <section className={shellStyles.content}>
        <div className={styles.examLayout} ref={examRef}>
          <div className={styles.questionPanel}>
            <div className={styles.questionContent}>
              <h1>{currentQuestion.text}</h1>
              <ol>
                {currentQuestion.answers.map((answer, index) => (
                  <li
                    key={answer}
                    className={[
                      selected[current] === index + 1 ? styles.activeAnswer : "",
                      finished && currentQuestion.correct === index + 1
                        ? styles.correctAnswer
                        : "",
                      finished &&
                      selected[current] === index + 1 &&
                      currentQuestion.correct !== index + 1
                        ? styles.wrongAnswer
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <span className={styles.choiceCircle}>
                      <input
                        type="radio"
                        checked={selected[current] === index + 1}
                        onChange={() => pick(index + 1)}
                      />
                    </span>
                    {answer}
                  </li>
                ))}
              </ol>

              {finished && (
                <div className={styles.resultBox}>
                  <p>
                    Đáp án đúng:{" "}
                    <strong>
                      {currentQuestion.correct}.{" "}
                      {currentQuestion.answers[currentQuestion.correct - 1]}
                    </strong>
                  </p>
                  <p>
                    Bạn chọn:{" "}
                    <strong>
                      {selected[current]
                        ? `${selected[current]}. ${currentQuestion.answers[selected[current] - 1]}`
                        : "Chưa chọn"}
                    </strong>
                  </p>
                  <div className={styles.resultStatus}>
                    Kết quả:{" "}
                    <span
                      className={
                        resultLabel === "Đậu"
                          ? styles.pass
                          : styles.fail
                      }
                    >
                      {resultLabel}
                    </span>{" "}
                    ({totalCorrect}/30 câu đúng)
                  </div>
                </div>
              )}
            </div>

            <div className={styles.statusBar}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className={styles.statusInfo}>
                <div className={styles.inlineTimer}>
                  ⏱ Thời gian còn lại: <strong>{timeText}</strong>
                </div>
                <p>Họ và tên: THÍ SINH SỐ 9</p>
                <p>Hạng xe: B - ĐỀ NGẪU NHIÊN</p>
                <p>Ngày thi: 23/03/2026</p>
                <p>Trạng thái: <span>Đang thi</span></p>
                <p>Bạn cần trả lời đúng: <strong>27/30 câu</strong></p>
              </div>
              <div className={styles.qrBox}>
                <div className={styles.qr} />
                <p>Group: daotaolaixehd.com.vn</p>
              </div>
            </div>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.timer}>
              ⏱ THỜI GIAN THI CÒN LẠI: {timeText}
            </div>

            <div className={styles.questionGrid}>
              {questions.map((q) => (
                <button
                  key={q.id}
                  className={`${styles.questionBtn} ${
                    current === q.id ? styles.activeQuestion : ""
                  }`}
                  onClick={() => setCurrent(q.id)}
                >
                  <span>{q.id}</span>
                  <div className={styles.answerDots}>
                    {[1, 2, 3, 4].map((item) => (
                      <span
                        key={item}
                        className={
                          selected[q.id] === item ? styles.filledDot : ""
                        }
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <button
              className={styles.finishBtn}
              onClick={() => setFinished(true)}
            >
              KẾT THÚC
            </button>

            <div className={styles.quickGuide}>
              <h4>Hướng dẫn nhanh:</h4>
              <p>Di chuyển câu dùng phím (← ↑ ↓ →) hoặc dùng chuột trái.</p>
              <p>Để chọn đáp án dùng chuột hoặc phím 1,2,3,4.</p>
              <p>Kết thúc thi nhấn ESC hoặc nút KẾT THÚC.</p>
              <p>Nhấn Ctrl + - để thu nhỏ giao diện.</p>
            </div>

            <div className={styles.sideActions}>
              <Link href="/courses/my-course/theory-practice">
                Đổi đề/hạng khác
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
