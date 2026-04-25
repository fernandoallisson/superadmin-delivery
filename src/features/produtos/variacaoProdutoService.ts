import { api } from "../../lib/api";

export interface VariacaoProduto {
  id: string;
  produto_id: string;
  nome: string;
  codigo_barras?: string;
  sku?: string;
  peso: number;
  quantidade_unidade: number;
  ativa: boolean;
  criado_em: string;
  atualizado_em: string;
}

export const variacaoProdutoService = {
  getByProdutoId: async (produtoId: string) => {
    const response = await api.get(`/produtos/${produtoId}/variacoes`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/variacoes_produto/${id}`);
    return response.data;
  },

  create: async (data: Partial<VariacaoProduto>) => {
    const response = await api.post("/variacoes_produto", data);
    return response.data;
  },

  update: async (id: string, data: Partial<VariacaoProduto>) => {
    const response = await api.put(`/variacoes_produto/${id}`, data);
    return response.data;
  },

  toggleAtiva: async (id: string, ativa: boolean) => {
    const response = await api.patch(`/variacoes_produto/${id}/ativa`, { ativa });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/variacoes_produto/${id}`);
    return response.data;
  },
};
