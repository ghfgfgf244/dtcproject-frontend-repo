export interface Course {
  id: string; // UNIQUEIDENTIFIER
  centerId: string; // UNIQUEIDENTIFIER
  courseName: string; // NVARCHAR(255)
  licenseType: string; // NVARCHAR(50) - B1, B2, C...
  description: string; // NVARCHAR(MAX)
  price: number; // DECIMAL(18,2)
  isActive: boolean; // BIT
  createdAt?: string; // DATETIME2
  createdBy?: string; // UNIQUEIDENTIFIER
  updatedAt?: string; // DATETIME2
  updatedBy?: string; // UNIQUEIDENTIFIER

  // --- UI Extended Properties ---
  // Những trường này chưa có trong DB nhưng cần cho giao diện hiện tại
  // Bạn có thể cân nhắc thêm vào DB hoặc fetch qua bảng liên kết
  imageUrl?: string;
  duration?: string;
}
