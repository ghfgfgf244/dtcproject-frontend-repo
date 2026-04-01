// src/types/learning-resource.ts
export type ResourceType = 'Video' | 'PDF' | 'Image' | 'Document';

export interface LearningResource {
  id: string;
  title: string;
  type: ResourceType;
  courseName: string;
  url: string;
  uploadDate: string;
}

export interface ResourceStats {
  totalResources: string;
  growthPercentage: string;
  storageUsed: string;
  storagePercentage: number;
  videoCount: string;
  videoOptimizedPercentage: string;
  downloadCount: string;
  avgDownloadsPerDay: string;
}