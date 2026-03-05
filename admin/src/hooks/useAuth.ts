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

export function getInitials(username: string): string {
  if (!username) return "";

  const namePart = username.split("\\").pop() || "";

  if (!namePart) return "";

  if (namePart.includes(".")) {
    const [first, last] = namePart.split(".");
    return (first?.[0] || "").toUpperCase() + (last?.[0] || "").toUpperCase();
  }

  if (namePart.length === 6) {
    return namePart[0].toUpperCase() + namePart[3].toUpperCase();
  }

  if (namePart.length >= 2) {
    return (
      namePart[0].toUpperCase() + namePart[namePart.length - 1].toUpperCase()
    );
  }

  return namePart[0]?.toUpperCase() || "";
}
