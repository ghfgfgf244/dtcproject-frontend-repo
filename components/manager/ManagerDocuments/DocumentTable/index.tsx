// src/app/(manager)/training-manager/documents/_components/DocumentTable/index.tsx
import React from 'react';
import { FileText, FileImage, FileCode2, Download, Trash2, Eye, ShieldCheck, ShieldAlert } from 'lucide-react';
import { DocumentRecord } from '@/types/document';

interface Props {
  documents: DocumentRecord[];
  onDownload: (doc: DocumentRecord) => void;
  onView: (doc: DocumentRecord) => void;
  onDelete: (doc: DocumentRecord) => void;
}

// Hàm format Bytes sang KB / MB (Giữ lại vì đây là logic tính toán chuẩn)
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default function DocumentTable({ documents, onDownload, onView, onDelete }: Props) {
  
  const getFileIcon = (ext: string) => {
    const extension = ext.toLowerCase();
    if (['jpg', 'jpeg', 'png'].includes(extension)) return <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center"><FileImage className="w-5 h-5" /></div>;
    if (['doc', 'docx'].includes(extension)) return <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><FileCode2 className="w-5 h-5" /></div>;
    return <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center"><FileText className="w-5 h-5" /></div>;
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <h3 className="text-lg font-bold text-slate-900 mt-4">Không có hồ sơ nào</h3>
        <p className="text-slate-500 text-sm mt-1">Chưa có giấy tờ nào khớp với bộ lọc của bạn.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-200">
              <th className="px-6 py-4">Tên tập tin</th>
              <th className="px-6 py-4">Loại giấy tờ</th>
              <th className="px-6 py-4">Kích thước</th>
              <th className="px-6 py-4">Xác thực</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {getFileIcon(doc.fileExtension)}
                    <div>
                      <p className="text-sm font-bold text-slate-900 line-clamp-1">{doc.fileName}.{doc.fileExtension}</p>
                      <p className="text-[11px] font-medium text-slate-500 mt-0.5">Tải lên: {doc.uploadDate}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-700">
                    {/* Render trực tiếp data tiếng Việt */}
                    {doc.documentType}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {formatBytes(doc.fileSize)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {doc.isVerified ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" /> Đã duyệt
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <ShieldAlert className="w-3.5 h-3.5" /> Chờ duyệt
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onView(doc)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Xem trước">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDownload(doc)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Tải xuống">
                      <Download className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(doc)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}