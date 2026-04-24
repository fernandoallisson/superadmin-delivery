import { api } from "../../lib/api";

export interface Store {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  status: "ativo" | "inativo" | "suspenso";
  created_at?: string;
}

export const storeService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get("/lojas", { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get(`/lojas/${id}`);
    return response.data;
  },

  create: async (data: Partial<Store>) => {
    const response = await api.post("/lojas", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Store>) => {
    const response = await api.put(`/lojas/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/lojas/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/lojas/${id}`);
    return response.data;
  }
};
