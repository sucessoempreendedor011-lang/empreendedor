import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { CartItem } from "@/types";
import { ArrowLeft, Store, Banknote, Check, Shield } from "lucide-react";

/**
 * Página de Carrinho - Opções de Pagamento
 * - Resumo do produto selecionado
 * - 2 opções de pagamento:
 *   1. Pagar à vista (PIX) → vai para cadastro de endereço
 *   2. Pagar parcelado direto com a loja → solicita CPF
 * - Seletor de parcelas: 8x, 12x, 24x, 32x, 40x
 */

const INSTALLMENT_OPTIONS = [8, 12, 24, 32, 40];

export default function Cart() {
  const [, navigate] = useLocation();
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [selectedInstallment, setSelectedInstallment] = useState<number>(40);

  useEffect(() => {
    const savedItem = localStorage.getItem("cartItem");
    if (savedItem) {
      setCartItem(JSON.parse(savedItem));
    }
  }, []);

  if (!cartItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-4">
            Carrinho vazio
          </h1>
          <button
            onClick={() => navigate("/catalogo")}
            className="magalu-btn-green px-6 py-2 rounded-lg font-semibold"
          >
            Ver produtos
          </button>
        </div>
      </div>
    );
  }

  const pixPrice = Math.round(cartItem.price * 0.9);
  const getInstallmentValue = (installments: number) => {
    return Math.round(cartItem.price / installments);
  };

  const handlePaymentSelect = (method: string) => {
    setSelectedPayment(method);
  };

  const handleContinue = () => {
    if (selectedPayment === "pix") {
      // Salvar método de pagamento e ir para cadastro de endereço
      localStorage.setItem("paymentMethod", "pix");
      navigate("/endereco");
    } else if (selectedPayment === "store") {
      // Salvar método de pagamento e parcelas selecionadas
      localStorage.setItem("paymentMethod", "store");
      localStorage.setItem("selectedInstallment", selectedInstallment.toString());
      navigate("/cpf");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 magalu-header">
        <div className="flex items-center px-3 py-3">
          <button
            onClick={() => window.history.back()}
            className="p-1 text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-white ml-3">Carrinho</h1>
        </div>
      </header>

      {/* Product Summary */}
      <div className="bg-white px-4 py-4">
        <div className="flex gap-4">
          <img
            src={cartItem.image}
            alt={cartItem.productName}
            className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-gray-800 mb-1">
              {cartItem.productName}
            </h2>
            <p className="text-xs text-gray-500 mb-1">
              Cor: {cartItem.color}
            </p>
            <p className="text-xs text-gray-500 mb-2">
              Quantidade: {cartItem.quantity}
            </p>
            <p className="text-lg font-bold text-gray-800">
              R$ {(cartItem.price * cartItem.quantity).toLocaleString("pt-BR")}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Options Title */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Escolha como pagar
        </h2>
        <p className="text-sm text-gray-600">
          Selecione a forma de pagamento que preferir
        </p>
      </div>

      {/* Payment Options */}
      <div className="px-4 space-y-3">
        {/* Opção 1: Pagar à vista (PIX) */}
        <button
          onClick={() => handlePaymentSelect("pix")}
          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
            selectedPayment === "pix"
              ? "border-[#00A650] bg-green-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedPayment === "pix" ? "bg-[#00A650]" : "bg-gray-100"
            }`}>
              <Banknote className={`w-5 h-5 ${
                selectedPayment === "pix" ? "text-white" : "text-gray-600"
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Pagar à vista</h3>
                {selectedPayment === "pix" && (
                  <Check className="w-5 h-5 text-[#00A650]" />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                PIX, boleto ou transferência
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-xl font-bold magalu-price-green">
                  R$ {(pixPrice * cartItem.quantity).toLocaleString("pt-BR")}
                </span>
                <span className="text-sm text-green-600">10% de desconto</span>
              </div>
            </div>
          </div>
        </button>

        {/* Opção 2: Pagar parcelado direto com a loja */}
        <div
          onClick={() => handlePaymentSelect("store")}
          className={`w-full p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
            selectedPayment === "store"
              ? "border-[#E83E8C] bg-pink-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedPayment === "store" ? "bg-[#E83E8C]" : "bg-gray-100"
            }`}>
              <Store className={`w-5 h-5 ${
                selectedPayment === "store" ? "text-white" : "text-gray-600"
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Parcelado direto com a loja</h3>
                {selectedPayment === "store" && (
                  <Check className="w-5 h-5 text-[#E83E8C]" />
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Sem cartão de crédito
              </p>
              
              {/* Seletor de Parcelas */}
              {selectedPayment === "store" && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Escolha em quantas vezes:
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {INSTALLMENT_OPTIONS.map((installment) => (
                      <button
                        key={installment}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInstallment(installment);
                        }}
                        className={`py-2 px-1 rounded-lg text-center font-bold text-sm transition-all ${
                          selectedInstallment === installment
                            ? "bg-[#E83E8C] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {installment}x
                      </button>
                    ))}
                  </div>
                  
                  {/* Valor da parcela selecionada */}
                  <div className="mt-4 p-3 bg-white rounded-lg border border-[#E83E8C]">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-bold text-[#E83E8C]">
                        {selectedInstallment}x de R$ {getInstallmentValue(selectedInstallment).toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-1">sem juros</p>
                  </div>
                </div>
              )}
              
              {/* Valor padrão quando não selecionado */}
              {selectedPayment !== "store" && (
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-xl font-bold text-gray-800">
                    até 40x de R$ {getInstallmentValue(40).toLocaleString("pt-BR")}
                  </span>
                  <span className="text-sm text-gray-500">sem juros</span>
                </div>
              )}
              
              {/* Destaque do programa */}
              <div className="mt-3 p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                <p className="text-xs font-semibold text-[#E83E8C] mb-2">
                  Programa exclusivo Magalu + Apple
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-[#00A650]" />
                    <span className="text-xs text-gray-700">Sem consulta ao SPC/SERASA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-[#00A650]" />
                    <span className="text-xs text-gray-700">Crédito para negativados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-[#00A650]" />
                    <span className="text-xs text-gray-700">Sem cartão de crédito</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
          <Shield className="w-5 h-5 text-[#0086FF]" />
          <div>
            <p className="text-xs font-semibold text-gray-800">Compra 100% segura</p>
            <p className="text-xs text-gray-500">Seus dados estão protegidos</p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
        <button
          onClick={handleContinue}
          disabled={!selectedPayment}
          className={`w-full py-3 rounded-lg font-bold text-lg ${
            selectedPayment
              ? "magalu-btn-green"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continuar
        </button>
      </div>

      {/* Bottom Spacer */}
      <div className="h-24" />
    </div>
  );
}
