// src/types/post.ts
export type PostStatus = 'Đang hiển thị' | 'Bản nháp' | 'Đã ẩn';
export type LicenseCategory = 'Hạng B1' | 'Hạng B2' | 'Hạng C';

export interface PostRecord {
  id: string;
  title: string;
  code: string;
  image: string;
  category: LicenseCategory;
  publishedDate: string;
  views: number;
  registrations: number;
  status: PostStatus;
}

export interface PostKPIs {
  totalActive: number;
  activeGrowth: string;
  totalRegistrations: number;
  regGrowth: string;
  avgConversion: number;
  conversionGrowth: string;
}

export interface PostFormData {
  id?: string;
  title: string;
  category: string;
  summary: string;
  content: string; // Nội dung HTML từ Rich Text Editor
  isPublished: boolean; // Trạng thái Công khai / Bản nháp
}