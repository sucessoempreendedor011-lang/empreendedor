export interface ColorOption {
  name: string;
  image: string;
  inStock: boolean;
}

export interface iPhone {
  id: string;
  model: string;
  displayName: string;
  storage: string;
  basePrice: number; // Preço base para 256GB
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  image: string;
  colors: ColorOption[];
  specs: {
    display: string;
    processor: string;
    camera: string;
    battery: string;
  };
  maxInstallments: number;
  installmentPrice: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  color: string;
  storage: string;
  quantity: number;
  price: number;
  image: string;
}

export type PaymentMethod = "pix" | "card" | "store";
