// src/app/(manager)/training-manager/mock-exams/[id]/_components/Modals/MockExamQuestionModal/index.tsx
"use client";

import React, { useState } from 'react';
import { X, Info, Upload } from 'lucide-react';
import { ExamQuestion, ExamAnswer } from '@/types/mock-exam-detail';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData: ExamQuestion | null;
  onSubmit: (updatedData: ExamQuestion) => void;
}

export default function MockExamQuestionModal({ isOpen, onClose, initialData, onSubmit }: Props) {
  // State quản lý Form
  const [content, setContent] = useState('');
  const [answers, setAnswers] = useState<ExamAnswer[]>([]);
  const [correctLabel, setCorrectLabel] = useState<string>('A');

  // Kỹ thuật đồng bộ State an toàn (thay thế useEffect)
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  const [prevInitialData, setPrevInitialData] = useState<ExamQuestion | null>(null);

  if (isOpen !== prevIsOpen || initialData !== prevInitialData) {
    setPrevIsOpen(isOpen);
    setPrevInitialData(initialData);
    
    if (isOpen && initialData) {
      setContent(initialData.content);
      setAnswers(initialData.answers);
      const correctAns = initialData.answers.find(a => a.isCorrect);
      setCorrectLabel(correctAns?.label || 'A');
    }
  }

  if (!isOpen || !initialData) return null;

  // Xử lý thay đổi nội dung của một đáp án cụ thể
  const handleAnswerChange = (label: string, newContent: string) => {
    setAnswers(prev => prev.map(ans => 
      ans.label === label ? { ...ans, content: newContent } : ans
    ));
  };

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Cập nhật lại cờ isCorrect cho mảng answers dựa trên correctLabel
    const updatedAnswers = answers.map(ans => ({
      ...ans,
      isCorrect: ans.label === correctLabel
    }));

    const updatedQuestion: ExamQuestion = {
      ...initialData,
      content,
      answers: updatedAnswers
    };

    onSubmit(updatedQuestion);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-slate-200 flex flex-col custom-scrollbar">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-[1.125rem] font-black text-slate-900 leading-none">Chỉnh sửa câu hỏi</h3>
            <p className="text-slate-500 text-[0.75rem] font-bold mt-1 uppercase tracking-wider">
              Mã câu hỏi: {initialData.id}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-1.5 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="p-8 space-y-8">
            
            {/* Question Text */}
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-slate-500 uppercase tracking-widest">Nội dung câu hỏi (Question)</label>
              <textarea 
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all resize-none font-medium leading-relaxed outline-none" 
                rows={3}
              />
            </div>

            {/* Illustration / ImageLink */}
            <div className="space-y-2">
              <label className="text-[0.75rem] font-bold text-slate-500 uppercase tracking-widest">Hình ảnh minh họa (ImageLink)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {initialData.imageUrl ? (
                  <div className="aspect-video bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group relative">
                    <img src={initialData.imageUrl} alt="Minh họa" className="w-full h-full object-contain p-2" />
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold shadow-lg">Thay đổi ảnh</button>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-50 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
                    <p className="text-xs text-slate-400 font-medium">Chưa có hình ảnh</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-700 font-medium flex items-start gap-2">
                      <Info className="w-4 h-4 shrink-0 mt-0.5" />
                      Gợi ý: Sử dụng ảnh .png hoặc .jpg có độ phân giải cao để học viên dễ quan sát.
                    </p>
                  </div>
                  <button type="button" className="w-full border border-slate-200 py-3 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 transition-all active:scale-95">
                    <Upload className="w-4 h-4" /> Tải lên từ thiết bị
                  </button>
                </div>
              </div>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              <label className="text-[0.75rem] font-bold text-slate-500 uppercase tracking-widest">Phương án trả lời</label>
              <div className="grid grid-cols-1 gap-4">
                {answers.map((ans) => (
                  <div key={ans.id} className="flex items-center gap-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-slate-900 text-white font-black flex items-center justify-center rounded-lg shadow-sm">
                      {ans.label}
                    </div>
                    <input 
                      type="text" 
                      required
                      value={ans.content}
                      onChange={(e) => handleAnswerChange(ans.label, e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none font-medium transition-all" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Correct Answer Selection */}
            <div className="space-y-3">
              <label className="text-[0.75rem] font-bold text-slate-500 uppercase tracking-widest">Đáp án đúng (CorrectAnswer)</label>
              <div className="flex flex-wrap gap-3">
                {answers.map((ans) => (
                  <label key={`correct-${ans.label}`} className="flex-1 min-w-[120px] relative cursor-pointer">
                    <input 
                      type="radio" 
                      name="correct_ans" 
                      value={ans.label}
                      checked={correctLabel === ans.label}
                      onChange={() => setCorrectLabel(ans.label)}
                      className="peer sr-only" 
                    />
                    <div className="p-4 rounded-xl border-2 border-slate-100 bg-slate-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all text-center select-none hover:bg-slate-100">
                      <span className={`block text-sm font-black transition-colors ${correctLabel === ans.label ? 'text-blue-700' : 'text-slate-600'}`}>
                        Đáp án {ans.label}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="px-8 py-5 border-t border-slate-100 flex justify-end gap-4 bg-slate-50 sticky bottom-0 z-10 rounded-b-xl">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors active:scale-95">
              Hủy bỏ
            </button>
            <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white text-sm font-black rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all">
              Cập nhật câu hỏi
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}