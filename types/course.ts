// types/course.ts

export type LicenseType = 'A1' | 'B1' | 'B2' | 'C' | string; 

export interface Course {
  id: string;                  // UNIQUEIDENTIFIER
  centerId: string;            // UNIQUEIDENTIFIER
  courseName: string;          // NVARCHAR(255)
  licenseType: LicenseType;    // NVARCHAR(50)
  description: string;         // NVARCHAR(MAX)
  price: number;               // DECIMAL(18,2)
  isActive: boolean;           // BIT
  
  // Audit Logs (Có thể null/undefined khi tạo mới)
  createdAt?: string;          // DATETIME2
  createdBy?: string;          // UNIQUEIDENTIFIER
  updatedAt?: string;          // DATETIME2
  updatedBy?: string;          // UNIQUEIDENTIFIER

  // UI-Specific (Frontend tự gán thêm để render, không gửi xuống DB)
  icon?: string;               
}