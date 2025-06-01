import React from 'react';
import { PlusCircle, Edit3, Trash2, Briefcase } from 'lucide-react';
import DataForm from '../AssetsManager/DataForm';

interface Column {
  key: string;
  label: string;
  type?: string;
  options?: Array<{value: string; label: string}>;
  required?: boolean;
  placeholder?: string;
}

interface DataManagerProps {
  title: string;
  items: any[];
  itemType: string;
  collectionName: string;
  saveData: (collection: string, data: any, id?: string) => Promise<string | null>;
  deleteData: (collection: string, id: string) => Promise<void>;
  openModal: (content: React.ReactNode, title?: string) => void;
  columns: Column[];
  renderRow?: (item: any, columns: Column[]) => React.ReactNode;
  darkMode: boolean;
  editMode?: boolean;
}

// Define field configurations for different item types
const getFormFields = (itemType: string, columns?: Column[]): Array<{ name: string; label: string; type: string; placeholder?: string; required?: boolean; options?: Array<{value: string; label: string}> }> => {
  if (itemType === 'asset' && columns && columns.every(col => col.type)) {
    return columns.map(col => ({
      name: col.key,
      label: col.label,
      type: col.type || 'text',
      options: col.options,
      required: col.required,
      placeholder: col.placeholder
    }));
  }
  
  switch (itemType) {
    case 'expense':
      return [
        { name: 'category', label: 'Category', type: 'text', placeholder: 'e.g., Food, Rent, Utilities', required: true },
        { name: 'details', label: 'Details', type: 'textarea', placeholder: 'e.g., Groceries from store' },
        { name: 'amount', label: 'Amount', type: 'number', placeholder: '0.00', required: true },
        { name: 'frequency', label: 'Frequency', type: 'select', required: true, options: [
          { value: 'One-Time', label: 'One-Time' },
          { value: 'Monthly', label: 'Monthly' },
          { value: 'Quarterly', label: 'Quarterly' },
          { value: 'Semi-Annually', label: 'Semi-Annually' },
          { value: 'Annually', label: 'Annually' },
        ]},
        { name: 'needWant', label: 'Need/Want', type: 'select', required: true, options: [
          { value: 'Need', label: 'Need' },
          { value: 'Want', label: 'Want' },
        ]},
        { name: 'date', label: 'Date', type: 'date', required: true }, // Assuming Expense has a date field
      ];
    case 'asset':
      return [
        { name: 'name', label: 'Asset Name', type: 'text', placeholder: 'e.g., Savings Account, Real Estate', required: true },
        { name: 'assetClass', label: 'Asset Class', type: 'text', placeholder: 'e.g., Cash, Equity, Fixed Income', required: true },
        { name: 'valueINR', label: 'Current Value (INR)', type: 'number', placeholder: '0', required: true },
      ];
    case 'liability':
      return [
        { name: 'name', label: 'Liability Name', type: 'text', placeholder: 'e.g., Credit Card, Home Loan', required: true },
        { name: 'type', label: 'Type', type: 'text', placeholder: 'e.g., Secured, Unsecured', required: true },
        { name: 'outstandingAmountINR', label: 'Outstanding Amount (INR)', type: 'number', placeholder: '0', required: true },
        { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', placeholder: '0.0' },
        { name: 'dueDate', label: 'Due Date', type: 'date' },
      ];
    default:
      return []; // Default to no fields if itemType is unknown
  }
};

const DataManager: React.FC<DataManagerProps> = ({
  title,
  items,
  itemType,
  collectionName,
  saveData,
  deleteData,
  openModal,
  columns,
  renderRow,
  darkMode
}) => {
  const formFields = (itemType === 'asset' && columns.every(col => col.type)) 
    ? columns.map(col => ({
        name: col.key,
        label: col.label,
        type: col.type || 'text',
        options: col.options,
        required: col.type !== 'select',
        placeholder: col.type === 'number' ? '0' : `Enter ${col.label.toLowerCase()}`
      })) 
    : getFormFields(itemType);

  const handleAddItem = () => {
    const modalTitle = `Add New ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`;
    openModal(
      <DataForm
        onSubmit={async (data: any) => {
          await saveData(collectionName, data);
          openModal(null);
        }}
        onCancel={() => openModal(null)}
        fields={formFields}
        darkMode={darkMode}
      />,
      modalTitle
    );
  };

  const handleEditItem = (item: any) => {
    const modalTitle = `Edit ${itemType.charAt(0).toUpperCase() + itemType.slice(1)}`;
    openModal(
      <DataForm
        initialData={item}
        onSubmit={async (data: any) => {
          await saveData(collectionName, data, item.id);
          openModal(null);
        }}
        onCancel={() => openModal(null)}
        fields={formFields}
        darkMode={darkMode}
      />,
      modalTitle
    );
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm(`Are you sure you want to delete this ${itemType}? This action cannot be undone.`)) {
      deleteData(collectionName, id);
    }
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 sm:p-6 rounded-xl shadow-lg`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold">{title}</h2>
        <button
          onClick={handleAddItem}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusCircle size={20} />
          <span>Add {itemType}</span>
        </button>
      </div>
      {items.length === 0 ? (
        <div className="text-center py-10">
          <Briefcase size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No {itemType}s added yet.</p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Click "Add {itemType}" to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className={`${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                {columns.map(col => (
                  <th key={col.key} className={`py-3 px-2 sm:px-4 text-left text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {col.label}
                  </th>
                ))}
                <th className={`py-3 px-2 sm:px-4 text-right text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  {renderRow ? (
                    renderRow(item, columns)
                  ) : (
                    columns.map(col => (
                      <td key={col.key} className="py-3 px-2 sm:px-4 whitespace-nowrap">
                        {item[col.key] || '-'}
                      </td>
                    ))
                  )}
                  <td className="py-3 px-2 sm:px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-1.5 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors mr-2"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
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

export default DataManager; 