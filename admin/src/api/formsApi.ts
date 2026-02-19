import { api } from "./axiosConfig";
import type { Form, CreateFormDto, UpdateFormDto } from "../types/form";

export const formsApi = {
  getAll: async (): Promise<Form[]> => {
    const response = await api.get<Form[]>("/admin/forms");
    return response.data;
  },

  getById: async (id: number): Promise<Form> => {
    const response = await api.get<Form>(`/admin/forms/${id}`);
    return response.data;
  },

  create: async (dto: CreateFormDto): Promise<Form> => {
    const response = await api.post<Form>("/admin/forms", dto);
    return response.data;
  },

  update: async (id: number, dto: UpdateFormDto): Promise<void> => {
    await api.put(`/admin/forms/${id}`, dto);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/admin/forms/${id}`);
  },
};
