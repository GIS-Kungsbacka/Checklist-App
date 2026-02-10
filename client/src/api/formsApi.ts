import axios from "axios";
import type { Form } from "../types/form";

// Get API base URL from environment variable, default to /FormApp/api
// This matches the IIS application structure where api is at /FormApp/api
const apiBase = import.meta.env.VITE_API_BASE || "/FormApp/api";

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

export const formsApi = {
  getAll: async (): Promise<Form[]> => {
    const response = await api.get<Form[]>("/forms");
    return response.data;
  },

  getById: async (id: number): Promise<Form> => {
    const response = await api.get<Form>(`/forms/${id}`);
    return response.data;
  },
};
