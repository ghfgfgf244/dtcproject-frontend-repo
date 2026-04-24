"use client";

import { FormEvent, useMemo, useState } from "react";
import { aiAdvisorService } from "@/services/aiAdvisorService";
import { AiChatPanelResult } from "@/types/ai";

type Props = {
  title?: string;
  placeholder?: string;
  description?: string;
  submitLabel?: string;
  helperText?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  onAsk?: (prompt: string) => Promise<AiChatPanelResult>;
};

type AnswerSection = {
  title: string;
  items: string[];
};

function cleanAiText(value?: string | null) {
  if (!value) return "";

  return value
    .replace(/\r/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\uFFFD/g, "")
    .replace(/\*\*/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeAnswerLines(answer?: string | null) {
  return cleanAiText(answer)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function isSectionHeading(line: string) {
  return /:$/.test(line) && !/^\d+[.)]/.test(line);
}

function stripListPrefix(line: string) {
  return line
    .replace(/^\d+[.)]\s*/, "")
    .replace(/^[-*•]\s*/, "")
    .trim();
}

function parseAnswer(answer?: string | null): {
  intro: string[];
  sections: AnswerSection[];
  closing: string[];
} {
  const lines = normalizeAnswerLines(answer);

  if (lines.length === 0) {
    return { intro: [], sections: [], closing: [] };
  }

  const intro: string[] = [];
  const sections: AnswerSection[] = [];
  const closing: string[] = [];
  let currentSection: AnswerSection | null = null;

  for (const line of lines) {
    if (isSectionHeading(line)) {
      if (currentSection) {
        sections.push(currentSection);
      }

      currentSection = {
        title: line.replace(/:$/, "").trim(),
        items: [],
      };
      continue;
    }

    if (currentSection) {
      currentSection.items.push(stripListPrefix(line));
      continue;
    }

    intro.push(stripListPrefix(line));
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  const lastSection = sections[sections.length - 1];
  if (
    lastSection &&
    ["mẹo học nhanh", "ghi nhớ nhanh", "tóm lại", "kết luận"].includes(
      lastSection.title.toLowerCase(),
    )
  ) {
    closing.push(...lastSection.items);
    sections.pop();
  }

  return { intro, sections, closing };
}

export default function AiChatPanel({
  title = "Trợ lý AI",
  placeholder = "Nhập câu hỏi của bạn...",
  description = "Nhập câu hỏi để nhận trả lời, nguồn tham khảo và chủ đề nên ôn tiếp.",
  submitLabel = "Gửi câu hỏi",
  helperText = "Khung AI dùng chung này có thể tái sử dụng cho tư vấn khóa học, giải đáp lý thuyết và các use case AI khác.",
  emptyStateTitle = "Sẵn sàng hỗ trợ",
  emptyStateDescription = "Hệ thống sẽ hiển thị câu trả lời AI, nguồn liên quan và các chủ đề gợi ý ngay tại đây.",
  onAsk,
}: Props) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<AiChatPanelResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const parsedAnswer = useMemo(() => parseAnswer(result?.answer), [result?.answer]);

  const handleAsk = async (event?: FormEvent) => {
    event?.preventDefault();

    if (!prompt.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = onAsk
        ? await onAsk(prompt.trim())
        : await aiAdvisorService.askTheory({
            question: prompt.trim(),
          });

      setResult(response);
    } catch (err) {
      console.error("AI chat failed:", err);
      setError("Chưa thể lấy phản hồi từ trợ lý AI.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Trợ lý AI
        </p>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>

      <form onSubmit={handleAsk} className="mt-4">
        <textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder={placeholder}
          className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">{helperText}</p>
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Đang hỏi..." : submitLabel}
          </button>
        </div>
      </form>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      {result ? (
        <div className="mt-4 space-y-4 rounded-2xl bg-slate-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Phản hồi AI</p>
            {result.model ? (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-sky-700">
                {result.model}
              </span>
            ) : null}
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
            {parsedAnswer.intro.length > 0 ? (
              <div className="space-y-3">
                {parsedAnswer.intro.map((paragraph, index) => (
                  <p key={`intro-${index}`} className="text-sm leading-7 text-slate-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}

            {parsedAnswer.sections.length > 0 ? (
              <div className="space-y-3">
                {parsedAnswer.sections.map((section, index) => (
                  <div
                    key={`${section.title}-${index}`}
                    className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <span className="rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-sky-700">
                        Mục {index + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {section.title}
                      </h3>
                    </div>

                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <div
                          key={`${section.title}-${itemIndex}`}
                          className="flex items-start gap-3"
                        >
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sky-500" />
                          <p className="text-sm leading-7 text-slate-700">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}

            {parsedAnswer.closing.length > 0 ? (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                  Ghi nhớ nhanh
                </p>
                <div className="mt-2 space-y-2">
                  {parsedAnswer.closing.map((item, index) => (
                    <p key={`closing-${index}`} className="text-sm leading-7 text-amber-900">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            {parsedAnswer.intro.length === 0 &&
            parsedAnswer.sections.length === 0 &&
            parsedAnswer.closing.length === 0 ? (
              <p className="text-sm leading-7 text-slate-700">
                {cleanAiText(result.answer)}
              </p>
            ) : null}
          </div>

          {result.suggestedTopics?.length ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Nên ôn tiếp
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {result.suggestedTopics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {result.sources?.length ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Nguồn liên quan
              </p>
              <div className="mt-3 grid gap-3">
                {result.sources.map((source, index) => (
                  <div
                    key={`${source.referenceId ?? source.title}-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {source.title}
                      </p>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                        {source.sourceType}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {source.snippet}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5">
          <p className="text-sm font-semibold text-slate-900">
            {emptyStateTitle}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {emptyStateDescription}
          </p>
        </div>
      )}
    </section>
  );
}
