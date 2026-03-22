// src/app/(manager)/training-manager/exams/_components/ExamCardList/index.tsx
import React from 'react';
import styles from './list.module.css';
import { Calendar, Clock, Plus } from 'lucide-react';
import { Exam } from '@/types/exam';

interface Props {
  batchName: string | undefined;
  exams: Exam[];
  onAddClick: () => void;
  onEditClick: (exam: Exam) => void;
}

export default function ExamCardList({ batchName, exams, onAddClick, onEditClick }: Props) {
  return (
    <section className={styles.listWrapper}>
      <div className="p-6 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          Kỳ thi của {batchName || "Đợt thi đã chọn"}
        </h3>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-1 bg-slate-100 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-200 transition-colors"
        >
          <Plus className="w-4 h-4" /> Thêm kỳ thi
        </button>
      </div>
      
      <div className={styles.gridContainer}>
        {exams.length === 0 ? (
          <p className="text-sm text-slate-500 italic col-span-full">Chưa có kỳ thi nào được lên lịch cho đợt này.</p>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-3 hover:shadow-sm transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">ID: {exam.id}</p>
                  <h4 className="text-sm font-bold text-slate-900">{exam.examName}</h4>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  exam.examType === 'ONLINE' || exam.examType === 'Theory' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {exam.examType}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" /> {exam.examDate}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" /> {exam.durationMinutes} Phút
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <button 
                  onClick={() => onEditClick(exam)}
                  className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded shadow-sm hover:bg-slate-50 transition-colors"
                >
                  Chỉnh sửa
                </button>
                <button className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded shadow-sm hover:bg-slate-50 transition-colors">
                  Đề thi
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}