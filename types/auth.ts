// d:\Project_Sample\driving-training-centers-project-v1\repo-frontend\dtcproject\types\auth.ts

export interface SyncUserRequest {
  clerkId: string;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  role?: string;
  centerId?: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
  fullName: string;
  token: string;
  role: string;  // e.g. "Student", "Instructor", "Admin"...
}
