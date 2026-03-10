import { mockCourses } from "@/lib/mockCourses";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetail({ params }: PageProps) {
  const { id } = await params;

  const course = mockCourses.find(
    (c) => c.courseId === Number(id)
  );

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Không tìm thấy khóa học
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">


      {/* HERO SECTION */}
      <div className="relative h-[420px] rounded-b-3xl overflow-hidden">
        <Link
          href="/courses"
          className="absolute top-6 left-6 z-20 px-4 py-2  bg-black/60 backdrop-blur-md  text-white rounded-full  hover:bg-black/80  transition">
          ← Quay lại
        </Link>
        <img
          src="/CourseImage.jpg"
          alt="Course Banner"
          className="w-full h-full object-cover opacity-60"

        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent p-10 flex flex-col justify-end">
          <span className="bg-cyan-500 text-black text-xs px-3 py-1 rounded-full w-fit mb-4 font-semibold">
            KHÓA HỌC LÁI XE
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {course.name}
          </h1>

          <p className="max-w-2xl text-slate-300">
            Đào tạo bài bản từ lý thuyết đến thực hành, cam kết thi đậu và
            hỗ trợ học viên tận tình trong suốt quá trình học.
          </p>
        </div>

        {/* PRICE BOX */}
        <div className="absolute right-10 bottom-10 bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl shadow-xl w-[260px]">
          <div className="text-3xl font-bold text-cyan-400 mb-1">
            {course.price?.toLocaleString()}đ
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Trọn gói – Không phát sinh
          </p>

          <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black py-2 rounded-xl font-semibold transition">
            Đăng ký ngay
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-3 gap-8">

        {/* LEFT CONTENT */}
        <div className="md:col-span-2 space-y-6">

          {/* Course Info */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">
              Thông tin khóa học
            </h2>

            <ul className="space-y-2 text-slate-300">
              <li>🚗 Hạng bằng: B1 / B2 / C</li>
              <li>📅 Thời gian đào tạo: 3 – 6 tháng</li>
              <li>📍 Địa điểm học thực hành: Sân tập chuẩn Sở GTVT</li>
              <li>🧑‍🏫 Giảng viên: Hơn 5 năm kinh nghiệm</li>
              <li>🎯 Tỷ lệ đậu: 95%+</li>
            </ul>
          </div>

          {/* Modules */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">
              Lộ trình học
            </h2>

            <div className="space-y-4">

              <div className="bg-slate-800 p-4 rounded-xl">
                <h3 className="font-semibold mb-2">
                  01 – Học lý thuyết & biển báo
                </h3>
                <p className="text-sm text-slate-400">
                  Học 600 câu hỏi luật giao thông, mẹo làm bài thi,
                  thi thử trên phần mềm chuẩn.
                </p>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl">
                <h3 className="font-semibold mb-2">
                  02 – Thực hành sa hình
                </h3>
                <p className="text-sm text-slate-400">
                  Tập 11 bài sa hình chuẩn thi sát hạch,
                  hướng dẫn chi tiết từng lỗi thường gặp.
                </p>
              </div>

              <div className="bg-slate-800 p-4 rounded-xl">
                <h3 className="font-semibold mb-2">
                  03 – Thực hành đường trường
                </h3>
                <p className="text-sm text-slate-400">
                  Thực hành xử lý tình huống giao thông thực tế,
                  kỹ năng lái xe an toàn.
                </p>
              </div>

            </div>
          </div>

          {/* Policy */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <h2 className="text-xl font-semibold mb-4">
              Chính sách & Cam kết
            </h2>

            <ul className="list-disc ml-5 space-y-2 text-slate-300">
              <li>Hỗ trợ học lại miễn phí nếu thi rớt lần đầu</li>
              <li>Không phát sinh chi phí ngoài hợp đồng</li>
              <li>Hỗ trợ đăng ký hồ sơ và khám sức khỏe</li>
              <li>Được chọn lịch học linh hoạt</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
            <h3 className="font-semibold mb-3">
              Trung tâm đào tạo
            </h3>

            <p className="text-slate-300 text-sm">
              Trung tâm Đào tạo & Sát hạch Lái Xe Thành Công
            </p>

            <p className="text-slate-500 text-xs mt-2">
              Địa chỉ: Nha Trang, Khánh Hòa
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center">
            <h3 className="font-semibold mb-3">
              Hỗ trợ tư vấn
            </h3>

            <p className="text-slate-300 text-sm">
              Hotline: 0900 000 000
            </p>

            <button className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 text-black py-2 rounded-xl font-semibold transition">
              Gọi ngay
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}