import React from 'react';
import { X } from 'lucide-react';
import { FormField } from '../../types/form';
import styles from './LiabilityForm.module.scss';

// FormField type is imported from '../../types/form'

interface LiabilityFormProps {
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  fields: FormField[];
  darkMode: boolean;
  isLoading?: boolean;
}

const LiabilityForm: React.FC<LiabilityFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  fields,
  darkMode,
  isLoading = false,
}) => {
  // Initialize form data with field keys
  const [formData, setFormData] = React.useState<Record<string, any>>(() => {
    const initialFormData: Record<string, any> = {};
    fields.forEach(field => {
      initialFormData[field.key] = initialData[field.key] ?? '';
    });
    return initialFormData;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // Find the field by name to get its key
    const field = fields.find(f => f.name === name);
    if (!field) return;
    
    setFormData(prev => ({
      ...prev,
      [field.key]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const missingFields = fields
      .filter(field => field.required && (formData[field.key] === '' || formData[field.key] === undefined))
      .map(field => field.label);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Map form data back to name-based structure for submission
    const submissionData: Record<string, any> = {};
    fields.forEach(field => {
      if (formData[field.key] !== undefined) {
        submissionData[field.name] = formData[field.key];
      }
    });

    onSubmit(submissionData);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.key] ?? '';
    const fieldId = `field-${field.key}`;
    
    if (field.type === 'select') {
      return (
        <div key={field.key} className={styles.fieldItem}>
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
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    const inputProps = {
      type: field.type,
      id: fieldId,
      name: field.name,
      value: value as string | number,
      onChange: handleChange,
      required: field.required,
      placeholder: field.placeholder,
      className: styles.input,
      ...(field.type === 'number' ? { step: '0.01', min: field.min, max: field.max } : {})
    };

    return (
      <div key={field.key} className={styles.fieldItem}>
        <label htmlFor={fieldId} className={styles.label}>
          {field.label}
          {field.required && <span className={styles.required}>*</span>}
        </label>
        {field.type === 'textarea' ? (
          <textarea {...inputProps} className={`${styles.input} ${styles.textarea}`} />
        ) : (
          <input {...inputProps} />
        )}
      </div>
    );
  };

  // Render fields in two columns
  const renderFieldsInColumns = () => {
    const visibleFields = fields.filter(field => 
      !field.showIf || field.showIf(formData)
    );
    
    const midPoint = Math.ceil(visibleFields.length / 2);
    const firstColumn = visibleFields.slice(0, midPoint);
    const secondColumn = visibleFields.slice(midPoint);
    
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

export default LiabilityForm;
