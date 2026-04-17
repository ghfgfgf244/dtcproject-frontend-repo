"use client";

import { FormEvent, useState } from "react";
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

          <div className="text-sm leading-6 text-slate-700">{result.answer}</div>

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
