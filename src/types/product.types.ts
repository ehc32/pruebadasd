// Tipos legacy para compatibilidad
export type Discount = {
  amount: number;
  percentage: number;
};

// Tipo legacy - mantener para compatibilidad temporal
export type LegacyProduct = {
  id: number;
  title: string;
  srcUrl: string;
  gallery?: string[];
  price: number;
  discount: Discount;
  rating: number;
};

// Re-exportar el tipo de la API como Product principal
export type { Product } from "@/lib/api/products";
