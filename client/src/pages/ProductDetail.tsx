import { useState } from "react";
import { useLocation, useParams } from "wouter";
import { iphones, calculatePriceByStorage } from "@/data/products";
import { ColorOption } from "@/types";
import { ArrowLeft, Check, ChevronRight, Heart, Minus, Plus, Share2, ShoppingCart, Truck } from "lucide-react";

/**
 * Página de Detalhes do Produto - Layout Magazine Luiza Mobile
 * - Header com botão voltar
 * - Galeria de imagens
 * - Informações do produto
 * - Seletor de variantes com indicação de esgotado
 * - Preços dinâmicos por armazenamento
 * - Botão Comprar que leva ao carrinho
 */

export default function ProductDetail() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const productId = params.id;

  const product = iphones.find((p) => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  
  // Encontrar a primeira cor em estoque como padrão
  const defaultColor = product?.colors.find(c => c.inStock) || product?.colors[0];
  const [selectedColor, setSelectedColor] = useState<ColorOption | undefined>(defaultColor);
  
  // 256GB pré-selecionado como padrão
  const [selectedStorage, setSelectedStorage] = useState("256GB");

  // Função para obter a imagem baseada na cor selecionada
  const getProductImage = () => {
    if (selectedColor?.image) {
      return selectedColor.image;
    }
    return product?.image || "";
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-4">
            Produto não encontrado
          </h1>
          <button
            onClick={() => navigate("/catalogo")}
            className="magalu-btn-green px-6 py-2 rounded-lg font-semibold"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Calcular preços baseado no armazenamento selecionado
  const currentPrice = calculatePriceByStorage(product.basePrice, selectedStorage);
  const pixPrice = Math.round(currentPrice * 0.9);
  const installmentValue = Math.round((currentPrice * quantity) / 40);

  // Verificar se a cor selecionada está em estoque
  const isSelectedColorInStock = selectedColor?.inStock ?? true;

  // Função para ir ao carrinho
  const handleBuy = () => {
    if (!isSelectedColorInStock) return;
    
    // Salvar dados do produto no localStorage para o carrinho
    const cartItem = {
      productId: product.id,
      productName: `${product.displayName} ${selectedStorage}`,
      color: selectedColor?.name || "",
      storage: selectedStorage,
      quantity: quantity,
      price: currentPrice,
      image: getProductImage(),
    };
    
    localStorage.setItem("cartItem", JSON.stringify(cartItem));
    navigate("/carrinho");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 magalu-header">
        <div className="flex items-center justify-between px-3 py-3">
          <button
            onClick={() => navigate("/catalogo")}
            className="p-1 text-white"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <button className="p-1 text-white">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-1 text-white">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-1 text-white relative">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Product Content */}
      <div className="bg-white">
        {/* Product Image */}
        <div className="relative p-4 bg-white">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
            <span className="magalu-badge-full text-xs font-semibold px-2 py-0.5 rounded">
              Full
            </span>
          </div>

          <img
            src={getProductImage()}
            alt={`${product.displayName} - ${selectedColor?.name || ""}`}
            className="w-full h-64 object-contain transition-all duration-300"
          />

          {/* Image Dots */}
          <div className="flex justify-center gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                className={`w-2 h-2 rounded-full ${dot === 1 ? "bg-[#0086FF]" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="px-4 pb-4">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="w-4 h-4 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-[#0086FF] font-medium">4.9 (2.322)</span>
          </div>

          {/* Product Name */}
          <h1 className="text-lg font-bold text-gray-800 mb-3">
            Apple {product.displayName} {selectedStorage} {product.specs.camera} iOS 5G
          </h1>

          {/* Storage Selector - 256GB pré-selecionado */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Armazenamento interno <strong>{selectedStorage}</strong></p>
            <div className="flex gap-2">
              {["128GB", "256GB", "512GB"].map((storage) => (
                <button
                  key={storage}
                  onClick={() => setSelectedStorage(storage)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                    selectedStorage === storage
                      ? "border-[#0086FF] bg-[#0086FF] text-white"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Cor <strong>{selectedColor?.name || ""}</strong>
              {!isSelectedColorInStock && (
                <span className="ml-2 text-red-500 text-xs font-semibold">(Esgotado)</span>
              )}
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  disabled={!color.inStock}
                  className={`px-3 py-1.5 rounded-lg text-sm border relative ${
                    selectedColor?.name === color.name
                      ? "border-[#0086FF] bg-blue-50 text-[#0086FF]"
                      : color.inStock
                        ? "border-gray-300 text-gray-700"
                        : "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                  }`}
                >
                  {color.name}
                  {!color.inStock && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1 rounded">
                      Esgotado
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Seller Info */}
          <p className="text-sm text-gray-600 mb-4">
            Vendido e entregue por <strong className="text-[#0086FF]">Magalu</strong>
          </p>
        </div>
      </div>

      {/* Price Section */}
      <div className="bg-white mt-2 px-4 py-4">
        {/* Original Price */}
        <p className="text-sm text-gray-400 line-through">
          R$ {product.originalPrice.toLocaleString("pt-BR")}
        </p>

        {/* Discount Badge */}
        <div className="inline-block magalu-badge-discount text-xs font-bold px-2 py-1 rounded mb-2">
          {product.discount}% OFF
        </div>

        {/* Current Price */}
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-3xl font-bold magalu-price-green">
            R$ {currentPrice.toLocaleString("pt-BR")}
          </span>
        </div>

        {/* PIX Price */}
        <p className="text-sm text-gray-600 mb-1">
          ou <span className="magalu-price-green font-semibold">R$ {pixPrice.toLocaleString("pt-BR")}</span> no Pix (10% de desconto)
        </p>

        {/* Installment Info */}
        <p className="text-sm text-gray-600 mb-1">
          Em até 40x de R$ {installmentValue.toLocaleString("pt-BR")} sem juros
        </p>

        {/* Quantity Selector */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm text-gray-600 font-medium">Quantidade:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Payment Link */}
        <button className="text-[#0086FF] text-sm font-medium mt-3 flex items-center gap-1">
          Ver opções de pagamento
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Action Button - Apenas Comprar */}
      <div className="bg-white mt-2 px-4 py-4">
        <button 
          onClick={handleBuy}
          disabled={!isSelectedColorInStock}
          className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 ${
            isSelectedColorInStock 
              ? "magalu-btn-green" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {isSelectedColorInStock ? "Comprar" : "Cor Esgotada"}
        </button>
      </div>

      {/* Benefits */}
      <div className="bg-white mt-2 px-4 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Truck className="w-5 h-5 text-[#0086FF]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Entrega Full</p>
            <p className="text-xs text-gray-500">Entrega rápida, frete barato e mais segurança</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Check className="w-5 h-5 text-[#0086FF]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Magalu garante</p>
            <p className="text-xs text-gray-500">Sua compra, do pedido à entrega</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-[#0086FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Devolução Gratuita</p>
            <p className="text-xs text-gray-500">Em até 7 dias após receber o produto</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Especificações</h2>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Display</span>
            <span className="text-sm font-medium text-gray-800">{product.specs.display}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Processador</span>
            <span className="text-sm font-medium text-gray-800">{product.specs.processor}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Câmera</span>
            <span className="text-sm font-medium text-gray-800">{product.specs.camera}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Bateria</span>
            <span className="text-sm font-medium text-gray-800">{product.specs.battery}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-sm text-gray-600">Armazenamento</span>
            <span className="text-sm font-medium text-gray-800">{selectedStorage}</span>
          </div>
        </div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-20" />
    </div>
  );
}
