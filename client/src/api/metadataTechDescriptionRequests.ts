import { api } from "./axiosConfig";
import type { MetadataTechDescription } from "../types/metadataTechDescription";

const BASE = "/metadatatechdescription";

export const metadataTechDescRequests = {
  getAll: async (): Promise<MetadataTechDescription[]> => {
    const response = await api.get<MetadataTechDescription[]>(BASE);
    return response.data;
  },

  getById: async (gid: number): Promise<MetadataTechDescription> => {
    const response = await api.get<MetadataTechDescription>(`${BASE}/${gid}`);
    return response.data;
  },
};
