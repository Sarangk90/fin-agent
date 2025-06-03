import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import LiabilityForm from './LiabilityForm';
import styles from './LiabilitiesManager.module.scss';

import { FormField, FormFieldType } from '../../types/form';

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
      type: 'text' as FormFieldType, 
      required: true, 
      placeholder: 'e.g., Credit Card, Home Loan' 
    },
    { 
      key: 'outstandingAmountINR', 
      name: 'outstandingAmountINR',
      label: 'Outstanding Amount (INR)', 
      type: 'number' as FormFieldType, 
      required: true, 
      placeholder: '0' 
    },
    { 
      key: 'type', 
      name: 'type',
      label: 'Type', 
      type: 'select' as FormFieldType, 
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
      type: 'number' as FormFieldType, 
      placeholder: '0.00',
      required: false 
    },
    { 
      key: 'termYears', 
      name: 'termYears',
      label: 'Term (Years)', 
      type: 'number' as FormFieldType, 
      placeholder: '0',
      required: false 
    },
    { 
      key: 'dueDate', 
      name: 'dueDate',
      label: 'Due Date', 
      type: 'date' as FormFieldType, 
      required: false 
    },
  ], []);

  const renderRow = (item: Liability, cols: FormField[]) => {
    return cols.map(col => {
      let value = item[col.key as keyof Liability];
      let displayValue: React.ReactNode = value || '-';
      let cellClass = styles.cell;
      
      if (col.key === 'outstandingAmountINR' && typeof value === 'number') {
        displayValue = formatCurrency(Number(value));
        cellClass += ` ${styles.currency}`;
      } else if (col.key === 'interestRate' && value) {
        displayValue = `${value}%`;
      } else if (col.key === 'dueDate' && value) {
        displayValue = new Date(value as string).toLocaleDateString();
      }
      
      return (
        <td key={col.key} className={cellClass}>
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
      />,
      'Add New Liability'
    );
  };

  const handleSave = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      // The data is already in the correct format (name-based) when it comes from the form
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

  const { totalOutstanding, totalLiabilities, avgInterestRate, nextDueDate } = useMemo(() => {
    if (liabilities.length === 0) {
      return {
        totalOutstanding: 0,
        totalLiabilities: 0,
        avgInterestRate: 0,
        nextDueDate: null
      };
    }

    const total = liabilities.reduce((sum, liability) => sum + (liability.outstandingAmountINR || 0), 0);
    const totalInterest = liabilities.reduce((sum, liability) => {
      const amount = liability.outstandingAmountINR || 0;
      const rate = liability.interestRate || 0;
      return sum + (amount * rate / 100);
    }, 0);
    
    const avgRate = total > 0 ? (totalInterest / total * 100) : 0;
    
    const upcomingPayments = liabilities
      .filter(l => l.dueDate)
      .map(l => new Date(l.dueDate as string))
      .sort((a, b) => a.getTime() - b.getTime());
    
    return {
      totalOutstanding: total,
      totalLiabilities: liabilities.length,
      avgInterestRate: parseFloat(avgRate.toFixed(2)),
      nextDueDate: upcomingPayments.length > 0 ? upcomingPayments[0] : null
    };
  }, [liabilities]);

  return (
    <div className={styles.liabilitiesManager}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTopRow}>
            <div>
              <h2>Liabilities</h2>
              <p className={styles.subtitle}>Manage your financial liabilities and their details</p>
            </div>
            <div className={styles.headerRight}>
              <button
                onClick={handleAdd}
                disabled={isLoading}
                className={styles.addButton}
              >
                <Plus size={18} />
                Add Liability
              </button>
            </div>
          </div>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Total Outstanding</div>
              <div className={styles.metricValue}>{formatCurrency(totalOutstanding)}</div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Total Liabilities</div>
              <div className={styles.metricValue}>{totalLiabilities}</div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Avg. Interest Rate</div>
              <div className={styles.metricValue}>
                {avgInterestRate > 0 ? `${avgInterestRate}%` : '-'}
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Next Due Date</div>
              <div className={styles.metricValue}>
                {nextDueDate ? nextDueDate.toLocaleDateString() : '-'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {liabilities.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <Plus size={24} />
          </div>
          <h3>No liabilities found</h3>
          <p>Get started by adding your first liability</p>
          <button
            onClick={handleAdd}
            className={styles.addButton}
          >
            <Plus size={16} />
            Add Liability
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                {columns.map(column => (
                  <th key={column.key}>
                    {column.label}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {liabilities.map(liability => (
                <tr key={liability.id} className={styles.row}>
                  {renderRow(liability, columns)}
                  <td className={styles.cell}>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEdit(liability)}
                        className={`${styles.actionButton} ${styles.editButton}`}
                        disabled={isLoading}
                        title="Edit liability"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(liability.id as string)}
                        className={`${styles.actionButton} ${styles.deleteButton}`}
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
      )}
    </div>
  );
};

export default LiabilitiesManager; 