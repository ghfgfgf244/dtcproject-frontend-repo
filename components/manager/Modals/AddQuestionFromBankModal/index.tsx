"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { QuestionBankItem } from "@/types/mock-exam-detail";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddSelected: (selectedQuestions: QuestionBankItem[]) => Promise<void> | void;
  bankQuestions: QuestionBankItem[];
  excludedQuestionIds?: number[];
}

export default function AddQuestionFromBankModal({
  isOpen,
  onClose,
  onAddSelected,
  bankQuestions,
  excludedQuestionIds = [],
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [category, setCategory] = useState("Tat ca");

  const filteredQuestions = useMemo(() => {
    return bankQuestions.filter((question) => {
      if (excludedQuestionIds.includes(question.id)) return false;

      const matchesKeyword =
        searchQuery.trim().length === 0 ||
        question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(question.id).includes(searchQuery.trim());

      const matchesCategory = category === "Tat ca" || question.category === category;

      return matchesKeyword && matchesCategory;
    });
  }, [bankQuestions, category, excludedQuestionIds, searchQuery]);

  if (!isOpen) return null;

  const toggleQuestion = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleAdd = async () => {
    const selected = filteredQuestions.filter((question) => selectedIds.includes(question.id));
    await onAddSelected(selected);
    setSelectedIds([]);
    setSearchQuery("");
    setCategory("Tat ca");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">Chọn câu hỏi từ ngân hàng</h2>
            <p className="mt-1 text-sm text-slate-500">Chọn một hoặc nhiều câu hỏi để thêm vào đề thi thử.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Tìm theo ID hoặc nội dung câu hỏi"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="Tat ca">Tat ca nhom</option>
            <option value="Ly thuyet">Ly thuyet</option>
            <option value="Bien bao">Bien bao</option>
            <option value="Sa hinh">Sa hinh</option>
          </select>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-6 py-5">
          {filteredQuestions.map((question) => (
            <button
              key={question.id}
              type="button"
              onClick={() => toggleQuestion(question.id)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                selectedIds.includes(question.id)
                  ? "border-blue-600 bg-blue-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"
              }`}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  Câu #{question.id}
                </span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  {question.category}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{question.content}</p>
            </button>
          ))}

          {filteredQuestions.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500">
              Không có câu hỏi phù hợp với bộ lọc hiện tại.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-6 py-4">
          <p className="text-sm text-slate-500">
            Đã chọn <strong className="text-slate-900">{selectedIds.length}</strong> câu hỏi
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={selectedIds.length === 0}
              className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Thêm vào đề thi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
