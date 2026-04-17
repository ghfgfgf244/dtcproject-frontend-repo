type Props = {
  title: string;
  summary: string;
  model?: string;
  highlights?: string[];
  tone?: "default" | "info";
};

type SummarySection = {
  title: string;
  body: string;
};

function normalizeSummary(summary: string) {
  return summary
    .replace(/\r/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseSummary(summary: string): {
  intro: string;
  sections: SummarySection[];
  closing: string;
} {
  const normalized = normalizeSummary(summary);

  const strongPattern = /\*\*(.+?)\*\*/g;
  const matches = [...normalized.matchAll(strongPattern)];

  if (matches.length === 0) {
    return {
      intro: normalized,
      sections: [],
      closing: "",
    };
  }

  const intro = normalized.slice(0, matches[0].index).trim();
  const sections: SummarySection[] = [];

  matches.forEach((match, index) => {
    const title = match[1].replace(/:+$/, "").trim();
    const bodyStart = (match.index || 0) + match[0].length;
    const bodyEnd =
      index < matches.length - 1 ? matches[index + 1].index || normalized.length : normalized.length;
    const body = normalized.slice(bodyStart, bodyEnd).trim().replace(/^[:\-–]\s*/, "");

    if (title && body) {
      sections.push({ title, body });
    }
  });

  const closing =
    sections.length > 0
      ? sections[sections.length - 1].body.includes("Vui lòng cung cấp thêm")
        ? sections.pop()?.body || ""
        : ""
      : "";

  return {
    intro,
    sections,
    closing,
  };
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

      {intro ? (
        <div className="mt-4 rounded-2xl border border-sky-100 bg-white/80 px-4 py-4">
          <p className="text-sm leading-7 text-slate-700">{intro}</p>
        </div>
      ) : null}

      {sections.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {sections.map((section, index) => (
            <div
              key={`${section.title}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] font-black text-sky-700">
                  Gợi ý {index + 1}
                </span>
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-900">{section.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{section.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {closing ? (
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-sm leading-6 text-amber-900">{closing}</p>
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
