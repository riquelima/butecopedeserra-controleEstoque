
import React from 'react';
import type { Page } from '../types';

type HeaderProps = {
  currentPage: Page;
};

const Header: React.FC<HeaderProps> = ({ currentPage }) => {
  const pageTitles: Record<Page, string> = {
      Dashboard: 'Visão Geral do Estoque',
      Products: 'Gerenciamento de Produtos',
      Reports: 'Relatórios de Consumo'
  }
  return (
    <header className="bg-white shadow-sm p-4 z-10">
      <h1 className="text-2xl font-bold text-brand-dark">{pageTitles[currentPage]}</h1>
    </header>
  );
};

export default Header;
