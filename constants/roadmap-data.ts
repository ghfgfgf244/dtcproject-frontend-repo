// src/constants/roadmap-data.ts
import { Roadmap, RoadmapStats } from '@/types/roadmap';

export const MOCK_ROADMAP_STATS: RoadmapStats = {
  total: 24,
  totalGrowth: '+12%',
  active: 18,
  completionRate: '87.5%',
  systemAverage: 'Trung bình hệ thống'
};

export const MOCK_ROADMAPS: Roadmap[] = [
  {
    id: 'RM-01',
    code: 'LG',
    title: 'Luật giao thông đường bộ',
    description: 'Hệ thống 600 câu hỏi lý thuyết và các biển báo cơ bản.',
    relatedCourses: 'B2 - Chuyên nghiệp',
    createdAt: '12/10/2023',
    theme: 'blue'
  },
  {
    id: 'RM-02',
    code: 'KT',
    title: 'Kỹ thuật lái xe căn bản',
    description: 'Hướng dẫn vận hành xe, số nóng, số nguội và côn phanh.',
    relatedCourses: 'Tất cả hạng xe',
    createdAt: '15/10/2023',
    theme: 'emerald'
  },
  {
    id: 'RM-03',
    code: 'SH',
    title: 'Sa hình thực tế',
    description: '11 bài thi sát hạch trên sân tiêu chuẩn quốc gia.',
    relatedCourses: 'B1, B2, C',
    createdAt: '18/10/2023',
    theme: 'orange'
  },
  {
    id: 'RM-04',
    code: 'ĐG',
    title: 'Đường trường nâng cao',
    description: 'Kỹ năng xử lý tình huống giao thông đô thị phức tạp.',
    relatedCourses: 'Hạng C, D, E',
    createdAt: '20/10/2023',
    theme: 'purple'
  }
];