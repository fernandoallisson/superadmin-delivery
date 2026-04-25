import { api } from "../../lib/api";

export interface Usuario {
  id: string;
  loja_id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  perfil: "administrador" | "operador" | "separador" | "entregador" | "financeiro";
  status: "ativo" | "inativo" | "bloqueado";
  ultimo_login_em?: string | null;
  criado_em?: string;
  atualizado_em?: string;
  // Dados auxiliares (pode vir do join)
  loja_nome?: string;
}

export interface UsuarioCreatePayload {
  loja_id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  senha: string;
  perfil: string;
  status?: string;
}

export type UsuarioUpdatePayload = Partial<Omit<UsuarioCreatePayload, "senha">>;

export const PERFIS_OPTIONS = [
  { value: "administrador", label: "Administrador" },
  { value: "operador", label: "Operador" },
  { value: "separador", label: "Separador" },
  { value: "entregador", label: "Entregador" },
  { value: "financeiro", label: "Financeiro" },
] as const;

export const STATUS_OPTIONS = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "bloqueado", label: "Bloqueado" },
] as const;

export const usuarioService = {
  getAll: async (params?: { loja_id?: string; status?: string; perfil?: string; nome?: string; email?: string }) => {
    const response = await api.get("/usuarios", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data?.data ?? response.data;
  },

  create: async (data: UsuarioCreatePayload) => {
    const response = await api.post("/usuarios", data);
    return response.data;
  },

  update: async (id: string, data: UsuarioUpdatePayload) => {
    const response = await api.put(`/usuarios/${id}`, data);
    return response.data;
  },

  patch: async (id: string, data: Partial<UsuarioUpdatePayload>) => {
    const response = await api.patch(`/usuarios/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/usuarios/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
  },
};
