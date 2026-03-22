// src/types/document.ts

export type DocumentType = 'CCCD / CMND' | 'Giấy phép Lái xe' | 'Chứng chỉ nghề' | 'Giấy khám Sức khỏe' | 'Khác';

export interface DocumentRecord {
  id?: string;             // DB: Id (uuid)
  userId: string;          // DB: UserId (uuid) - Biết tài liệu này của ai
  documentType: DocumentType; // DB: DocumentType (nvarchar)
  fileUrl: string;         // DB: FileUrl (nvarchar)
  fileName: string;        // DB: FileName (nvarchar)
  fileExtension: string;   // DB: FileExtension (nvarchar(10))
  fileSize: number;        // DB: FileSize (int) - Lưu theo Bytes
  uploadDate?: string;     // DB: UploadDate (datetime)
  isVerified: boolean;     // DB: IsVerified (bit)
}
// src/types/document.ts

export type DocCategory = 'Giáo trình' | 'Quy định' | 'Biểu mẫu' | 'Khác';
export type DocFormat = 'PDF' | 'DOCX' | 'XLSX' | 'MP4';
