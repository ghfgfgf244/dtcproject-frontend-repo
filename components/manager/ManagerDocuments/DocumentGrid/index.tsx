import React from 'react';
import styles from './grid.module.css';
import { FileText, Plus, Eye, Download, Edit, Trash2 } from 'lucide-react';
import { DocumentRecord } from '@/types/document';

interface Props {
  documents: DocumentRecord[];
  onUploadClick: () => void;
  onEdit: (doc: DocumentRecord) => void;
  onDelete: (doc: DocumentRecord) => void;
}
const formatBytes = (bytes: number) => { /* hàm format size như Table */ return (bytes/1024/1024).toFixed(1) + ' MB'; };

export default function DocumentGrid({ documents, onUploadClick, onEdit, onDelete }: Props) {
  return (
    <div className={styles.gridContainer}>
      {documents.map(doc => (
        <div key={doc.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-500/50 transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <FileText className="w-6 h-6" />
            </div>
            {doc.isVerified && <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Verified</span>}
          </div>
          <h4 className="font-bold text-slate-900 mb-1 truncate group-hover:text-blue-600 transition-colors">{doc.fileName}{doc.fileExtension}</h4>
          <div className="flex flex-col gap-1 text-xs text-slate-500 font-medium">
            <span>Uploaded: {doc.uploadDate}</span>
            <span>Size: {formatBytes(doc.fileSize)}</span>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
            <div className="flex gap-2">
               <button className="text-slate-400 hover:text-blue-600" title="View"><Eye className="w-4 h-4" /></button>
               <button className="text-slate-400 hover:text-green-600" title="Download"><Download className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-2 border-l border-slate-200 pl-2">
               <button onClick={() => onEdit(doc)} className="text-slate-400 hover:text-amber-600" title="Edit Metadata"><Edit className="w-4 h-4" /></button>
               <button onClick={() => onDelete(doc)} className="text-slate-400 hover:text-red-600" title="Delete"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      ))}
      
      {/* Nút Upload dạng Card */}
      <div 
        onClick={onUploadClick}
        className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-8 hover:bg-slate-50 hover:border-blue-500 transition-all cursor-pointer group"
      >
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors mb-3">
          <Plus className="w-6 h-6" />
        </div>
        <p className="font-bold text-slate-500 group-hover:text-blue-600 transition-colors">Add Document</p>
      </div>
    </div>
  );
}