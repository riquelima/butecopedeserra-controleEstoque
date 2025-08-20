import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product, StockMovement } from '../types';
import { ProductCategory, MovementType } from '../types';

// Mock Data
const initialProducts: Product[] = [
  { id: '1', name: 'Tomate Italiano', category: ProductCategory.INGREDIENTS, supplier: 'Fazenda Sol', quantity: 20, minQuantity: 10, expirationDate: '2024-08-15', description: 'Ideal para molhos e saladas.' },
  { id: '2', name: 'Cerveja Artesanal IPA', category: ProductCategory.BEVERAGES, supplier: 'Cevada Pura', quantity: 8, minQuantity: 12, expirationDate: '2024-10-20', description: 'Cerveja de amargor acentuado e notas cítricas.' },
  { id: '3', name: 'Detergente Neutro', category: ProductCategory.CLEANING, supplier: 'LimpaTudo', quantity: 30, minQuantity: 5, expirationDate: '2025-01-01', description: 'Para limpeza geral de utensílios e superfícies.' },
  { id: '4', name: 'Pão de Hambúrguer', category: ProductCategory.INGREDIENTS, supplier: 'Pão & Cia', quantity: 50, minQuantity: 20, expirationDate: '2024-07-30', description: 'Pão de brioche macio e amanteigado.' },
  { id: '5', name: 'Vinho Tinto Malbec', category: ProductCategory.BEVERAGES, supplier: 'Vinhos do Sul', quantity: 15, minQuantity: 10, expirationDate: '2026-05-01', description: 'Vinho encorpado com notas de ameixa e baunilha.' },
];

const initialMovements: StockMovement[] = [
    {id: 'm1', productId: '1', type: MovementType.IN, quantity: 20, reason: 'Entrega semanal', timestamp: new Date().toISOString()},
    {id: 'm2', productId: '2', type: MovementType.OUT, quantity: 5, reason: 'Venda do dia', timestamp: new Date().toISOString()},
];


interface InventoryContextType {
  products: Product[];
  movements: StockMovement[];
  addProduct: (product: Omit<Product, 'id' | 'quantity'>) => void;
  updateProduct: (product: Product) => void;
  addStockMovement: (movement: Omit<StockMovement, 'id' | 'timestamp'>) => void;
  getProductById: (id: string) => Product | undefined;
  getMovementHistory: (productId: string) => StockMovement[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements);

  const addProduct = useCallback((productData: Omit<Product, 'id' | 'quantity'>) => {
    const newProduct: Product = {
      ...productData,
      id: new Date().toISOString(), // Simple unique ID
      quantity: 0, // Initial quantity is 0, updated with movements
    };
    setProducts(prev => [...prev, newProduct]);
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  }, []);

  const addStockMovement = useCallback((movementData: Omit<StockMovement, 'id' | 'timestamp'>) => {
    const newMovement: StockMovement = {
      ...movementData,
      id: new Date().toISOString() + Math.random(),
      timestamp: new Date().toISOString(),
    };
    setMovements(prev => [newMovement, ...prev]);
    setProducts(prev => prev.map(p => {
      if (p.id === movementData.productId) {
        let newQuantity = p.quantity;
        if(movementData.type === MovementType.IN) {
            newQuantity += movementData.quantity;
        } else {
            newQuantity -= movementData.quantity;
        }
        return { ...p, quantity: Math.max(0, newQuantity) };
      }
      return p;
    }));
  }, []);
  
  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  const getMovementHistory = useCallback((productId: string) => {
    return movements.filter(m => m.productId === productId);
  }, [movements]);

  return React.createElement(
    InventoryContext.Provider,
    {
      value: {
        products,
        movements,
        addProduct,
        updateProduct,
        addStockMovement,
        getProductById,
        getMovementHistory,
      },
    },
    children
  );
};

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};