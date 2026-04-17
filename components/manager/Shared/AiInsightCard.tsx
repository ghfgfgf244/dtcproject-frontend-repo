"use client";

import { DashboardInsightResponse } from "@/types/ai";

type Props = {
  title: string;
  insight?: DashboardInsightResponse | null;
  loading?: boolean;
};

type SectionBlock =
  | {
      type: "paragraph";
      text: string;
    }
  | {
      type: "bullet-list";
      items: string[];
    }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    };

type SummarySection = {
  title: string;
  blocks: SectionBlock[];
};

const COLOR_PREFIXES = ["màu sắc:", "mau sac:"];

function cleanText(value: string) {
  return value
    .replace(/\r/g, "")
    .replace(/\uFFFD/g, "")
    .replace(/â€¢/g, "•")
    .replace(/â€“/g, "-")
    .replace(/á»/g, "ỳ")
    .trim();
}

function isNoiseLine(line: string) {
  const normalized = line.replace(/\*/g, "").trim().toLowerCase();
  return COLOR_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function normalizeLines(summary?: string | null) {
  if (!summary) return [];

  return cleanText(summary)
    .replace(/##+\s*/g, "\n")
    .replace(/\*\*/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !isNoiseLine(line));
}

function isRomanHeading(line: string) {
  return /^[IVX]+\.\s+/.test(line);
}

function isColonHeading(line: string) {
  return /:$/.test(line) && !line.startsWith("|");
}

function isBullet(line: string) {
  return /^[-•*]\s+/.test(line);
}

function isTableLine(line: string) {
  return line.includes("|");
}

function isTableSeparator(line: string) {
  const compact = line.replace(/\|/g, "").replace(/[-:\s]/g, "");
  return compact.length === 0;
}

function parseTableRow(line: string) {
  return line
    .split("|")
    .map((cell) => cell.trim())
    .filter(Boolean);
}

function parseBlocks(lines: string[]): SectionBlock[] {
  const blocks: SectionBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const current = lines[index];

    if (isBullet(current)) {
      const items: string[] = [];
      while (index < lines.length && isBullet(lines[index])) {
        items.push(lines[index].replace(/^[-•*]\s+/, "").trim());
        index += 1;
      }
      blocks.push({ type: "bullet-list", items });
      continue;
    }

    if (isTableLine(current)) {
      const tableLines: string[] = [];
      while (index < lines.length && isTableLine(lines[index])) {
        tableLines.push(lines[index]);
        index += 1;
      }

      const meaningfulRows = tableLines.filter((line) => !isTableSeparator(line));
      if (meaningfulRows.length >= 2) {
        const [headerLine, ...rowLines] = meaningfulRows;
        blocks.push({
          type: "table",
          headers: parseTableRow(headerLine),
          rows: rowLines.map(parseTableRow),
        });
      } else if (meaningfulRows.length === 1) {
        blocks.push({ type: "paragraph", text: meaningfulRows[0] });
      }
      continue;
    }

    const paragraphLines = [current];
    index += 1;

    while (
      index < lines.length &&
      !isBullet(lines[index]) &&
      !isTableLine(lines[index])
    ) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" "),
    });
  }

  return blocks;
}

function parseSummary(summary?: string | null) {
  const lines = normalizeLines(summary);
  const sections: SummarySection[] = [];
  let intro = "";
  let index = 0;

  while (index < lines.length && !isRomanHeading(lines[index]) && !isColonHeading(lines[index])) {
    intro += `${intro ? " " : ""}${lines[index]}`;
    index += 1;
  }

  while (index < lines.length) {
    const current = lines[index];
    let title = current;

    if (isRomanHeading(current)) {
      title = current.replace(/^[IVX]+\.\s+/, "").trim();
    } else if (isColonHeading(current)) {
      title = current.replace(/:$/, "").trim();
    }

    index += 1;

    const contentLines: string[] = [];
    while (
      index < lines.length &&
      !isRomanHeading(lines[index]) &&
      !isColonHeading(lines[index])
    ) {
      contentLines.push(lines[index]);
      index += 1;
    }

    sections.push({
      title,
      blocks: parseBlocks(contentLines),
    });
  }

  return {
    intro,
    sections,
  };
}

function renderBlock(block: SectionBlock, key: string) {
  if (block.type === "paragraph") {
    return (
      <p key={key} className="text-sm leading-7 text-slate-700">
        {block.text}
      </p>
    );
  }

  if (block.type === "bullet-list") {
    return (
      <div key={key} className="space-y-3">
        {block.items.map((item, index) => (
          <div key={`${key}-${index}`} className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3">
            <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
            <p className="text-sm leading-7 text-slate-700">{item}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div key={key} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {block.headers.map((header, index) => (
                <th
                  key={`${key}-header-${index}`}
                  className="px-4 py-3 text-left text-[11px] font-black uppercase tracking-[0.18em] text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {block.rows.map((row, rowIndex) => (
              <tr key={`${key}-row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${key}-cell-${rowIndex}-${cellIndex}`} className="px-4 py-3 text-slate-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AiInsightCard({ title, insight, loading = false }: Props) {
  const { intro, sections } = parseSummary(insight?.summary);

  return (
    <section className="overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-sky-50 via-white to-indigo-50 shadow-sm">
      <div className="border-b border-blue-100/70 bg-white/80 px-6 py-5 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-600">
              Nhận định AI
            </p>
            <h2 className="mt-2 text-2xl font-black text-slate-900">{title}</h2>
          </div>

          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
            {loading ? "Đang phân tích..." : insight?.model || "Phân tích nội bộ"}
          </span>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-11/12 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-8/12 animate-pulse rounded-full bg-slate-200" />
          </div>
        ) : sections.length > 0 || intro ? (
          <>
            {intro ? (
              <div className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-4">
                <p className="text-sm leading-7 text-slate-700">{intro}</p>
              </div>
            ) : null}

            <div className="space-y-4">
              {sections.map((section, index) => (
                <div
                  key={`${section.title}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white/85 px-4 py-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start gap-3">
                    <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[11px] font-black text-blue-700">
                      Mục {index + 1}
                    </span>
                    <h3 className="pt-0.5 text-sm font-bold text-slate-900">{section.title}</h3>
                  </div>

                  <div className="space-y-3">
                    {section.blocks.map((block, blockIndex) =>
                      renderBlock(block, `${section.title}-${blockIndex}`),
                    )}
                  </div>
                </div>
              ))}
            </div>

            {insight?.highlights?.length ? (
              <div className="rounded-2xl border border-blue-100 bg-white/80 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Điểm nổi bật
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {insight.highlights.map((highlight, index) => (
                    <span
                      key={`${highlight}-${index}`}
                      className="rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <p className="text-sm leading-7 text-slate-600">
            Chưa có nhận định AI. Bạn vẫn có thể dùng các KPI bên dưới để theo dõi vận hành.
          </p>
        )}
      </div>
    </section>
  );
}
