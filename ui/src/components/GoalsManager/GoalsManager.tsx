import React, { useMemo, useState } from 'react';
import { Plus, Edit, Trash2, Target, IndianRupee, CalendarDays } from 'lucide-react';
import styles from './GoalsManager.module.scss';
import GoalForm from './GoalForm';

export interface FormField {
  key: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date';
  options?: Array<{value: string; label: string}>;
  required?: boolean;
  placeholder?: string;
  step?: string;
  min?: number;
  [key: string]: any;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  notes?: string;
  [key: string]: string | number | undefined;
}

interface GoalsManagerProps {
  goals: Goal[];
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

const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return '#ef4444';
    case 'medium':
      return '#f59e0b';
    case 'low':
      return '#10b981';
    default:
      return '#6b7280';
  }
};

const GoalsManager: React.FC<GoalsManagerProps> = ({
  goals,
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
      label: 'Goal Name', 
      type: 'text', 
      required: true, 
      placeholder: 'e.g., Down Payment, Vacation, Retirement' 
    },
    { 
      key: 'targetAmount', 
      name: 'targetAmount',
      label: 'Target Amount (₹)', 
      type: 'number', 
      required: true, 
      placeholder: '0',
      min: 0
    },
    { 
      key: 'currentAmount', 
      name: 'currentAmount',
      label: 'Current Amount (₹)', 
      type: 'number', 
      required: true, 
      placeholder: '0',
      min: 0
    },
    { 
      key: 'targetDate', 
      name: 'targetDate',
      label: 'Target Date', 
      type: 'date', 
      required: true
    },
    { 
      key: 'priority', 
      name: 'priority',
      label: 'Priority', 
      type: 'select', 
      required: true,
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ]
    },
    { 
      key: 'category', 
      name: 'category',
      label: 'Category', 
      type: 'select', 
      required: true,
      options: [
        { value: 'House', label: '🏠 House' },
        { value: 'Car', label: '🚗 Car' },
        { value: 'Education', label: '🎓 Education' },
        { value: 'Wedding', label: '💍 Wedding' },
        { value: 'Vacation', label: '✈️ Vacation' },
        { value: 'Retirement', label: '👵 Retirement' },
        { value: 'Emergency Fund', label: '🆘 Emergency Fund' },
        { value: 'Investment', label: '📈 Investment' },
        { value: 'Other', label: '📌 Other' },
      ]
    },
  ], []);

  const displayColumns = useMemo(() => [
    { key: 'name', label: 'Goal' },
    { key: 'targetAmount', label: 'Target', align: 'right' as const },
    { key: 'currentAmount', label: 'Current', align: 'right' as const },
    { key: 'progress', label: 'Progress' },
    { key: 'targetDate', label: 'Target Date' },
    { key: 'priority', label: 'Priority' },
    { key: 'category', label: 'Category' },
  ], []);

  const renderRow = (goal: Goal) => {
    const progress = Math.min(Math.round(((goal.currentAmount as number) / (goal.targetAmount as number)) * 100), 100);
    
    return displayColumns.map(col => {
      if (col.key === 'progress') {
        return (
          <td key={col.key} className={styles.cell}>
            <div className={styles.progressContainer}>
              <div 
                className={styles.progressBar} 
                style={{
                  width: `${progress}%`,
                  backgroundColor: getPriorityColor(goal.priority as string)
                }}
              >
                <span className={styles.progressText}>{progress}%</span>
              </div>
            </div>
          </td>
        );
      }
      
      let value;
      switch (col.key) {
        case 'targetAmount':
        case 'currentAmount':
          value = formatCurrency(goal[col.key] as number);
          break;
        case 'targetDate':
          value = formatDate(goal[col.key] as string);
          break;
        case 'priority':
          value = (
            <span className={styles.priorityBadge} style={{ backgroundColor: getPriorityColor(goal.priority as string) }}>
              {(goal.priority as string).charAt(0).toUpperCase() + (goal.priority as string).slice(1)}
            </span>
          );
          break;
        default:
          value = goal[col.key as keyof Goal] || '-';
      }
      
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
      <GoalForm
        initialData={{}}
        onSubmit={async (data: any) => {
          setIsLoading(true);
          try {
            await saveData('goals', data);
            openModal(null);
          } finally {
            setIsLoading(false);
          }
        }}
        onCancel={() => openModal(null)}
        fields={columns}
        darkMode={darkMode}
      />,
      'Add New Goal'
    );
  };

  const handleEdit = (goal: Goal) => {
    openModal(
      <GoalForm
        initialData={goal}
        onSubmit={async (data: any) => {
          setIsLoading(true);
          try {
            await saveData('goals', data, goal.id as string);
            openModal(null);
          } finally {
            setIsLoading(false);
          }
        }}
        onCancel={() => openModal(null)}
        fields={columns}
        darkMode={darkMode}
      />,
      'Edit Goal'
    );
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setIsLoading(true);
      try {
        await deleteData('goals', id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const { totalTarget, totalSaved, totalGoals, completionPercentage, upcomingDeadline } = useMemo(() => {
    if (goals.length === 0) {
      return {
        totalTarget: 0,
        totalSaved: 0,
        totalGoals: 0,
        completionPercentage: 0,
        upcomingDeadline: null
      };
    }

    const target = goals.reduce((sum, goal) => sum + ((goal.targetAmount as number) || 0), 0);
    const saved = goals.reduce((sum, goal) => sum + ((goal.currentAmount as number) || 0), 0);
    const percentage = target > 0 ? Math.min(Math.round((saved / target) * 100), 100) : 0;
    
    // Find the nearest upcoming deadline
    const now = new Date();
    const upcoming = goals
      .filter(goal => new Date(goal.targetDate as string) > now)
      .sort((a, b) => new Date(a.targetDate as string).getTime() - new Date(b.targetDate as string).getTime())[0];

    return {
      totalTarget: target,
      totalSaved: saved,
      totalGoals: goals.length,
      completionPercentage: percentage,
      upcomingDeadline: upcoming?.targetDate || null
    };
  }, [goals]);

  return (
    <div className={styles.goalsManager}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerTopRow}>
            <div>
              <h2>Goals</h2>
              <p className={styles.subtitle}>Track and manage your financial goals and their progress</p>
            </div>
            <div className={styles.headerRight}>
              <button
                onClick={handleAdd}
                disabled={isLoading}
                className={styles.addButton}
              >
                <Plus size={18} />
                Add Goal
              </button>
            </div>
          </div>
          
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Total Target</div>
              <div className={styles.metricValue}>
                <IndianRupee size={16} className={styles.metricIcon} />
                {formatCurrency(totalTarget)}
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Total Saved</div>
              <div className={styles.metricValue}>
                <IndianRupee size={16} className={styles.metricIcon} />
                {formatCurrency(totalSaved)}
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Completion</div>
              <div className={styles.metricValue}>
                {completionPercentage}%
                <div className={styles.completionBar}>
                  <div 
                    className={styles.completionProgress} 
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className={styles.metricCard}>
              <div className={styles.metricLabel}>Upcoming Deadline</div>
              <div className={styles.metricValue}>
                <CalendarDays size={16} className={styles.metricIcon} />
                {upcomingDeadline ? formatDate(upcomingDeadline as string) : 'No upcoming'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {goals.length === 0 ? (
        <div className={styles.emptyState}>
          <Target size={48} className={styles.emptyStateIcon} />
          <h3>No goals yet</h3>
          <p>Start by adding your first financial goal</p>
          <button
            onClick={handleAdd}
            className={styles.addButton}
          >
            <Plus size={18} />
            Add Your First Goal
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
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
              {goals.map(goal => (
                <tr key={goal.id} className={styles.row}>
                  {renderRow(goal)}
                  <td className={styles.cell} data-column="actions">
                    <div className={styles.cellContent}>
                      <div className={styles.actions}>
                        <button
                          onClick={() => handleEdit(goal)}
                          className={`${styles.actionButton} ${styles.editButton}`}
                          disabled={isLoading}
                          aria-label="Edit goal"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(goal.id as string)}
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          disabled={isLoading}
                          aria-label="Delete goal"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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

export default GoalsManager;
