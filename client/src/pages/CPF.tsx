import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { CartItem } from "@/types";
import { ArrowLeft, Shield, Check, Store, AlertCircle } from "lucide-react";

/**
 * Página de Solicitação de CPF
 * - Para parcelamento direto com a loja
 * - Informa sobre o programa exclusivo
 * - Solicita CPF do usuário
 * - Redireciona para análise de crédito
 */

export default function CPF() {
  const [, navigate] = useLocation();
  const [cpf, setCpf] = useState("");
  const [cartItem, setCartItem] = useState<CartItem | null>(null);

  useEffect(() => {
    const savedItem = localStorage.getItem("cartItem");
    if (savedItem) {
      setCartItem(JSON.parse(savedItem));
    }
  }, []);

  // Formatar CPF enquanto digita
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    if (formatted.length <= 14) {
      setCpf(formatted);
    }
  };

  const isCPFValid = cpf.replace(/\D/g, "").length === 11;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCPFValid) return;

    // Salvar CPF no localStorage
    localStorage.setItem("userCPF", cpf);
    
    // Redirecionar para página de análise de crédito
    navigate("/analise");
  };

  const installmentValue = cartItem ? Math.round(cartItem.price / 40) : 0;

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
          <h1 className="text-lg font-bold text-white ml-3">Parcelamento Magalu</h1>
        </div>
      </header>

      {/* Program Info */}
      <div className="bg-gradient-to-br from-[#0086FF] to-[#0066CC] px-4 py-6 text-white">
        <div className="flex items-center gap-2 mb-3">
          <Store className="w-6 h-6" />
          <h2 className="text-xl font-bold">Parcelamento Exclusivo</h2>
        </div>
        <p className="text-sm opacity-90 mb-4">
          Programa especial em parceria com a Apple. Parcele seu iPhone em até 40x diretamente com a Magalu!
        </p>
        
        <div className="bg-white/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold">Sem consulta ao SPC/SERASA</p>
              <p className="text-xs opacity-80">Não afeta seu score de crédito</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold">Crédito para negativados</p>
              <p className="text-xs opacity-80">Análise diferenciada e facilitada</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold">Sem cartão de crédito</p>
              <p className="text-xs opacity-80">Pague via boleto ou PIX mensal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Summary */}
      {cartItem && (
        <div className="bg-white px-4 py-4 mt-2">
          <div className="flex gap-4">
            <img
              src={cartItem.image}
              alt={cartItem.productName}
              className="w-16 h-16 object-contain bg-gray-50 rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-800">
                {cartItem.productName}
              </h3>
              <p className="text-xs text-gray-500">Cor: {cartItem.color}</p>
              <div className="mt-2">
                <span className="text-lg font-bold text-[#E83E8C]">
                  40x de R$ {installmentValue.toLocaleString("pt-BR")}
                </span>
                <span className="text-sm text-gray-500 ml-1">sem juros</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CPF Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6">
        <div className="bg-white rounded-xl p-4">
          <h3 className="font-bold text-gray-800 mb-2">Informe seu CPF</h3>
          <p className="text-sm text-gray-600 mb-4">
            Precisamos do seu CPF para analisar sua proposta de crédito. Não se preocupe, seus dados estão seguros.
          </p>
          
          <div className="relative">
            <input
              type="text"
              value={cpf}
              onChange={handleCPFChange}
              placeholder="000.000.000-00"
              className="w-full px-4 py-4 text-xl text-center font-mono border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#0086FF] focus:border-[#0086FF] transition-all"
              required
            />
            {isCPFValid && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Check className="w-6 h-6 text-[#00A650]" />
              </div>
            )}
          </div>
          
          <div className="flex items-start gap-2 mt-4 p-3 bg-blue-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-[#0086FF] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600">
              Ao informar seu CPF, você concorda com nossa política de privacidade e autoriza a análise de crédito para fins de parcelamento.
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 mt-4 text-gray-500">
          <Shield className="w-4 h-4" />
          <span className="text-xs">Dados protegidos e criptografados</span>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={!isCPFValid}
            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 ${
              isCPFValid
                ? "magalu-btn-green"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Enviar para análise
          </button>
        </div>

        {/* Process Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            A análise é instantânea e você receberá o resultado em segundos
          </p>
        </div>
      </form>

      {/* Bottom Spacer */}
      <div className="h-10" />
    </div>
  );
}
