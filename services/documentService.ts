import api from "@/lib/api";
import { DocumentResponse, DocumentRecord, DocumentType } from "@/types/document";

// Define the standard unified API response structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors: string[];
}

/**
 * Maps the backend DocumentResponse to the frontend UI model (DocumentRecord).
 * Infers the DocumentType from the filename as it's not stored on the backend.
 */
const mapToDocumentRecord = (dto: DocumentResponse): DocumentRecord => {
  const name = dto.fileName.toLowerCase();
  let documentType: DocumentType = 'Tài liệu';

  if (name.includes('cccd') || name.includes('cmnd')) documentType = 'CCCD / CMND';
  else if (name.includes('gplx') || name.includes('bang-lai')) documentType = 'Giấy phép Lái xe';
  else if (name.includes('suc-khoe') || name.includes('sk')) documentType = 'Giấy khám Sức khỏe';
  else if (name.includes('chung-chi')) documentType = 'Chứng chỉ nghề';
  else if (name.includes('khac')) documentType = 'Khác';

  return {
    id: dto.id,
    userId: dto.userId,
    documentType: documentType,
    fileName: dto.fileName,
    fileExtension: dto.extension.replace('.', ''),
    fileSize: dto.size,
    fileUrl: dto.fileUrl,
    isVerified: dto.isVerified,
    uploadDate: new Date(dto.createdAt).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  };
};

export const documentService = {
  /**
   * Fetch all documents belonging to the current user.
   */
  getMyDocuments: async (): Promise<DocumentRecord[]> => {
    try {
      const response = await api.get<ApiResponse<DocumentResponse[]>>("/Document");
      return (response.data.data || []).map(mapToDocumentRecord);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      return [];
    }
  },

  /**
   * Upload a new document to Cloudinary and save its reference in the database.
   */
  uploadDocument: async (file: File, resourceType: string = 'raw'): Promise<DocumentRecord | null> => {
    try {
      const formData = new FormData();
      formData.append('File', file);
      formData.append('ResourceType', resourceType);

      const response = await api.post<ApiResponse<DocumentResponse>>("/Document/upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return mapToDocumentRecord(response.data.data);
    } catch (error) {
      console.error("Failed to upload document:", error);
      throw error;
    }
  },

  /**
   * Delete a personal document.
   */
  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`/Document/${id}`);
  }
};
