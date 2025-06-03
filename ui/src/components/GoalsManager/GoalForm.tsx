import React from 'react';
import { FormField } from './GoalsManager';

type FormData = Record<string, any>;

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
    await onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] ?? '',
      onChange: handleChange,
      required: field.required,
      placeholder: field.placeholder,
      className: `mt-1 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} shadow-sm focus:border-blue-500 focus:ring-blue-500`,
    };

    switch (field.type) {
      case 'select':
        return (
          <select {...commonProps}>
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
            min={field.min}
            step={field.step || '1'}
          />
        );
      case 'date':
        return <input type="date" {...commonProps} min={new Date().toISOString().split('T')[0]} />;
      case 'textarea':
        return <textarea {...commonProps} rows={3} />;
      default:
        return <input type={field.type} {...commonProps} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <label
              htmlFor={field.name}
              className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
          </div>
        ))}
      </div>
      
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 text-sm font-medium rounded-md ${
            darkMode
              ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save Goal
        </button>
      </div>
    </form>
  );
};

export default GoalForm;
