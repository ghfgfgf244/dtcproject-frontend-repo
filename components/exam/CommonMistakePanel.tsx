"use client";

import { CommonMistakeItem } from "@/types/mock-exam-detail";

type Props = {
  items: CommonMistakeItem[];
  title?: string;
  description?: string;
  compact?: boolean;
};

export default function CommonMistakePanel({
  items,
  title = "Các câu học viên hay sai",
  description = "Theo dõi những câu có tỷ lệ sai cao để ưu tiên ôn tập đúng trọng tâm.",
  compact = false,
}: Props) {
  if (items.length === 0) {
    return (
      <section
        className={[
          "rounded-3xl border border-slate-200 bg-white shadow-sm",
          compact ? "p-4" : "p-5 sm:p-6",
        ].join(" ")}
      >
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
        <div className="mt-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          Chưa có đủ dữ liệu làm bài để thống kê các câu sai phổ biến.
        </div>
      </section>
    );
  }

  return (
    <section
      className={[
        "rounded-3xl border border-slate-200 bg-white shadow-sm",
        compact ? "p-4" : "p-5 sm:p-6",
      ].join(" ")}
    >
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div className="mt-4 space-y-3">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                Top {index + 1}
              </span>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                {item.category}
              </span>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                Tỷ lệ sai {(item.wrongRate * 100).toFixed(0)}%
              </span>
            </div>

            <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-700">{item.content}</p>

            <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
              <span>Lượt làm: {item.attemptCount}</span>
              <span>Số lần sai: {item.wrongAttemptCount}</span>
            </div>

            {item.explanation ? (
              <p className="mt-3 rounded-xl bg-white px-3 py-3 text-sm leading-6 text-slate-600">
                {item.explanation}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
