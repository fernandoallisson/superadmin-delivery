import { api } from "../../lib/api";

export const importacaoService = {
  importCSV: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/importacao_produtos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
