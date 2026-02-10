import axios from "axios";
import type { Form, CreateFormDto, UpdateFormDto } from "../types/form";

// Get API base URL from environment variable, default to /FormApp/api
// This matches the IIS application structure where api is at /FormApp/api
const apiBase = import.meta.env.VITE_API_BASE || "/FormApp/api";

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

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
