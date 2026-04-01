// src/types/roadmap.ts
export interface RoadmapStats {
  total: number;
  totalGrowth: string;
  active: number;
  completionRate: string;
  systemAverage: string;
}

export interface Roadmap {
  id: string;
  code: string; // VD: LG, KT, SH
  title: string;
  description: string;
  relatedCourses: string;
  createdAt: string;
  theme: 'blue' | 'emerald' | 'orange' | 'purple';
}