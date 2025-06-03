import React from 'react';
import { FormField } from '../../types/form';
import styles from './ExpenseForm.module.scss';

// Extend FormField interface to include spanFull property
interface ExtendedFormField extends FormField {
  spanFull?: boolean;
}

interface ExpenseFormProps {
  initialData: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  fields: ExtendedFormField[];
  darkMode: boolean;
  isLoading?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  fields,
  darkMode,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Find the field to determine its type
    const field = fields.find(f => f.name === name);
    if (!field) return;
    
    let newValue: string | number = value;
    
    // Convert to number for numeric fields
    if (type === 'number' || field.type === 'number') {
      newValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error if field is being edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        validationErrors[field.name] = `${field.label} is required`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    await onSubmit(formData);
  };

  const renderField = (field: ExtendedFormField) => {
    const fieldError = errors[field.name];
    const fieldId = `field-${field.name}`;
    const value = formData[field.name] ?? '';
    
    if (field.type === 'select') {
      return (
        <div key={field.name} className={`${styles.fieldItem} ${field.spanFull ? styles.spanFull : ''}`}>
          <label htmlFor={fieldId} className={styles.label}>
            {field.label}
            {field.required && <span className={styles.required}>*</span>}
          </label>
          <select
            id={fieldId}
            name={field.name}
            value={value}
            onChange={handleChange}
            className={`${styles.select} ${styles.input}`}
            disabled={isLoading}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {fieldError && <p className={styles.error}>{fieldError}</p>}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className={`${styles.fieldItem} ${styles.spanFull}`}>
          <label htmlFor={fieldId} className={styles.label}>
            {field.label}
            {field.required && <span className={styles.required}>*</span>}
          </label>
          <textarea
            id={fieldId}
            name={field.name}
            value={value}
            onChange={handleChange}
            className={`${styles.textarea} ${styles.input}`}
            placeholder={field.placeholder}
            disabled={isLoading}
            rows={3}
          />
          {fieldError && <p className={styles.error}>{fieldError}</p>}
        </div>
      );
    }

    return (
      <div key={field.name} className={styles.fieldItem}>
        <label htmlFor={fieldId} className={styles.label}>
          {field.label}
          {field.required && <span className={styles.required}>*</span>}
        </label>
        <input
          type={field.type}
          id={fieldId}
          name={field.name}
          value={value}
          onChange={handleChange}
          className={styles.input}
          placeholder={field.placeholder}
          required={field.required}
          disabled={isLoading}
          min={field.min}
          max={field.max}
          step={field.step}
        />
        {fieldError && <p className={styles.error}>{fieldError}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.grid}>
        {fields.map((field) => renderField(field))}
      </div>

      <div className={styles.buttonContainer}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={`${styles.button} ${styles.buttonSecondary}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          {isLoading ? (
            <>
              <svg className={styles.spinner} viewBox="0 0 24 24">
                <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className={styles.spinnerPath} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Saving...
            </>
          ) : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
