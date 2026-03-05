import React from "react";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: string) => void;
}

export function CourseCard({ course, onEnroll }: CourseCardProps) {
  // Format số tiền sang định dạng VNĐ
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(course.price);

  // Sinh màu Badge tự động dựa trên LicenseType
  const getBadgeStyle = (type: string) => {
    if (type.includes("B1")) return "bg-white/90 text-primary";
    if (type.includes("B2")) return "bg-amber-500 text-white";
    if (type.includes("C")) return "bg-slate-900 text-white";
    return "bg-emerald-500 text-white";
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
      {/* Thumbnail & Badge */}
      <div className="relative h-48 w-full bg-slate-200">
        <div className="absolute top-4 left-4 z-10">
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${getBadgeStyle(course.licenseType)}`}
          >
            {course.licenseType}
          </span>
        </div>
        <div
          className="w-full h-full bg-center bg-cover"
          style={{
            backgroundImage: `url(${course.imageUrl || "/default-course-bg.jpg"})`,
          }}
          aria-label={course.courseName}
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
          {course.courseName}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6">
          {course.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase text-slate-400 font-bold">
                Course Price
              </span>
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                {formattedPrice}
              </span>
            </div>
            {course.duration && (
              <div className="flex items-center text-primary bg-primary/10 px-2 py-1 rounded text-xs font-bold">
                <span className="material-symbols-outlined text-sm mr-1">
                  timer
                </span>
                {course.duration}
              </div>
            )}
          </div>

          <button
            onClick={() => onEnroll(course.id)}
            className="w-full py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-bold rounded-lg transition-all shadow-md shadow-primary/20"
          >
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
}
