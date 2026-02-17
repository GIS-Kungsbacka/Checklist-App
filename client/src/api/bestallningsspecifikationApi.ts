import axios from "axios";
import type { Bestallningsspecifikation } from "../types/bestallningsspecifikation";

const apiBase = import.meta.env.VITE_API_BASE || "/FormApp/api";

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

const BASE = "/admin/ordersummary";

export const bestallningsspecifikationApi = {
  getAll: async (): Promise<Bestallningsspecifikation[]> => {
    const response = await api.get<Bestallningsspecifikation[]>(BASE);
    return response.data;
  },

  getById: async (
    bestallningGid: number,
  ): Promise<Bestallningsspecifikation> => {
    const response = await api.get<Bestallningsspecifikation>(
      `${BASE}/${bestallningGid}`,
    );
    return response.data;
  },
};
