import { api } from "./axiosConfig";
import type { Order } from "../types/order";

const BASE = "/ordersummary";

export const orderSummaryRequests = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>(BASE);
    return response.data;
  },

  getById: async (bestallningGid: number): Promise<Order> => {
    const response = await api.get<Order>(`${BASE}/${bestallningGid}`);
    return response.data;
  },
};
