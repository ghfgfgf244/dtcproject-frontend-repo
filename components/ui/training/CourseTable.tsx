// components/training/CourseTable.tsx
import React from "react";

// 1. Định nghĩa Interface chuẩn xác (Không dùng any)
export interface CourseType {
  id: string;
  name: string;
  details: string;
  licenseType: string;
  price: string;
  status: "Active" | "Draft" | "Inactive";
}

// 2. Component Dòng dữ liệu
export function CourseRow({ course }: { course: CourseType }) {
  // Map màu sắc tương ứng với trạng thái
  const statusStyles = {
    Active: {
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      dot: "bg-emerald-500",
    },
    Draft: {
      bg: "bg-slate-100 dark:bg-slate-700",
      text: "text-slate-500 dark:text-slate-400",
      dot: "bg-slate-400",
    },
    Inactive: {
      bg: "bg-rose-100 dark:bg-rose-900/30",
      text: "text-rose-600 dark:text-rose-400",
      dot: "bg-rose-500",
    },
  };

  const currentStyle = statusStyles[course.status];

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <p className="font-semibold text-sm">{course.name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {course.details}
        </p>
      </td>
      <td className="px-6 py-4">
        <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium">
          {course.licenseType}
        </span>
      </td>
      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
        {course.price}
      </td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${currentStyle.bg} ${currentStyle.text}`}
        >
          <span className={`size-1.5 rounded-full ${currentStyle.dot}`}></span>
          {course.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-primary hover:text-blue-700 text-sm font-bold">
          Edit
        </button>
      </td>
    </tr>
  );
}
