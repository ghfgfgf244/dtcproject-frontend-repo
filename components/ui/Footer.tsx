import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0b1f26] text-slate-300 pt-16 pb-8 px-6 md:px-20">
      {/* TOP SECTION */}
      <div className="grid md:grid-cols-3 gap-12 mb-12">

        {/* LEFT */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center text-black font-bold">
              D
            </div>
            <h2 className="text-white text-xl font-semibold">
              DrivingSchool
            </h2>
          </div>

          <p className="text-slate-400 leading-relaxed">
            Trung tâm đào tạo lái xe chuyên nghiệp. 
            Cam kết đào tạo chất lượng, hỗ trợ học viên tận tâm 
            và tỷ lệ đậu cao.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-6">
            Quick Links
          </h3>

          <ul className="space-y-3 text-slate-400">
            <li>
              <Link href="/courses" className="hover:text-cyan-400 transition">
                Khóa học
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-cyan-400 transition">
                Lịch khai giảng
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-cyan-400 transition">
                Câu hỏi thường gặp
              </Link>
            </li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h3 className="text-white font-semibold mb-6">
            Legal
          </h3>

          <ul className="space-y-3 text-slate-400">
            <li>
              <Link href="#" className="hover:text-cyan-400 transition">
                Chính sách bảo mật
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-cyan-400 transition">
                Điều khoản sử dụng
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-cyan-400 transition">
                Chính sách hoàn tiền
              </Link>
            </li>
          </ul>
        </div>
      </div>

      

      {/* DIVIDER */}
      <div className="border-t border-slate-700 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
        <p>
          © {new Date().getFullYear()} Driving School System. All rights reserved.
        </p>

        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="text-lg">🌐</span>
          <span>Tiếng Việt (VN)</span>
        </div>
      </div>
    </footer>
  );
}