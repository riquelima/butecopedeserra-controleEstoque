
import React, { useState } from 'react';
import { InventoryProvider } from './hooks/useInventory';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import Reports from './components/Reports';
import type { Page } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'Products':
        return <ProductList />;
      case 'Reports':
        return <Reports />;
      case 'Dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <InventoryProvider>
      <div className="flex h-screen bg-brand-light font-sans text-brand-dark">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header currentPage={activePage} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-light p-6 lg:p-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </InventoryProvider>
  );
};

export default App;
