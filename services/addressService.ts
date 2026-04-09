import api from "@/lib/api";

export interface AddressOption {
  id: number;
  addressName: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const addressService = {
  async getAll(): Promise<AddressOption[]> {
    const response = await api.get<ApiResponse<AddressOption[]>>("/Address");
    return response.data.data || [];
  },
};
