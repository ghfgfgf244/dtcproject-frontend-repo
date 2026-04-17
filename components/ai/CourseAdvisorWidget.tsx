"use client";

import { useEffect, useMemo, useState } from "react";
import { aiAdvisorService } from "@/services/aiAdvisorService";
import AiSuggestionCard from "@/components/ai/AiSuggestionCard";
import AiSummaryBlock from "@/components/ai/AiSummaryBlock";
import { CourseAdvisorResponse } from "@/types/ai";
import { centerService } from "@/services/centerService";
import { EXAM_LEVEL_OPTIONS } from "@/constants/exam-levels";

const QUICK_SCHEDULE_OPTIONS = [
  "Buổi tối trong tuần",
  "Cuối tuần",
  "Sáng trong tuần",
  "Linh hoạt theo ca",
] as const;

export default function CourseAdvisorWidget() {
  const [licenseLevel, setLicenseLevel] = useState("");
  const [district, setDistrict] = useState("");
  const [schedule, setSchedule] = useState("");
  const [districtSuggestions, setDistrictSuggestions] = useState<string[]>([]);
  const [result, setResult] = useState<CourseAdvisorResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const centers = await centerService.getAll();
        const suggestions = new Set<string>();

        centers.forEach((center) => {
          const address = center.address?.trim();
          if (!address) {
            return;
          }

          suggestions.add(address);

          address
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
            .forEach((item) => suggestions.add(item));
        });

        setDistrictSuggestions(Array.from(suggestions).slice(0, 20));
      } catch (fetchError) {
        console.error("Failed to load center districts:", fetchError);
      }
    };

    loadDistricts();
  }, []);

  const filteredDistrictSuggestions = useMemo(() => {
    const normalizedInput = district.trim().toLowerCase();
    if (!normalizedInput) {
      return districtSuggestions.slice(0, 8);
    }

    return districtSuggestions
      .filter((item) => item.toLowerCase().includes(normalizedInput))
      .slice(0, 8);
  }, [district, districtSuggestions]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await aiAdvisorService.getCourseAdvice({
        desiredLicenseLevel: licenseLevel || undefined,
        preferredDistrict: district || undefined,
        preferredSchedule: schedule || undefined,
        needNearestCenter: true,
        needEarliestExam: true,
      });
      setResult(response);
    } catch (err) {
      console.error("Course advisor failed:", err);
      setError("Chưa thể tải gợi ý khóa học lúc này.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="course-advisor"
      className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Tư vấn thông minh
        </p>
        <h2 className="text-2xl font-semibold text-slate-900">
          Tư vấn khóa học, trung tâm và địa điểm thi
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Hệ thống sẽ ưu tiên hạng bằng, khu vực, kỳ học còn chỗ và lịch thi đã
          được xếp để đưa ra gợi ý phù hợp nhất.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {QUICK_SCHEDULE_OPTIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSchedule(item)}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
              schedule === item
                ? "bg-sky-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <select
          value={licenseLevel}
          onChange={(event) => setLicenseLevel(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-500"
        >
          <option value="">Chọn hạng bằng</option>
          {EXAM_LEVEL_OPTIONS.map((item) => (
            <option key={item.value} value={item.label}>
              {item.label}
            </option>
          ))}
        </select>
        <div className="relative">
          <input
            list="district-suggestions"
            value={district}
            onChange={(event) => setDistrict(event.target.value)}
            placeholder="Quận/huyện hoặc địa chỉ ưu tiên"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
          />
          <datalist id="district-suggestions">
            {filteredDistrictSuggestions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>
        <input
          value={schedule}
          onChange={(event) => setSchedule(event.target.value)}
          placeholder="Ví dụ: Tối trong tuần, cuối tuần..."
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-sky-500"
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          Nếu dữ liệu chưa đủ cho một tiêu chí, hệ thống sẽ nói rõ và ưu tiên
          gợi ý gần nhất đang có.
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Đang tư vấn..." : "Nhận gợi ý"}
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}

      {result ? (
        <div className="mt-5 space-y-4">
          <AiSummaryBlock
            title="Tổng hợp gợi ý khóa học"
            summary={result.message}
            model={result.model}
            tone="info"
            highlights={result.suggestions
              .slice(0, 4)
              .map((item) => item.courseName)}
          />
          {result.suggestions.map((suggestion, index) => (
            <AiSuggestionCard
              key={
                suggestion.courseId ??
                suggestion.centerId ??
                `${suggestion.title}-${index}`
              }
              suggestion={suggestion}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
