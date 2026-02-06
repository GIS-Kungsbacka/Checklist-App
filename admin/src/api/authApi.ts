import axios from "axios";

const api = axios.create({
  baseURL: "/api",
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
