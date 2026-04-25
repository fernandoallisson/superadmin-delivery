import { api } from "../../lib/api";

export interface Categoria {
  id: string;
  nome: string;
  slug: string;
  ordem_exibicao: number;
  ativa: boolean;
  criado_em: string;
  atualizado_em: string;
}

export const categoriaService = {
  getAll: async () => {
    const response = await api.get("/categorias");
    return response.data;
  },
};
