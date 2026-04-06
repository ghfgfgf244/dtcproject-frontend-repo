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

// Default category for homepage posts (seeded: "Tin dao tao")
const DEFAULT_CATEGORY_ID = 1;

export const blogService = {
  /**
   * Create a new blog post.
   */
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

  /**
   * Fetch all blogs.
   */
  async getAll(onlyPublished: boolean = false): Promise<Blog[]> {
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

  /**
   * Fetch blogs created by a specific user.
   */
  async getByUserId(userId: string): Promise<Blog[]> {
    try {
      const response = await api.get<{ data: Blog[] }>(`/Blog/user/${userId}`);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch blogs by user:", error);
      return [];
    }
  },

  /**
   * Delete a blog post.
   */
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/Blog/${id}`);
    } catch (error) {
      console.error("Failed to delete blog:", error);
      throw error;
    }
  },

  /**
   * Update a blog post.
   */
  async update(id: string, data: UpdateBlogRequest): Promise<Blog | null> {
    try {
      const response = await api.put<{ data: Blog }>(`/Blog/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error("Failed to update blog:", error);
      throw error;
    }
  },

  /**
   * Publish a blog post.
   */
  async publish(id: string): Promise<void> {
    try {
      await api.patch(`/Blog/${id}/publish`);
    } catch (error) {
      console.error("Failed to publish blog:", error);
      throw error;
    }
  },

  /**
   * Unpublish a blog post.
   */
  async unpublish(id: string): Promise<void> {
    try {
      await api.patch(`/Blog/${id}/unpublish`);
    } catch (error) {
      console.error("Failed to unpublish blog:", error);
      throw error;
    }
  },

  /**
   * Toggle publish status of a blog post based on current state.
   */
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
