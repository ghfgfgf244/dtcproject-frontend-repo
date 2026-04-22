"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { courseService } from "@/services/courseService";
import { registrationService } from "@/services/registrationService";
import { documentService } from "@/services/documentService";
import {
  collaboratorService,
  ReferralCodeValidationResponse,
} from "@/services/collaboratorService";
import { setAuthToken } from "@/lib/api";
import { Course } from "@/types/course";

type UploadState = {
  file: File | null;
  existingUrl?: string;
  status: "idle" | "loading" | "success" | "error";
};

type DocsState = {
  photo: UploadState;
  idFront: UploadState;
  idBack: UploadState;
};

export default function RegisterPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralPreview, setReferralPreview] =
    useState<ReferralCodeValidationResponse | null>(null);
  const [validatingReferral, setValidatingReferral] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [docs, setDocs] = useState<DocsState>({
    photo: { file: null, status: "idle" },
    idFront: { file: null, status: "idle" },
    idBack: { file: null, status: "idle" },
  });

  const formattedPrice = useMemo(
    () => (course ? new Intl.NumberFormat("vi-VN").format(course.price) : ""),
    [course],
  );

  const referralDiscountAmount = useMemo(() => {
    if (!course || !referralPreview?.isValid) return 0;
    return Math.round(course.price * (referralPreview.discountRate / 100));
  }, [course, referralPreview]);

  const finalPrice = useMemo(() => {
    if (!course) return 0;
    return Math.max(course.price - referralDiscountAmount, 0);
  }, [course, referralDiscountAmount]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await getToken();
        setAuthToken(token ?? null);

        const data = await courseService.getCourseById(courseId);
        setCourse(data);

        if (!isSignedIn) {
          return;
        }

        const myDocs = await documentService.getMyDocuments();
        const sortedDocs = [...myDocs].sort(
          (a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
        );

        const findDoc = (keywords: string[]) =>
          sortedDocs.find((doc) =>
            keywords.some((keyword) =>
              doc.fileName.toLowerCase().includes(keyword.toLowerCase()),
            ),
          );

        const existingPhoto = findDoc(["photo", "avatar", "profile", "chan dung"]);
        const existingFront = findDoc(["front", "mat truoc", "id_front", "truoc"]);
        const existingBack = findDoc(["back", "mat sau", "id_back", "sau"]);

        setDocs((prev) => ({
          photo: {
            ...prev.photo,
            existingUrl: existingPhoto?.fileUrl,
            status: existingPhoto ? "success" : "idle",
          },
          idFront: {
            ...prev.idFront,
            existingUrl: existingFront?.fileUrl,
            status: existingFront ? "success" : "idle",
          },
          idBack: {
            ...prev.idBack,
            existingUrl: existingBack?.fileUrl,
            status: existingBack ? "success" : "idle",
          },
        }));
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Không thể tải thông tin khóa học. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId, getToken, isSignedIn]);

  const handleValidateReferralCode = async (rawCode: string) => {
    const normalizedCode = rawCode.trim();
    if (!normalizedCode) {
      setReferralPreview(null);
      return;
    }

    try {
      setValidatingReferral(true);
      const preview = await collaboratorService.validateReferralCode(normalizedCode, courseId);
      setReferralPreview(preview);
    } catch (validationError) {
      console.error("Referral validation error:", validationError);
      setReferralPreview({
        isValid: false,
        discountRate: 5,
        commissionRate: 5,
        message: "Không thể kiểm tra mã giới thiệu lúc này.",
      });
    } finally {
      setValidatingReferral(false);
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: keyof DocsState,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setDocs((prev) => ({
      ...prev,
      [type]: { ...prev[type], file, status: "success" },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!course) return;

    if (!agreed) {
      setError("Bạn cần đồng ý với điều khoản trước khi đăng ký.");
      return;
    }

    if (referralCode.trim() && referralPreview && !referralPreview.isValid) {
      setError("Mã giới thiệu không hợp lệ hoặc đã ngừng hoạt động.");
      return;
    }

    setSubmitting(true);
    setError(null);

    if (!isSignedIn) {
      const missingIdentity: string[] = [];
      if (!fullName.trim()) missingIdentity.push("Họ và tên");
      if (!email.trim()) missingIdentity.push("Email");
      if (!phone.trim()) missingIdentity.push("Số điện thoại");

      if (missingIdentity.length > 0) {
        setError(`Vui lòng nhập đầy đủ: ${missingIdentity.join(", ")}`);
        setSubmitting(false);
        return;
      }
    }

    const missingDocs: string[] = [];
    if (!docs.photo.file && !docs.photo.existingUrl) missingDocs.push("Ảnh chân dung");
    if (!docs.idFront.file && !docs.idFront.existingUrl) missingDocs.push("CCCD mặt trước");
    if (!docs.idBack.file && !docs.idBack.existingUrl) missingDocs.push("CCCD mặt sau");

    if (missingDocs.length > 0) {
      setError(`Vui lòng cung cấp đầy đủ: ${missingDocs.join(", ")}`);
      setSubmitting(false);
      return;
    }

    try {
      const token = await getToken();
      setAuthToken(token ?? null);

      const formData = new FormData();
      formData.append("CourseId", course.id);
      formData.append("TotalFee", finalPrice.toString());

      if (!isSignedIn) {
        formData.append("FullName", fullName.trim());
        formData.append("Email", email.trim());
        formData.append("Phone", phone.trim());
      }

      if (notes.trim()) formData.append("Notes", notes.trim());
      if (referralCode.trim()) formData.append("ReferralCode", referralCode.trim());
      if (docs.photo.file) formData.append("Photo", docs.photo.file);
      if (docs.idFront.file) formData.append("IdFront", docs.idFront.file);
      if (docs.idBack.file) formData.append("IdBack", docs.idBack.file);

      const registration = await registrationService.registerCourse(formData);

      const placementNotice = registration?.placementMessage?.trim()
        ? registration.placementMessage.trim()
        : registration?.suggestedTermName
          ? `Dự kiến hệ thống sẽ xếp bạn vào kỳ ${registration.suggestedTermName}. Nếu kỳ hiện tại đã đủ chỗ, trung tâm sẽ ưu tiên kỳ tiếp theo phù hợp cho bạn.`
          : "Nếu kỳ hiện tại đã đủ chỗ, trung tâm sẽ ưu tiên xếp bạn vào kỳ tiếp theo phù hợp.";

      setSuccessMessage(placementNotice);
      setReferralCode("");
    } catch (err: any) {
      console.error("Submit error:", err);
      const message =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        err.message ||
        "Đã xảy ra lỗi khi đăng ký khóa học.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderUploadCard = (
    label: string,
    type: keyof DocsState,
    placeholder: string,
    previewAlt: string,
  ) => {
    const state = docs[type];
    const previewUrl = state.file ? URL.createObjectURL(state.file) : state.existingUrl;

    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-600">{label}</span>
        <label className="group relative flex h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center transition hover:bg-slate-100">
          {previewUrl ? (
            <div className="relative h-full w-full">
              <img src={previewUrl} className="h-full w-full object-contain" alt={previewAlt} />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="rounded-full bg-sky-600 px-3 py-1 text-xs font-bold text-white">
                  Thay đổi ảnh
                </span>
              </div>
            </div>
          ) : (
            <>
              <span className="mb-1 text-2xl">📄</span>
              <span className="text-xs text-slate-500">{placeholder}</span>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e, type)}
            className="hidden"
          />
        </label>
      </div>
    );
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Đang tải...</div>;
  }

  if (!course) {
    return <div className="flex min-h-screen items-center justify-center">Không tìm thấy khóa học</div>;
  }

  return (
    <>
      <div className="flex min-h-screen justify-center bg-white p-6 text-slate-900">
        <div className="w-full max-w-5xl space-y-8">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img
              src={course.thumbnailUrl || "/CourseImage.jpg"}
              className="h-56 w-full object-cover opacity-70"
              alt={course.courseName}
            />

            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-white/80 p-6">
              <span className="mb-2 w-fit rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase text-sky-700">
                Hạng {course.licenseType}
              </span>

              <h1 className="text-3xl font-bold">{course.courseName}</h1>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-slate-700 md:grid-cols-4">
                <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
                  <p className="text-xs text-slate-500">Thời gian</p>
                  <p className="font-semibold">{course.durationInWeeks} tuần</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
                  <p className="text-xs text-slate-500">Học phí gốc</p>
                  <p className="font-semibold text-sky-600">{formattedPrice} đ</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
                  <p className="text-xs text-slate-500">Cơ sở</p>
                  <p className="font-semibold">{course.centerName || "Đang cập nhật"}</p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white/80 p-3">
                  <p className="text-xs text-slate-500">Ưu đãi referral</p>
                  <p className="font-semibold text-emerald-600">Giảm 5%</p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
          >
            <h2 className="mb-2 text-2xl font-semibold">Thông tin đăng ký</h2>
            <p className="mb-6 text-sm text-slate-500">
              Vui lòng điền thông tin và tải lên các giấy tờ cần thiết để hoàn tất thủ tục.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {!isSignedIn ? (
                <>
                  <div className="md:col-span-2">
                    <h3 className="mb-4 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wider text-sky-600">
                      Thông tin học viên
                    </h3>
                    <p className="mb-4 text-xs text-slate-500">
                      Bạn chưa đăng nhập. Hệ thống sẽ tạo hồ sơ học viên nội bộ từ thông tin bên dưới
                      để lưu đăng ký và giấy tờ của bạn.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-600">Họ và tên</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-slate-600">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ban@email.com"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400"
                    />
                  </div>

                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-600">Số điện thoại</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09xxxxxxxx"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400"
                    />
                  </div>
                </>
              ) : null}

              <div className="md:col-span-2">
                <h3 className="mb-4 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wider text-sky-600">
                  Thông tin bổ sung
                </h3>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-600">Mã giới thiệu (nếu có)</label>
                <input
                  placeholder="Ví dụ: REF123"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  onBlur={(e) => handleValidateReferralCode(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400"
                />
                {validatingReferral ? (
                  <p className="text-xs text-slate-500">Đang kiểm tra mã giới thiệu...</p>
                ) : null}
                {referralPreview?.isValid ? (
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                    Mã hợp lệ, thuộc về cộng tác viên <strong>{referralPreview.collaboratorName}</strong>.
                    Bạn được giảm <strong>{referralPreview.discountRate}%</strong> học phí.
                  </div>
                ) : null}
                {!validatingReferral && referralCode.trim() && referralPreview && !referralPreview.isValid ? (
                  <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                    {referralPreview.message || "Mã giới thiệu không hợp lệ hoặc đã ngừng hoạt động."}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-600">Ghi chú thêm</label>
                <textarea
                  placeholder="Ghi chú về lịch học hoặc yêu cầu khác..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="h-24 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400"
                />
              </div>

              <div className="md:col-span-2">
                <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">Tổng hợp học phí</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <div className="flex items-center justify-between">
                      <span>Học phí gốc</span>
                      <strong>{formattedPrice} đ</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Giảm giá theo mã cộng tác viên</span>
                      <strong className="text-emerald-600">
                        -{new Intl.NumberFormat("vi-VN").format(referralDiscountAmount)} đ
                      </strong>
                    </div>
                    <div className="flex items-center justify-between border-t border-sky-100 pt-2 text-base">
                      <span className="font-semibold text-slate-900">Học phí cần thanh toán</span>
                      <strong className="text-sky-600">
                        {new Intl.NumberFormat("vi-VN").format(finalPrice)} đ
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:col-span-2">
                <h3 className="mb-4 border-b border-slate-200 pb-2 text-sm font-semibold uppercase tracking-wider text-sky-600">
                  Giấy tờ yêu cầu
                </h3>
                <p className="mb-4 text-xs italic text-slate-500">
                  Vui lòng tải lên ảnh chụp bản gốc rõ nét. Dung lượng tối đa 5MB mỗi tệp.
                </p>
              </div>

              {renderUploadCard("Ảnh chân dung (3x4)", "photo", "Tải ảnh chân dung", "Ảnh chân dung")}
              {renderUploadCard("CCCD/CMND (Mặt trước)", "idFront", "Tải mặt trước", "CCCD mặt trước")}

              <div className="md:col-span-2 md:w-1/2">
                {renderUploadCard("CCCD/CMND (Mặt sau)", "idBack", "Tải mặt sau", "CCCD mặt sau")}
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <div className="mt-8 border-t border-slate-200 pt-4">
              <label className="group flex w-fit cursor-pointer items-center gap-3 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 bg-white accent-sky-500"
                />
                <span className="transition group-hover:text-slate-900">
                  Tôi đồng ý với các{" "}
                  <span className="text-sky-600 hover:underline">điều khoản và chính sách</span> của
                  trung tâm đào tạo.
                </span>
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="rounded-xl border border-slate-200 px-6 py-2 text-sm font-medium transition hover:bg-slate-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={submitting}
                className={`flex items-center gap-2 rounded-xl bg-sky-600 px-8 py-2 font-semibold text-white shadow-md shadow-sky-100 transition hover:bg-sky-700 ${
                  submitting ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {submitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Đang xử lý...
                  </>
                ) : (
                  "Đăng ký ngay"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {successMessage ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] border border-sky-100 bg-white p-6 shadow-2xl shadow-sky-100/40">
            <div className="mb-5 flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl text-emerald-700">
                ✓
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-sky-600">
                  Đăng ký thành công
                </p>
                <h3 className="mt-2 text-2xl font-black text-slate-900">
                  Hồ sơ của bạn đã được ghi nhận
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Trung tâm đã nhận thông tin đăng ký khóa học. Bạn có thể theo dõi trạng thái duyệt
                  trong khu vực khóa học của mình sau khi đăng nhập.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-700">
                  Thông tin dự kiến xếp kỳ
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{successMessage}</p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">
                  Học phí áp dụng
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Học phí cuối cùng của bạn là{" "}
                  <strong>{new Intl.NumberFormat("vi-VN").format(finalPrice)} đ</strong>
                  {referralPreview?.isValid
                    ? ` sau khi áp dụng mã giới thiệu của ${referralPreview.collaboratorName}.`
                    : "."}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setSuccessMessage(null)}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
              >
                Ở lại trang này
              </button>
              <button
                type="button"
                onClick={() => router.push("/courses")}
                className="rounded-2xl bg-sky-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-100 transition hover:bg-sky-700"
              >
                Về danh sách khóa học
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
