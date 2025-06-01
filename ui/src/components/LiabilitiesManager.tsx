import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { FormField } from './AssetsManager/AssetsManager';
import AssetForm from './AssetsManager/AssetForm';

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
  
  const columns: FormField[] = useMemo(() => [
    { 
      key: 'name', 
      name: 'name',
      label: 'Name', 
      type: 'text', 
      required: true, 
      placeholder: 'e.g., Credit Card, Home Loan' 
    },
    { 
      key: 'type', 
      name: 'type',
      label: 'Type', 
      type: 'select', 
      required: true, 
      options: [
        { value: 'Secured', label: 'Secured' },
        { value: 'Unsecured', label: 'Unsecured' },
        { value: 'Credit Card', label: 'Credit Card' },
        { value: 'Personal Loan', label: 'Personal Loan' },
        { value: 'Home Loan', label: 'Home Loan' },
        { value: 'Car Loan', label: 'Car Loan' },
        { value: 'Education Loan', label: 'Education Loan' },
        { value: 'Other', label: 'Other' }
      ]
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
      key: 'interestRate', 
      name: 'interestRate',
      label: 'Interest Rate (%)', 
      type: 'number', 
      placeholder: '0.0',
      step: '0.1'
    },
    { 
      key: 'dueDate', 
      name: 'dueDate',
      label: 'Due Date', 
      type: 'date' 
    },
  ], []);

  const renderRow = (item: Liability, cols: FormField[]) => {
    return cols.map(col => (
      <td 
        key={col.key} 
        className={`py-3 px-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-nowrap`}
      >
        {col.key === 'outstandingAmountINR' 
          ? formatCurrency(item[col.key] as number) 
          : col.key === 'interestRate' && item[col.key] 
            ? `${item[col.key]}%`
            : item[col.key] || '-'}
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
            await saveData('liabilities', data);
            openModal(null);
          } finally {
            setIsLoading(false);
          }
        }}
        onCancel={() => openModal(null)}
        fields={columns}
        darkMode={darkMode}
      />,
      'Add New Liability'
    );
  };

  const handleEdit = (liability: Liability) => {
    openModal(
      <AssetForm
        initialData={liability}
        onSubmit={async (data: any) => {
          setIsLoading(true);
          try {
            await saveData('liabilities', data, liability.id as string);
            openModal(null);
          } finally {
            setIsLoading(false);
          }
        }}
        onCancel={() => openModal(null)}
        fields={columns}
        darkMode={darkMode}
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
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-6 rounded-lg shadow-md`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Liabilities</h2>
        <button
          onClick={handleAdd}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          <Plus size={18} />
          Add Liability
        </button>
      </div>

      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Total Outstanding</h3>
        <p className="text-2xl font-bold">{formatCurrency(totalOutstanding)}</p>
      </div>

      {liabilities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No liabilities found. Add your first liability to get started.</p>
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
              {liabilities.map(liability => (
                <tr key={liability.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  {renderRow(liability, columns)}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(liability)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        disabled={isLoading}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(liability.id as string)}
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

export default LiabilitiesManager; 