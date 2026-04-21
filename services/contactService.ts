import api from "@/lib/api";

export interface ContactRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  subject?: string;
  message: string;
}

export const contactService = {
  async sendContact(data: ContactRequest): Promise<void> {
    await api.post("/Contact", data);
  },
};
