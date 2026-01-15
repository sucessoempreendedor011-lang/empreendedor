import { Heart, Menu, Search, ShoppingCart, User } from "lucide-react";
import { useLocation } from "wouter";

/**
 * Header do Magazine Luiza Mobile
 * - Background azul gradiente (#0086FF -> #0066CC)
 * - Logo Magalu à esquerda
 * - Barra de busca centralizada
 * - Ícones de favoritos, carrinho e conta à direita
 */

interface MagaluHeaderProps {
  showSearch?: boolean;
  showBack?: boolean;
  title?: string;
}

export default function MagaluHeader({ showSearch = true, showBack = false, title }: MagaluHeaderProps) {
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-50 magalu-header shadow-md">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-3 py-2">
        {/* Left - Menu and Logo */}
        <div className="flex items-center gap-2">
          <button className="p-1 text-white">
            <Menu className="w-6 h-6" />
          </button>
          <button onClick={() => navigate("/")} className="flex items-center">
            {/* Magalu Logo */}
            <svg viewBox="0 0 120 32" className="h-7 w-auto" fill="white">
              <path d="M12 4C6.5 4 2 8.5 2 14s4.5 10 10 10c2.8 0 5.3-1.1 7.1-3l-2.1-2.1C15.6 20.2 13.9 21 12 21c-3.9 0-7-3.1-7-7s3.1-7 7-7c1.9 0 3.6.8 4.9 2l2.1-2.1C17.3 5.1 14.8 4 12 4z"/>
              <text x="28" y="22" fontSize="16" fontWeight="800" fill="white">magalu</text>
            </svg>
          </button>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-3">
          <button className="p-1 text-white relative">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-1 text-white relative">
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button className="p-1 text-white">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="px-3 pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar no Magalu"
              className="w-full pl-4 pr-10 py-2.5 bg-white rounded-full text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0086FF]">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* CEP Bar */}
      <div className="bg-white px-3 py-2 border-b border-gray-200">
        <button className="flex items-center gap-1 text-sm text-gray-600">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Informe seu CEP</span>
        </button>
      </div>
    </header>
  );
}
