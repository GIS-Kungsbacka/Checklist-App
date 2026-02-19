import { api } from "./axiosConfig";
import type {
  Checklist,
  CreateChecklistDto,
  UpdateChecklistDto,
} from "../types/checklist";

const BASE = "/admin/checklist";

export const checklistRequests = {
  getAll: async (): Promise<Checklist[]> => {
    const response = await api.get<Checklist[]>(BASE);
    return response.data;
  },

  getById: async (gid: number): Promise<Checklist> => {
    const response = await api.get<Checklist>(`${BASE}/${gid}`);
    return response.data;
  },

  create: async (dto: CreateChecklistDto): Promise<Checklist> => {
    const response = await api.post<Checklist>(BASE, dto);
    return response.data;
  },

  update: async (gid: number, dto: UpdateChecklistDto): Promise<void> => {
    await api.put(`${BASE}/${gid}`, dto);
  },

  delete: async (gid: number): Promise<void> => {
    await api.delete(`${BASE}/${gid}`);
  },
};
