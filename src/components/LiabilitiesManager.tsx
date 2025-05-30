import React from 'react';
import DataManager from './DataManager';

interface Liability {
  id: string;
  name: string;
  valueINR: number;
  interestRate?: number;
  termYears?: number;
  [key: string]: string | number | undefined;
}

interface LiabilitiesManagerProps {
  liabilities: Liability[];
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

const LiabilitiesManager: React.FC<LiabilitiesManagerProps> = ({
  liabilities,
  saveData,
  deleteData,
  openModal,
  darkMode
}) => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'valueINR', label: 'Amount (INR)' },
    { key: 'interestRate', label: 'Interest Rate (%)' },
  ];

  const renderRow = (item: Liability, cols: { key: string; label: string }[]) => cols.map(col => (
    <td key={col.key} className={`py-3 px-2 sm:px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}>
      {col.key === 'valueINR' ? formatCurrency(item[col.key] as number) :
       col.key === 'interestRate' && item[col.key] ? `${item[col.key]}%` :
       item[col.key] || '-'}
    </td>
  ));

  return (
    <DataManager
      title="Liabilities"
      items={liabilities}
      itemType="liability"
      saveData={saveData}
      deleteData={deleteData}
      openModal={openModal}
      columns={columns}
      renderRow={renderRow}
      darkMode={darkMode}
    />
  );
};

export default LiabilitiesManager; 