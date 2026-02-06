import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/authApi";

export function useAuth() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    retry: false,
  });

  return {
    user: data,
    isAdmin: data?.isAdmin ?? false,
    isLoading,
    isAuthenticated: !!data && !error,
    error,
  };
}
