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
  assetClass: string;
  assetType: string;
  fpAssetClass: string;
  [key: string]: string | number;
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

  const renderRow = (item: Asset, cols: FormField[]) => {
    return cols.map(col => (
      <td key={col.key} className={`${styles.cell} ${col.key === 'valueINR' ? styles.currency : ''}`}>
        {col.key === 'valueINR' ? formatCurrency(item[col.key] as number) : item[col.key] || '-'}
      </td>
    ));
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

  const totalValue = useMemo(() => {
    return assets.reduce((sum, asset) => sum + (asset.valueINR || 0), 0);
  }, [assets]);

  return (
    <div className={styles.assetsManager}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Assets</h2>
          <span className={styles.totalValue}>{formatCurrency(totalValue)}</span>
        </div>
        <button
          onClick={handleAdd}
          disabled={isLoading}
          className={styles.addButton}
        >
          <Plus size={18} />
          Add Asset
        </button>
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