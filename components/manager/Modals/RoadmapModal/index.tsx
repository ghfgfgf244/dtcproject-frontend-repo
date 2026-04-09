import React, { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import { LearningRoadmapItem } from "@/types/course";

export interface RoadmapSubmitData {
  id?: string;
  orderNo: number;
  title: string;
  description: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoadmapSubmitData) => Promise<void>;
  initialData?: LearningRoadmapItem | null;
}

export default function RoadmapModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RoadmapSubmitData>({
    orderNo: 1,
    title: "",
    description: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          id: initialData.id,
          orderNo: initialData.orderNo || 1,
          title: initialData.title || "",
          description: initialData.description || "",
        });
      } else {
        setFormData({
          orderNo: 1,
          title: "",
          description: "",
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-black text-lg text-slate-900 uppercase">
            {initialData ? "Sửa chặng lộ trình" : "Thêm chặng lộ trình"}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Thứ tự</label>
              <input 
                type="number" 
                required 
                min={1}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.orderNo || ""}
                onChange={e => {
                  const val = e.target.value;
                  setFormData({...formData, orderNo: val === "" ? ("" as any) : parseInt(val)});
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Tiêu đề chặng</label>
              <input 
                type="text" 
                required 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1">Mô tả chi tiết</label>
            <textarea 
              required 
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>



          <div className="pt-4 flex justify-end gap-3 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
              Hủy
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 rounded-lg text-white text-sm font-bold hover:bg-blue-700 flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Lưu chặng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}