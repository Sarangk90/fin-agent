import React from 'react';
import { X } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
}

interface LiabilityFormProps {
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  fields: FormField[];
  darkMode: boolean;
  title: string;
  isLoading?: boolean;
}

const LiabilityForm: React.FC<LiabilityFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  fields,
  darkMode,
  title,
  isLoading = false,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] ?? '';
    
    if (field.type === 'select') {
      return (
        <div key={field.name} className="mb-4">
          <label
            htmlFor={field.name}
            className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}
          >
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
          <select
            id={field.name}
            name={field.name}
            value={value as string}
            onChange={handleChange}
            required={field.required}
            className={`mt-1 block w-full rounded-md ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
            } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
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

    return (
      <div key={field.name} className="mb-4">
        <label
          htmlFor={field.name}
          className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
          type={field.type}
          id={field.name}
          name={field.name}
          value={value as string | number}
          onChange={handleChange}
          required={field.required}
          placeholder={field.placeholder}
          className={`mt-1 block w-full rounded-md ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
        />
      </div>
    );
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
      <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex justify-between items-center`}>
        <h3 className="text-lg font-medium leading-6">{title}</h3>
        <button
          type="button"
          onClick={onCancel}
          className={`rounded-md p-1.5 ${
            darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
          } hover:bg-opacity-20 hover:bg-gray-500`}
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-4">
          {fields.map(field => renderField(field))}
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Liability'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiabilityForm;
