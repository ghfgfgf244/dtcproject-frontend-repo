"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CourseAdvisorSuggestion } from "@/types/ai";

type Props = {
  suggestion: CourseAdvisorSuggestion;
};

type MapTarget = {
  title: string;
  address: string;
  externalUrl: string;
} | null;

function buildMapsSearchUrl(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

function buildMapsEmbedUrl(address: string) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

export default function AiSuggestionCard({ suggestion }: Props) {
  const [activeMap, setActiveMap] = useState<MapTarget>(null);

  // const [isDetailOpen, setIsDetailOpen] = useState(false);

  const centerMapUrl = useMemo(
    () =>
      suggestion.centerAddress
        ? buildMapsSearchUrl(suggestion.centerAddress)
        : null,
    [suggestion.centerAddress],
  );

  const activeEmbedUrl = activeMap
    ? buildMapsEmbedUrl(activeMap.address)
    : null;

  const examMapUrl = useMemo(
    () =>
      suggestion.examAddressName
        ? buildMapsSearchUrl(suggestion.examAddressName)
        : null,
    [suggestion.examAddressName],
  );

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            GPLX {suggestion.licenseType}
          </span>
          {typeof suggestion.remainingTermSeats === "number" ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Còn {suggestion.remainingTermSeats} chỗ
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 text-base font-semibold text-slate-900">
          {suggestion.courseName}
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-700">
          {suggestion.centerName}
        </p>
        {suggestion.centerAddress ? (
          <p className="mt-1 text-sm text-slate-500">
            {suggestion.centerAddress}
          </p>
        ) : null}

        <div className="mt-4 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Kỳ học
            </p>
            <p className="mt-1 font-medium">
              {suggestion.termName || "Chưa có kỳ phù hợp"}
            </p>
            {suggestion.termStartDate ? (
              <p className="mt-1 text-slate-500">
                {new Date(suggestion.termStartDate).toLocaleDateString("vi-VN")}
                {suggestion.termEndDate
                  ? ` - ${new Date(suggestion.termEndDate).toLocaleDateString("vi-VN")}`
                  : ""}
              </p>
            ) : null}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Thi gợi ý
            </p>
            <p className="mt-1 font-medium">
              {suggestion.examBatchName || "Chưa có lịch thi"}
            </p>
            {suggestion.examDate ? (
              <p className="mt-1 text-slate-500">
                {new Date(suggestion.examDate).toLocaleDateString("vi-VN")}
              </p>
            ) : null}
            {suggestion.examAddressName ? (
              <p className="mt-1 text-slate-500">
                {suggestion.examAddressName}
              </p>
            ) : null}
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {suggestion.summary}
        </p>
        {suggestion.reason ? (
          <p className="mt-3 rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-800">
            {suggestion.reason}
          </p>
        ) : null}

        {typeof suggestion.price === "number" ? (
          <p className="mt-3 text-sm font-semibold text-slate-900">
            Học phí tham khảo: {suggestion.price.toLocaleString("vi-VN")} VNĐ
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-3">
          {suggestion.courseId ? (
            <Link
              href={`/courses/${suggestion.courseId}`}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Xem khóa học
            </Link>
          ) : null}

          {suggestion.centerAddress && centerMapUrl ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveMap({
                    title: `Bản đồ trung tâm: ${suggestion.centerName}`,
                    address: suggestion.centerAddress!,
                    externalUrl: centerMapUrl,
                  })
                }
                className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-100"
              >
                Xem bản đồ trung tâm
              </button>
              <a
                href={centerMapUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Mở Google Maps
              </a>
            </>
          ) : null}

          {suggestion.examAddressName && examMapUrl ? (
            <button
              type="button"
              onClick={() =>
                setActiveMap({
                  title: "Bản đồ địa điểm thi",
                  address: suggestion.examAddressName!,
                  externalUrl: examMapUrl,
                })
              }
              className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
            >
              Xem địa điểm thi
            </button>
          ) : null}
        </div>
      </div>

      <Dialog
        open={!!activeMap}
        onOpenChange={(open) => !open && setActiveMap(null)}
      >
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          <DialogHeader className="border-b border-slate-200 px-6 py-5">
            <DialogTitle className="text-slate-900">
              {activeMap?.title || "Bản đồ"}
            </DialogTitle>
            <DialogDescription className="text-slate-600">
              {activeMap?.address || "Đang tải địa điểm..."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 p-4 sm:p-6">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              {activeEmbedUrl ? (
                <iframe
                  title={activeMap?.title || "Google Maps"}
                  src={activeEmbedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-[320px] w-full border-0 sm:h-[420px]"
                />
              ) : null}
            </div>

            {activeMap ? (
              <div className="flex flex-wrap justify-end gap-3">
                <a
                  href={activeMap.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Mở trong Google Maps
                </a>
                <button
                  type="button"
                  onClick={() => setActiveMap(null)}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Đóng
                </button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
