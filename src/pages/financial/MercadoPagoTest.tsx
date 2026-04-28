import React, { useState } from 'react';
import { initMercadoPago, CardPayment } from '@mercadopago/sdk-react';
import { mercadopagoService } from '../../features/financial/mercadopagoService';

// Initialize with the Public Key from .env
initMercadoPago('TEST-a2091884-ef72-41be-87bc-52dd30870914');

export const MercadoPagoTest = () => {
  const testOrders = [
    { id: 'b1000000-0000-0000-0000-000000000001', label: 'Pedido TEST-001 (R$ 100,00)', amount: 100.00 },
    { id: 'b2000000-0000-0000-0000-000000000002', label: 'Pedido TEST-002 (R$ 50,00)', amount: 50.00 },
    { id: 'b3000000-0000-0000-0000-000000000003', label: 'Pedido TEST-003 (R$ 25,00)', amount: 25.00 },
  ];

  const [pedidoId, setPedidoId] = useState(testOrders[0].id);
  const [amount, setAmount] = useState(testOrders[0].amount);
  const [status, setStatus] = useState<any>(null);

  const initialization = {
    amount: amount,
  };

  const onSubmit = async (param: any) => {
    console.log('onSubmit param:', param);
    const formData = param.formData || param;
    
    if (!formData || !formData.token) {
      console.error('Dados de pagamento não encontrados no param:', param);
      setStatus({ success: false, error: 'Erro ao capturar dados do cartão. Verifique o console.' });
      return;
    }
    
    try {
      const paymentData = {
        pedido_id: pedidoId,
        card_token: formData.token,
        payment_method_id: formData.payment_method_id,
        installments: formData.installments,
        issuer_id: formData.issuer_id ? parseInt(formData.issuer_id) : null,
        payer_email: formData.payer?.email,
        doc_type: formData.payer?.identification?.type,
        doc_number: formData.payer?.identification?.number,
      };

      const result = await mercadopagoService.processCardPayment(paymentData);
      setStatus({ success: true, data: result });
      console.log('Payment success:', result);
    } catch (error: any) {
      setStatus({ success: false, error: error.response?.data || error.message });
      console.error('Payment error:', error);
    }
  };

  const onError = async (error: any) => {
    console.error('Brick Error:', error);
  };

  const onReady = async () => {
    console.log('Brick Ready');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Teste de Pagamento Mercado Pago</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Selecionar Pedido de Teste
        </label>
        <select
          value={pedidoId}
          onChange={(e) => {
            const order = testOrders.find(o => o.id === e.target.value);
            if (order) {
              setPedidoId(order.id);
              setAmount(order.amount);
            }
          }}
          className="w-full p-2 border rounded mb-4"
        >
          {testOrders.map(order => (
            <option key={order.id} value={order.id}>{order.label}</option>
          ))}
        </select>

        <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-50 rounded">
          <strong>UUID do Pedido:</strong> {pedidoId}
        </div>

        <CardPayment
          initialization={initialization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
        />
      </div>

      {status && (
        <div className={`p-4 rounded-lg ${status.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <h2 className="font-bold">{status.success ? 'Pagamento Processado!' : 'Erro no Pagamento'}</h2>
          <pre className="mt-2 text-xs overflow-auto">
            {JSON.stringify(status.data || status.error, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
