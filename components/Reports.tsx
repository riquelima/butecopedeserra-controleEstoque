
import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { MovementType } from '../types';

const Reports: React.FC = () => {
    const { products, movements } = useInventory();

    // Data for Pie Chart (Stock by Category)
    const categoryData = products.reduce((acc, product) => {
        const category = product.category;
        acc[category] = (acc[category] || 0) + product.quantity;
        return acc;
    }, {} as Record<string, number>);

    const pieChartData = Object.keys(categoryData).map(key => ({
        name: key,
        value: categoryData[key]
    }));

    const COLORS = ['#4a2c2a', '#8d6e63', '#c8a97e', '#f5f0e1'];

    // Data for Line Chart (Consumption over time)
    const consumptionData = movements
        .filter(m => m.type === MovementType.OUT || m.type === MovementType.WASTE)
        .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map(m => ({
            date: new Date(m.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit'}),
            quantity: m.quantity
        }));
        
    const aggregatedConsumption = consumptionData.reduce((acc, current) => {
        const existing = acc.find(item => item.date === current.date);
        if (existing) {
            existing.quantity += current.quantity;
        } else {
            acc.push({ ...current });
        }
        return acc;
    }, [] as {date: string; quantity: number}[]).slice(-10); // Last 10 days


    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-brand-dark">Análises de Estoque</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-brand-dark mb-4">Distribuição de Estoque por Categoria</h3>
                    <div className="w-full h-80">
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold text-brand-dark mb-4">Tendência de Consumo (Últimos 10 Dias)</h3>
                     <div className="w-full h-80">
                        <ResponsiveContainer>
                             <LineChart data={aggregatedConsumption} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fill: '#4a2c2a' }}/>
                                <YAxis tick={{ fill: '#4a2c2a' }}/>
                                <Tooltip contentStyle={{ backgroundColor: '#f5f0e1', border: '1px solid #c8a97e' }} />
                                <Legend />
                                <Line type="monotone" dataKey="quantity" name="Itens Consumidos" stroke="#4a2c2a" strokeWidth={2} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-brand-dark mb-4">Giro de Estoque (Em breve)</h3>
                <p className="text-gray-500">Esta seção trará análises detalhadas sobre o giro de cada produto, ajudando a identificar itens de alta e baixa movimentação para otimizar suas compras.</p>
            </div>
        </div>
    );
};

export default Reports;
