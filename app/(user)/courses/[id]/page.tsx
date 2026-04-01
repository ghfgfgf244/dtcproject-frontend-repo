// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\app\(user)\courses\[id]\page.tsx

import { courseService } from "@/services/courseService";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetail({ params }: PageProps) {
  const { id } = await params;

  // Fetch real data from the API
  const course = await courseService.getCourseById(id);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-slate-900">
        Không tìm thấy khóa học
      </div>
    );
  }

  const { courseName, description, price, centerName, centerAddress, learningRoadmap, licenseType } = course;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* HERO SECTION */}
      <div className="relative h-[420px] rounded-b-3xl overflow-hidden bg-slate-100">
        <Link
          href="/courses"
          className="absolute top-6 left-6 z-20 px-4 py-2 bg-white/80 backdrop-blur-md text-slate-900 rounded-full border border-slate-200 hover:bg-white transition">
          ← Quay lại
        </Link>
        <img
          src={course.thumbnailUrl || "/CourseImage.jpg"}
          alt={courseName}
          className="w-full h-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent p-10 flex flex-col justify-end">
          <span className="bg-sky-100 text-sky-700 text-xs px-3 py-1 rounded-full w-fit mb-4 font-semibold uppercase">
            Hạng {licenseType || 'Khác'}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {courseName}
          </h1>

          <p className="max-w-2xl text-slate-600">
            {description || "Đào tạo bài bản từ lý thuyết đến thực hành, cam kết thi đậu và hỗ trợ học viên tận tình trong suốt quá trình học."}
          </p>
        </div>

        {/* PRICE BOX */}
        <div className="absolute right-10 bottom-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-[260px] border border-slate-200">
          <div className="text-3xl font-bold text-sky-600 mb-1">
            {price?.toLocaleString()}đ
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Trọn gói – Không phát sinh
          </p>

          <Link href={`/courses/${id}/register`}>
            <button className="w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-xl font-semibold transition">
              Đăng ký ngay
            </button>
          </Link>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-3 gap-8">

        {/* LEFT CONTENT */}
        <div className="md:col-span-2 space-y-6">

          {/* Course Info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Thông tin khóa học
            </h2>

            <ul className="space-y-2 text-slate-600">
              <li>🚗 Hạng bằng: {licenseType || 'Chưa cập nhật'}</li>
              <li>📅 Thời gian đào tạo: {course.durationInWeeks || '3-6'} tuần</li>
              <li>📍 Địa điểm học thực hành: Sân tập chuẩn Sở GTVT</li>
              <li>🧑‍🏫 Giảng viên: Hơn 5 năm kinh nghiệm</li>
              <li>🎯 Tỷ lệ đậu: 95%+</li>
            </ul>
          </div>

          {/* Roadmap */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Lộ trình học
            </h2>

            <div className="space-y-4">
              {learningRoadmap && learningRoadmap.length > 0 ? (
                learningRoadmap.map((item, index) => (
                  <div key={item.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {item.content || "Nội dung chi tiết đang được cập nhật."}
                      </p>
                      {item.attachmentUrl && (
                        <a href={item.attachmentUrl} target="_blank" className="text-xs text-sky-600 hover:underline mt-2 block">
                          Tài liệu đi kèm
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 py-4 text-center border border-dashed rounded-xl">
                  Lộ trình học đang được cập nhật.
                </div>
              )}
            </div>
          </div>

          {/* Policy */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Chính sách & Cam kết
            </h2>

            <ul className="list-disc ml-5 space-y-2 text-slate-600">
              <li>Hỗ trợ học lại miễn phí nếu thi rớt lần đầu</li>
              <li>Không phát sinh chi phí ngoài hợp đồng</li>
              <li>Hỗ trợ đăng ký hồ sơ và khám sức khỏe</li>
              <li>Được chọn lịch học linh hoạt</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
            <h3 className="font-semibold mb-3">
              Trung tâm đào tạo
            </h3>

            <p className="text-slate-800 font-medium">
              {centerName || "Đang cập nhật trung tâm"}
            </p>

            {centerAddress && (
              <p className="text-slate-500 text-xs mt-2 italic">
                {centerAddress}
              </p>
            )}
            
            <Link href={`/centers/${course.centerId}`} className="text-xs text-sky-600 hover:underline mt-4 block">
              Xem chi tiết trung tâm
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
            <h3 className="font-semibold mb-3">
              Hỗ trợ tư vấn
            </h3>

            <p className="text-slate-600 text-sm">
              Hotline: 0900 000 000
            </p>

            <button className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white py-2 rounded-xl font-semibold transition">
              Gọi ngay
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
