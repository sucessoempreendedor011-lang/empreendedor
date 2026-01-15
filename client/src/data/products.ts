import { iPhone } from "@/types";

// Preços base para 256GB (com desconto de 15% aplicado)
// Fórmula: preço original * 0.85 (15% de desconto)
// Storage: 128GB = -5%, 256GB = base, 512GB = +5%

export const iphones: iPhone[] = [
  {
    id: "iphone-17",
    model: "iPhone 17",
    displayName: "iPhone 17",
    storage: "256GB",
    basePrice: 6799, // Preço base para 256GB (7999 * 0.85)
    originalPrice: 7999,
    discountedPrice: 6799,
    discount: 15,
    image: "/images/iphone-17-preto.jpg",
    colors: [
      { name: "Preto", image: "/images/iphone-17-preto.jpg", inStock: true },
      { name: "Branco", image: "/images/iphone-17-branco.jpg", inStock: true },
      { name: "Azul", image: "/images/iphone-17-azul.jpg", inStock: true },
      { name: "Verde", image: "/images/iphone-17-verde.jpg", inStock: true },
    ],
    specs: {
      display: "6.1\" Super Retina",
      processor: "A19",
      camera: "48MP Principal",
      battery: "3582 mAh",
    },
    maxInstallments: 40,
    installmentPrice: 170,
  },
  {
    id: "iphone-17-pro",
    model: "iPhone 17 Pro",
    displayName: "iPhone 17 Pro",
    storage: "256GB",
    basePrice: 9774, // 11499 * 0.85
    originalPrice: 11499,
    discountedPrice: 9774,
    discount: 15,
    image: "/images/iphone-17-pro-prateado.jpg",
    colors: [
      { name: "Prateado", image: "/images/iphone-17-pro-prateado.jpg", inStock: true },
      { name: "Preto", image: "/images/iphone-17-pro.jpg", inStock: false },
      { name: "Ouro", image: "/images/iphone-17-pro.jpg", inStock: false },
      { name: "Laranja", image: "/images/iphone-17-pro-laranja.jpg", inStock: true },
      { name: "Azul Intenso", image: "/images/iphone-17-pro-azul-intenso.jpg", inStock: true },
    ],
    specs: {
      display: "6.3\" Super Retina XDR",
      processor: "A19 Pro",
      camera: "48MP Tripla",
      battery: "3349 mAh",
    },
    maxInstallments: 40,
    installmentPrice: 244,
  },
  {
    id: "iphone-17-pro-max",
    model: "iPhone 17 Pro Max",
    displayName: "iPhone 17 Pro Max",
    storage: "256GB",
    basePrice: 10624, // 12499 * 0.85
    originalPrice: 12499,
    discountedPrice: 10624,
    discount: 15,
    image: "/images/iphone-17-pro-max-prateado.jpg",
    colors: [
      { name: "Prateado", image: "/images/iphone-17-pro-max-prateado.jpg", inStock: true },
      { name: "Preto", image: "/images/iphone-17-pro-max-prateado.jpg", inStock: false },
      { name: "Ouro", image: "/images/iphone-17-pro-max-prateado.jpg", inStock: false },
      { name: "Laranja Cósmico", image: "/images/iphone-17-pro-max-laranja-cosmico.jpg", inStock: true },
      { name: "Azul Intenso", image: "/images/iphone-17-pro-max-azul-intenso.jpg", inStock: true },
    ],
    specs: {
      display: "6.9\" Super Retina XDR",
      processor: "A19 Pro",
      camera: "48MP Tripla",
      battery: "4685 mAh",
    },
    maxInstallments: 40,
    installmentPrice: 266,
  },
  {
    id: "iphone-16",
    model: "iPhone 16",
    displayName: "iPhone 16",
    storage: "256GB",
    basePrice: 5779, // 6799 * 0.85
    originalPrice: 6799,
    discountedPrice: 5779,
    discount: 15,
    image: "/images/iphone-16-preto.jpg",
    colors: [
      { name: "Preto", image: "/images/iphone-16-preto.jpg", inStock: true },
      { name: "Branco", image: "/images/iphone-16-branco.jpg", inStock: true },
      { name: "Rosa", image: "/images/iphone-16-rosa.jpg", inStock: true },
      { name: "Azul", image: "/images/iphone-16-azul.jpg", inStock: true },
    ],
    specs: {
      display: "6.1\" Super Retina",
      processor: "A18",
      camera: "48MP Principal",
      battery: "3582 mAh",
    },
    maxInstallments: 40,
    installmentPrice: 144,
  },
  {
    id: "iphone-16-pro-max",
    model: "iPhone 16 Pro Max",
    displayName: "iPhone 16 Pro Max",
    storage: "256GB",
    basePrice: 8924, // 10499 * 0.85
    originalPrice: 10499,
    discountedPrice: 8924,
    discount: 15,
    image: "/images/iphone16promax-preto.jpg",
    colors: [
      { name: "Preto", image: "/images/iphone16promax-preto.jpg", inStock: true },
      { name: "Prateado", image: "/images/iphone16promax-preto.jpg", inStock: false },
      { name: "Ouro", image: "/images/iphone16promax-preto.jpg", inStock: false },
      { name: "Bronze", image: "/images/iphone16promax-preto.jpg", inStock: false },
    ],
    specs: {
      display: "6.9\" Super Retina XDR",
      processor: "A18 Pro",
      camera: "48MP Tripla",
      battery: "4685 mAh",
    },
    maxInstallments: 40,
    installmentPrice: 223,
  },
  {
    id: "iphone-15",
    model: "iPhone 15",
    displayName: "iPhone 15",
    storage: "256GB",
    basePrice: 5524, // 6499 * 0.85
    originalPrice: 6499,
    discountedPrice: 5524,
    discount: 15,
    image: "/images/iphone-15-preto.jpg",
    colors: [
      { name: "Preto", image: "/images/iphone-15-preto.jpg", inStock: true },
      { name: "Branco", image: "/images/iphone-15-branco.jpg", inStock: true },
      { name: "Rosa", image: "/images/iphone-15-rosa.jpg", inStock: true },
      { name: "Amarelo", image: "/images/iphone-15-amarelo.jpg", inStock: true },
    ],
    specs: {
      display: "6.1\" Liquid Retina",
      processor: "A16 Bionic",
      camera: "48MP Principal",
      battery: "3349 mAh",
    },
    maxInstallments: 40,
    installmentPrice: 138,
  },
  {
    id: "iphone-14",
    model: "iPhone 14",
    displayName: "iPhone 14",
    storage: "256GB",
    basePrice: 5099, // 5999 * 0.85
    originalPrice: 5999,
    discountedPrice: 5099,
    discount: 15,
    image: "/images/iphone-14-preto.jpg",
    colors: [
      { name: "Preto", image: "/images/iphone-14-preto.jpg", inStock: true },
      { name: "Branco", image: "/images/iphone-14-branco.jpeg", inStock: true },
      { name: "Roxo", image: "/images/iphone-14-roxo.jpg", inStock: true },
      { name: "Azul", image: "/images/iphone-14-azul.jpg", inStock: true },
    ],
    specs: {
      display: "6.1\" Super Retina",
      processor: "A15 Bionic",
      camera: "12MP Dupla",
      battery: "3279 mAh",
    },
    maxInstallments: 40,
    installmentPrice: 127,
  },
];

// Função para calcular preço baseado no armazenamento
export function calculatePriceByStorage(basePrice: number, storage: string): number {
  switch (storage) {
    case "128GB":
      return Math.round(basePrice * 0.95); // -5%
    case "256GB":
      return basePrice; // preço base
    case "512GB":
      return Math.round(basePrice * 1.05); // +5%
    default:
      return basePrice;
  }
}
