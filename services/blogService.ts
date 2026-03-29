import api from "@/lib/api";

export interface Blog {
  id: string;
  title: string;
  avatar?: string;
  categoryId: number;
  summary?: string;
  content: string;
  status: boolean;
  createdAt: string;
}

export interface CreateBlogRequest {
  title: string;
  categoryId: number;
  content: string;
  summary?: string;
  avatar?: string;
}

export interface UpdateBlogRequest {
  title?: string;
  categoryId?: number;
  content?: string;
  summary?: string;
  avatar?: string;
}

export const blogService = {
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
