// src/app/(manager)/training-manager/mock-exams/[id]/_components/ExamHeaderInfo/index.tsx
import React from 'react';
import { ClipboardList, Timer, HelpCircle, ArrowUpDown, PlusCircle } from 'lucide-react';
import { MockExamDetailInfo } from '@/types/mock-exam-detail';

interface Props {
  info: MockExamDetailInfo;
  onAddClick: () => void;
}

export default function ExamHeaderInfo({ info, onAddClick }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
          <ClipboardList className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{info.title}</h1>
          <div className="flex flex-wrap gap-3 items-center">
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Độ khó: {info.difficulty}
            </span>
            <span className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Khóa học: {info.course}
            </span>
            <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5 ml-2">
              <Timer className="w-4 h-4" /> {info.durationMinutes} Phút
            </span>
            <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4" /> {info.totalQuestions} Câu hỏi
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3 shrink-0">
        <button className="flex items-center gap-2 border border-slate-200 text-slate-600 px-4 py-2.5 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all active:scale-95">
          <ArrowUpDown className="w-4 h-4" /> Thay đổi thứ tự
        </button>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-xs font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4" /> Thêm câu hỏi từ ngân hàng
        </button>
      </div>
    </div>
  );
}