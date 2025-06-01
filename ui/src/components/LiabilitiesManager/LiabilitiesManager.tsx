import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import LiabilityForm from './LiabilityForm';

interface FormField {
  key: string;
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

export interface Liability {
  id: string;
  name: string;
  outstandingAmountINR: number;
  type: string;
  interestRate?: number;
  termYears?: number;
  dueDate?: string;
  [key: string]: string | number | undefined; 
}

interface LiabilitiesManagerProps {
  liabilities: Liability[];
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

const LiabilitiesManager: React.FC<LiabilitiesManagerProps> = ({
  liabilities,
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
      placeholder: 'e.g., Credit Card, Home Loan' 
    },
    { 
      key: 'outstandingAmountINR', 
      name: 'outstandingAmountINR',
      label: 'Outstanding Amount (INR)', 
      type: 'number', 
      required: true, 
      placeholder: '0' 
    },
    { 
      key: 'type', 
      name: 'type',
      label: 'Type', 
      type: 'select', 
      required: true,
      options: [
        { label: 'Credit Card', value: 'credit_card' },
        { label: 'Personal Loan', value: 'personal_loan' },
        { label: 'Home Loan', value: 'home_loan' },
        { label: 'Car Loan', value: 'car_loan' },
        { label: 'Education Loan', value: 'education_loan' },
        { label: 'Other', value: 'other' },
      ]
    },
    { 
      key: 'interestRate', 
      name: 'interestRate',
      label: 'Interest Rate (%)', 
      type: 'number', 
      placeholder: '0.00',
      required: false 
    },
    { 
      key: 'termYears', 
      name: 'termYears',
      label: 'Term (Years)', 
      type: 'number', 
      placeholder: '0',
      required: false 
    },
    { 
      key: 'dueDate', 
      name: 'dueDate',
      label: 'Due Date', 
      type: 'date', 
      required: false 
    },
  ], []);

  const renderRow = (item: Liability, cols: FormField[]) => {
    return cols.map(col => {
      let value = item[col.key as keyof Liability];
      let displayValue: React.ReactNode = value || '-';
      
      if (col.key === 'outstandingAmountINR' && typeof value === 'number') {
        displayValue = formatCurrency(value);
      } else if (col.key === 'interestRate' && value) {
        displayValue = `${value}%`;
      } else if (col.key === 'dueDate' && value) {
        displayValue = new Date(value as string).toLocaleDateString();
      }
      
      return (
        <td 
          key={col.key} 
          className={`px-6 py-4 whitespace-nowrap text-sm ${
            col.key === 'outstandingAmountINR' || col.key === 'interestRate' 
              ? 'text-right font-mono' 
              : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {displayValue}
        </td>
      );
    });
  };

  const handleAdd = () => {
    openModal(
      <LiabilityForm
        onSubmit={async (data) => {
          await handleSave('', data);
        }}
        onCancel={() => openModal(null)}
        fields={columns}
        darkMode={darkMode}
        title="Add New Liability"
      />,
      'Add New Liability'
    );
  };

  const handleSave = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      await saveData('liabilities', data, id || undefined);
      openModal(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (liability: Liability) => {
    openModal(
      <LiabilityForm
        initialData={liability}
        onSubmit={async (data) => {
          await handleSave(liability.id as string, data);
        }}
        onCancel={() => openModal(null)}
        fields={columns}
        darkMode={darkMode}
        title="Edit Liability"
      />,
      'Edit Liability'
    );
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this liability?')) {
      setIsLoading(true);
      try {
        await deleteData('liabilities', id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const totalOutstanding = useMemo(() => {
    return liabilities.reduce((sum, liability) => sum + (liability.outstandingAmountINR || 0), 0);
  }, [liabilities]);

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'} p-6 rounded-xl shadow-lg`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Liabilities</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your financial liabilities and their details</p>
        </div>
        <button
          onClick={handleAdd}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          Add Liability
        </button>
      </div>

      <div className="mb-8 p-5 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
        <h3 className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">Total Outstanding</h3>
        <p className="text-3xl font-bold text-red-900 dark:text-white">{formatCurrency(totalOutstanding)}</p>
      </div>

      {liabilities.length === 0 ? (
        <div className="text-center py-12 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-3">
            <Plus className="text-red-500 dark:text-red-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No liabilities found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Get started by adding your first liability</p>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 rounded-md transition-colors duration-200"
          >
            <Plus size={16} />
            Add Liability
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/80 backdrop-blur-sm">
                <tr>
                  {columns.map((column, index) => (
                    <th
                      key={column.key}
                      scope="col"
                      className={`px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                        index === 0 ? 'rounded-tl-xl' : ''
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th scope="col" className="relative px-6 py-3.5 rounded-tr-xl">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800/50">
                {liabilities.map((liability, index) => (
                  <tr 
                    key={liability.id} 
                    className={`${
                      index % 2 === 0 
                        ? 'bg-white dark:bg-gray-800/50' 
                        : 'bg-gray-50 dark:bg-gray-800/30'
                    } hover:bg-red-50/50 dark:hover:bg-gray-700/50 transition-colors duration-150`}
                  >
                    {renderRow(liability, columns)}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEdit(liability)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 p-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          disabled={isLoading}
                          title="Edit liability"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(liability.id as string)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          disabled={isLoading}
                          title="Delete liability"
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
        </div>
      )}
    </div>
  );
};

export default LiabilitiesManager; 