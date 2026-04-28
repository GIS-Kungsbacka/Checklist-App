import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { orderSummaryRequests } from "../api/orderSummaryRequests";
import type { OrderSummary } from "../types/orderSummary";

type Options = {
  enabled?: boolean;
};

export const useOrders = (options?: Options): UseQueryResult<OrderSummary[]> => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderSummaryRequests.getAll,
    enabled: options?.enabled ?? true,
    retry: 3,                 
    retryDelay: 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
    staleTime: 0,
  });
};

export const useOrderById = (
  id: string,
  options?: Options
): UseQueryResult<OrderSummary> => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderSummaryRequests.getById(id),
    enabled: options?.enabled ?? true,
  });
};
