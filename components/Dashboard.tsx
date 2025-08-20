
import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { AlertTriangleIcon, CheckCircleIcon } from './Icons';

const StatCard: React.FC<{ title: string; value: string | number; color: string }> = ({ title, value, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:scale-105">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
);

const Dashboard: React.FC = () => {
    const { products } = useInventory();

    const lowStockItems = products.filter(p => p.quantity <= p.minQuantity);
    
    const today = new Date();
    const expiringSoonItems = products.filter(p => {
        const expDate = new Date(p.expirationDate);
        const diffTime = expDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 && diffDays <= 7;
    });

    const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
    
    const chartData = products.slice(0, 5).map(p => ({
        name: p.name.split(' ').slice(0,2).join(' '),
        quantidade: p.quantity,
    }));

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total de Itens em Estoque" value={totalItems} color="text-brand-primary" />
                <StatCard title="Itens com Estoque Baixo" value={lowStockItems.length} color={lowStockItems.length > 0 ? "text-danger" : "text-success"} />
                <StatCard title="Itens Próximos da Validade" value={expiringSoonItems.length} color={expiringSoonItems.length > 0 ? "text-warning" : "text-success"}/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-brand-dark mb-4">Alertas Inteligentes</h3>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                        {lowStockItems.length === 0 && expiringSoonItems.length === 0 && (
                            <div className="flex items-center p-4 bg-green-50 text-green-700 rounded-lg">
                                <CheckCircleIcon className="w-6 h-6 mr-3"/>
                                <span>Tudo certo! Nenhum alerta no momento.</span>
                            </div>
                        )}
                        {lowStockItems.map(item => (
                            <div key={item.id} className="flex items-center p-4 bg-red-50 text-danger rounded-lg animate-pulse">
                                <AlertTriangleIcon className="w-6 h-6 mr-3"/>
                                <span>
                                    <strong>Estoque Baixo:</strong> {item.name} (Apenas {item.quantity} unidades restantes).
                                </span>
                            </div>
                        ))}
                         {expiringSoonItems.map(item => (
                            <div key={item.id} className="flex items-center p-4 bg-orange-50 text-warning rounded-lg">
                                <AlertTriangleIcon className="w-6 h-6 mr-3"/>
                                <span>
                                    <strong>Validade Próxima:</strong> {item.name} (Vence em {new Date(item.expirationDate).toLocaleDateString()}).
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-brand-dark mb-4">Resumo de Quantidades</h3>
                    <div className="w-full h-80">
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" tick={{ fill: '#4a2c2a' }} />
                                <YAxis tick={{ fill: '#4a2c2a' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#f5f0e1', border: '1px solid #c8a97e' }} />
                                <Bar dataKey="quantidade" fill="#8d6e63" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
