import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import styles from './ExpensesManager.module.scss';

export interface FormField {
  key: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date';
  options?: Array<{value: string; label: string}>;
  required?: boolean;
  placeholder?: string;
  step?: string;
  min?: number | string;
  max?: number | string;
  [key: string]: any;
}

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
    { 
      key: 'annualAmount', 
      label: 'Annual Amount',
      align: 'right' as const
    },
  ];
  
  // Define column widths based on content
  const getColumnWidth = (key: string) => {
    const widths: {[key: string]: string} = {
      'category': '180px',
      'amount': '140px',
      'annualAmount': '180px',
      'frequency': '110px',
      'needWant': '110px',
      'date': '135px',
      'details': 'minmax(80px, 120px)'
    };
    return widths[key] || 'minmax(150px, 1fr)';
  };

  const renderRow = (item: Expense, cols: FormField[]) => {
    return displayColumns.map(col => {
      const value = col.key === 'amount' 
        ? formatCurrency(item[col.key] as number)
        : col.key === 'annualAmount'
          ? formatCurrency(calculateAnnualAmount(item.amount, item.frequency))
          : item[col.key as keyof Expense] || '-';
      
      return (
        <td 
          key={col.key}
          className={`${styles.cell} ${col.align === 'right' ? styles.rightAligned : ''}`}
          data-column={col.key}
        >
          <div className={styles.cellContent}>
            {value}
          </div>
        </td>
      );
    });
  };

  const handleAdd = () => {
    openModal(
      <ExpenseForm
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
        isLoading={isLoading}
      />,
      'Add New Expense'
    );
  };

  const handleEdit = (expense: Expense) => {
    openModal(
      <ExpenseForm
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
        isLoading={isLoading}
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
    <div className={styles.expensesManager}>
      <div className={styles.header}>
        <div className={styles.headerTopRow}>
          <div className={styles.headerLeft}>
            <h2>Expenses</h2>
            <p className={styles.subtitle}>Track and manage your monthly and annual expenses</p>
          </div>
          <div className={styles.headerRight}>
            <button
              onClick={handleAdd}
              disabled={isLoading}
              className={styles.addButton}
            >
              <Plus size={18} />
              Add Expense
            </button>
          </div>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Monthly Average</div>
            <div className={styles.metricValue}>{formatCurrency(totalMonthlyExpense)}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Annual Total</div>
            <div className={styles.metricValue}>{formatCurrency(totalAnnualExpense)}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Total Expenses</div>
            <div className={styles.metricValue}>{expenses.length}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Last Updated</div>
            <div className={styles.metricValue}>
              {expenses.length > 0 
                ? new Date(Math.max(...expenses.map(e => new Date(e.date).getTime()))).toLocaleDateString()
                : '-'}
            </div>
          </div>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No expenses found. Add your first expense to get started.</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <colgroup>
              {displayColumns.map(column => (
                <col key={column.key} style={{ width: getColumnWidth(column.key) }} />
              ))}
              <col style={{ width: '100px' }} />
            </colgroup>
            <thead className={styles.tableHeader}>
              <tr>
                {displayColumns.map(column => (
                  <th key={column.key}>
                    {column.label}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map(expense => (
                <tr key={expense.id} className={styles.row}>
                  {renderRow(expense, columns)}
                  <td className={styles.cell}>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEdit(expense)}
                        className={`${styles.actionButton} ${styles.editButton}`}
                        disabled={isLoading}
                        title="Edit expense"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id as string)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        disabled={isLoading}
                        title="Delete expense"
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