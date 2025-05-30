import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, ShieldCheck, Heart } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  colorClass?: string;
  darkMode: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon: Icon, colorClass = "blue", darkMode }) => (
  <div className={`${darkMode ? 'bg-gray-800 shadow-slate-700' : 'bg-white shadow-slate-200'} p-6 rounded-xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className={`text-md font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{title}</h3>
      <div className={`p-2.5 rounded-lg bg-opacity-20 ${
        darkMode 
          ? `bg-${colorClass}-500 text-${colorClass}-300` 
          : `bg-${colorClass}-100 text-${colorClass}-600`
      }`}>
        <Icon size={20} />
      </div>
    </div>
    <p className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{value}</p>
  </div>
);

interface DashboardProps {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  totalAnnualExpenses: number;
  darkMode: boolean;
}

const formatCurrency = (amount: number, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const Dashboard: React.FC<DashboardProps> = ({
  netWorth,
  totalAssets,
  totalLiabilities,
  totalAnnualExpenses,
  darkMode
}) => {
  return (
    <div className={`${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <h2 className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <DashboardCard 
          title="Net Worth" 
          value={formatCurrency(netWorth)} 
          icon={DollarSign} 
          colorClass="green" 
          darkMode={darkMode} 
        />
        <DashboardCard 
          title="Total Assets" 
          value={formatCurrency(totalAssets)} 
          icon={TrendingUp} 
          colorClass="blue" 
          darkMode={darkMode} 
        />
        <DashboardCard 
          title="Total Liabilities" 
          value={formatCurrency(totalLiabilities)} 
          icon={TrendingDown} 
          colorClass="red" 
          darkMode={darkMode} 
        />
        <DashboardCard 
          title="Annual Expenses" 
          value={formatCurrency(totalAnnualExpenses)} 
          icon={ShoppingCart} 
          colorClass="yellow" 
          darkMode={darkMode} 
        />
      </div>
    </div>
  );
};

export default Dashboard; 