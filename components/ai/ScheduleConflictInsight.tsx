"use client";

import {
  ScheduleConflictExplainResponse,
} from "@/services/scheduleService";

type Props = {
  insight: ScheduleConflictExplainResponse | null;
};

function formatDateTime(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ScheduleConflictInsight({ insight }: Props) {
  if (!insight) return null;

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              insight.hasConflict
                ? "bg-rose-100 text-rose-700"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {insight.hasConflict ? "Có xung đột" : "Không xung đột"}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {insight.model || "Phân tích nội bộ"}
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-700">{insight.summary}</p>
      </div>

      {insight.conflicts.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-black text-slate-900">Chi tiết xung đột</h4>
          <div className="space-y-2">
            {insight.conflicts.map((conflict, index) => (
              <div
                key={`${conflict.scheduleId}-${conflict.conflictType}-${index}`}
                className="rounded-lg border border-rose-200 bg-rose-50 p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-rose-700">
                    {conflict.conflictType}
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    {conflict.className}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-700">{conflict.message}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {formatDateTime(conflict.startTime)} - {formatDateTime(conflict.endTime)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  GV: {conflict.instructorName} · Địa điểm: {conflict.addressName}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {insight.suggestions.length > 0 ? (
        <div className="space-y-2">
          <h4 className="text-sm font-black text-slate-900">Gợi ý khung giờ thay thế</h4>
          <div className="space-y-2">
            {insight.suggestions.map((item, index) => (
              <div
                key={`${item.startTime}-${index}`}
                className="rounded-lg border border-emerald-200 bg-emerald-50 p-3"
              >
                <p className="text-sm font-semibold text-emerald-800">
                  {formatDateTime(item.startTime)} - {formatDateTime(item.endTime)}
                </p>
                <p className="mt-1 text-xs text-emerald-700">{item.reason}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
