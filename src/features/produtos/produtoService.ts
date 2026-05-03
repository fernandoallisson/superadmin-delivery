import { api } from "../../lib/api";

export interface Produto {
  id: string;
  categoria_id: string;
  nome: string;
  slug: string;
  descricao?: string;
  marca?: string;
  codigo_barras?: string;
  unidade_medida: string;
  vendavel_por_peso: boolean;
  imagem_url?: string;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export const produtoService = {
  getAll: async (params?: Record<string, any>) => {
    const response = await api.get("/produtos", { params });
    return response.data?.data ?? response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/produtos/${id}`);
    return response.data?.data ?? response.data;
  },

  create: async (data: Partial<Produto>) => {
    const response = await api.post("/produtos", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Produto>) => {
    const response = await api.put(`/produtos/${id}`, data);
    return response.data;
  },

  toggleAtivo: async (id: string, ativo: boolean) => {
    const response = await api.patch(`/produtos/${id}/ativo`, { ativo });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/produtos/${id}`);
    return response.data;
  },
};
