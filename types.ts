
export type Page = 'Dashboard' | 'Products' | 'Reports';

export enum ProductCategory {
  BEVERAGES = 'Bebidas',
  INGREDIENTS = 'Ingredientes',
  CLEANING = 'Limpeza',
  OTHER = 'Outros',
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  supplier: string;
  quantity: number;
  minQuantity: number;
  expirationDate: string; // YYYY-MM-DD
  description?: string;
}

export enum MovementType {
  IN = 'Entrada',
  OUT = 'Saída',
  WASTE = 'Desperdício'
}

export interface StockMovement {
  id: string;
  productId: string;
  type: MovementType;
  quantity: number;
  reason: string;
  timestamp: string; // ISO 8601
}
