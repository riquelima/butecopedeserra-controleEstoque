
import React from 'react';
import type { Page } from '../types';
import { DashboardIcon, BoxIcon, ChartIcon } from './Icons';

type SidebarProps = {
  activePage: Page;
  setActivePage: (page: Page) => void;
};

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: Page;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-lg transition-all duration-200 ease-in-out rounded-lg ${
      isActive
        ? 'bg-brand-accent text-brand-dark font-semibold shadow-md'
        : 'text-brand-light hover:bg-brand-secondary hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  return (
    <div className="w-64 bg-brand-primary text-white p-6 flex flex-col">
      <div className="flex items-center mb-12">
        <span className="text-3xl font-bold text-brand-accent tracking-wider">Buteco</span>
      </div>
      <nav className="flex flex-col space-y-4">
        <NavItem
          icon={<DashboardIcon className="w-6 h-6" />}
          label="Dashboard"
          isActive={activePage === 'Dashboard'}
          onClick={() => setActivePage('Dashboard')}
        />
        <NavItem
          icon={<BoxIcon className="w-6 h-6" />}
          label="Products"
          isActive={activePage === 'Products'}
          onClick={() => setActivePage('Products')}
        />
        <NavItem
          icon={<ChartIcon className="w-6 h-6" />}
          label="Reports"
          isActive={activePage === 'Reports'}
          onClick={() => setActivePage('Reports')}
        />
      </nav>
      <div className="mt-auto text-center text-brand-secondary text-sm">
        <p>&copy; {new Date().getFullYear()} Buteco Pé de Serra</p>
        <p>v1.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
