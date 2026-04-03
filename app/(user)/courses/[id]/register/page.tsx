// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\app\(user)\courses\[id]\register\page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { courseService } from "@/services/courseService";
import { registrationService } from "@/services/registrationService";
import { documentService } from "@/services/documentService";
import { setAuthToken } from "@/lib/api";
import { Course } from "@/types/course";

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [notes, setNotes] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [agreed, setAgreed] = useState(false);

  // Document states
  const [docs, setDocs] = useState<{
    photo: { file: File | null; status: 'idle' | 'uploading' | 'success' | 'error' };
    idFront: { file: File | null; status: 'idle' | 'uploading' | 'success' | 'error' };
    idBack: { file: File | null; status: 'idle' | 'uploading' | 'success' | 'error' };
  }>({
    photo: { file: null, status: 'idle' },
    idFront: { file: null, status: 'idle' },
    idBack: { file: null, status: 'idle' },
  });

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Set token for the initial fetch - many courses might be public, but let's be safe
        const token = await getToken();
        setAuthToken(token);

        const data = await courseService.getCourseById(courseId);
        setCourse(data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Không thể tải thông tin khóa học. Vui lòng kiểm tra kết nối mạng.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, getToken]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof docs) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocs(prev => ({ ...prev, [type]: { file, status: 'idle' } }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;
    if (!agreed) {
      alert("Bạn phải đồng ý với điều khoản dịch vụ.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // 1. Ensure token is fresh for registration
      const token = await getToken();
      setAuthToken(token);

      // 2. Build FormData
      const formData = new FormData();
      formData.append("CourseId", course.id);
      formData.append("TotalFee", course.price.toString());
      if (notes) formData.append("Notes", notes);
      if (referralCode) formData.append("ReferralCode", referralCode);

      // Append files if they exist
      if (docs.photo.file) formData.append("Photo", docs.photo.file);
      if (docs.idFront.file) formData.append("IdFront", docs.idFront.file);
      if (docs.idBack.file) formData.append("IdBack", docs.idBack.file);

      // 3. Submit registration package
      await registrationService.registerCourse(formData);

      alert("Đăng ký thành công!");
      router.push("/courses");
    } catch (err: any) {
      console.error("Submit error:", err);
      const msg = err.response?.data?.message || err.message || "Đã xảy ra lỗi khi đăng ký khóa học.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  if (!course) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy khóa học</div>;

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">

        {/* COURSE HERO */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
          <img
            src={course.thumbnailUrl || "/CourseImage.jpg"}
            className="w-full h-56 object-cover opacity-70"
          />

          <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-white/80">
            <span className="bg-sky-100 text-sky-700 text-xs px-3 py-1 rounded-full w-fit mb-2 font-semibold uppercase">
              Hạng {course.licenseType}
            </span>

            <h1 className="text-3xl font-bold">
              {course.courseName}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-sm text-slate-700">
              <div className="bg-white/80 p-3 rounded-xl border border-slate-200">
                <p className="text-slate-500 text-xs">Thời gian</p>
                <p className="font-semibold">{course.durationInWeeks} tuần</p>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-slate-200">
                <p className="text-slate-500 text-xs">Học phí</p>
                <p className="font-semibold text-sky-600">{course.price.toLocaleString()}đ</p>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-slate-200">
                <p className="text-slate-500 text-xs">Cơ sở</p>
                <p className="font-semibold">{course.centerName || "Đang cập nhật"}</p>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-slate-200">
                <p className="text-slate-500 text-xs">Hỗ trợ</p>
                <p className="font-semibold">Trọn gói</p>
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-2">Thông Tin Đăng Ký</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Vui lòng điền thông tin và tải lên các giấy tờ cần thiết để hoàn tất thủ tục.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Notes & Referral */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                Thông Tin Bổ Sung
              </h3>
            </div>

            <div className="flex flex-col gap-2">
               <label className="text-sm font-medium text-slate-600">Mã giới thiệu (nếu có)</label>
               <input
                placeholder="Ví dụ: REF123"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-sky-400 outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-2 md:col-span-2">
               <label className="text-sm font-medium text-slate-600">Ghi chú thêm</label>
               <textarea
                placeholder="Ghi chú về lịch học hoặc yêu cầu khác..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 h-24 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:border-sky-400 outline-none transition resize-none"
              />
            </div>

            {/* Documents Section */}
            <div className="md:col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
                Giấy Tờ Yêu Cầu
              </h3>
              <p className="text-xs text-slate-500 mb-4 italic">
                * Vui lòng tải lên ảnh chụp bản gốc rõ nét. Dung lượng tối đa 5MB/file.
              </p>
            </div>

            {/* Upload Grids */}
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-600">Ảnh chân dung (3x4)</span>
              <label className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer flex flex-col items-center justify-center h-32 bg-slate-50 relative overflow-hidden">
                {docs.photo.file ? (
                  <span className="text-sky-600 font-medium text-xs break-all px-2">{docs.photo.file.name}</span>
                ) : (
                  <>
                    <span className="text-2xl mb-1">📸</span>
                    <span className="text-xs text-slate-500">Tải ảnh chân dung</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'photo')} className="hidden" />
              </label>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-600">CCCD/CMND (Mặt trước)</span>
              <label className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer flex flex-col items-center justify-center h-32 bg-slate-50 relative overflow-hidden">
                 {docs.idFront.file ? (
                  <span className="text-sky-600 font-medium text-xs break-all px-2">{docs.idFront.file.name}</span>
                ) : (
                  <>
                    <span className="text-2xl mb-1">🪪</span>
                    <span className="text-xs text-slate-500">Tải mặt trước</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'idFront')} className="hidden" />
              </label>
            </div>

            <div className="flex flex-col gap-2 md:col-span-2 md:w-1/2">
              <span className="text-sm font-medium text-slate-600">CCCD/CMND (Mặt sau)</span>
              <label className="border border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer flex flex-col items-center justify-center h-32 bg-slate-50 relative overflow-hidden">
                 {docs.idBack.file ? (
                  <span className="text-sky-600 font-medium text-xs break-all px-2">{docs.idBack.file.name}</span>
                ) : (
                  <>
                    <span className="text-2xl mb-1">🪪</span>
                    <span className="text-xs text-slate-500">Tải mặt sau</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'idBack')} className="hidden" />
              </label>
            </div>
          </div>

          {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">{error}</div>}

          {/* terms */}
          <div className="mt-8 pt-4 border-t border-slate-200">
            <label className="flex items-center gap-3 text-sm text-slate-600 cursor-pointer w-fit group">
              <input 
                type="checkbox" 
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 accent-sky-500 rounded border-slate-300 bg-white" 
              />
              <span className="group-hover:text-slate-900 transition">
                Tôi đồng ý với các <span className="text-sky-600 hover:underline">điều khoản và chính sách</span> của trung tâm đào tạo.
              </span>
            </label>
          </div>

          {/* buttons */}
          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition text-sm font-medium"
            >
              Hủy
            </button>

            <button
              type="submit"
              disabled={submitting}
              className={`px-8 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold transition shadow-md shadow-sky-100 flex items-center gap-2 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : "Đăng Ký Ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
