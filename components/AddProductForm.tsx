
import React, { useState } from 'react';
import { useInventory } from '../hooks/useInventory';
import { ProductCategory } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { SparklesIcon } from './Icons';

type AddProductFormProps = {
  onClose: () => void;
};

const AddProductForm: React.FC<AddProductFormProps> = ({ onClose }) => {
  const { addProduct } = useInventory();
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>(ProductCategory.INGREDIENTS);
  const [supplier, setSupplier] = useState('');
  const [minQuantity, setMinQuantity] = useState(10);
  const [expirationDate, setExpirationDate] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    if (!name) {
      alert('Por favor, insira o nome do produto primeiro.');
      return;
    }
    setIsGenerating(true);
    const generatedDesc = await generateProductDescription(name);
    setDescription(generatedDesc);
    setIsGenerating(false);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({ name, category, supplier, minQuantity, expirationDate, description });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
        <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-accent focus:border-brand-accent"/>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoria</label>
          <select id="category" value={category} onChange={e => setCategory(e.target.value as ProductCategory)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-accent focus:border-brand-accent">
            {Object.values(ProductCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Fornecedor</label>
          <input type="text" id="supplier" value={supplier} onChange={e => setSupplier(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-accent focus:border-brand-accent"/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="minQuantity" className="block text-sm font-medium text-gray-700">Qtde. Mínima</label>
          <input type="number" id="minQuantity" value={minQuantity} onChange={e => setMinQuantity(parseInt(e.target.value))} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-accent focus:border-brand-accent"/>
        </div>
        <div>
          <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">Data de Validade</label>
          <input type="date" id="expirationDate" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-accent focus:border-brand-accent"/>
        </div>
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
        <div className="relative">
          <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-brand-accent focus:border-brand-accent"></textarea>
          <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="absolute bottom-2 right-2 flex items-center bg-brand-accent text-brand-dark px-3 py-1 text-sm rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
            <SparklesIcon className="w-4 h-4 mr-1"/>
            {isGenerating ? 'Gerando...' : 'Gerar com IA'}
          </button>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Cancelar</button>
        <button type="submit" className="bg-brand-primary text-white px-4 py-2 rounded-md hover:bg-brand-secondary">Salvar Produto</button>
      </div>
    </form>
  );
};

export default AddProductForm;
