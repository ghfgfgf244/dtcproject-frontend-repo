// src/app/(manager)/training-manager/exams/_components/ExamClientView/index.tsx
"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { ExamBatch, Exam } from "@/types/exam";
import { EXAM_TABS } from "@/constants/exam-data";

import ExamBatchTable from "../ExamBatchTable";
import ExamCardList from "../ExamCardList";
import BatchStats from "../BatchStats";
import ExamBatchModal from "../../Modals/ExamBatchModal";
import ExamModal from "../../Modals/ExamModal";

interface Props {
  initialBatches: ExamBatch[];
  initialExams: Exam[];
}

export default function ExamClientView({ initialBatches, initialExams }: Props) {
  // 1. State quản lý UI cơ bản
  const [selectedBatchId, setSelectedBatchId] = useState<string>(initialBatches[0]?.id || "");
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 2. State quản lý Modal Đợt thi (Batch)
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ExamBatch | null>(null);

  // 3. State quản lý Modal Bài thi (Exam)
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);

  // --- HANDLERS CHO ĐỢT THI ---
  const handleCreateBatch = () => {
    setEditingBatch(null); // Null = Create
    setIsBatchModalOpen(true);
  };

  const handleEditBatch = (batch: ExamBatch) => {
    setEditingBatch(batch); // Có data = Edit
    setIsBatchModalOpen(true);
  };

  // --- HANDLERS CHO BÀI THI ---
  const handleCreateExam = () => {
    setEditingExam(null); // Null = Create
    setIsExamModalOpen(true);
  };

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam); // Có data = Edit
    setIsExamModalOpen(true);
  };

  // --- LOGIC LỌC DỮ LIỆU ---
  const filteredBatches = useMemo(() => {
    return initialBatches.filter((batch) => {
      const matchTab = 
        activeTab === 'all' || 
        (activeTab === 'active' && batch.status === 'ACTIVE') ||
        (activeTab === 'upcoming' && batch.status === 'UPCOMING') ||
        (activeTab === 'completed' && batch.status === 'COMPLETED');
      
      const query = searchQuery.toLowerCase();
      const matchSearch = 
        batch.batchName.toLowerCase().includes(query) || 
        batch.courseId.toLowerCase().includes(query);

      return matchTab && matchSearch;
    });
  }, [initialBatches, activeTab, searchQuery]);

  const isSelectedBatchVisible = filteredBatches.some(b => b.id === selectedBatchId);
  const currentBatchId = isSelectedBatchVisible ? selectedBatchId : filteredBatches[0]?.id;
  
  const selectedBatch = initialBatches.find(b => b.id === currentBatchId);
  const currentExams = initialExams.filter(ex => ex.examBatchId === currentBatchId);

  return (
    <>
      <div className="flex flex-col space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Tìm kiếm kỳ thi, đợt thi hoặc khóa học..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button onClick={handleCreateBatch} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-all shrink-0">
            <Plus className="w-4 h-4" /> Tạo đợt thi mới
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 gap-8 overflow-x-auto">
          {EXAM_TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 border-b-2 text-sm font-bold whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bảng Đợt Thi */}
        <ExamBatchTable 
          batches={filteredBatches} 
          selectedId={currentBatchId || ""} 
          onSelect={setSelectedBatchId} 
          onEditClick={handleEditBatch} // Nối hàm Edit Batch
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Danh sách Bài Thi */}
            <ExamCardList 
              batchName={selectedBatch?.batchName} 
              exams={currentExams} 
              onAddClick={handleCreateExam} // Nối hàm Add Exam
              onEditClick={handleEditExam}  // Nối hàm Edit Exam
            />
          </div>
          
          <div className="lg:col-span-1">
            <BatchStats batchName={selectedBatch?.batchName} examCount={currentExams.length} />
          </div>
        </div>
      </div>

      {/* --- RENDER MODALS --- */}
      <ExamBatchModal 
        isOpen={isBatchModalOpen} 
        onClose={() => setIsBatchModalOpen(false)} 
        initialData={editingBatch} 
        onSubmit={(data) => {
          console.log("Đang lưu Đợt thi:", data);
          setIsBatchModalOpen(false);
        }}
      />

      <ExamModal 
        isOpen={isExamModalOpen} 
        onClose={() => setIsExamModalOpen(false)}
        batchContext={{ id: currentBatchId || "", name: selectedBatch?.batchName || "" }}
        initialData={editingExam} 
        onSubmit={(data) => {
          console.log("Đang lưu Bài thi:", data);
          setIsExamModalOpen(false);
        }}
      />
    </>
  );
}