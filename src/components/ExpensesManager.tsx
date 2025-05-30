import React from 'react';
import DataManager from './DataManager';

interface Expense {
  id: string;
  category: string;
  details?: string;
  amount: number;
  frequency: string;
  needWant: 'Need' | 'Want';
  [key: string]: string | number | undefined;
}

interface ExpensesManagerProps {
  expenses: Expense[];
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

const calculateAnnualAmount = (amount: number, frequency: string): number => {
  amount = parseFloat(amount.toString()) || 0;
  switch (frequency) {
    case "Monthly": return amount * 12;
    case "Quarterly": return amount * 4;
    case "Semi-Annually": return amount * 2;
    case "Annually": return amount;
    case "One-Time": return amount;
    default: return 0;
  }
};

const ExpensesManager: React.FC<ExpensesManagerProps> = ({
  expenses,
  saveData,
  deleteData,
  openModal,
  darkMode
}) => {
  const columns = [
    { key: 'category', label: 'Category' },
    { key: 'details', label: 'Details' },
    { key: 'amount', label: 'Amount (INR)' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'needWant', label: 'Need/Want' },
    { key: 'annualAmount', label: 'Annual Amt (INR)' },
  ];

  const renderRow = (item: Expense, cols: { key: string; label: string }[]) => cols.map(col => (
    <td key={col.key} className={`py-3 px-2 sm:px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}>
      {col.key === 'amount' ? formatCurrency(item[col.key] as number) :
       col.key === 'annualAmount' ? formatCurrency(calculateAnnualAmount(item.amount, item.frequency)) :
       item[col.key] || '-'}
    </td>
  ));

  return (
    <DataManager
      title="Expenses"
      items={expenses}
      itemType="expense"
      saveData={saveData}
      deleteData={deleteData}
      openModal={openModal}
      columns={columns}
      renderRow={renderRow}
      darkMode={darkMode}
    />
  );
};

export default ExpensesManager; 