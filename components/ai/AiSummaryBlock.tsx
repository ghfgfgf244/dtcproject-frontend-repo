type Props = {
  title: string;
  summary: string;
  model?: string;
  highlights?: string[];
  tone?: "default" | "info";
};

type SummarySection = {
  title: string;
  items: string[];
};

const BLOCKED_LINES = [
  "note:",
  "wait,",
  "revised content",
  "check sections",
  "final polish",
  "user constraints",
  "mandatory output format",
  "content of the problem",
  "role:",
  "language:",
  "context:",
  "the user asked",
  "the context provided was",
  "since the persona is",
  "i will",
];

function cleanSummary(summary: string) {
  return summary
    .replace(/\r/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/\*\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeTitle(line: string) {
  const cleaned = line.replace(/:$/, "").trim();
  const lower = cleaned.toLowerCase();

  if (lower === "tong quan") return "Tổng quan";
  if (lower === "top goi y") return "Top gợi ý";
  if (lower === "loi khuyen tiep theo") return "Lời khuyên tiếp theo";
  if (lower === "giai thich") return "Giải thích";
  if (lower === "can ghi nho") return "Cần ghi nhớ";
  if (lower === "meo hoc nhanh") return "Mẹo học nhanh";

  return cleaned;
}

function isHeading(line: string) {
  return /:$/.test(line) || /^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+/.test(line);
}

function isBullet(line: string) {
  return /^[-*•]\s+/.test(line);
}

function shouldSkip(line: string) {
  const normalized = line.trim().toLowerCase();
  return BLOCKED_LINES.some((item) => normalized.startsWith(item)) || normalized.endsWith("- ok");
}

function parseSummary(summary: string): {
  intro: string[];
  sections: SummarySection[];
  closing: string[];
} {
  const lines = cleanSummary(summary)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !shouldSkip(line));

  const intro: string[] = [];
  const sections: SummarySection[] = [];
  const closing: string[] = [];
  let current: SummarySection | null = null;

  for (const line of lines) {
    if (isHeading(line)) {
      if (current && current.items.length > 0) {
        sections.push(current);
      }

      const title = normalizeTitle(line.replace(/^(I|II|III|IV|V|VI|VII|VIII|IX|X)\.\s+/, ""));
      current = { title, items: [] };
      continue;
    }

    const item = line.replace(/^[-*•]\s+/, "").trim();
    if (!item || item === "-") {
      continue;
    }

    if (current) {
      current.items.push(item);
    } else {
      intro.push(item);
    }
  }

  if (current && current.items.length > 0) {
    sections.push(current);
  }

  const lastSection = sections[sections.length - 1];
  if (
    lastSection &&
    ["mẹo học nhanh", "ghi nhớ nhanh", "tóm lại", "kết luận", "lời khuyên tiếp theo"].includes(
      lastSection.title.toLowerCase(),
    )
  ) {
    closing.push(...lastSection.items);
    sections.pop();
  }

  return { intro, sections, closing };
}

export default function AiSummaryBlock({
  title,
  summary,
  model,
  highlights = [],
  tone = "default",
}: Props) {
  const toneClasses =
    tone === "info"
      ? "border-sky-200 bg-gradient-to-br from-sky-50 via-white to-cyan-50"
      : "border-slate-200 bg-white";

  const { intro, sections, closing } = parseSummary(summary);

  return (
    <section className={`rounded-3xl border p-5 shadow-sm ${toneClasses}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            Tóm tắt AI
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900">{title}</h2>
        </div>
        {model ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {model}
          </span>
        ) : null}
      </div>

      {intro.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-sky-100 bg-white/80 px-4 py-4">
          <div className="space-y-2">
            {intro.map((item, index) => (
              <p key={`intro-${index}`} className="text-sm leading-7 text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {sections.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {sections.map((section, index) => (
            <div
              key={`${section.title}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-4 shadow-sm"
            >
              <div className="mb-3 flex items-start gap-3">
                <span className="mt-0.5 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-black text-sky-700">
                  Mục {index + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{section.title}</h3>
              </div>

              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div
                    key={`${section.title}-${itemIndex}`}
                    className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3"
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

      {closing.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
          <div className="space-y-2">
            {closing.map((item, index) => (
              <p key={`closing-${index}`} className="text-sm leading-6 text-amber-900">
                {item}
              </p>
            ))}
          </div>
        </div>
      ) : null}

      {highlights.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {highlights.map((item) => (
            <span
              key={item}
              className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
