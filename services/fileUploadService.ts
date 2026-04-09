import api from "@/lib/api";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

interface UploadPublicResponse {
  Url?: string;
  url?: string;
  PublicId?: string;
  publicId?: string;
  Version?: string;
  version?: string;
  FileName?: string;
  fileName?: string;
}

export const fileUploadService = {
  async uploadPublic(
    file: File,
    options?: {
      folder?: string;
      resourceType?: "image" | "video" | "raw";
    }
  ): Promise<string> {
    const formData = new FormData();
    formData.append("File", file);
    formData.append("Folder", options?.folder || "public_assets");
    formData.append("ResourceType", options?.resourceType || "raw");

    const response = await api.post<ApiResponse<UploadPublicResponse>>("/File/upload-public", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const payload = response.data.data;
    const url = payload?.Url || payload?.url;

    if (!url) {
      throw new Error("Khong nhan duoc link tep tin sau khi tai len.");
    }

    return url;
  },
};
