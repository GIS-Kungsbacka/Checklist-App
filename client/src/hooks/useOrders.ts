import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { orderSummaryRequests } from "../api/orderSummaryRequests";
import type { OrderSummary } from "../types/orderSummary";

export const useOrders = (): UseQueryResult<OrderSummary[]> => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderSummaryRequests.getAll,
    refetchInterval: () =>
      document.visibilityState === "visible" ? 10_000 : false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useOrderById = (id: string): UseQueryResult<OrderSummary> => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderSummaryRequests.getById(id),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
