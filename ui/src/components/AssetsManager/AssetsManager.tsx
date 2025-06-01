import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AssetForm from './AssetForm';
import styles from './AssetsManager.module.scss';

export interface FormField {
  key: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date';
  options?: Array<{value: string; label: string}>;
  required?: boolean;
  placeholder?: string;
  step?: string;
  [key: string]: any; // Allow additional properties
}

export interface Asset {
  id: string;
  name: string;
  valueINR: number;
  interestRate?: number;
  assetClass: string;
  assetType: string;
  fpAssetClass: string;
  [key: string]: string | number | undefined;
}

interface AssetsManagerProps {
  assets: Asset[];
  saveData: (collection: string, data: any, id?: string) => Promise<string | null>;
  deleteData: (collection: string, id: string) => Promise<void>;
  openModal: (content: React.ReactNode, title?: string) => void;
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

const AssetsManager: React.FC<AssetsManagerProps> = ({
  assets,
  saveData,
  deleteData,
  openModal,
  darkMode
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const columns = useMemo<FormField[]>(() => [
    { 
      key: 'name', 
      name: 'name',
      label: 'Name', 
      type: 'text', 
      required: true, 
      placeholder: 'e.g., Savings Account' 
    },
    { 
      key: 'valueINR', 
      name: 'valueINR',
      label: 'Value (INR)', 
      type: 'number', 
      required: true, 
      placeholder: '0' 
    },
    {
      key: 'interestRate',
      name: 'interestRate',
      label: 'Interest Rate (%)',
      type: 'number',
      required: false,
      placeholder: 'e.g., 5.5',
      step: '0.01',
      min: 0,
      max: 100
    },
    { 
      key: 'assetClass', 
      name: 'assetClass',
      label: 'Class', 
      type: 'select', 
      required: true,
      options: [
        { value: 'Cash / Cash Equivalent', label: 'Cash / Cash Equivalent' },
        { value: 'Equity', label: 'Equity' },
        { value: 'Debt', label: 'Debt' },
        { value: 'Real Estate', label: 'Real Estate' },
        { value: 'Commodities', label: 'Commodities' },
        { value: 'Alternatives', label: 'Alternatives' },
        { value: 'Other', label: 'Other' },
      ] 
    },
    { 
      key: 'assetType', 
      name: 'assetType',
      label: 'Type', 
      type: 'select', 
      required: true,
      options: [
        { value: 'Savings Account', label: 'Savings Account' },
        { value: 'Fixed Deposit (FD)', label: 'Fixed Deposit (FD)' },
        { value: 'Recurring Deposit (RD)', label: 'Recurring Deposit (RD)' },
        { value: 'Stocks (Direct Equity)', label: 'Stocks (Direct Equity)' },
        { value: 'Equity Mutual Fund', label: 'Equity Mutual Fund' },
        { value: 'Debt Mutual Fund', label: 'Debt Mutual Fund' },
        { value: 'PPF / EPF / NPS', label: 'PPF / EPF / NPS' },
        { value: 'Bonds', label: 'Bonds' },
        { value: 'Residential Property', label: 'Residential Property' },
        { value: 'Commercial Property', label: 'Commercial Property' },
        { value: 'Land', label: 'Land' },
        { value: 'Physical Gold / Silver', label: 'Physical Gold / Silver' },
        { value: 'SGB (Sovereign Gold Bond)', label: 'SGB (Sovereign Gold Bond)' },
        { value: 'Cryptocurrency', label: 'Cryptocurrency' },
        { value: 'Other Sub Class', label: 'Other Sub Class' },
      ] 
    },
    { 
      key: 'fpAssetClass', 
      name: 'fpAssetClass',
      label: 'FP Class', 
      type: 'select', 
      required: true,
      options: [
        { value: 'Emergency Fund', label: 'Emergency Fund' },
        { value: 'Retirement', label: 'Retirement' },
        { value: 'Goal-Specific', label: 'Goal-Specific' },
        { value: 'General Investment / Wealth Creation', label: 'General Investment / Wealth Creation' },
        { value: 'Tax Saving', label: 'Tax Saving' },
        { value: 'Other', label: 'Other' },
      ] 
    },
  ], []);

  const renderRow = (asset: Asset, columns: FormField[]) => {
    return columns.map(column => {
      let value = asset[column.key];
      
      if (column.key === 'valueINR' && typeof value === 'number') {
        return (
          <td key={column.key} className={styles.cell}>
            {formatCurrency(value as number)}
          </td>
        );
      }
      
      if (column.key === 'interestRate') {
        return (
          <td key={column.key} className={styles.cell}>
            {value ? `${value}%` : '-'}
          </td>
        );
      }
      
      return (
        <td key={column.key} className={styles.cell}>
          {value || '-'}
        </td>
      );
    });
  };

  const handleAdd = () => {
    openModal(
      <AssetForm
        initialData={{}}
        onSubmit={async (data: any) => {
          setIsLoading(true);
          try {
            await saveData('assets', data);
            openModal(null);
          } finally {
            setIsLoading(false);
          }
        }}
        onCancel={() => openModal(null)}
        fields={columns}
        darkMode={darkMode}
      />,
      'Add New Asset'
    );
  };

  const handleEdit = (asset: Asset) => {
    openModal(
      <AssetForm
        initialData={asset}
        onSubmit={async (data: any) => {
          setIsLoading(true);
          try {
            await saveData('assets', data, asset.id as string);
            openModal(null);
          } finally {
            setIsLoading(false);
          }
        }}
        onCancel={() => openModal(null)}
        fields={columns}
        darkMode={darkMode}
      />,
      'Edit Asset'
    );
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      setIsLoading(true);
      try {
        await deleteData('assets', id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const { totalValue, totalAssets, assetAllocation, lastUpdated, avgInterestRate } = useMemo(() => {
    if (assets.length === 0) {
      return {
        totalValue: 0,
        totalAssets: 0,
        assetAllocation: [],
        lastUpdated: null
      };
    }

    const total = assets.reduce((sum, asset) => sum + (asset.valueINR || 0), 0);
    
    // Calculate asset allocation by class
    const allocationMap = assets.reduce<Record<string, number>>((acc, asset) => {
      const classKey = asset.assetClass || 'Other';
      acc[classKey] = (acc[classKey] || 0) + (asset.valueINR || 0);
      return acc;
    }, {});
    
    // Convert to array and sort by value
    const allocation = Object.entries(allocationMap)
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / total) * 100
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3); // Top 3 classes
    
    // Find the most recent updated date
    const lastUpdate = assets.length > 0 
      ? new Date(Math.max(...assets
          .filter(a => a.updatedAt)
          .map(a => new Date(a.updatedAt as string).getTime())))
      : null;
    
    // Calculate weighted average interest rate
    const totalInterestBearingAssets = assets.reduce((sum, asset) => {
      const rate = typeof asset.interestRate === 'number' ? asset.interestRate : 0;
      return rate > 0 ? sum + (asset.valueINR || 0) : sum;
    }, 0);
    
    const totalInterest = assets.reduce((sum, asset) => {
      const rate = typeof asset.interestRate === 'number' ? asset.interestRate : 0;
      return rate > 0 ? sum + ((asset.valueINR || 0) * rate / 100) : sum;
    }, 0);
    
    const avgRate = totalInterestBearingAssets > 0 
      ? (totalInterest / totalInterestBearingAssets) * 100 
      : 0;
    
    return {
      totalValue: total,
      totalAssets: assets.length,
      assetAllocation: allocation,
      lastUpdated: lastUpdate,
      avgInterestRate: parseFloat(avgRate.toFixed(2))
    };
  }, [assets]);

  return (
    <div className={styles.assetsManager}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTopRow}>
            <div>
              <h2>Assets</h2>
              <p className={styles.subtitle}>Track and manage your financial assets across different classes and types</p>
            </div>
            <div className={styles.headerRight}>
              <button
                onClick={handleAdd}
                disabled={isLoading}
                className={styles.addButton}
              >
                <Plus size={18} />
                Add Asset
              </button>
            </div>
          </div>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Total Value</div>
              <div className={styles.metricValue}>{formatCurrency(totalValue)}</div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Total Assets</div>
              <div className={styles.metricValue}>{totalAssets}</div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Avg. Interest Rate</div>
              <div className={styles.metricValue}>
                {avgInterestRate > 0 ? `${avgInterestRate.toFixed(2)}%` : '-'}
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Top Asset Class</div>
              <div className={styles.metricValue}>
                {assetAllocation.length > 0 ? assetAllocation[0].name : '-'}
                {assetAllocation.length > 0 && (
                  <span className={styles.metricSubtext}>
                    {assetAllocation[0].percentage.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No assets found. Add your first asset to get started.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                {columns.map(column => (
                  <th key={column.key}>
                    {column.label}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.map(asset => (
                <tr key={asset.id} className={styles.row}>
                  {renderRow(asset, columns)}
                  <td className={styles.cell}>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEdit(asset)}
                        className={`${styles.actionButton} ${styles.editButton}`}
                        disabled={isLoading}
                        aria-label="Edit asset"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(asset.id as string)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        disabled={isLoading}
                        aria-label="Delete asset"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssetsManager; 