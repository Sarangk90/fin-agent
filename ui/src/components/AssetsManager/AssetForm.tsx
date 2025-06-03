import React from 'react';
import styles from './AssetForm.module.scss';

type FormDataObject = Record<string, any>;

export interface FormField {
  key: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date';
  options?: Array<{value: string; label: string; group?: string}>;
  required?: boolean;
  placeholder?: string;
  description?: string;
  group?: string;
  min?: number | string;
  max?: number | string;
  step?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  className?: string;
  showIf?: (values: Record<string, any>) => boolean;
  [key: string]: any; // Allow additional properties
}

interface AssetFormProps {
  initialData?: FormDataObject;
  onSubmit: (data: Record<string, any>) => Promise<void> | void;
  onCancel: () => void;
  darkMode: boolean;
  fields: FormField[];
  isLoading?: boolean;
}

const getInitialFormData = (fields: FormField[], initialData: FormDataObject = {}): FormDataObject => {
  return fields.reduce<FormDataObject>((acc, field) => {
    if (initialData[field.name] !== undefined) {
      acc[field.name] = initialData[field.name];
    } else if (field.required) {
      acc[field.name] = field.type === 'number' ? 0 : '';
    }
    return acc;
  }, {});
};

const AssetForm: React.FC<AssetFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  darkMode,
  fields,
  isLoading = false
}) => {
  const [formData, setFormData] = React.useState<FormDataObject>(
    getInitialFormData(fields, initialData || {})
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
    await onSubmit(formData);
  };

  // Render fields in two columns
  const renderFieldsInColumns = () => {
    // Filter out fields that don't meet their showIf condition
    const visibleFields = fields.filter(field => 
      !field.showIf || field.showIf(formData)
    );
    
    // Split fields into two columns
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

  const renderField = (field: FormField) => {
    // Skip rendering if showIf condition is not met
    if (field.showIf && !field.showIf(formData)) {
      return null;
    }

    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] ?? '',
      onChange: handleChange,
      required: field.required,
      placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
      className: `${styles.input} ${field.error ? styles.inputError : ''}`,
      disabled: isLoading,
    };

    const fieldClasses = `${styles.fieldItem} ${field.className || ''}`;

    const fieldContent = (() => {
      switch (field.type) {
        case 'select':
          return (
            <select {...commonProps} className={`${styles.select} ${field.error ? styles.inputError : ''}`}>
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        case 'number':
          return (
            <input
              type="number"
              {...commonProps}
              step={field.name === 'valueINR' ? '1' : 'any'}
              className={`${styles.input} ${field.error ? styles.inputError : ''}`}
            />
          );
        case 'textarea':
          return <textarea {...commonProps} rows={3} className={`${styles.textarea} ${field.error ? styles.inputError : ''}`} />;
        default:
          return <input type={field.type} {...commonProps} className={styles.input} />;
      }
    })();

    return (
      <div className={fieldClasses}>
        <label htmlFor={field.name} className={styles.label}>
          {field.label}
          {field.required && <span className={styles.required}>*</span>}
        </label>
        {fieldContent}
        {field.error && <div className={styles.error}>{field.error}</div>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid}>
        {renderFieldsInColumns()}
      </div>
      <div className={styles.footer}>
        <button
          type="button"
          onClick={onCancel}
          className={`${styles.button} ${styles.cancelButton}`}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`${styles.button} ${styles.saveButton}`}
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default AssetForm;
