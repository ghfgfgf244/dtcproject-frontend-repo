import api from "@/lib/api";

export interface Blog {
  id: string;
  title: string;
  avatar?: string;
  categoryId: string;
  summary?: string;
  content: string;
  status: boolean;
  createdAt: string;
  authorName: string;
  authorAvatar?: string;
}

export interface CreateBlogRequest {
  title: string;
  categoryId: string;
  content: string;
  summary?: string;
  avatar?: string;
}

export interface UpdateBlogRequest {
  title?: string;
  categoryId?: string;
  content?: string;
  summary?: string;
  avatar?: string;
}

// Default category for homepage posts (seeded: "Tin dao tao")
const DEFAULT_CATEGORY_ID = "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1";

export const blogService = {
  /**
   * Create a new blog post.
   */
  async create(content: string, title: string, avatar?: string): Promise<Blog | null> {
    try {
      const response = await api.post<{ data: Blog }>("/Blog", {
        title,
        categoryId: DEFAULT_CATEGORY_ID,
        content,
        avatar,
        summary: title,
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
};
