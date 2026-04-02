import { api } from "./axiosConfig";
import type {
  ManagementPlan,
  UpdateManagementPlanDto,
} from "../types/managementPlan";

const BASE = "/admin/managementplan";

export const managementPlanRequests = {
  getAll: async (): Promise<ManagementPlan[]> => {
    const response = await api.get<ManagementPlan[]>(BASE);
    return response.data;
  },

  getById: async (gid: number): Promise<ManagementPlan> => {
    const response = await api.get<ManagementPlan>(`${BASE}/${gid}`);
    return response.data;
  },

  update: async (gid: number, dto: UpdateManagementPlanDto): Promise<void> => {
    await api.put(`${BASE}/${gid}`, dto);
  },

  delete: async (gid: number): Promise<void> => {
    await api.delete(`${BASE}/${gid}`);
  },
};
