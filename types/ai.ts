export interface AiSource {
  title: string;
  snippet: string;
  sourceType: string;
  referenceId?: string | null;
}

export interface AiChatRequest {
  prompt: string;
  scope?: string;
  metadata?: Record<string, string>;
}

export interface AiChatResponse {
  answer: string;
  model: string;
  fromCache: boolean;
  sources: AiSource[];
}

export interface AiChatPanelResult {
  answer: string;
  model?: string;
  sources?: AiSource[];
  suggestedTopics?: string[];
}

export interface CourseAdvisorRequest {
  desiredLicenseLevel?: string;
  preferredDistrict?: string;
  preferredSchedule?: string;
  needNearestCenter?: boolean;
  needEarliestExam?: boolean;
}

export interface CourseAdvisorSuggestion {
  courseId?: string | null;
  centerId?: string | null;
  termId?: string | null;
  examBatchId?: string | null;
  courseName: string;
  licenseType: string;
  price?: number | null;
  centerName: string;
  centerAddress: string;
  termName?: string | null;
  termStartDate?: string | null;
  termEndDate?: string | null;
  remainingTermSeats?: number | null;
  examBatchName?: string | null;
  examDate?: string | null;
  examAddressName?: string | null;
  title: string;
  summary: string;
  reason: string;
}

export interface CourseAdvisorResponse {
  message: string;
  model: string;
  suggestions: CourseAdvisorSuggestion[];
}

export interface TheoryAssistantRequest {
  question: string;
  examLevel?: string;
  category?: string;
  includeStudyTips?: boolean;
}

export interface TheoryAssistantResponse {
  answer: string;
  model: string;
  sources: AiSource[];
  suggestedTopics: string[];
}

export interface DashboardInsightRequest {
  role: string;
  contextJson?: string;
}

export interface DashboardInsightResponse {
  summary: string;
  model: string;
  highlights: string[];
  alerts: string[];
}
