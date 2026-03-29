// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\types\document.ts

export interface DocumentResponse {
  id: string;
  userId: string;
  resourceType: string;
  providerPublicId: string;
  version: string;
  fileName: string;
  extension: string;
  size: number;
  isVerified: boolean;
  fileUrl: string;
  createdAt: string;
}

export type DocumentType = 'CCCD / CMND' | 'Giấy phép Lái xe' | 'Giấy khám Sức khỏe' | 'Chứng chỉ nghề' | 'Khác' | 'Tài liệu';

export interface DocumentRecord {
  id: string;
  userId: string;
  documentType: DocumentType;
  fileName: string;
  fileExtension: string;
  fileSize: number;
  fileUrl: string;
  isVerified: boolean;
  uploadDate: string;
}

export interface DocumentUploadResponse {
  success: boolean;
  data: DocumentResponse;
}
