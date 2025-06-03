import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, Target, PieChart, CheckCircle, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.scss';

import { calculateFIStatus } from '../../services/fiService';
import type { UserFIParameters, FinancialIndependenceResult } from '../../types/fiTypes';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  colorClass?: string;
  darkMode: boolean;
  path?: string;
  children?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  colorClass = 'blue', 
  darkMode,
  path,
  children
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
      {children}
    </div>
  );
};

interface DashboardProps {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  totalAnnualExpenses: number;
  totalGoals: number;
  darkMode: boolean;
}

const formatCurrency = (amount: number | string, currency = 'INR') => {
  if (typeof amount === 'string') return amount;
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
  totalGoals,
  darkMode
}) => {
  const [fiParams, setFiParams] = useState<UserFIParameters>({
    desired_annual_fi_expenses: 1200000,
    swr_percentage: 4.0,
    emergency_fund_to_exclude: 500000,
    primary_residence_equity_to_exclude: 0,
    fp_asset_classes_for_investable: ["Retirement", "General Investment", "Equity", "Debt"],
  });
  const [fiResult, setFiResult] = useState<FinancialIndependenceResult | null>(null);
  const [isLoadingFI, setIsLoadingFI] = useState<boolean>(true);
  const [errorFI, setErrorFI] = useState<string | null>(null);

  useEffect(() => {
    const fetchFIData = async () => {
      try {
        setIsLoadingFI(true);
        setErrorFI(null);
        const result = await calculateFIStatus(fiParams);
        setFiResult(result);
      } catch (err) {
        if (err instanceof Error) {
          setErrorFI(err.message);
        } else {
          setErrorFI('An unknown error occurred while fetching FI data.');
        }
        console.error("FI Fetch Error:", err);
      } finally {
        setIsLoadingFI(false);
      }
    };

    fetchFIData();
  }, [fiParams]);

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
          <DashboardCard
            title="Goals"
            value={formatCurrency(totalGoals)}
            icon={Flag}
            colorClass="blue"
            darkMode={darkMode}
            path="/goals"
          />
        </div>
      </div>

      <div className={styles.fiSection}>
        <h2 className={styles.title} style={{ marginTop: '2rem', marginBottom: '1rem' }}>Financial Independence Status</h2>
        {isLoadingFI && <p>Loading FI data...</p>}
        {errorFI && <p className={styles.errorText}>Error loading FI data: {errorFI}</p>}
        {fiResult && (
          <>
            <div className={`${styles.cardsGrid} ${styles.fiCardsGrid}`}>
              <DashboardCard
                title="FI Status"
                value={fiResult.is_financially_independent ? 'Achieved' : 'In Progress'}
                icon={fiResult.is_financially_independent ? CheckCircle : Target}
                colorClass={fiResult.is_financially_independent ? 'green' : 'orange'}
                darkMode={darkMode}
              >
                <div className={styles.fiProgressBarContainer}>
                  <div 
                    style={{ width: `${Math.min(fiResult.fi_ratio_percentage, 100)}%` }}
                    className={`${styles.fiProgressBar} ${fiResult.fi_ratio_percentage >= 100 ? styles.fiProgressComplete : styles.fiProgressInProgress}`}>
                  </div>
                </div>
                <p className={styles.fiRatioText}>{fiResult.fi_ratio_percentage.toFixed(2)}% towards FI</p>
              </DashboardCard>

              <DashboardCard 
                title="Net FI Corpus Available"
                value={formatCurrency(fiResult.net_fi_corpus_available)}
                icon={PieChart} 
                colorClass="teal" 
                darkMode={darkMode} 
              />
              <DashboardCard 
                title="Required FI Corpus"
                value={formatCurrency(fiResult.required_fi_corpus)}
                icon={DollarSign} 
                colorClass="purple" 
                darkMode={darkMode} 
              />
               <DashboardCard 
                title="Net Investable Assets"
                value={formatCurrency(fiResult.details.net_investable_assets)}
                icon={TrendingUp} 
                colorClass="blue" 
                darkMode={darkMode} 
              />
            </div>
            
            <div className={`${styles.fiDetailsCard} ${darkMode ? styles.dark : styles.light}`}>
              <h3 className={styles.fiDetailsTitle}>FI Calculation Details</h3>
              <ul> 
                <li>Annual Expenses Used: {formatCurrency(fiResult.fi_annual_expenses_used)}</li>
                <li>SWR Used: {fiResult.swr_percentage_used}%</li>
                <li>Cost of Goals Set Aside: {formatCurrency(fiResult.details.total_current_cost_of_goals_to_set_aside)}</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 