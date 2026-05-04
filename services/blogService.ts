import api from "@/lib/api";

export interface Blog {
  id: string;
  title: string;
  avatar?: string;
  categoryId: number;
  categoryName?: string;
  summary?: string;
  content: string;
  status: boolean;
  createdAt: string;
  updatedAt?: string;
  authorName: string;
  authorAvatar?: string;
}

export interface BlogPage {
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  items: Blog[];
}

export interface CreateBlogRequest {
  title: string;
  categoryId: number;
  content: string;
  summary?: string;
  avatar?: string;
  status?: boolean;
}

export interface UpdateBlogRequest {
  title?: string;
  categoryId?: number;
  content?: string;
  summary?: string;
  avatar?: string;
  status?: boolean;
}

const DEFAULT_CATEGORY_ID = 1;

export const blogService = {
  async create(data: CreateBlogRequest): Promise<Blog | null> {
    try {
      const response = await api.post<{ data: Blog }>("/Blog", {
        title: data.title,
        categoryId: data.categoryId || DEFAULT_CATEGORY_ID,
        content: data.content,
        avatar: data.avatar,
        summary: data.summary,
        status: data.status ?? true,
      });
      return response.data.data;
    } catch (error) {
      console.error("Failed to create blog:", error);
      throw error;
    }
  },

  async getAll(onlyPublished = false): Promise<Blog[]> {
    try {
      const response = await api.get<{ data: Blog[] }>("/Blog", {
        params: { onlyPublished },
      });
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
      return [];
    }
  },

  async getPaged(options?: {
    onlyPublished?: boolean;
    pageNumber?: number;
    pageSize?: number;
    searchTerm?: string;
    categoryName?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<BlogPage> {
    try {
      const response = await api.get<{
        data: {
          pageNumber: number;
          pageSize: number;
          totalItems: number;
          totalPages: number;
          items: Blog[];
        };
      }>("/Blog/paged", {
        params: {
          onlyPublished: options?.onlyPublished ?? false,
          pageNumber: options?.pageNumber ?? 1,
          pageSize: options?.pageSize ?? 10,
          searchTerm: options?.searchTerm?.trim() || undefined,
          categoryName: options?.categoryName?.trim() || undefined,
          startDate: options?.startDate || undefined,
          endDate: options?.endDate || undefined,
        },
      });

      const payload = response.data.data;
      return {
        pageNumber: payload?.pageNumber ?? 1,
        pageSize: payload?.pageSize ?? options?.pageSize ?? 10,
        totalItems: payload?.totalItems ?? 0,
        totalPages: payload?.totalPages ?? 0,
        items: payload?.items ?? [],
      };
    } catch (error) {
      console.error("Failed to fetch paged blogs:", error);
      return {
        pageNumber: options?.pageNumber ?? 1,
        pageSize: options?.pageSize ?? 10,
        totalItems: 0,
        totalPages: 0,
        items: [],
      };
    }
  },

  async getByUserId(userId: string): Promise<Blog[]> {
    try {
      const response = await api.get<{ data: Blog[] }>(`/Blog/user/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch blogs by user:", error);
      return [];
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/Blog/${id}`);
    } catch (error) {
      console.error("Failed to delete blog:", error);
      throw error;
    }
  },

  async update(id: string, data: UpdateBlogRequest): Promise<Blog | null> {
    try {
      const response = await api.put<{ data: Blog }>(`/Blog/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to update blog:", error);
      throw error;
    }
  },

  async publish(id: string): Promise<void> {
    try {
      await api.patch(`/Blog/${id}/publish`);
    } catch (error) {
      console.error("Failed to publish blog:", error);
      throw error;
    }
  },

  async unpublish(id: string): Promise<void> {
    try {
      await api.patch(`/Blog/${id}/unpublish`);
    } catch (error) {
      console.error("Failed to unpublish blog:", error);
      throw error;
    }
  },

  async togglePublish(id: string, currentlyPublished: boolean): Promise<void> {
    if (currentlyPublished) {
      await this.unpublish(id);
    } else {
      await this.publish(id);
    }
  },

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ data: { url: string } }>("/Blog/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data.url;
  },
};
