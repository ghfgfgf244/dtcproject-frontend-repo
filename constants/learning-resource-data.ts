import { LearningResource, ResourceStats } from '@/types/learning-resource';

export const MOCK_RESOURCE_STATS: ResourceStats = {
  totalResources: '1,284',
  growthPercentage: '12%',
  storageUsed: '42.5 GB',
  storagePercentage: 65,
  videoCount: '156',
  videoOptimizedPercentage: '85%',
  downloadCount: '8.9k',
  avgDownloadsPerDay: '250',
};

// FIX: Added missing `courseId` field and fixed invalid type values ('PDF' -> 'Pdf', 'Document' -> 'Link')
export const MOCK_LEARNING_RESOURCES: LearningResource[] = [
  { id: 'RES-01', courseId: 'crs-1', title: 'Video hướng dẫn lùi chuồng', type: 'Video', courseName: 'B2 - Lái xe hạng nhẹ', url: 'drive.google.com/vid-01', uploadDate: '12/10/2023' },
  { id: 'RES-02', courseId: 'crs-2', title: 'PDF 600 câu hỏi luật', type: 'Pdf', courseName: 'Luật giao thông ĐB', url: 'azure-cdn.com/edu/law', uploadDate: '08/10/2023' },
  { id: 'RES-03', courseId: 'crs-3', title: 'Ảnh biển báo cấm', type: 'Image', courseName: 'Biển báo cơ bản', url: 'static.executive.vn/img1', uploadDate: '05/10/2023' },
  { id: 'RES-04', courseId: 'crs-4', title: 'Mô phỏng 120 tình huống', type: 'Video', courseName: 'Thực hành sa hình', url: 'drive.google.com/vid-02', uploadDate: '15/10/2023' },
  { id: 'RES-05', courseId: 'crs-5', title: 'Tài liệu bảo dưỡng xe', type: 'Link', courseName: 'Cấu tạo & Sửa chữa', url: 'azure-cdn.com/doc/fix', uploadDate: '18/10/2023' },
  { id: 'RES-06', courseId: 'crs-6', title: 'Video thi sát hạch B1', type: 'Video', courseName: 'B1 - Lái xe tự động', url: 'drive.google.com/vid-03', uploadDate: '20/10/2023' },
  { id: 'RES-07', courseId: 'crs-7', title: 'Infographic các lỗi thường gặp', type: 'Image', courseName: 'Kinh nghiệm lái xe', url: 'static.executive.vn/img2', uploadDate: '22/10/2023' },
];