import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { FormField } from './AssetsManager/AssetsManager';
import AssetForm from './AssetsManager/AssetForm';

export interface Expense {
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
  const [isLoading, setIsLoading] = useState(false);
  
  const columns: FormField[] = useMemo(() => [
    { 
      key: 'category', 
      name: 'category',
      label: 'Category', 
      type: 'select', 
      required: true, 
      placeholder: 'e.g., Food, Rent, Utilities',
      options: [
        { value: 'Housing', label: 'Housing' },
        { value: 'Utilities', label: 'Utilities' },
        { value: 'Food', label: 'Food' },
        { value: 'Transportation', label: 'Transportation' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Insurance', label: 'Insurance' },
        { value: 'Entertainment', label: 'Entertainment' },
        { value: 'Education', label: 'Education' },
        { value: 'Personal Care', label: 'Personal Care' },
        { value: 'Other', label: 'Other' }
      ]
    },
    { 
      key: 'details', 
      name: 'details',
      label: 'Details', 
      type: 'textarea', 
      placeholder: 'e.g., Groceries from store' 
    },
    { 
      key: 'amount', 
      name: 'amount',
      label: 'Amount', 
      type: 'number', 
      placeholder: '0.00', 
      required: true,
      step: '0.01'
    },
    {
      key: 'frequency', 
      name: 'frequency',
      label: 'Frequency', 
      type: 'select', 
      required: true, 
      options: [
        { value: 'One-Time', label: 'One-Time' },
        { value: 'Monthly', label: 'Monthly' },
        { value: 'Quarterly', label: 'Quarterly' },
        { value: 'Semi-Annually', label: 'Semi-Annually' },
        { value: 'Annually', label: 'Annually' },
      ]
    },
    {
      key: 'needWant', 
      name: 'needWant',
      label: 'Need/Want', 
      type: 'select', 
      required: true, 
      options: [
        { value: 'Need', label: 'Need' },
        { value: 'Want', label: 'Want' },
      ]
    },
    { 
      key: 'date', 
      name: 'date',
      label: 'Date', 
      type: 'date', 
      required: true 
    },
  ], []);

  const displayColumns = [
    ...columns,
    { key: 'annualAmount', label: 'Annual Amt (INR)' },
  ];

  const renderRow = (item: Expense, cols: FormField[]) => {
    return displayColumns.map(col => (
      <td 
        key={col.key} 
        className={`py-3 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}
      >
        {col.key === 'amount' 
          ? formatCurrency(item[col.key] as number) 
          : col.key === 'annualAmount' 
            ? formatCurrency(calculateAnnualAmount(item.amount, item.frequency))
            : item[col.key as keyof Expense] || '-'}
      </td>
    ));
  };

  const handleAdd = () => {
    openModal(
      <AssetForm
        initialData={{ date: new Date().toISOString().split('T')[0] }}
        onSubmit={async (data: any) => {
          setIsLoading(true);
          try {
            await saveData('expenses', data);
            openModal(null);
          } finally {
            setIsLoading(false);
          }
        }}
        onCancel={() => openModal(null)}
        fields={columns}
        darkMode={darkMode}
      />,
      'Add New Expense'
    );
  };

  const handleEdit = (expense: Expense) => {
    openModal(
      <AssetForm
        initialData={expense}
        onSubmit={async (data: any) => {
          setIsLoading(true);
          try {
            await saveData('expenses', data, expense.id as string);
            openModal(null);
          } finally {
            setIsLoading(false);
          }
        }}
        onCancel={() => openModal(null)}
        fields={columns}
        darkMode={darkMode}
      />,
      'Edit Expense'
    );
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setIsLoading(true);
      try {
        await deleteData('expenses', id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalAnnualExpense = useMemo(() => {
    return expenses.reduce((sum, expense) => {
      return sum + calculateAnnualAmount(expense.amount, expense.frequency);
    }, 0);
  }, [expenses]);

  const totalMonthlyExpense = useMemo(() => {
    return totalAnnualExpense / 12;
  }, [totalAnnualExpense]);

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-md`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Expenses</h2>
        <button
          onClick={handleAdd}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Monthly Average</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalMonthlyExpense)}</p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Annual Total</h3>
          <p className="text-2xl font-bold">{formatCurrency(totalAnnualExpense)}</p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No expenses found. Add your first expense to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {displayColumns.map(column => (
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
              {expenses.map(expense => (
                <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {renderRow(expense, columns)}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(expense)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        disabled={isLoading}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id as string)}
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

export default ExpensesManager; 