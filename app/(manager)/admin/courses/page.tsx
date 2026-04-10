import React from "react";
import CourseClientView from "@/components/manager/CourseManagement/CourseClientView";

export const metadata = {
  title: "Quản lý Khóa học | DTC Admin",
  description: "Trang quản lý danh mục khóa học đào tạo dự án DTC.",
};

export default function AdminCoursesPage() {
  return (
    <div className="p-6 md:p-10 bg-[#f8fafc] min-h-screen">
      <CourseClientView />
    </div>
  );
}
