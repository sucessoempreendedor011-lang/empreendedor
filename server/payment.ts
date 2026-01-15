import axios from 'axios';

// Configurações da API Duttyfy
const API_URL = 'https://www.pagamentos-seguros.app/api-pix/iHY_ZgNPWMdw7TedQDXpssVOmLHiALTs59rIwghTpdWhf9WDd_5v7ui3PpZNs3q2WOPBRO0O4KyoWAlChCqM_Q';
const UTMIFY_TOKEN = 'OMhfhmPPcECrnmP0EzFJIcHq8qhhMBx19mzT';

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  xcod?: string;
  sck?: string;
  fbclid?: string;
  gclid?: string;
  src?: string;
}

interface PaymentData {
  amount: number; // em centavos
  cpf: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  utms: UTMParams;
}

interface PixResponse {
  success: boolean;
  pixCode?: string;
  transactionId?: string;
  qrCodeUrl?: string;
  error?: string;
}

/**
 * Gera um código PIX via API Duttyfy
 */
export async function generatePix(data: PaymentData): Promise<PixResponse> {
  try {
    console.log('[Pagamento] Iniciando geração de PIX...', {
      amount: data.amount,
      cpf: data.cpf,
      product: data.productName
    });

    // Payload para o gateway Duttyfy
    const payload = {
      amount: data.amount,
      description: `Entrada - ${data.productName}`,
      customer: {
        name: data.customerName,
        document: data.cpf,
        email: data.customerEmail,
        phone: '11999999999'
      },
      item: {
        title: data.productName,
        price: data.amount,
        quantity: 1
      },
      paymentMethod: 'PIX'
    };

    console.log('[Pagamento] Enviando para gateway Duttyfy...', payload);

    // Envia para o gateway
    const response = await axios.post(API_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('[Pagamento] Resposta do gateway:', response.data);

    if (!response.data || !response.data.pixCode) {
      throw new Error('Erro ao gerar PIX: resposta inválida do gateway');
    }

    const transactionId = response.data.transactionId || response.data.id || `pix_${Date.now()}`;
    const pixCode = response.data.pixCode;

    // Envia para Utmify com status "waiting_payment"
    await sendToUtmify(transactionId, {
      ...data,
      transactionId,
      status: 'waiting_payment'
    });

    return {
      success: true,
      pixCode,
      transactionId,
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(pixCode)}&size=300x300`
    };
  } catch (error: any) {
    console.error('[Pagamento] Erro:', error.message);
    return {
      success: false,
      error: error.message || 'Erro ao gerar PIX'
    };
  }
}

/**
 * Verifica o status de um pagamento PIX
 */
export async function checkPaymentStatus(transactionId: string): Promise<{ isPaid: boolean; status: string }> {
  try {
    console.log('[Verificar] Verificando pagamento:', transactionId);

    const response = await axios.get(`${API_URL}?transactionId=${encodeURIComponent(transactionId)}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('[Verificar] Resposta do gateway:', response.data);

    const status = response.data.status || 'PENDING';
    const isPaid = ['COMPLETED', 'PAID', 'APPROVED'].includes(status.toUpperCase());

    if (isPaid) {
      console.log('[Verificar] Pagamento confirmado!', transactionId);
      // TODO: Atualizar status no banco de dados e enviar para Utmify com status "paid"
    }

    return {
      isPaid,
      status
    };
  } catch (error: any) {
    console.error('[Verificar] Erro:', error.message);
    return {
      isPaid: false,
      status: 'ERROR'
    };
  }
}

/**
 * Envia dados para Utmify
 */
async function sendToUtmify(transactionId: string, data: any): Promise<void> {
  try {
    const utmifyData = {
      orderId: transactionId,
      platform: 'Duttify',
      paymentMethod: 'pix',
      status: data.status,
      createdAt: new Date().toISOString(),
      approvedDate: data.status === 'paid' ? new Date().toISOString() : null,
      refundedAt: null,
      customer: {
        name: data.customerName,
        email: data.customerEmail,
        phone: '11999999999',
        document: data.cpf,
        country: 'BR',
        ip: null
      },
      products: [
        {
          id: 'iphone_entrada',
          name: data.productName,
          planId: null,
          planName: null,
          quantity: 1,
          priceInCents: data.amount
        }
      ],
      trackingParameters: {
        src: data.utms?.src || null,
        sck: data.utms?.sck || null,
        utm_source: data.utms?.utm_source || null,
        utm_campaign: data.utms?.utm_campaign || null,
        utm_medium: data.utms?.utm_medium || null,
        utm_content: data.utms?.utm_content || null,
        utm_term: data.utms?.utm_term || null,
        xcod: data.utms?.xcod || null,
        fbclid: data.utms?.fbclid || null,
        gclid: data.utms?.gclid || null
      },
      commission: {
        totalPriceInCents: data.amount,
        gatewayFeeInCents: 0,
        userCommissionInCents: data.amount
      },
      isTest: false
    };

    console.log('[Utmify] Enviando dados:', utmifyData);

    await axios.post('https://api.utmify.com.br/api-credentials/orders', utmifyData, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-token': UTMIFY_TOKEN
      },
      timeout: 30000
    });

    console.log('[Utmify] Dados enviados com sucesso');
  } catch (error: any) {
    console.error('[Utmify] Erro ao enviar:', error.message);
  }
}
