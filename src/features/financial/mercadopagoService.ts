import { api } from "../../lib/api";

export interface CardPaymentData {
  pedido_id: string;
  card_token: string;
  payment_method_id: string;
  installments: number;
  issuer_id?: number | null;
  payer_email: string;
  doc_type: string;
  doc_number: string;
}

export const mercadopagoService = {
  processCardPayment: async (data: CardPaymentData) => {
    const response = await api.post("/mercadopago/payment/card", data);
    return response.data;
  },
  
  getPaymentMethods: async () => {
    const response = await api.get("/mercadopago/payment-methods");
    return response.data;
  }
};
