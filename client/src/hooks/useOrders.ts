import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { orderSummaryRequests } from "../api/bestallningsspecifikationApi";
import type { Order } from "../types/order";

export const useOrders = (): UseQueryResult<Order[]> => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderSummaryRequests.getAll,
  });
};

export const useOrderById = (id: number): UseQueryResult<Order> => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderSummaryRequests.getById(id),
  });
};
