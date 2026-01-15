import { useState } from "react";
import MagaluHeader from "@/components/MagaluHeader";
import ProductCard from "@/components/ProductCard";
import { iphones } from "@/data/products";
import { ChevronRight } from "lucide-react";

/**
 * Página Home - Layout Magazine Luiza Mobile
 * - Header azul com logo e busca
 * - Breadcrumb
 * - Título da categoria
 * - Grid de produtos 2 colunas
 */

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIphones = iphones.filter((iphone) =>
    iphone.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <MagaluHeader />

      {/* Breadcrumb */}
      <div className="bg-white px-3 py-2 border-b border-gray-200">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <a href="/" className="hover:text-[#0086FF]">Início</a>
          <ChevronRight className="w-3 h-3" />
          <a href="/" className="hover:text-[#0086FF]">Celulares e Smartphones</a>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-800 font-medium">iPhone</span>
        </div>
      </div>

      {/* Category Title */}
      <div className="bg-white px-3 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">iPhone</h1>
        <p className="text-sm text-gray-500 mt-1">
          {filteredIphones.length} produtos encontrados
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="bg-white px-3 py-3 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {["iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max", "iPhone 16", "iPhone 16 Pro Max", "iPhone 15", "iPhone 14"].map((category) => (
            <button
              key={category}
              onClick={() => setSearchTerm(category.replace("iPhone ", ""))}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                searchTerm && category.toLowerCase().includes(searchTerm.toLowerCase())
                  ? "bg-[#0086FF] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Sort Bar */}
      <div className="bg-white px-3 py-2 border-b border-gray-200 flex items-center justify-between">
        <span className="text-sm text-gray-600">Ordenar por</span>
        <select className="text-sm text-gray-800 font-medium bg-transparent border-none focus:outline-none">
          <option>Relevância</option>
          <option>Menor preço</option>
          <option>Maior preço</option>
          <option>Mais vendidos</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="p-3">
        <div className="grid grid-cols-2 gap-2">
          {filteredIphones.map((iphone) => (
            <ProductCard key={iphone.id} product={iphone} />
          ))}
        </div>

        {filteredIphones.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500">Nenhum produto encontrado</p>
            <button
              onClick={() => setSearchTerm("")}
              className="mt-2 text-[#0086FF] font-medium"
            >
              Ver todos os produtos
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-8">
        <div className="px-4 py-6">
          <div className="flex items-center gap-2 mb-4">
            <svg viewBox="0 0 120 32" className="h-6 w-auto" fill="white">
              <text x="0" y="22" fontSize="16" fontWeight="800" fill="white">magalu</text>
            </svg>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Atendimento</h4>
              <p className="text-gray-400">Segunda a sexta: 9h às 18h</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contato</h4>
              <p className="text-gray-400">contato@magalu.com.br</p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
            <p>© 2026 Magazine Luiza. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
