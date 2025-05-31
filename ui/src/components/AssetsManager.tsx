import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import DataManager from './DataManager/DataManager';

interface Asset {
  id: string;
  name: string;
  valueINR: number;
  assetClass: string;
  assetType: string;
  fpAssetClass: string;
}

// Define a more specific type for the data being saved (without id for new assets)
interface AssetDataToSave {
  name: string;
  valueINR: number;
  assetClass: string;
  assetType: string;
  fpAssetClass: string;
}

interface AssetsManagerProps {
  assets: Asset[];
  saveData: (collection: string, data: any, id?: string) => Promise<string | null>;
  deleteData: (collection: string, id: string) => Promise<void>;
  openModal: (content: React.ReactNode) => void;
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

const AssetsManager: React.FC<AssetsManagerProps> = ({ assets, saveData, deleteData, openModal, darkMode }) => {
  const columns = [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'valueINR', label: 'Value (INR)', type: 'number' },
    {
      key: 'assetClass',
      label: 'Class',
      type: 'select',
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
      label: 'Type',
      type: 'select',
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
      label: 'FP Class',
      type: 'select',
      options: [
        { value: 'Emergency Fund', label: 'Emergency Fund' },
        { value: 'Retirement', label: 'Retirement' },
        { value: 'Goal-Specific', label: 'Goal-Specific' },
        { value: 'General Investment / Wealth Creation', label: 'General Investment / Wealth Creation' },
        { value: 'Tax Saving', label: 'Tax Saving' },
        { value: 'Other', label: 'Other' },
      ]
    },
  ];

  const renderRow = (item: Asset, cols: Array<{ key: string; label: string; type?: string; options?: Array<{value: string, label: string}> }>) => cols.map(col => (
    <td key={col.key} className={`py-3 px-2 sm:px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}>
      {col.key === 'valueINR' ? formatCurrency(item[col.key] as number) : item[col.key] || '-'}
    </td>
  ));

  return (
    <DataManager
      title="Assets"
      items={assets}
      itemType="asset"
      saveData={saveData}
      deleteData={deleteData}
      openModal={openModal}
      columns={columns}
      renderRow={renderRow}
      darkMode={darkMode}
    />
  );
};

export default AssetsManager; 