import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { managementPlanRequests } from "../api/managementPlanRequests";
import type { UpdateManagementPlanDto } from "../types/managementPlan";
import { broadcastQueryInvalidation } from "../../lib/broadcastChannel";

export const useManagementPlans = () =>
  useQuery({
    queryKey: ["management-plans"],
    queryFn: managementPlanRequests.getAll,
    retry: 3,
    retryDelay: 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

export const useUpdateManagementPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      gid,
      data,
    }: {
      gid: number;
      data: UpdateManagementPlanDto;
    }) => managementPlanRequests.update(gid, data),
    onSuccess: (_, { gid }) => {
      void queryClient.invalidateQueries({ queryKey: ["management-plans"] });
      void queryClient.invalidateQueries({
        queryKey: ["management-plans", gid],
      });
      broadcastQueryInvalidation(["management-plans"]);
      broadcastQueryInvalidation(["management-plans", gid.toString()]);
    },
  });
};

export const useDeleteManagementPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gid: number) => managementPlanRequests.delete(gid),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["management-plans"] });
      broadcastQueryInvalidation(["management-plans"]);
    },
  });
};
