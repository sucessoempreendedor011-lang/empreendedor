import { Heart } from "lucide-react";
import { useLocation } from "wouter";
import { iPhone } from "@/types";

/**
 * Card de Produto estilo Magazine Luiza Mobile
 * - Badge "Full" em azul no canto superior
 * - Badge de desconto em amarelo
 * - Imagem do produto centralizada
 * - Nome do produto em preto
 * - Avaliação com estrelas
 * - Preço original riscado
 * - Preço com desconto em verde
 * - Parcelamento
 */

interface ProductCardProps {
  product: iPhone;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [, navigate] = useLocation();

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  // Calcular preço no PIX (10% de desconto adicional)
  const pixPrice = Math.round(product.discountedPrice * 0.9);
  const pixDiscount = 10;

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow relative"
    >
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        <span className="magalu-badge-full text-xs font-semibold px-2 py-0.5 rounded">
          Full
        </span>
      </div>

      {/* Favorite Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); }}
        className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50"
      >
        <Heart className="w-4 h-4 text-gray-400" />
      </button>

      {/* Discount Badge */}
      <div className="absolute top-10 left-2 z-10">
        <div className="magalu-badge-discount text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          <span className="text-[10px]">ATÉ</span>
          <span className="text-sm">40x</span>
        </div>
      </div>

      {/* Product Image */}
      <div className="p-4 pt-12 pb-2 flex items-center justify-center bg-white">
        <img
          src={product.image}
          alt={product.displayName}
          className="w-full h-32 object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 pt-1">
        {/* Product Name */}
        <h3 className="text-sm text-gray-800 font-medium line-clamp-2 mb-1 leading-tight">
          {product.displayName} {product.storage}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-3 h-3 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-gray-500">(1.234)</span>
        </div>

        {/* Original Price */}
        <p className="text-xs text-gray-400 line-through">
          R$ {product.originalPrice.toLocaleString("pt-BR")}
        </p>

        {/* Installment Info */}
        <p className="text-xs text-gray-600 mb-1">
          {product.maxInstallments}x de R$ {product.installmentPrice.toLocaleString("pt-BR")} sem juros
        </p>

        {/* PIX Price */}
        <div className="flex items-baseline gap-1">
          <span className="text-xs text-gray-600">ou</span>
          <span className="text-lg font-bold magalu-price-green">
            R$ {pixPrice.toLocaleString("pt-BR")}
          </span>
          <span className="text-sm magalu-price-green">no Pix</span>
        </div>

        {/* PIX Discount Badge */}
        <span className="text-xs text-green-600 font-medium">
          ({pixDiscount}% de desconto no pix)
        </span>
      </div>
    </div>
  );
}
