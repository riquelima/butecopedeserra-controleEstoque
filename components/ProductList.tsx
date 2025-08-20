
import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import type { Product } from '../types';
import { MovementType } from '../types';
import { PlusCircleIcon } from './Icons';
import AddProductForm from './AddProductForm';
import Modal from './Modal';

const ProductList: React.FC = () => {
  const { products, addStockMovement } = useInventory();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isStockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockChange, setStockChange] = useState({ quantity: 0, type: MovementType.IN, reason: '' });
  
  const openStockModal = (product: Product, type: MovementType) => {
    setSelectedProduct(product);
    setStockChange({ quantity: 0, type, reason: type === MovementType.IN ? 'Recebimento' : 'Uso diário' });
    setStockModalOpen(true);
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && stockChange.quantity > 0) {
      addStockMovement({
        productId: selectedProduct.id,
        quantity: stockChange.quantity,
        type: stockChange.type,
        reason: stockChange.reason,
      });
      setStockModalOpen(false);
    }
  };
  
  const getStatus = (product: Product) => {
    if (product.quantity <= 0) return { text: 'Sem estoque', color: 'bg-gray-400' };
    if (product.quantity <= product.minQuantity) return { text: 'Estoque baixo', color: 'bg-danger' };
    return { text: 'Em estoque', color: 'bg-success' };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-brand-dark">Todos os Produtos</h2>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center bg-brand-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-secondary transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Adicionar Produto
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-brand-accent">
              <th className="p-3">Produto</th>
              <th className="p-3">Categoria</th>
              <th className="p-3 text-center">Quantidade</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3">Fornecedor</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
                const status = getStatus(product);
                return (
                    <tr key={product.id} className="border-b border-brand-light hover:bg-gray-50">
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3 text-gray-600">{product.category}</td>
                    <td className="p-3 text-center font-semibold text-lg">{product.quantity}</td>
                    <td className="p-3 text-center">
                        <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${status.color}`}>
                            {status.text}
                        </span>
                    </td>
                    <td className="p-3 text-gray-600">{product.supplier}</td>
                    <td className="p-3 text-right">
                        <button onClick={() => openStockModal(product, MovementType.IN)} className="bg-green-500 text-white px-3 py-1 rounded-md mr-2 text-sm hover:bg-green-600">+</button>
                        <button onClick={() => openStockModal(product, MovementType.OUT)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">-</button>
                    </td>
                    </tr>
                )
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Adicionar Novo Produto">
        <AddProductForm onClose={() => setAddModalOpen(false)} />
      </Modal>

      <Modal isOpen={isStockModalOpen} onClose={() => setStockModalOpen(false)} title={`Movimentar Estoque: ${selectedProduct?.name}`}>
        <form onSubmit={handleStockSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Movimento</label>
            <input type="text" value={stockChange.type} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm p-2" />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              type="number"
              id="quantity"
              value={stockChange.quantity}
              onChange={(e) => setStockChange(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-accent focus:border-brand-accent"
              min="1"
              required
            />
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Motivo</label>
            <input
              type="text"
              id="reason"
              value={stockChange.reason}
              onChange={(e) => setStockChange(prev => ({...prev, reason: e.target.value}))}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-accent focus:border-brand-accent"
              required
            />
          </div>
          <div className="flex justify-end pt-4">
            <button type="button" onClick={() => setStockModalOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-secondary">Salvar</button>
          </div>
        </form>
      </Modal>

    </div>
  );
};

export default ProductList;
