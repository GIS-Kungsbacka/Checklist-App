import axios from "axios";
import type {
  BestallaUppdragFrageformular,
  CreateBestallaUppdragFrageformularDto,
  UpdateBestallaUppdragFrageformularDto,
} from "../types/bestallaUppdragFrageformular";

const apiBase = import.meta.env.VITE_API_BASE || "/FormApp/api";

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

const BASE = "/admin/checklist";

export const bestallaUppdragFrageformularApi = {
  getAll: async (): Promise<BestallaUppdragFrageformular[]> => {
    const response = await api.get<BestallaUppdragFrageformular[]>(BASE);
    return response.data;
  },

  getById: async (gid: number): Promise<BestallaUppdragFrageformular> => {
    const response = await api.get<BestallaUppdragFrageformular>(
      `${BASE}/${gid}`,
    );
    return response.data;
  },

  create: async (
    dto: CreateBestallaUppdragFrageformularDto,
  ): Promise<BestallaUppdragFrageformular> => {
    const response = await api.post<BestallaUppdragFrageformular>(BASE, dto);
    return response.data;
  },

  update: async (
    gid: number,
    dto: UpdateBestallaUppdragFrageformularDto,
  ): Promise<void> => {
    await api.put(`${BASE}/${gid}`, dto);
  },

  delete: async (gid: number): Promise<void> => {
    await api.delete(`${BASE}/${gid}`);
  },
};
