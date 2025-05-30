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
  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-lg transition-all hover:shadow-xl`}>
    <div className="flex items-center justify-between mb-3">
      <h3 className={`text-lg font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{title}</h3>
      <div className={`p-2 rounded-full bg-${colorClass}-100 dark:bg-${colorClass}-900/50 text-${colorClass}-500 dark:text-${colorClass}-300`}>
        <Icon size={24} />
      </div>
    </div>
    <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
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
    <div className={`p-6 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
      <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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