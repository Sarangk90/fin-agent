import React from 'react';
import DataManager from './DataManager/DataManager';

interface Expense {
  id: string;
  category: string;
  details?: string;
  amount: number;
  frequency: string;
  needWant: 'Need' | 'Want';
  date: string;
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
  const managerColumns = [
    { key: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Food, Rent, Utilities', required: true },
    { key: 'details', label: 'Details', type: 'textarea', placeholder: 'e.g., Groceries from store' },
    { key: 'amount', label: 'Amount', type: 'number', placeholder: '0.00', required: true },
    {
      key: 'frequency', label: 'Frequency', type: 'select', required: true, options: [
        { value: 'One-Time', label: 'One-Time' },
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Quarterly', label: 'Quarterly' },
        { value: 'Semi-Annually', label: 'Semi-Annually' },
        { value: 'Annually', label: 'Annually' },
      ]
    },
    {
      key: 'needWant', label: 'Need/Want', type: 'select', required: true, options: [
        { value: 'Need', label: 'Need' },
        { value: 'Want', label: 'Want' },
      ]
    },
    { key: 'date', label: 'Date', type: 'date', required: true },
  ];

  const displayColumns = [
    ...managerColumns,
    { key: 'annualAmount', label: 'Annual Amt (INR)' },
  ];

  const renderRow = (item: Expense, cols: Array<{ key: string; label: string }>) => {
    return displayColumns.map(col => (
      <td key={col.key} className={`py-3 px-2 sm:px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}>
        {col.key === 'amount' ? formatCurrency(item[col.key] as number) :
         col.key === 'annualAmount' ? formatCurrency(calculateAnnualAmount(item.amount, item.frequency)) :
         item[col.key as keyof Expense] || '-'}
      </td>
    ));
  };

  return (
    <DataManager
      title="Expenses"
      items={expenses}
      itemType="expense"
      collectionName="expenses"
      saveData={saveData}
      deleteData={deleteData}
      openModal={openModal}
      columns={displayColumns}
      renderRow={renderRow}
      darkMode={darkMode}
    />
  );
};

export default ExpensesManager; 