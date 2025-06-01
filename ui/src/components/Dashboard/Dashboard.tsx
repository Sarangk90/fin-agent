import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.scss';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  colorClass?: string;
  darkMode: boolean;
  path?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass = 'blue', 
  darkMode,
  path
}) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div 
      className={`${styles.card} ${styles[colorClass]} ${darkMode ? styles.dark : styles.light}`}
      onClick={handleClick}
      style={{ cursor: path ? 'pointer' : 'default' }}
      role={path ? 'button' : undefined}
      tabIndex={path ? 0 : undefined}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && path) {
          handleClick();
        }
      }}
    >
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
        <div className={styles.cardIcon}>
          <Icon size={20} />
        </div>
      </div>
      <p className={styles.cardValue}>{value}</p>
    </div>
  );
};

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
        <div className={styles.netWorthCard}>
          <DashboardCard
            title="Net Worth"
            value={formatCurrency(netWorth)}
            icon={DollarSign}
            colorClass={netWorth < 0 ? 'red' : 'blue'}
            darkMode={darkMode}
            path="/"
          />
        </div>
        <div className={styles.otherCards}>
          <DashboardCard
            title="Total Assets"
            value={formatCurrency(totalAssets)}
            icon={TrendingUp}
            colorClass="green"
            darkMode={darkMode}
            path="/assets"
          />
          <DashboardCard
            title="Total Liabilities"
            value={formatCurrency(totalLiabilities)}
            icon={TrendingDown}
            colorClass="red"
            darkMode={darkMode}
            path="/liabilities"
          />
          <DashboardCard
            title="Monthly Expenses"
            value={formatCurrency(totalAnnualExpenses / 12)}
            icon={ShoppingCart}
            colorClass="purple"
            darkMode={darkMode}
            path="/expenses"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 