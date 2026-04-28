import { api } from "../../lib/api";

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password, userType: 'superadmin' });
    return response.data;
  },
  me: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  }
};
