import axios from "axios";
import type { Form } from "../types/form";

const api = axios.create({
  baseURL: "/api",
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
