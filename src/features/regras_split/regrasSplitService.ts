import { api } from "../../lib/api";

export interface RegraSplitDestinatario {
  id?: string;
  regra_split_id?: string;
  tipo_destinatario: "plataforma" | "loja" | "franquia" | "entregador" | "outro";
  loja_conta_pagamento_id?: string | null;
  provider_account_id?: string | null;
  tipo_valor: "percentual" | "fixo";
  valor: number;
  prioridade: number;
  ativo: boolean;
}

export interface RegraSplit {
  id?: string;
  loja_id: string;
  loja_nome?: string;
  nome: string;
  descricao?: string;
  gateway: string;
  ativo: boolean;
  prioridade: number;
  criado_em?: string;
  destinatarios?: RegraSplitDestinatario[];
}

export const regrasSplitService = {
  getAll: async () => {
    const { data } = await api.get<RegraSplit[]>("/regras_split");
    return data;
  },

  getById: async (id: string) => {
    const { data } = await api.get<RegraSplit>(`/regras_split/${id}`);
    return data;
  },

  create: async (payload: RegraSplit) => {
    const { data } = await api.post<RegraSplit>("/regras_split", payload);
    return data;
  },

  update: async (id: string, payload: Partial<RegraSplit>) => {
    const { data } = await api.put<RegraSplit>(`/regras_split/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/regras_split/${id}`);
  },
};
