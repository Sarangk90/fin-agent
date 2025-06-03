import React from 'react';
import { FormField } from './GoalsManager';
import styles from './GoalForm.module.scss';

type FormData = Record<string, any>; // Consider moving this to a shared types file

export interface GoalFormProps {
  initialData?: FormData;
  onSubmit: (data: FormData) => Promise<void> | void;
  onCancel: () => void;
  darkMode: boolean;
  fields: FormField[];
}

const getInitialFormData = (fields: FormField[], initialData: FormData = {}): FormData => {
  return fields.reduce((acc, field) => {
    if (initialData[field.name] !== undefined) {
      acc[field.name] = initialData[field.name];
    } else if (field.required) {
      acc[field.name] = field.type === 'number' ? 0 : '';
    }
    return acc;
  }, {} as FormData);
};

const GoalForm: React.FC<GoalFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  darkMode,
  fields
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<FormData>(
    () => getInitialFormData(fields, initialData)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' 
        ? (value === '' ? '' : parseFloat(value) || 0)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  const renderField = (field: FormField) => {
    const fieldId = `field-${field.name}`;
    const value = formData[field.name] ?? '';

    if (field.type === 'select') {
      return (
        <div className={styles.fieldItem}>
          <label htmlFor={fieldId} className={styles.label}>
            {field.label}
            {field.required && <span className={styles.required}>*</span>}
          </label>
          <select
            id={fieldId}
            name={field.name}
            value={value as string}
            onChange={handleChange}
            required={field.required}
            className={`${styles.select} ${styles.input}`}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    const inputProps = {
      id: fieldId,
      name: field.name,
      value: value,
      onChange: handleChange,
      required: field.required,
      placeholder: field.placeholder,
      className: styles.input,
      ...(field.type === 'number' ? { 
        step: field.step || '1',
        min: field.min,
        max: field.max 
      } : {}),
      ...(field.type === 'date' ? { 
        min: new Date().toISOString().split('T')[0]
      } : {})
    };

    return (
      <div key={field.name} className={styles.fieldItem}>
        <label htmlFor={fieldId} className={styles.label}>
          {field.label}
          {field.required && <span className={styles.required}>*</span>}
        </label>
        {field.type === 'textarea' ? (
          <textarea {...inputProps} className={`${styles.input} ${styles.textarea}`} rows={3} />
        ) : (
          <input type={field.type} {...inputProps} />
        )}
      </div>
    );
  };

  // Render fields in two columns
  const renderFieldsInColumns = () => {
    const midPoint = Math.ceil(fields.length / 2);
    const firstColumn = fields.slice(0, midPoint);
    const secondColumn = fields.slice(midPoint);
    
    return (
      <div className={styles.fieldsContainer}>
        <div className={styles.column}>
          {firstColumn.map(field => renderField(field))}
        </div>
        <div className={styles.column}>
          {secondColumn.map(field => renderField(field))}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.form} ${darkMode ? styles.dark : ''}`} data-theme={darkMode ? 'dark' : 'light'}>
      <form onSubmit={handleSubmit} className={styles.formElement}>
        <div className={styles.grid}>
          {renderFieldsInColumns()}
        </div>
        
        <div className={styles.footer}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className={`${styles.button} ${styles.cancelButton}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.button} ${styles.saveButton}`}
          >
            {isLoading ? (
              <>
                <svg className={styles.spinner} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              'Save'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm;
