import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { checklistRequests } from "../api/checkListRequests";
import type { Checklist, UpdateChecklistDto } from "../types/checklist";

export const useChecklists = (): UseQueryResult<Checklist[]> => {
  return useQuery({
    queryKey: ["checklists"],
    queryFn: checklistRequests.getAll,
    retry: 3,                 
    retryDelay: 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchInterval: 10_000,
    staleTime: 0,
  });
};

export const useChecklistById = (gid: number): UseQueryResult<Checklist> => {
  return useQuery({
    queryKey: ["checklists", gid],
    queryFn: () => checklistRequests.getById(gid),
  });
};

export const useCreateChecklist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checklistRequests.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["checklists"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useUpdateChecklist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gid, data }: { gid: number; data: UpdateChecklistDto }) =>
      checklistRequests.update(gid, data),
    onSuccess: (_, { gid }) => {
      void queryClient.invalidateQueries({ queryKey: ["checklists"] });
      void queryClient.invalidateQueries({ queryKey: ["checklists", gid] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};

export const useDeleteChecklist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gid: number) => checklistRequests.delete(gid),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["checklists"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
};
