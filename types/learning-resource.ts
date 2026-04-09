// src/types/learning-resource.ts
export type ResourceType = 'Video' | 'Pdf' | 'Link' | 'Slide' | 'Image';

export interface LearningResource {
  id: string;
  title: string;
  type: ResourceType;
  courseId: string;
  courseName: string;
  url: string;
  uploadDate: string;
  isActive?: boolean;
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

// To map backend DTO to frontend model
export interface ResourceLearningDTO {
  id: string;
  courseId: string;
  courseName: string;
  resourceType: number | string; // Can be enum value or name
  title: string;
  resourceUrl: string;
  isActive: boolean;
  createdAt: string;
}