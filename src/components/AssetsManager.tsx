import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import DataManager from './DataManager';

interface Asset {
  id: string;
  name: string;
  valueINR: number;
  assetClass: string;
  assetType: string;
  fpAssetClass: string;
  [key: string]: string | number; // Add index signature
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
    { key: 'name', label: 'Name' },
    { key: 'valueINR', label: 'Value (INR)' },
    { key: 'assetClass', label: 'Class' },
    { key: 'assetType', label: 'Type' },
    { key: 'fpAssetClass', label: 'FP Class' },
  ];

  const renderRow = (item: Asset, cols: { key: string; label: string }[]) => cols.map(col => (
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