import { useLocation } from "wouter";
import { Check, CreditCard, Shield, Smartphone, Star, Users } from "lucide-react";

/**
 * Landing Page - Informativo Parcelamento Exclusivo Magalu + Apple
 * Visual padrão Magazine Luiza
 * - Sem cartão de crédito
 * - Sem consulta ao SPC/SERASA
 * - Crédito liberado para negativados
 * - Parceria oficial com Apple
 */

export default function Landing() {
  const [, navigate] = useLocation();

  const handleContinue = () => {
    navigate("/catalogo");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="magalu-header py-4 px-4">
        <div className="flex items-center justify-center w-full">
          <img 
            src="/images/magalu-logo.svg" 
            alt="Magazine Luiza" 
            className="h-8 w-auto"
          />
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0086FF] to-[#0066CC] text-white px-4 py-8 text-center">
        {/* Apple + Magalu Partnership Badge */}
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
          <span className="text-sm font-semibold">Parceria Oficial</span>
          <span className="text-sm font-semibold">Apple + Magalu</span>
        </div>

        <h1 className="text-3xl font-extrabold mb-4 leading-tight">
          iPhone Parcelado<br />
          <span className="text-yellow-300">em até 40x</span>
        </h1>

        <p className="text-lg opacity-90 mb-6">
          Direto com a Magalu, sem burocracia!
        </p>

        {/* iPhone Image */}
        <div className="relative mx-auto w-48 h-48 mb-6">
          <img
            src="/images/iphone-17-pro-max.png"
            alt="iPhone"
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Main CTA */}
        <button
          onClick={handleContinue}
          className="w-full max-w-sm bg-[#00A650] hover:bg-[#008c44] text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-all transform hover:scale-105"
        >
          Ver iPhones Disponíveis
        </button>
      </section>

      {/* Benefits Section */}
      <section className="px-4 py-8 bg-gray-50">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
          Vantagens Exclusivas
        </h2>

        <div className="space-y-4">
          {/* Benefit 1 - No Credit Card */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6 text-[#00A650]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Sem Cartão de Crédito</h3>
              <p className="text-sm text-gray-600">
                Parcele seu iPhone sem precisar de cartão de crédito. O crédito é liberado diretamente pela Magalu.
              </p>
            </div>
          </div>

          {/* Benefit 2 - No SPC/SERASA */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-[#0086FF]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Sem Consulta ao SPC/SERASA</h3>
              <p className="text-sm text-gray-600">
                Não consultamos órgãos de proteção ao crédito. Sua análise é feita internamente pela Magalu.
              </p>
            </div>
          </div>

          {/* Benefit 3 - Credit for Negativados */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Crédito para Negativados</h3>
              <p className="text-sm text-gray-600">
                Mesmo com nome negativado, você pode ter crédito liberado para comprar seu iPhone.
              </p>
            </div>
          </div>

          {/* Benefit 4 - Apple Partnership */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-gray-700" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-1">Parceria Oficial Apple</h3>
              <p className="text-sm text-gray-600">
                Produtos originais Apple com garantia oficial. Parceria exclusiva Magalu + Apple.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="px-4 py-8 bg-white">
        <h2 className="text-xl font-bold text-gray-800 text-center mb-6">
          Como Funciona?
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#0086FF] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              1
            </div>
            <p className="text-gray-700">Escolha o iPhone desejado</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#0086FF] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              2
            </div>
            <p className="text-gray-700">Selecione o parcelamento em até 40x</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#0086FF] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              3
            </div>
            <p className="text-gray-700">Preencha seus dados para análise</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#00A650] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              <Check className="w-5 h-5" />
            </div>
            <p className="text-gray-700 font-semibold">Crédito aprovado na hora!</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="px-4 py-6 bg-gray-50">
        <div className="flex items-center justify-center gap-6 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-xs text-gray-600">4.9 de avaliação</p>
          </div>
          <div className="h-8 w-px bg-gray-300" />
          <div>
            <p className="text-lg font-bold text-gray-800">+1M</p>
            <p className="text-xs text-gray-600">clientes satisfeitos</p>
          </div>
          <div className="h-8 w-px bg-gray-300" />
          <div>
            <p className="text-lg font-bold text-gray-800">100%</p>
            <p className="text-xs text-gray-600">seguro</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 py-8 bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Aproveite essa oportunidade exclusiva!
          </p>
          <button
            onClick={handleContinue}
            className="w-full max-w-sm bg-[#00A650] hover:bg-[#008c44] text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-all"
          >
            Quero Meu iPhone Agora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white px-4 py-6">
        <div className="text-center">
          <svg viewBox="0 0 120 32" className="h-6 w-auto mx-auto mb-4" fill="white">
            <text x="0" y="22" fontSize="16" fontWeight="800" fill="white">magalu</text>
          </svg>
          <p className="text-xs text-gray-400 mb-2">
            Parceria oficial Apple + Magazine Luiza
          </p>
          <p className="text-xs text-gray-500">
            © 2026 Magazine Luiza. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
