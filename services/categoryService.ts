import api from "@/lib/api";

export interface Category {
  id: string;
  categoryId: number;
  name: string;
  parentCategoryId?: number;
  showMenuStatus: boolean;
}

export const categoryService = {
  /**
   * Fetch all categories.
   */
  async getAll(): Promise<Category[]> {
    try {
      const response = await api.get<{ data: Category[] }>("/Category");
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },

  /**
   * Get category by ID.
   */
  async getById(id: string): Promise<Category | null> {
    try {
      const response = await api.get<{ data: Category }>(`/Category/${id}`);
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch category:", error);
      return null;
    }
  }
};
