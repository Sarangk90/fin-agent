import React from 'react';
import { FormField } from './ExpensesManager';

interface ExpenseFormProps {
  initialData: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onCancel: () => void;
  fields: FormField[];
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
    const { name, value, type } = e.target as HTMLInputElement;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
        {fields.map((field) => {
          const fieldError = errors[field.name];
          
          if (field.type === 'select') {
            return (
              <div key={field.name} className="space-y-1">
                <label htmlFor={field.name} className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  disabled={isLoading}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldError && <p className="mt-1 text-sm text-red-600">{fieldError}</p>}
              </div>
            );
          }

          if (field.type === 'textarea') {
            return (
              <div key={field.name} className="md:col-span-2 space-y-1">
                <label htmlFor={field.name} className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  rows={3}
                  className={`mt-1 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                  placeholder={field.placeholder}
                  disabled={isLoading}
                />
                {fieldError && <p className="mt-1 text-sm text-red-600">{fieldError}</p>}
              </div>
            );
          }

          return (
            <div key={field.name} className="space-y-1">
              <label htmlFor={field.name} className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                placeholder={field.placeholder}
                required={field.required}
                disabled={isLoading}
                min={field.min}
                max={field.max}
                step={field.step}
              />
              {fieldError && <p className="mt-1 text-sm text-red-600">{fieldError}</p>}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className={`px-4 py-2 text-sm font-medium rounded-md ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50 border border-gray-300'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
