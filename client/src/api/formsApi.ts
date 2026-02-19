import { api } from "./axiosConfig";
import type { Form } from "../types/form";

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
