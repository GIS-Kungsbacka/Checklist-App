import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getBroadcastChannel,
  type QueryInvalidationMessage,
} from "./broadcastChannel";

/**
 * Hook to sync React Query cache across browser windows/tabs
 * Listens for broadcast messages and invalidates queries accordingly
 */
export function useBroadcastSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = getBroadcastChannel();

    const handleMessage = (event: MessageEvent<QueryInvalidationMessage>) => {
      if (event.data.type === "invalidate-queries") {
        // Invalidate queries in this window
        void queryClient.invalidateQueries({
          queryKey: event.data.queryKey,
        });
      }
    };

    channel.addEventListener("message", handleMessage);

    return () => {
      channel.removeEventListener("message", handleMessage);
    };
  }, [queryClient]);
}
