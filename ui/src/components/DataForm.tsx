import React, { useState } from 'react';

// This will be a generic form, props will need to be quite flexible
interface DataFormProps {
  initialData?: any; // Data for editing
  onSubmit: (formData: any) => Promise<void | string | null>; // string | null for potential ID return
  onCancel: () => void;
  fields: Array<{ name: string; label: string; type: string; placeholder?: string; required?: boolean; options?: Array<{value: string; label: string}> }>;
  darkMode: boolean;
  // We might need more props like 'itemType' to customize the form further
}

const DataForm: React.FC<DataFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  fields,
  darkMode
}) => {
  const [formData, setFormData] = useState<any>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = type === 'checkbox' ? e.target.checked : undefined;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit(formData);
      // If onSubmit is successful, the modal will likely be closed by the parent component
    } catch (err: any) {
      setError(err.message || 'Failed to save data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} space-y-4`}>
      {fields.map(field => (
        <div key={field.name}>
          <label htmlFor={field.name} className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === 'select' ? (
            <select
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              required={field.required}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400' : 'border-gray-300'}`}
            >
              <option value="">{field.placeholder || 'Select an option'}</option>
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : field.type === 'textarea' ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              rows={3}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400' : 'border-gray-300'}`}
            />
          ) : (
            <input
              type={field.type}
              id={field.name}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleChange}
              placeholder={field.placeholder}
              required={field.required}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${darkMode ? 'bg-gray-700 border-gray-600 placeholder-gray-400' : 'border-gray-300'}`}
            />
          )}
        </div>
      ))}
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${darkMode ? 'bg-gray-600 hover:bg-gray-500 text-gray-200 focus:ring-gray-500' : 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-indigo-500'}`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSubmitting ? (darkMode ? 'bg-indigo-400' : 'bg-indigo-300') : (darkMode ? 'bg-indigo-500 hover:bg-indigo-600 focus:ring-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500')}`}
        >
          {isSubmitting ? 'Saving...' : (initialData.id ? 'Update' : 'Save')}
        </button>
      </div>
    </form>
  );
};

export default DataForm; 