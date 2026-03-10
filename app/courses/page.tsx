import { mockCourses } from "@/lib/mockCourses";
import CourseGrid from "@/components/course/CourseGrid";

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HERO */}
      <section className="text-center py-20 bg-gradient-to-r from-sky-600 to-blue-800">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Làm Chủ Tay Lái – Vững Vàng Mọi Hành Trình
        </h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Đăng ký khóa học lái xe tại các trung tâm uy tín.
          Thực hành bài bản, sẵn sàng chinh phục mọi cung đường.
        </p>
      </section>

      {/* COURSE LIST */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <CourseGrid courses={mockCourses} />
      </div>
    </div>
  );
}