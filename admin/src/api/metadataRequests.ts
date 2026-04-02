import { api } from "./axiosConfig";
import type { Metadata, UpdateMetadataDto } from "../types/metadata";

const BASE = "/admin/metadata";

export const metadataRequests = {
  getAll: async (): Promise<Metadata[]> => {
    const response = await api.get<Metadata[]>(BASE);
    return response.data;
  },

  getById: async (gid: number): Promise<Metadata> => {
    const response = await api.get<Metadata>(`${BASE}/${gid}`);
    return response.data;
  },

  update: async (gid: number, dto: UpdateMetadataDto): Promise<void> => {
    await api.put(`${BASE}/${gid}`, dto);
  },

  delete: async (gid: number): Promise<void> => {
    await api.delete(`${BASE}/${gid}`);
  },
};
