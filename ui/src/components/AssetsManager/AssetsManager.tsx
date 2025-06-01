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
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-md`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Assets</h2>
        <button
          onClick={handleAdd}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          <Plus size={18} />
          Add Asset
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Total Value</h3>
        <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No assets found. Add your first asset to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {columns.map(column => (
                  <th
                    key={column.key}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {assets.map(asset => (
                <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {renderRow(asset, columns)}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(asset)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        disabled={isLoading}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(asset.id as string)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        disabled={isLoading}
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