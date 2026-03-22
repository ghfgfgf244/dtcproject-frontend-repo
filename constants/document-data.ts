// src/constants/document-data.ts
import { DocumentRecord } from "@/types/document";

// Đưa object default ra đây và export nó
export const DEFAULT_DOCUMENT_FORM: DocumentRecord = {
  userId: '', // Lát nữa Component sẽ ghi đè vào
  documentType: 'CCCD / CMND',
  fileUrl: '',
  fileName: '',
  fileExtension: '',
  fileSize: 0,
  isVerified: false,
};

export const MOCK_DOCUMENT_STATS = {
  verified: 12,
  pending: 2,
  expiring: 1
};

export const MOCK_DOCUMENTS: DocumentRecord[] = [
  {
    id: "doc-uuid-1",
    userId: "usr-101",
    documentType: "CCCD / CMND",
    fileUrl: "/uploads/cccd-mat-truoc.jpg",
    fileName: "CCCD_NguyenVanA_MatTruoc",
    fileExtension: "jpg",
    fileSize: 2548000, // ~2.4 MB
    uploadDate: "12 Thg 10, 2024",
    isVerified: true
  },
  {
    id: "doc-uuid-2",
    userId: "usr-101",
    documentType: "Giấy khám Sức khỏe",
    fileUrl: "/uploads/giay-kham-sk.pdf",
    fileName: "GiayKhamSucKhoe_B2_NVA",
    fileExtension: "pdf",
    fileSize: 1024000, // ~1 MB
    uploadDate: "15 Thg 10, 2024",
    isVerified: false
  },
  {
    id: "doc-uuid-3",
    userId: "usr-102",
    documentType: "Giấy phép Lái xe",
    fileUrl: "/uploads/gplx-a1.png",
    fileName: "GPLX_HangA1_TranThiB",
    fileExtension: "png",
    fileSize: 512000, // ~500 KB
    uploadDate: "01 Thg 11, 2024",
    isVerified: true
  },
  {
    id: "doc-uuid-4",
    userId: "usr-103",
    documentType: "Chứng chỉ nghề",
    fileUrl: "/uploads/chung-chi-sp.pdf",
    fileName: "ChungChiSuPham_LeHuuC",
    fileExtension: "pdf",
    fileSize: 4500000, // ~4.5 MB
    uploadDate: "20 Thg 09, 2024",
    isVerified: true
  },
  {
    id: "doc-uuid-5",
    userId: "usr-104",
    documentType: "Khác",
    fileUrl: "/uploads/don-de-nghi.docx",
    fileName: "DonDeNghiHocVu_PD",
    fileExtension: "docx",
    fileSize: 125000, // ~125 KB
    uploadDate: "05 Thg 11, 2024",
    isVerified: false
  }
];