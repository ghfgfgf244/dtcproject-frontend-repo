"use client";

type Props = {
  title: string;
  items?: string[];
  tone?: "blue" | "amber" | "emerald";
};

const toneClasses: Record<NonNullable<Props["tone"]>, string> = {
  blue: "border-blue-100 bg-blue-50/70 text-blue-900",
  amber: "border-amber-100 bg-amber-50/70 text-amber-900",
  emerald: "border-emerald-100 bg-emerald-50/70 text-emerald-900",
};

export default function AiAlertList({ title, items = [], tone = "blue" }: Props) {
  return (
    <section className={`rounded-3xl border p-5 shadow-sm ${toneClasses[tone]}`}>
      <h3 className="text-sm font-black uppercase tracking-[0.2em]">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length ? (
          items.map((item, index) => (
            <div key={`${title}-${index}`} className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700">
              {item}
            </div>
          ))
        ) : (
          <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm leading-6 text-slate-500">
            Chưa có mục nào cần hiển thị.
          </div>
        )}
      </div>
    </section>
  );
}
