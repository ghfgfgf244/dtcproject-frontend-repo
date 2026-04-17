// src/app/(manager)/training-manager/mock-exams/[id]/_components/QuestionCard/index.tsx
import React from "react";
import { Trash2, CheckCircle2, Edit3, TriangleAlert } from "lucide-react";
import { ExamQuestion } from "@/types/mock-exam-detail";

interface Props {
  question: ExamQuestion;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function QuestionCard({ question, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:border-blue-300 transition-colors group">
      <div className="flex flex-col md:flex-row">
        {/* Số thứ tự */}
        <div className="md:w-16 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 flex items-center justify-center font-black text-slate-400 text-lg py-3 md:py-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
          {String(question.order).padStart(2, "0")}
        </div>

        {/* Nội dung câu hỏi */}
        <div className="flex-1 p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4 gap-4">
                <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                  {question.content}
                </p>
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                    <TriangleAlert className="h-3.5 w-3.5" />
                    Sai {question.wrongAttemptCount ?? 0} lần
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(question.id)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white shadow-sm border border-transparent hover:border-blue-200 rounded-md transition-all bg-transparent"
                    title="Chỉnh sửa câu hỏi"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(question.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-white shadow-sm border border-transparent hover:border-red-200 rounded-md transition-all bg-transparent"
                    title="Xóa câu hỏi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {question.answers.map((answer) => (
                  <div
                    key={answer.id}
                    className={`p-3 rounded-lg text-xs border transition-all flex items-center justify-between ${
                      answer.isCorrect
                        ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
                        : "bg-slate-50 border-transparent text-slate-600 hover:border-slate-200 cursor-default"
                    }`}
                  >
                    <span>
                      <span
                        className={`font-bold mr-2 ${answer.isCorrect ? "text-blue-700" : "text-slate-900"}`}
                      >
                        {answer.label}.
                      </span>
                      {answer.content}
                    </span>
                    {answer.isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Cột Hình ảnh (Đã được CSS lại để không bao giờ bị tràn) */}
            {question.imageUrl && (
              <div className="lg:w-64 xl:w-80 shrink-0">
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-center h-48">
                  <img
                    src={question.imageUrl}
                    alt="Question image"
                    className="max-w-full max-h-full object-contain rounded"
                  />
                </div>
                {question.explanation && (
                  <p className="text-[10px] text-center text-slate-400 mt-2 italic">
                    {question.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
