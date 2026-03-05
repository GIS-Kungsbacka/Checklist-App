import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { orderSummaryRequests } from "../api/orderSummaryRequests";
import type { OrderSummary } from "../types/orderSummary";

export const useOrderSummaries = (): UseQueryResult<OrderSummary[]> => {
  return useQuery({
    queryKey: ["orderSummaries"],
    queryFn: orderSummaryRequests.getAll,
    refetchInterval: () =>
      document.visibilityState === "visible" ? 10_000 : false,
  });
};