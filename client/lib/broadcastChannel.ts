/**
 * BroadcastChannel utility for cross-window/tab communication
 * Used to sync React Query cache invalidation across browser windows
 */

const CHANNEL_NAME = "react-query-sync";

export type QueryInvalidationMessage = {
  type: "invalidate-queries";
  queryKey: string[];
};

let channel: BroadcastChannel | null = null;

export function getBroadcastChannel(): BroadcastChannel {
  if (typeof window === "undefined") {
    // SSR fallback
    return {
      postMessage: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      close: () => {},
    } as unknown as BroadcastChannel;
  }

  if (!channel) {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME);
    } catch (error) {
      console.warn(
        "BroadcastChannel not supported, falling back to no-op",
        error
      );
      return {
        postMessage: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        close: () => {},
      } as unknown as BroadcastChannel;
    }
  }

  return channel;
}

export function broadcastQueryInvalidation(queryKey: string[]) {
  const ch = getBroadcastChannel();
  const message: QueryInvalidationMessage = {
    type: "invalidate-queries",
    queryKey,
  };
  ch.postMessage(message);
}
