import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, Check, MessageCircle } from "lucide-react";

/**
 * Página de Aguardando Atendente
 * - Loading de 9 segundos "Aguarde! Estamos encontrando um atendente..."
 * - Loading de 3 segundos "Atendente encontrado!"
 * - Redireciona para página do Typebot com UTMs (cpf, iphone, parcela)
 */

export default function WaitingAgent() {
  const [, navigate] = useLocation();
  const [phase, setPhase] = useState<"searching" | "found" | "ready">("searching");

  useEffect(() => {
    // Verificar se tem telefone salvo
    const phone = localStorage.getItem("userPhone");
    if (!phone) {
      navigate("/resultado");
      return;
    }

    // Fase 1: Procurando atendente (9 segundos)
    const searchingTimer = setTimeout(() => {
      setPhase("found");
    }, 9000);

    // Fase 2: Atendente encontrado (3 segundos depois)
    const foundTimer = setTimeout(() => {
      setPhase("ready");
    }, 12000);

    // Fase 3: Redirecionar para chat com UTMs (após 12 segundos total)
    const redirectTimer = setTimeout(() => {
      // Recuperar dados do localStorage
      const cpf = localStorage.getItem("userCPF") || "";
      const cartItemStr = localStorage.getItem("cartItem");
      const installment = localStorage.getItem("selectedInstallment") || "40";
      
      let iphone = "";
      if (cartItemStr) {
        try {
          const cartItem = JSON.parse(cartItemStr);
          iphone = cartItem.productName || "";
        } catch {
          iphone = "";
        }
      }

      // Limpar CPF (remover pontos e traços)
      const cleanCPF = cpf.replace(/\D/g, "");

      // Construir URL com UTMs
      const params = new URLSearchParams();
      params.set("cpf", cleanCPF);
      params.set("iphone", iphone);
      params.set("parcela", installment);

      navigate(`/chat?${params.toString()}`);
    }, 12500);

    return () => {
      clearTimeout(searchingTimer);
      clearTimeout(foundTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0086FF] to-[#0066CC] flex items-center justify-center p-4">
      <div className="text-center text-white max-w-sm">
        {phase === "searching" && (
          <>
            {/* Spinner animado */}
            <div className="mb-8 relative">
              <div className="w-24 h-24 border-4 border-white/30 rounded-full mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-16 h-16 animate-spin" />
              </div>
            </div>

            {/* Mensagem */}
            <h2 className="text-2xl font-bold mb-3">
              Aguarde!
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Estamos encontrando um atendente disponível para você...
            </p>

            {/* Dots animados */}
            <div className="flex justify-center gap-2">
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>

            {/* Info */}
            <p className="text-sm opacity-70 mt-8">
              Isso pode levar alguns segundos...
            </p>
          </>
        )}

        {phase === "found" && (
          <>
            {/* Check animado */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-[#00A650] rounded-full flex items-center justify-center mx-auto animate-pulse">
                <Check className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Mensagem */}
            <h2 className="text-2xl font-bold mb-3">
              Atendente encontrado!
            </h2>
            <p className="text-lg opacity-90">
              Conectando você ao chat...
            </p>
          </>
        )}

        {phase === "ready" && (
          <>
            {/* Chat icon */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-[#00A650] rounded-full flex items-center justify-center mx-auto">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Mensagem */}
            <h2 className="text-2xl font-bold mb-3">
              Tudo pronto!
            </h2>
            <p className="text-lg opacity-90">
              Redirecionando para o chat...
            </p>
          </>
        )}
      </div>
    </div>
  );
}
