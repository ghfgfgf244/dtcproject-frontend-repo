"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { fileUploadService } from "@/services/fileUploadService";
import { ExamQuestion, QuestionCategory, QuestionFormData } from "@/types/mock-exam-detail";
import { toast } from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: ExamQuestion | null;
  onSubmit: (data: QuestionFormData) => Promise<void> | void;
}

const CATEGORIES: QuestionCategory[] = ["Ly thuyet", "Bien bao", "Sa hinh"];

function mapInitialData(question: ExamQuestion | null): QuestionFormData {
  const answer = (label: "A" | "B" | "C" | "D") =>
    question?.answers.find((item) => item.label === label)?.content || "";

  const correctLabel = question?.answers.find((item) => item.isCorrect)?.label || "A";
  const correctAnswer = correctLabel === "A" ? 1 : correctLabel === "B" ? 2 : correctLabel === "C" ? 3 : 4;

  return {
    category: question?.category || "Ly thuyet",
    content: question?.content || "",
    answerA: answer("A"),
    answerB: answer("B"),
    answerC: answer("C"),
    answerD: answer("D"),
    correctAnswer,
    imageLink: question?.imageUrl || "",
    explanation: question?.explanation || "",
  };
}

export default function MockExamQuestionModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  const [form, setForm] = useState<QuestionFormData>(mapInitialData(initialData));
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setForm(mapInitialData(initialData));
    setSelectedImage(null);
    setSubmitting(false);
    setUploadingImage(false);
  }, [initialData, isOpen]);

  const isEditing = useMemo(() => Boolean(initialData), [initialData]);

  if (!isOpen) return null;

  const setField = <K extends keyof QuestionFormData>(key: K, value: QuestionFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const imagePreview = selectedImage ? URL.createObjectURL(selectedImage) : form.imageLink || "";

  const uploadSelectedImage = async () => {
    if (!selectedImage) {
      toast.error("Vui long chon hinh anh tu may tinh.");
      return;
    }

    try {
      setUploadingImage(true);
      const uploadedUrl = await fileUploadService.uploadPublic(selectedImage, {
        folder: "question_images",
        resourceType: "image",
      });
      setField("imageLink", uploadedUrl);
      setSelectedImage(null);
      toast.success("Da tai hinh anh len thanh cong.");
    } catch (error) {
      console.error("Failed to upload question image:", error);
      toast.error("Khong the tai hinh anh len.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      let payload = form;

      if (selectedImage && !form.imageLink) {
        const uploadedUrl = await fileUploadService.uploadPublic(selectedImage, {
          folder: "question_images",
          resourceType: "image",
        });
        payload = { ...form, imageLink: uploadedUrl };
      }

      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-4xl items-center justify-center py-4">
        <div className="flex max-h-[calc(100vh-48px)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="shrink-0 border-b border-slate-100 px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  {isEditing ? "Chinh sua cau hoi" : "Them cau hoi moi"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Nhap day du noi dung, dap an va nhom cau hoi de luu vao ngan hang de.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nhom cau hoi</label>
                  <select
                    value={form.category}
                    onChange={(event) => setField("category", event.target.value as QuestionCategory)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Dap an dung</label>
                  <select
                    value={form.correctAnswer}
                    onChange={(event) => setField("correctAnswer", Number(event.target.value) as QuestionFormData["correctAnswer"])}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value={1}>1 - Dap an A</option>
                    <option value={2}>2 - Dap an B</option>
                    <option value={3}>3 - Dap an C</option>
                    <option value={4}>4 - Dap an D</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Noi dung cau hoi</label>
                <textarea
                  value={form.content}
                  onChange={(event) => setField("content", event.target.value)}
                  rows={4}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Dap an A</label>
                  <input value={form.answerA || ""} onChange={(event) => setField("answerA", event.target.value)} required={form.correctAnswer === 1} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Dap an B</label>
                  <input value={form.answerB || ""} onChange={(event) => setField("answerB", event.target.value)} required={form.correctAnswer === 2} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Dap an C</label>
                  <input value={form.answerC || ""} onChange={(event) => setField("answerC", event.target.value)} required={form.correctAnswer === 3} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Dap an D</label>
                  <input value={form.answerD || ""} onChange={(event) => setField("answerD", event.target.value)} required={form.correctAnswer === 4} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Hinh anh cau hoi</label>
                    <input
                      value={form.imageLink || ""}
                      onChange={(event) => setField("imageLink", event.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      placeholder="Dan link hinh anh hoac tai file tu may tinh"
                    />
                  </div>

                  <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 p-5 text-center transition hover:bg-blue-50">
                    <ImagePlus className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                    <p className="text-sm font-bold text-blue-700">Chon hinh anh local</p>
                    <p className="mt-1 text-xs text-slate-500">Ho tro JPG, PNG, WEBP. File se duoc tai len Cloudinary.</p>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(event) => setSelectedImage(event.target.files?.[0] || null)}
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-3">
                    {selectedImage && <span className="text-xs font-medium text-slate-600">Da chon: {selectedImage.name}</span>}
                    <button
                      type="button"
                      onClick={uploadSelectedImage}
                      disabled={!selectedImage || uploadingImage}
                      className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Tai hinh len ngay
                    </button>
                    {form.imageLink && (
                      <button
                        type="button"
                        onClick={() => setField("imageLink", "")}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                      >
                        Xoa link anh
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700">Giai thich</label>
                  <textarea
                    value={form.explanation || ""}
                    onChange={(event) => setField("explanation", event.target.value)}
                    rows={5}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Xem truoc hinh anh</p>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview question" className="h-44 w-full rounded-xl object-contain bg-white" />
                    ) : (
                      <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-sm text-slate-400">
                        Chua co hinh anh
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-white px-6 py-4">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Huy
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploadingImage}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {submitting ? "Dang luu..." : isEditing ? "Cap nhat cau hoi" : "Luu cau hoi"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
