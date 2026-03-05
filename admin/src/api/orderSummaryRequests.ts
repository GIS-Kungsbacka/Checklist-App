import { api } from "./axiosConfig";
import type { OrderSummary } from "../types/orderSummary";

const BASE = "/ordersummary";

export const orderSummaryRequests = {
  getAll: async (): Promise<OrderSummary[]> => {
    const response = await api.get<OrderSummary[]>(BASE);
    return response.data.map(item => ({
      arendenummerArtvise: item.arendenummerArtvise,
    }));
  },
}