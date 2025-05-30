import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import styles from './Dashboard.module.scss';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  colorClass?: string;
  darkMode: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass = 'blue', 
  darkMode 
}) => (
  <div className={`${styles.card} ${styles[colorClass]} ${darkMode ? styles.dark : styles.light}`}>
    <div className={styles.cardHeader}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.cardIcon}>
        <Icon size={20} />
      </div>
    </div>
    <p className={styles.cardValue}>{value}</p>
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
    <div className={`${styles.dashboard} ${darkMode ? styles.dark : styles.light}`}>
      <h2 className={styles.title}>Overview</h2>
      <div className={styles.cardsGrid}>
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