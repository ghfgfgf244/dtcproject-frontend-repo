import React from "react";

export function CourseFilter() {
  return (
    <aside className="w-full lg:w-64 flex flex-col gap-8 shrink-0">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">Filters</h3>
          <span className="material-symbols-outlined text-slate-400 text-sm">
            tune
          </span>
        </div>

        {/* License Type Filter */}
        <div className="mb-8">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            License Type
          </h4>
          <div className="space-y-3">
            {[
              "All Types",
              "Manual (B1)",
              "Automatic (B2)",
              "Truck (Class C)",
            ].map((type, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  defaultChecked={idx === 0}
                  className="rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Price Range
          </h4>
          <div className="space-y-3">
            {["Under 10M VND", "10M - 15M VND", "Over 15M VND"].map(
              (range, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="price"
                    className="border-slate-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-primary transition-colors">
                    {range}
                  </span>
                </label>
              ),
            )}
          </div>
        </div>

        <button className="mt-8 w-full py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          Reset All
        </button>
      </div>

      {/* Support Box */}
      <div className="bg-primary/10 p-6 rounded-xl border border-primary/20">
        <h4 className="font-bold text-primary mb-2">Need help?</h4>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
          Chat with our experts to find the perfect course for your goals.
        </p>
        <button className="flex items-center gap-2 text-primary font-bold text-sm">
          Contact Support{" "}
          <span className="material-symbols-outlined text-sm">
            arrow_forward
          </span>
        </button>
      </div>
    </aside>
  );
}
