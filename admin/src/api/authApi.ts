import axios from "axios";

// Get API base URL from environment variable, default to /FormApp/api
const apiBase = import.meta.env.VITE_API_BASE || "/FormApp/api";

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true,
});

export interface UserInfo {
  username: string;
  isAdmin: boolean;
}

export const authApi = {
  getCurrentUser: async (): Promise<UserInfo> => {
    const response = await api.get<UserInfo>("/me");
    return response.data;
  },
};
