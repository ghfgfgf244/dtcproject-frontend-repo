// src/app/(manager)/training-manager/mock-exams/[id]/_components/Modals/AddQuestionFromBankModal/index.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { X, Search, ChevronDown, Upload, Info } from 'lucide-react';
import { QuestionBankItem } from '@/types/mock-exam-detail';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddSelected: (selectedQuestions: QuestionBankItem[]) => void;
  bankQuestions: QuestionBankItem[];
}

export default function AddQuestionFromBankModal({ isOpen, onClose, onAddSelected, bankQuestions }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterDifficulty, setFilterDifficulty] = useState('Tất cả cấp độ');
  const [filterCategory, setFilterCategory] = useState('Tất cả loại hình');

  // Logic lọc câu hỏi trong ngân hàng
  const filteredBank = useMemo(() => {
    return bankQuestions.filter((q) => {
      // 1. Lọc theo từ khóa (Tìm trong nội dung câu hỏi hoặc ID)
      const matchesSearch = searchQuery === '' || 
        q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Lọc theo độ khó
      const matchesDifficulty = filterDifficulty === 'Tất cả cấp độ' || 
        q.difficulty === filterDifficulty;

      // 3. Lọc theo loại hình (Category)
      const matchesCategory = filterCategory === 'Tất cả loại hình' || 
        q.category === filterCategory;

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [bankQuestions, searchQuery, filterDifficulty, filterCategory]);

  if (!isOpen) return null;

  // Xử lý chọn/bỏ chọn
  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleAdd = () => {
    const selectedItems = bankQuestions.filter(q => selectedIds.has(q.id));
    onAddSelected(selectedItems);
    setSelectedIds(new Set()); // Reset sau khi thêm
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl rounded-xl overflow-hidden border border-slate-200">
        
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-none">Thêm Câu Hỏi Từ Ngân Hàng</h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Chọn câu hỏi để thêm vào đề thi thử</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TOOLBAR */}
        <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4 shrink-0">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Tìm kiếm câu hỏi theo từ khóa..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:ring-2 focus:ring-blue-600 rounded-lg text-sm outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <select 
              className="w-full py-2 border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-600 rounded-lg outline-none px-3 cursor-pointer font-medium"
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="Tất cả cấp độ">Tất cả cấp độ</option>
              <option value="Cơ bản">Cơ bản</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Nâng cao">Nâng cao</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select 
              className="w-full py-2 border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-blue-600 rounded-lg outline-none px-3 cursor-pointer font-medium"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="Tất cả loại hình">Tất cả loại hình</option>
              <option value="Lý thuyết">Câu hỏi lý thuyết</option>
              <option value="Biển báo">Câu hỏi biển báo</option>
              <option value="Sa hình">Câu hỏi sa hình</option>
            </select>
          </div>
        </div>

        {/* CONTENT LIST */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-4 custom-scrollbar">
          {filteredBank.map((q) => (
            <div 
              key={q.id}
              onClick={() => toggleSelect(q.id)}
              className={`bg-white p-4 border rounded-xl transition-all flex gap-4 cursor-pointer group hover:shadow-md ${
                selectedIds.has(q.id) ? 'border-blue-600 ring-1 ring-blue-600' : 'border-slate-200'
              }`}
            >
              <div className="pt-1">
                <input 
                  type="checkbox" 
                  checked={selectedIds.has(q.id)}
                  onChange={() => {}} // Handle by parent div click
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer pointer-events-none"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                    q.difficulty === 'Cơ bản' ? 'bg-emerald-50 text-emerald-600' : 
                    q.difficulty === 'Trung bình' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    ID: {q.id} • {q.difficulty}
                  </span>
                  <span className="text-[10px] font-medium text-slate-400">{q.updatedAt}</span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                   <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 mb-3 leading-relaxed">{q.content}</p>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {q.answers.map(ans => (
                          <div 
                            key={ans.id} 
                            className={`text-xs p-2 rounded border ${ans.isCorrect ? 'bg-blue-50 border-blue-100 text-blue-700 font-medium' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                          >
                            {ans.label}. {ans.content} {ans.isCorrect && '(Đúng)'}
                          </div>
                        ))}
                      </div>
                   </div>
                   {q.imageUrl && (
                     <div className="w-24 h-20 bg-slate-100 rounded border border-slate-200 shrink-0 overflow-hidden">
                        <img src={q.imageUrl} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                     </div>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white shrink-0">
          <div className="text-sm text-slate-600 font-medium">
            Đã chọn <span className="font-black text-blue-600 text-lg">{selectedIds.size}</span> câu hỏi
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={onClose}
              className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors active:scale-95"
            >
              Đóng
            </button>
            <button 
              onClick={handleAdd}
              disabled={selectedIds.size === 0}
              className="flex-1 md:flex-none px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" /> Thêm vào Đề thi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}