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
  totalAnnualNeeds: number;
  totalAnnualWants: number;
  assets: any[];
  expenses: any[];
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
  darkMode
}) => {
  return (
    <div className={`w-full h-full p-10 ${darkMode ? 'bg-red-700' : 'bg-blue-700'} bg-orange-500`}>
      <h1 className="text-4xl text-white">Test: Does this fill the space?</h1>
      <p className="text-white">DarkMode: {darkMode.toString()}</p>
    </div>
  );
};

export default Dashboard; 