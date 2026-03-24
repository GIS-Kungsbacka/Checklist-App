import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { metadataRequests } from "../api/metadataRequests";
import type { UpdateMetadataDto } from "../types/metadata";
import { broadcastQueryInvalidation } from "../../lib/broadcastChannel";

export const useMetadatas = () =>
  useQuery({
    queryKey: ["metadatas"],
    queryFn: metadataRequests.getAll,
    retry: 3,
    retryDelay: 1000,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

export const useCreateMetadata = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: metadataRequests.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["metadatas"] });
      broadcastQueryInvalidation(["metadatas"]);
    },
  });
};

export const useUpdateMetadata = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gid, data }: { gid: number; data: UpdateMetadataDto }) =>
      metadataRequests.update(gid, data),
    onSuccess: (_, { gid }) => {
      void queryClient.invalidateQueries({ queryKey: ["metadatas"] });
      void queryClient.invalidateQueries({ queryKey: ["metadatas", gid] });
      broadcastQueryInvalidation(["metadatas"]);
      broadcastQueryInvalidation(["metadatas", gid.toString()]);
    },
  });
};

export const useDeleteMetadata = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gid: number) => metadataRequests.delete(gid),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["metadatas"] });
      broadcastQueryInvalidation(["metadatas"]);
    },
  });
};
